-- =====================================================
-- SCRIPT PARA APLICAR RLS POLICIES MANUALMENTE
-- =====================================================
-- Data: 31/12/2024
-- Migration: 20251231000001_rls_policies_critical_tables.sql
--
-- INSTRUÇÕES:
-- 1. Abra Supabase Dashboard: https://supabase.com/dashboard
-- 2. Vá em SQL Editor
-- 3. Cole este script completo
-- 4. Execute (Run)
-- 5. Verifique saída para confirmar sucesso
-- =====================================================

-- =====================================================
-- 1. LEADS TABLE - RLS Policies
-- =====================================================

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (se existirem)
DROP POLICY IF EXISTS "Users can view leads from their tenant" ON leads;
DROP POLICY IF EXISTS "Users can insert leads for their tenant" ON leads;
DROP POLICY IF EXISTS "Users can update leads from their tenant" ON leads;
DROP POLICY IF EXISTS "Users can delete leads from their tenant" ON leads;

-- Policy: Users can view leads from their tenant
CREATE POLICY "Users can view leads from their tenant"
ON leads
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- Policy: Users can insert leads for their tenant
CREATE POLICY "Users can insert leads for their tenant"
ON leads
FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- Policy: Users can update leads from their tenant
CREATE POLICY "Users can update leads from their tenant"
ON leads
FOR UPDATE
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

