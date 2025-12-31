-- =====================================================
-- RLS POLICIES - CRITICAL TABLES (SECURITY-005)
-- =====================================================
-- Data: 31/12/2024
-- Objetivo: Implementar Row Level Security completa em tabelas críticas
-- Tabelas: leads, conversations, products, contracts
-- Impacto: Prevenir vazamento de dados entre tenants (multi-tenancy)
--
-- IMPORTANTE: Estas policies garantem isolamento completo entre tenants
-- =====================================================

-- =====================================================
-- 1. LEADS TABLE - RLS Policies
-- =====================================================

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

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
-- 3. PRODUCTS TABLE - RLS Policies
-- =====================================================

-- Check if products table exists (may be lawyer_products)
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
    -- Enable RLS
    ALTER TABLE products ENABLE ROW LEVEL SECURITY;

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
  END IF;
END $$;

-- =====================================================
-- 4. CONTRACTS TABLE - RLS Policies
-- =====================================================

-- Enable RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

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
-- 5. BONUS: MESSAGES TABLE - RLS Policies
-- =====================================================
-- Messages são parte de conversations, também precisa de RLS

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'messages') THEN
    ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

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
  END IF;
END $$;

-- =====================================================
-- 6. VERIFICATION QUERIES
-- =====================================================

-- Verify RLS is enabled on all critical tables
DO $$
DECLARE
  table_name text;
  rls_status boolean;
BEGIN
  FOR table_name IN
    SELECT unnest(ARRAY['leads', 'conversations', 'products', 'contracts', 'messages'])
  LOOP
    SELECT relrowsecurity INTO rls_status
    FROM pg_class
    WHERE relname = table_name;

    IF rls_status THEN
      RAISE NOTICE 'RLS ENABLED on table: %', table_name;
    ELSE
      RAISE WARNING 'RLS NOT ENABLED on table: %', table_name;
    END IF;
  END LOOP;
END $$;

-- =====================================================
-- NOTAS DE SEGURANÇA
-- =====================================================
--
-- 1. Todas as policies verificam tenant_id via auth.uid()
-- 2. Isolamento completo entre tenants garantido
-- 3. Messages usa conversation_id para herdar tenant_id
-- 4. Service role bypassa RLS (para admin operations)
-- 5. Testar isolamento com múltiplos tenants antes de produção
--
-- TESTES RECOMENDADOS:
-- - Criar 2 usuários em tenants diferentes
-- - Verificar que User A não vê dados de User B
-- - Verificar que INSERT/UPDATE/DELETE respeitam tenant_id
--
-- =====================================================
