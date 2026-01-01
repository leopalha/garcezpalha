-- =====================================================
-- APPLY RLS POLICIES ONLY (SEM TRIGGERS)
-- =====================================================
-- Data: 31/12/2024
-- Objetivo: Aplicar apenas RLS policies sem recriar triggers
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

DO $$
BEGIN
  -- Enable RLS (ignora se já ativado)
  ALTER TABLE IF EXISTS leads ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies (se existirem)
  DROP POLICY IF EXISTS "Users can view leads from their tenant" ON leads;
  DROP POLICY IF EXISTS "Users can insert leads for their tenant" ON leads;
  DROP POLICY IF EXISTS "Users can update leads from their tenant" ON leads;
  DROP POLICY IF EXISTS "Users can delete leads from their tenant" ON leads;

  -- Create policies
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'leads') THEN
    -- Policy: Users can view leads from their tenant
    EXECUTE 'CREATE POLICY "Users can view leads from their tenant"
    ON leads
    FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    -- Policy: Users can insert leads for their tenant
    EXECUTE 'CREATE POLICY "Users can insert leads for their tenant"
    ON leads
    FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    -- Policy: Users can update leads from their tenant
    EXECUTE 'CREATE POLICY "Users can update leads from their tenant"
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
    )';

    -- Policy: Users can delete leads from their tenant
    EXECUTE 'CREATE POLICY "Users can delete leads from their tenant"
    ON leads
    FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela LEADS';
  ELSE
    RAISE NOTICE '⏭️  Tabela LEADS não existe';
  END IF;
END $$;

-- =====================================================
-- 2. CONVERSATIONS TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  ALTER TABLE IF EXISTS conversations ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Users can view conversations from their tenant" ON conversations;
  DROP POLICY IF EXISTS "Users can insert conversations for their tenant" ON conversations;
  DROP POLICY IF EXISTS "Users can update conversations from their tenant" ON conversations;
  DROP POLICY IF EXISTS "Users can delete conversations from their tenant" ON conversations;

  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'conversations') THEN
    EXECUTE 'CREATE POLICY "Users can view conversations from their tenant"
    ON conversations
    FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    EXECUTE 'CREATE POLICY "Users can insert conversations for their tenant"
    ON conversations
    FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    EXECUTE 'CREATE POLICY "Users can update conversations from their tenant"
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
    )';

    EXECUTE 'CREATE POLICY "Users can delete conversations from their tenant"
    ON conversations
    FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela CONVERSATIONS';
  ELSE
    RAISE NOTICE '⏭️  Tabela CONVERSATIONS não existe';
  END IF;
END $$;

-- =====================================================
-- 3. QUALIFIED_LEADS TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  ALTER TABLE IF EXISTS qualified_leads ENABLE ROW LEVEL SECURITY;

  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can view qualified leads from their tenant" ON qualified_leads;
  DROP POLICY IF EXISTS "Users can insert qualified leads for their tenant" ON qualified_leads;
  DROP POLICY IF EXISTS "Users can update qualified leads from their tenant" ON qualified_leads;
  DROP POLICY IF EXISTS "Users can delete qualified leads from their tenant" ON qualified_leads;

  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'qualified_leads') THEN
    EXECUTE 'CREATE POLICY "Users can view qualified leads from their tenant"
    ON qualified_leads
    FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    EXECUTE 'CREATE POLICY "Users can insert qualified leads for their tenant"
    ON qualified_leads
    FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    EXECUTE 'CREATE POLICY "Users can update qualified leads from their tenant"
    ON qualified_leads
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
    )';

    EXECUTE 'CREATE POLICY "Users can delete qualified leads from their tenant"
    ON qualified_leads
    FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela QUALIFIED_LEADS';
  ELSE
    RAISE NOTICE '⏭️  Tabela QUALIFIED_LEADS não existe';
  END IF;
END $$;

