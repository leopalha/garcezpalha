-- =====================================================
-- SETUP COMPLETO MULTI-TENANT
-- =====================================================
-- Data: 31/12/2024
-- Objetivo: Criar estrutura multi-tenant completa
--
-- PASSO 1: Criar tabela tenants
-- PASSO 2: Adicionar coluna tenant_id nas tabelas
-- PASSO 3: Aplicar RLS policies
--
-- INSTRUÇÕES:
-- 1. Abra Supabase Dashboard: https://supabase.com/dashboard
-- 2. Vá em SQL Editor
-- 3. Cole este script completo
-- 4. Execute (Run)
-- =====================================================

-- =====================================================
-- PASSO 1: Criar tabela TENANTS (se não existir)
-- =====================================================

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Informações básicas
  name TEXT NOT NULL,
  email TEXT,
  oab_number TEXT,
  cnpj TEXT,

  -- Configurações
  settings JSONB DEFAULT '{}'::jsonb,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar index
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- Criar trigger updated_at
CREATE OR REPLACE FUNCTION update_tenants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tenants_updated_at ON tenants;
CREATE TRIGGER tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_tenants_updated_at();

DO $$
BEGIN
  RAISE NOTICE '✅ Tabela TENANTS criada/verificada';
END $$;

-- =====================================================
-- PASSO 2: Adicionar coluna TENANT_ID nas tabelas
-- =====================================================

-- LEADS
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'leads') THEN
    -- Adicionar coluna se não existir
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'leads' AND column_name = 'tenant_id'
    ) THEN
      ALTER TABLE leads ADD COLUMN tenant_id UUID REFERENCES tenants(id);
      RAISE NOTICE '✅ Coluna tenant_id adicionada na tabela LEADS';
    ELSE
      RAISE NOTICE '⏭️  Coluna tenant_id já existe na tabela LEADS';
    END IF;

    -- Criar index
    CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
  END IF;
END $$;

-- CONVERSATIONS
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'conversations') THEN
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'conversations' AND column_name = 'tenant_id'
    ) THEN
      ALTER TABLE conversations ADD COLUMN tenant_id UUID REFERENCES tenants(id);
      RAISE NOTICE '✅ Coluna tenant_id adicionada na tabela CONVERSATIONS';
    ELSE
      RAISE NOTICE '⏭️  Coluna tenant_id já existe na tabela CONVERSATIONS';
    END IF;

    CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON conversations(tenant_id);
  END IF;
END $$;

-- QUALIFIED_LEADS
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'qualified_leads') THEN
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'qualified_leads' AND column_name = 'tenant_id'
    ) THEN
      ALTER TABLE qualified_leads ADD COLUMN tenant_id UUID REFERENCES tenants(id);
      RAISE NOTICE '✅ Coluna tenant_id adicionada na tabela QUALIFIED_LEADS';
    ELSE
      RAISE NOTICE '⏭️  Coluna tenant_id já existe na tabela QUALIFIED_LEADS';
    END IF;

    CREATE INDEX IF NOT EXISTS idx_qualified_leads_tenant ON qualified_leads(tenant_id);
  END IF;
END $$;

-- CONTRACTS
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'contracts') THEN
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'contracts' AND column_name = 'tenant_id'
    ) THEN
      ALTER TABLE contracts ADD COLUMN tenant_id UUID REFERENCES tenants(id);
      RAISE NOTICE '✅ Coluna tenant_id adicionada na tabela CONTRACTS';
    ELSE
      RAISE NOTICE '⏭️  Coluna tenant_id já existe na tabela CONTRACTS';
    END IF;

    CREATE INDEX IF NOT EXISTS idx_contracts_tenant ON contracts(tenant_id);
  END IF;
END $$;