-- Policy: Users can delete leads from their tenant
CREATE POLICY "Users can delete leads from their tenant"
ON leads
FOR DELETE
USING (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- =====================================================
-- 2. CONVERSATIONS TABLE - RLS Policies
-- =====================================================

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view conversations from their tenant" ON conversations;
DROP POLICY IF EXISTS "Users can insert conversations for their tenant" ON conversations;
DROP POLICY IF EXISTS "Users can update conversations from their tenant" ON conversations;
DROP POLICY IF EXISTS "Users can delete conversations from their tenant" ON conversations;

-- Policy: Users can view conversations from their tenant
CREATE POLICY "Users can view conversations from their tenant"
ON conversations
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- Policy: Users can insert conversations for their tenant
CREATE POLICY "Users can insert conversations for their tenant"
ON conversations
FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- Policy: Users can update conversations from their tenant
CREATE POLICY "Users can update conversations from their tenant"
ON conversations
FOR UPDATE
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

-- Policy: Users can delete conversations from their tenant
CREATE POLICY "Users can delete conversations from their tenant"
ON conversations
FOR DELETE
USING (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- =====================================================
-- 3. PRODUCTS TABLE - RLS Policies (Se existir)
-- =====================================================

-- Enable RLS (ignora se tabela não existir)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view products from their tenant" ON products;
    DROP POLICY IF EXISTS "Users can insert products for their tenant" ON products;
    DROP POLICY IF EXISTS "Users can update products from their tenant" ON products;
    DROP POLICY IF EXISTS "Users can delete products from their tenant" ON products;

    -- Policy: Users can view products from their tenant
    CREATE POLICY "Users can view products from their tenant"
    ON products
    FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    -- Policy: Users can insert products for their tenant
    CREATE POLICY "Users can insert products for their tenant"
    ON products
    FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    -- Policy: Users can update products from their tenant
    CREATE POLICY "Users can update products from their tenant"
    ON products
    FOR UPDATE
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

    -- Policy: Users can delete products from their tenant
    CREATE POLICY "Users can delete products from their tenant"
    ON products
    FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    );

    RAISE NOTICE 'RLS policies aplicadas na tabela products';
  ELSE
    RAISE NOTICE 'Tabela products não existe, pulando...';
  END IF;
END $$;

-- =====================================================
-- 4. CONTRACTS TABLE - RLS Policies
-- =====================================================

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view contracts from their tenant" ON contracts;
DROP POLICY IF EXISTS "Users can insert contracts for their tenant" ON contracts;
DROP POLICY IF EXISTS "Users can update contracts from their tenant" ON contracts;
DROP POLICY IF EXISTS "Users can delete contracts from their tenant" ON contracts;

-- Policy: Users can view contracts from their tenant
CREATE POLICY "Users can view contracts from their tenant"
ON contracts
FOR SELECT
USING (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- Policy: Users can insert contracts for their tenant
CREATE POLICY "Users can insert contracts for their tenant"
ON contracts
FOR INSERT
WITH CHECK (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- Policy: Users can update contracts from their tenant
CREATE POLICY "Users can update contracts from their tenant"
ON contracts
FOR UPDATE
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

-- Policy: Users can delete contracts from their tenant
CREATE POLICY "Users can delete contracts from their tenant"
ON contracts
FOR DELETE
USING (
  tenant_id IN (
    SELECT tenant_id FROM users WHERE id = auth.uid()
  )
);

-- =====================================================
-- 5. MESSAGES TABLE - RLS Policies (Se existir)
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'messages') THEN
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies
    DROP POLICY IF EXISTS "Users can view messages from their tenant conversations" ON messages;
    DROP POLICY IF EXISTS "Users can insert messages in their tenant conversations" ON messages;
    DROP POLICY IF EXISTS "Users can update messages in their tenant conversations" ON messages;
    DROP POLICY IF EXISTS "Users can delete messages in their tenant conversations" ON messages;

    -- Policy: Users can view messages from conversations in their tenant
    CREATE POLICY "Users can view messages from their tenant conversations"
    ON messages
    FOR SELECT
    USING (
      conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    );

    -- Policy: Users can insert messages in their tenant conversations
    CREATE POLICY "Users can insert messages in their tenant conversations"
    ON messages
    FOR INSERT
    WITH CHECK (
      conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    );

    -- Policy: Users can update messages in their tenant conversations
    CREATE POLICY "Users can update messages in their tenant conversations"
    ON messages
    FOR UPDATE
    USING (
      conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    )
    WITH CHECK (
      conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    );

    -- Policy: Users can delete messages in their tenant conversations
    CREATE POLICY "Users can delete messages in their tenant conversations"
    ON messages
    FOR DELETE
    USING (
      conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    );

    RAISE NOTICE 'RLS policies aplicadas na tabela messages';
  ELSE
    RAISE NOTICE 'Tabela messages não existe, pulando...';
  END IF;
END $$;

-- =====================================================
-- 6. VERIFICATION - Verificar RLS ativado
-- =====================================================

DO $$
DECLARE
  table_name text;
  rls_status boolean;
  policy_count int;
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'VERIFICAÇÃO DE RLS POLICIES';
  RAISE NOTICE '==============================================';

  FOR table_name IN
    SELECT unnest(ARRAY['leads', 'conversations', 'products', 'contracts', 'messages'])
  LOOP
    -- Verifica se tabela existe
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = table_name) THEN
      -- Verifica se RLS está habilitado
      SELECT relrowsecurity INTO rls_status
      FROM pg_class
      WHERE relname = table_name;

      -- Conta policies
      SELECT COUNT(*) INTO policy_count
      FROM pg_policies
      WHERE tablename = table_name;

      IF rls_status THEN
        RAISE NOTICE '✅ % - RLS ENABLED - % policies', table_name, policy_count;
      ELSE
        RAISE WARNING '❌ % - RLS NOT ENABLED', table_name;
      END IF;
    ELSE
      RAISE NOTICE '⏭️  % - Tabela não existe', table_name;
    END IF;
  END LOOP;

  RAISE NOTICE '==============================================';
  RAISE NOTICE 'VERIFICAÇÃO COMPLETA';
  RAISE NOTICE '==============================================';
END $$;

-- =====================================================
-- 7. TEST QUERY - Testar isolamento de tenant
-- =====================================================

-- Esta query deve retornar apenas dados do tenant do usuário autenticado
-- Execute após fazer login no app
/*
SELECT
  'leads' as table_name,
  COUNT(*) as row_count
FROM leads
UNION ALL
SELECT
  'conversations' as table_name,
  COUNT(*) as row_count
FROM conversations
UNION ALL
SELECT
  'contracts' as table_name,
  COUNT(*) as row_count
FROM contracts;
*/

-- =====================================================
-- NOTAS FINAIS
-- =====================================================
--
-- ✅ SUCESSO se você viu:
--    - "RLS ENABLED" para todas as tabelas
--    - 4 policies por tabela (SELECT, INSERT, UPDATE, DELETE)
--
-- ⚠️ ATENÇÃO:
--    - Service role key BYPASSA RLS (use apenas em admin)
--    - Anon key RESPEITA RLS (use no frontend)
--    - Teste com 2 usuários de tenants diferentes
--
-- 📝 PRÓXIMO PASSO:
--    - Testar isolamento: criar 2 leads com tenants diferentes
--    - Verificar que usuário A não vê leads de usuário B
--
-- =====================================================

-- Finalizado!
SELECT 'RLS Migration aplicada com sucesso! ✅' as status;