-- =====================================================
-- 4. CONTRACTS TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  ALTER TABLE IF EXISTS contracts ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Users can view contracts from their tenant" ON contracts;
  DROP POLICY IF EXISTS "Users can insert contracts for their tenant" ON contracts;
  DROP POLICY IF EXISTS "Users can update contracts from their tenant" ON contracts;
  DROP POLICY IF EXISTS "Users can delete contracts from their tenant" ON contracts;

  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'contracts') THEN
    EXECUTE 'CREATE POLICY "Users can view contracts from their tenant"
    ON contracts
    FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    EXECUTE 'CREATE POLICY "Users can insert contracts for their tenant"
    ON contracts
    FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    EXECUTE 'CREATE POLICY "Users can update contracts from their tenant"
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
    )';

    EXECUTE 'CREATE POLICY "Users can delete contracts from their tenant"
    ON contracts
    FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela CONTRACTS';
  ELSE
    RAISE NOTICE '⏭️  Tabela CONTRACTS não existe';
  END IF;
END $$;

-- =====================================================
-- 5. MESSAGES TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Users can view messages from their tenant conversations" ON messages;
  DROP POLICY IF EXISTS "Users can insert messages in their tenant conversations" ON messages;
  DROP POLICY IF EXISTS "Users can update messages in their tenant conversations" ON messages;
  DROP POLICY IF EXISTS "Users can delete messages in their tenant conversations" ON messages;

  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'messages') THEN
    EXECUTE 'CREATE POLICY "Users can view messages from their tenant conversations"
    ON messages
    FOR SELECT
    USING (
      conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    )';

    EXECUTE 'CREATE POLICY "Users can insert messages in their tenant conversations"
    ON messages
    FOR INSERT
    WITH CHECK (
      conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    )';

    EXECUTE 'CREATE POLICY "Users can update messages in their tenant conversations"
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
    )';

    EXECUTE 'CREATE POLICY "Users can delete messages in their tenant conversations"
    ON messages
    FOR DELETE
    USING (
      conversation_id IN (
        SELECT id FROM conversations
        WHERE tenant_id IN (
          SELECT tenant_id FROM users WHERE id = auth.uid()
        )
      )
    )';

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela MESSAGES';
  ELSE
    RAISE NOTICE '⏭️  Tabela MESSAGES não existe';
  END IF;
END $$;

-- =====================================================
-- 6. PRODUCTS TABLE - RLS Policies (Se existir)
-- =====================================================

DO $$
BEGIN
  ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Users can view products from their tenant" ON products;
  DROP POLICY IF EXISTS "Users can insert products for their tenant" ON products;
  DROP POLICY IF EXISTS "Users can update products from their tenant" ON products;
  DROP POLICY IF EXISTS "Users can delete products from their tenant" ON products;

  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
    EXECUTE 'CREATE POLICY "Users can view products from their tenant"
    ON products
    FOR SELECT
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    EXECUTE 'CREATE POLICY "Users can insert products for their tenant"
    ON products
    FOR INSERT
    WITH CHECK (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    EXECUTE 'CREATE POLICY "Users can update products from their tenant"
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
    )';

    EXECUTE 'CREATE POLICY "Users can delete products from their tenant"
    ON products
    FOR DELETE
    USING (
      tenant_id IN (
        SELECT tenant_id FROM users WHERE id = auth.uid()
      )
    )';

    RAISE NOTICE '✅ 4 RLS policies aplicadas na tabela PRODUCTS';
  ELSE
    RAISE NOTICE '⏭️  Tabela PRODUCTS não existe';
  END IF;
END $$;

-- =====================================================
-- 7. VERIFICATION - Verificar RLS ativado
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
    SELECT unnest(ARRAY['leads', 'conversations', 'qualified_leads', 'products', 'contracts', 'messages'])
  LOOP
    IF EXISTS (SELECT FROM pg_tables WHERE tablename = table_name) THEN
      SELECT relrowsecurity INTO rls_status
      FROM pg_class
      WHERE relname = table_name;

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
  RAISE NOTICE 'RLS POLICIES APLICADAS COM SUCESSO!';
  RAISE NOTICE '==============================================';
END $$;

-- =====================================================
-- NOTAS FINAIS
-- =====================================================
--
-- ✅ Este script:
--    - Apenas aplica RLS policies
--    - NÃO cria triggers (já existem)
--    - NÃO cria tabelas (já existem)
--    - É idempotente (pode rodar múltiplas vezes)
--
-- ⚠️ ATENÇÃO:
--    - Service role key BYPASSA RLS
--    - Anon key RESPEITA RLS
--    - Testar com 2 usuários de tenants diferentes
--
-- =====================================================

SELECT 'RLS Policies aplicadas com sucesso! ✅' as status;