-- PRODUCTS (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'products' AND column_name = 'tenant_id'
    ) THEN
      ALTER TABLE products ADD COLUMN tenant_id UUID REFERENCES tenants(id);
      RAISE NOTICE '✅ Coluna tenant_id adicionada na tabela PRODUCTS';
    ELSE
      RAISE NOTICE '⏭️  Coluna tenant_id já existe na tabela PRODUCTS';
    END IF;

    CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
  END IF;
END $$;

-- MESSAGES (herda tenant_id de conversations)
-- Não precisa de tenant_id direto, usa JOIN com conversations

-- =====================================================
-- PASSO 2.5: Atualizar tabela USERS para ter tenant_id
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'users') THEN
    IF NOT EXISTS (
      SELECT FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'tenant_id'
    ) THEN
      ALTER TABLE users ADD COLUMN tenant_id UUID REFERENCES tenants(id);
      RAISE NOTICE '✅ Coluna tenant_id adicionada na tabela USERS';
    ELSE
      RAISE NOTICE '⏭️  Coluna tenant_id já existe na tabela USERS';
    END IF;

    CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);
  END IF;
END $$;

-- =====================================================
-- PASSO 3: Aplicar RLS POLICIES
-- =====================================================

-- 3.1 LEADS
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'leads') THEN
    ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view leads from their tenant" ON leads;
    DROP POLICY IF EXISTS "Users can insert leads for their tenant" ON leads;
    DROP POLICY IF EXISTS "Users can update leads from their tenant" ON leads;
    DROP POLICY IF EXISTS "Users can delete leads from their tenant" ON leads;

    CREATE POLICY "Users can view leads from their tenant"
    ON leads FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can insert leads for their tenant"
    ON leads FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can update leads from their tenant"
    ON leads FOR UPDATE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can delete leads from their tenant"
    ON leads FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela LEADS';
  END IF;
END $$;

-- 3.2 CONVERSATIONS
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'conversations') THEN
    ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view conversations from their tenant" ON conversations;
    DROP POLICY IF EXISTS "Users can insert conversations for their tenant" ON conversations;
    DROP POLICY IF EXISTS "Users can update conversations from their tenant" ON conversations;
    DROP POLICY IF EXISTS "Users can delete conversations from their tenant" ON conversations;

    CREATE POLICY "Users can view conversations from their tenant"
    ON conversations FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can insert conversations for their tenant"
    ON conversations FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can update conversations from their tenant"
    ON conversations FOR UPDATE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can delete conversations from their tenant"
    ON conversations FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela CONVERSATIONS';
  END IF;
END $$;

-- 3.3 QUALIFIED_LEADS
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'qualified_leads') THEN
    ALTER TABLE qualified_leads ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view qualified leads from their tenant" ON qualified_leads;
    DROP POLICY IF EXISTS "Users can insert qualified leads for their tenant" ON qualified_leads;
    DROP POLICY IF EXISTS "Users can update qualified leads from their tenant" ON qualified_leads;
    DROP POLICY IF EXISTS "Users can delete qualified leads from their tenant" ON qualified_leads;

    CREATE POLICY "Users can view qualified leads from their tenant"
    ON qualified_leads FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can insert qualified leads for their tenant"
    ON qualified_leads FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can update qualified leads from their tenant"
    ON qualified_leads FOR UPDATE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can delete qualified leads from their tenant"
    ON qualified_leads FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela QUALIFIED_LEADS';
  END IF;
END $$;

-- 3.4 CONTRACTS
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'contracts') THEN
    ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view contracts from their tenant" ON contracts;
    DROP POLICY IF EXISTS "Users can insert contracts for their tenant" ON contracts;
    DROP POLICY IF EXISTS "Users can update contracts from their tenant" ON contracts;
    DROP POLICY IF EXISTS "Users can delete contracts from their tenant" ON contracts;

    CREATE POLICY "Users can view contracts from their tenant"
    ON contracts FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can insert contracts for their tenant"
    ON contracts FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can update contracts from their tenant"
    ON contracts FOR UPDATE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can delete contracts from their tenant"
    ON contracts FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela CONTRACTS';
  END IF;
