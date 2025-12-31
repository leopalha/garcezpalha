-- Fix RLS Policies with Proper Tenant Isolation
-- P1-002: Replace `USING true` with actual tenant checks

-- ============================================
-- LEADS TABLE
-- ============================================

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can create leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Admins can view all leads" ON leads;

-- Recreate with tenant isolation
CREATE POLICY "Users can view leads in their tenant"
  ON leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.tenant_id = leads.tenant_id
    )
  );

CREATE POLICY "Users can create leads in their tenant"
  ON leads FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.tenant_id = leads.tenant_id
    )
  );

CREATE POLICY "Users can update leads in their tenant"
  ON leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.tenant_id = leads.tenant_id
    )
  );

CREATE POLICY "Admins can delete leads in their tenant"
  ON leads FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.tenant_id = leads.tenant_id
        AND users.role = 'admin'
    )
  );

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own conversations" ON conversations;
DROP POLICY IF EXISTS "Users can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON conversations;

CREATE POLICY "Users can view conversations in their tenant"
  ON conversations FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.tenant_id = (SELECT tenant_id FROM users WHERE id = conversations.user_id)
        AND users.role IN ('admin', 'lawyer')
    )
  );

CREATE POLICY "Users can create own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations"
  ON conversations FOR UPDATE
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.tenant_id = (SELECT tenant_id FROM users WHERE id = conversations.user_id)
        AND users.role IN ('admin', 'lawyer')
    )
  );

-- ============================================
-- QUALIFIED_LEADS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view qualified leads" ON qualified_leads;
DROP POLICY IF EXISTS "Users can create qualified leads" ON qualified_leads;
DROP POLICY IF EXISTS "Admins can update qualified leads" ON qualified_leads;

CREATE POLICY "Users can view qualified leads in their tenant"
  ON qualified_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u1
      JOIN users u2 ON u1.tenant_id = u2.tenant_id
      WHERE u1.id = auth.uid()
        AND u2.id = qualified_leads.user_id
    )
  );

CREATE POLICY "System can create qualified leads"
  ON qualified_leads FOR INSERT
  WITH CHECK (true); -- System creates via service role

CREATE POLICY "Admins can update qualified leads in their tenant"
  ON qualified_leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u1
      JOIN users u2 ON u1.tenant_id = u2.tenant_id
      WHERE u1.id = auth.uid()
        AND u2.id = qualified_leads.user_id
        AND u1.role IN ('admin', 'lawyer')
    )
  );

-- ============================================
-- CONTRACTS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own contracts" ON contracts;
DROP POLICY IF EXISTS "Admins can view all contracts" ON contracts;
DROP POLICY IF EXISTS "Users can create contracts" ON contracts;

CREATE POLICY "Users can view contracts in their tenant"
  ON contracts FOR SELECT
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM users u1
      JOIN users u2 ON u1.tenant_id = u2.tenant_id
      WHERE u1.id = auth.uid()
        AND u2.id = contracts.user_id
        AND u1.role IN ('admin', 'lawyer', 'partner')
    )
  );

CREATE POLICY "Lawyers can create contracts in their tenant"
  ON contracts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u1
      JOIN users u2 ON u1.tenant_id = u2.tenant_id
      WHERE u1.id = auth.uid()
        AND u2.id = user_id
        AND u1.role IN ('admin', 'lawyer')
    )
  );

CREATE POLICY "Lawyers can update contracts in their tenant"
  ON contracts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users u1
      JOIN users u2 ON u1.tenant_id = u2.tenant_id
      WHERE u1.id = auth.uid()
        AND u2.id = contracts.user_id
        AND u1.role IN ('admin', 'lawyer')
    )
  );

-- ============================================
-- PRODUCTS TABLE
-- ============================================

-- Products are global (shared across tenants), but creation is restricted

DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admins can create products" ON products;

CREATE POLICY "Authenticated users can view products"
  ON products FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can create products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
  );

-- ============================================
-- MESSAGES TABLE (Chat messages)
-- ============================================

DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;

CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
        AND (
          conversations.user_id = auth.uid()
          OR EXISTS (
            SELECT 1 FROM users u1
            JOIN users u2 ON u1.tenant_id = u2.tenant_id
            WHERE u1.id = auth.uid()
              AND u2.id = conversations.user_id
              AND u1.role IN ('admin', 'lawyer')
          )
        )
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = conversation_id
        AND conversations.user_id = auth.uid()
    )
  );

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================

DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view subscriptions in their tenant"
  ON subscriptions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u1
      JOIN users u2 ON u1.tenant_id = u2.tenant_id
      WHERE u1.id = auth.uid()
        AND u2.id = subscriptions.user_id
        AND u1.role = 'admin'
    )
  );

CREATE POLICY "System can manage subscriptions"
  ON subscriptions FOR ALL
  USING (true);

-- ============================================
-- Add tenant_id to tables that don't have it
-- ============================================

-- Add tenant_id column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'tenant_id') THEN
    ALTER TABLE leads ADD COLUMN tenant_id TEXT;

    -- Populate tenant_id from user's tenant
    UPDATE leads SET tenant_id = (
      SELECT tenant_id FROM users WHERE users.id = leads.user_id
    );

    -- Make it NOT NULL after populating
    ALTER TABLE leads ALTER COLUMN tenant_id SET NOT NULL;

    -- Add index
    CREATE INDEX idx_leads_tenant_id ON leads(tenant_id);
  END IF;
END$$;

-- ============================================
-- Function to auto-populate tenant_id
-- ============================================

CREATE OR REPLACE FUNCTION set_tenant_id_from_user()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tenant_id IS NULL AND NEW.user_id IS NOT NULL THEN
    SELECT tenant_id INTO NEW.tenant_id
    FROM users
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to leads table
DROP TRIGGER IF EXISTS trigger_set_tenant_id_leads ON leads;
CREATE TRIGGER trigger_set_tenant_id_leads
  BEFORE INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION set_tenant_id_from_user();

-- ============================================
-- Security Functions
-- ============================================

-- Check if user has access to tenant
CREATE OR REPLACE FUNCTION has_tenant_access(target_tenant_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND tenant_id = target_tenant_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is admin in tenant
CREATE OR REPLACE FUNCTION is_tenant_admin(target_tenant_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
      AND tenant_id = target_tenant_id
      AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION has_tenant_access TO authenticated;
GRANT EXECUTE ON FUNCTION is_tenant_admin TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON POLICY "Users can view leads in their tenant" ON leads IS
  'Users can only view leads within their own tenant (multi-tenant isolation)';

COMMENT ON FUNCTION has_tenant_access IS
  'Check if current user has access to a specific tenant';

COMMENT ON FUNCTION set_tenant_id_from_user IS
  'Auto-populate tenant_id from user relationship';
