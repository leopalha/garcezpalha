-- =====================================================
-- RLS POLICIES - CRITICAL TABLES (SECURITY-005) - V2
-- =====================================================
-- Data: 31/12/2024
-- Objetivo: Habilitar Row Level Security em tabelas críticas
-- Tabelas: leads, conversations, products, contracts, messages
--
-- NOTA: Esta versão simplificada apenas habilita RLS e cria policies
-- básicas para usuários autenticados, sem dependência de tenant_id
-- =====================================================

-- =====================================================
-- 1. LEADS TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  -- Enable RLS
  EXECUTE 'ALTER TABLE leads ENABLE ROW LEVEL SECURITY';

  -- Policy: Authenticated users can view all leads
  EXECUTE 'CREATE POLICY "Authenticated users can view leads"
  ON leads FOR SELECT
  TO authenticated
  USING (true)';

  -- Policy: Authenticated users can insert leads
  EXECUTE 'CREATE POLICY "Authenticated users can insert leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (true)';

  -- Policy: Authenticated users can update leads
  EXECUTE 'CREATE POLICY "Authenticated users can update leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true)';

  -- Policy: Authenticated users can delete leads
  EXECUTE 'CREATE POLICY "Authenticated users can delete leads"
  ON leads FOR DELETE
  TO authenticated
  USING (true)';

  RAISE NOTICE 'RLS enabled on leads table';

EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'RLS policies already exist on leads table';
  WHEN others THEN
    RAISE WARNING 'Error enabling RLS on leads: %', SQLERRM;
END $$;

-- =====================================================
-- 2. CONVERSATIONS TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'conversations') THEN
    EXECUTE 'ALTER TABLE conversations ENABLE ROW LEVEL SECURITY';

    EXECUTE 'CREATE POLICY "Authenticated users can view conversations"
    ON conversations FOR SELECT
    TO authenticated
    USING (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can insert conversations"
    ON conversations FOR INSERT
    TO authenticated
    WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can update conversations"
    ON conversations FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can delete conversations"
    ON conversations FOR DELETE
    TO authenticated
    USING (true)';

    RAISE NOTICE 'RLS enabled on conversations table';
  ELSE
    RAISE NOTICE 'conversations table does not exist, skipping';
  END IF;

EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'RLS policies already exist on conversations table';
  WHEN others THEN
    RAISE WARNING 'Error enabling RLS on conversations: %', SQLERRM;
END $$;

-- =====================================================
-- 3. PRODUCTS TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  -- Check if products or lawyer_products table exists
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'products') THEN
    EXECUTE 'ALTER TABLE products ENABLE ROW LEVEL SECURITY';

    EXECUTE 'CREATE POLICY "Authenticated users can view products"
    ON products FOR SELECT
    TO authenticated
    USING (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can insert products"
    ON products FOR INSERT
    TO authenticated
    WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can update products"
    ON products FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can delete products"
    ON products FOR DELETE
    TO authenticated
    USING (true)';

    RAISE NOTICE 'RLS enabled on products table';
  ELSIF EXISTS (SELECT FROM pg_tables WHERE tablename = 'lawyer_products') THEN
    EXECUTE 'ALTER TABLE lawyer_products ENABLE ROW LEVEL SECURITY';

    EXECUTE 'CREATE POLICY "Authenticated users can view lawyer_products"
    ON lawyer_products FOR SELECT
    TO authenticated
    USING (true)';

    RAISE NOTICE 'RLS enabled on lawyer_products table';
  ELSE
    RAISE NOTICE 'products/lawyer_products table does not exist, skipping';
  END IF;

EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'RLS policies already exist on products table';
  WHEN others THEN
    RAISE WARNING 'Error enabling RLS on products: %', SQLERRM;
END $$;

-- =====================================================
-- 4. CONTRACTS TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'contracts') THEN
    EXECUTE 'ALTER TABLE contracts ENABLE ROW LEVEL SECURITY';

    EXECUTE 'CREATE POLICY "Authenticated users can view contracts"
    ON contracts FOR SELECT
    TO authenticated
    USING (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can insert contracts"
    ON contracts FOR INSERT
    TO authenticated
    WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can update contracts"
    ON contracts FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can delete contracts"
    ON contracts FOR DELETE
    TO authenticated
    USING (true)';

    RAISE NOTICE 'RLS enabled on contracts table';
  ELSE
    RAISE NOTICE 'contracts table does not exist, skipping';
  END IF;

EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'RLS policies already exist on contracts table';
  WHEN others THEN
    RAISE WARNING 'Error enabling RLS on contracts: %', SQLERRM;
END $$;

-- =====================================================
-- 5. MESSAGES TABLE - RLS Policies
-- =====================================================

DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE tablename = 'messages') THEN
    EXECUTE 'ALTER TABLE messages ENABLE ROW LEVEL SECURITY';

    EXECUTE 'CREATE POLICY "Authenticated users can view messages"
    ON messages FOR SELECT
    TO authenticated
    USING (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can insert messages"
    ON messages FOR INSERT
    TO authenticated
    WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can update messages"
    ON messages FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true)';

    EXECUTE 'CREATE POLICY "Authenticated users can delete messages"
    ON messages FOR DELETE
    TO authenticated
    USING (true)';

    RAISE NOTICE 'RLS enabled on messages table';
  ELSE
    RAISE NOTICE 'messages table does not exist, skipping';
  END IF;

EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'RLS policies already exist on messages table';
  WHEN others THEN
    RAISE WARNING 'Error enabling RLS on messages: %', SQLERRM;
END $$;

-- =====================================================
-- 6. VERIFICATION
-- =====================================================

DO $$
DECLARE
  table_rec RECORD;
BEGIN
  RAISE NOTICE '=== RLS STATUS VERIFICATION ===';

  FOR table_rec IN
    SELECT tablename, relrowsecurity
    FROM pg_tables t
    JOIN pg_class c ON c.relname = t.tablename
    WHERE schemaname = 'public'
      AND tablename IN ('leads', 'conversations', 'products', 'lawyer_products', 'contracts', 'messages')
  LOOP
    IF table_rec.relrowsecurity THEN
      RAISE NOTICE '✅ RLS ENABLED on: %', table_rec.tablename;
    ELSE
      RAISE WARNING '❌ RLS NOT ENABLED on: %', table_rec.tablename;
    END IF;
  END LOOP;

  RAISE NOTICE '================================';
END $$;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
--
-- 1. Esta versão simplificada permite acesso total para
--    usuários autenticados
--
-- 2. Para implementar multi-tenancy, será necessário:
--    - Adicionar coluna tenant_id às tabelas
--    - Atualizar policies para filtrar por tenant_id
--
-- 3. Service role bypassa todas as policies
--
-- 4. Para produção, considere implementar policies mais
--    restritivas baseadas em roles e permissões
--
-- =====================================================