END $$;

-- 3.5 MESSAGES (via conversations)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'messages') THEN
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view messages from their tenant conversations" ON messages;
    DROP POLICY IF EXISTS "Users can insert messages in their tenant conversations" ON messages;
    DROP POLICY IF EXISTS "Users can update messages in their tenant conversations" ON messages;
    DROP POLICY IF EXISTS "Users can delete messages in their tenant conversations" ON messages;

    CREATE POLICY "Users can view messages from their tenant conversations"
    ON messages FOR SELECT
    USING (
      conversation_id::uuid IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    );

    CREATE POLICY "Users can insert messages in their tenant conversations"
    ON messages FOR INSERT
    WITH CHECK (
      conversation_id::uuid IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    );

    CREATE POLICY "Users can update messages in their tenant conversations"
    ON messages FOR UPDATE
    USING (
      conversation_id::uuid IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    )
    WITH CHECK (
      conversation_id::uuid IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    );

    CREATE POLICY "Users can delete messages in their tenant conversations"
    ON messages FOR DELETE
    USING (
      conversation_id::uuid IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    );

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela MESSAGES';
  END IF;
END $$;

-- 3.6 PRODUCTS (se existir)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view products from their tenant" ON products;
    DROP POLICY IF EXISTS "Users can insert products for their tenant" ON products;
    DROP POLICY IF EXISTS "Users can update products from their tenant" ON products;
    DROP POLICY IF EXISTS "Users can delete products from their tenant" ON products;

    CREATE POLICY "Users can view products from their tenant"
    ON products FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can insert products for their tenant"
    ON products FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can update products from their tenant"
    ON products FOR UPDATE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    CREATE POLICY "Users can delete products from their tenant"
    ON products FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela PRODUCTS';
  END IF;
END $$;

-- =====================================================
-- PASSO 4: VERIFICAÇÃO FINAL
-- =====================================================

DO $$
DECLARE
  tbl_name text;
  rls_status boolean;
  policy_count int;
  has_tenant_id boolean;
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'VERIFICAÇÃO MULTI-TENANT';
  RAISE NOTICE '==============================================';

  FOR tbl_name IN
    SELECT unnest(ARRAY['leads', 'conversations', 'qualified_leads', 'products', 'contracts', 'messages', 'users'])
  LOOP
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = tbl_name) THEN
      -- Verificar RLS
      SELECT relrowsecurity INTO rls_status
      FROM pg_class
      WHERE relname = tbl_name;

      -- Contar policies
      SELECT COUNT(*) INTO policy_count
      FROM pg_policies
      WHERE tablename = tbl_name;

      -- Verificar coluna tenant_id
      SELECT EXISTS (
        SELECT FROM information_schema.columns c
        WHERE c.table_name = tbl_name AND c.column_name = 'tenant_id'
      ) INTO has_tenant_id;

      RAISE NOTICE '📊 %:', tbl_name;

      IF rls_status THEN
        RAISE NOTICE '  ✅ RLS ENABLED - % policies', policy_count;
      ELSE
        RAISE WARNING '  ❌ RLS NOT ENABLED';
      END IF;

      IF has_tenant_id THEN
        RAISE NOTICE '  ✅ tenant_id column exists';
      ELSE
        IF tbl_name = 'messages' THEN
          RAISE NOTICE '  ⏭️  tenant_id not needed (uses conversations)';
        ELSE
          RAISE WARNING '  ❌ tenant_id column missing';
        END IF;
      END IF;

    ELSE
      RAISE NOTICE '⏭️  % - Tabela não existe', tbl_name;
    END IF;
  END LOOP;

  RAISE NOTICE '==============================================';
  RAISE NOTICE 'SETUP MULTI-TENANT COMPLETO! ✅';
  RAISE NOTICE '==============================================';
END $$;

-- =====================================================
-- MENSAGEM FINAL
-- =====================================================

SELECT 'Multi-tenant setup completo! ✅' as status;
