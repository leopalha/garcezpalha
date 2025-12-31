-- Migration: Subscription & Billing System
-- Created: 2024-12-30
-- Purpose: Enable Stripe subscriptions and billing management

-- =====================================================
-- SUBSCRIPTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User/Tenant reference
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  -- Stripe IDs
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT NOT NULL,

  -- Plan details
  plan_id TEXT NOT NULL CHECK (plan_id IN ('starter', 'pro', 'enterprise')),
  plan_name TEXT NOT NULL,
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),

  -- Pricing
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',

  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'canceled', 'past_due', 'incomplete', 'trialing', 'paused'
  )),

  -- Trial
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,

  -- Billing dates
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- INVOICES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Stripe IDs
  stripe_invoice_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,

  -- Invoice details
  invoice_number TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',

  -- Status
  status TEXT NOT NULL CHECK (status IN (
    'draft', 'open', 'paid', 'void', 'uncollectible'
  )),

  -- Dates
  invoice_date TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,

  -- URLs
  invoice_pdf TEXT,
  hosted_invoice_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- =====================================================
-- PAYMENT METHODS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User reference
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Stripe IDs
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,

  -- Card details
  type TEXT NOT NULL CHECK (type IN ('card', 'pix', 'boleto')),
  card_brand TEXT,
  card_last4 TEXT,
  card_exp_month INT,
  card_exp_year INT,

  -- Status
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USAGE TRACKING TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Usage type
  metric TEXT NOT NULL CHECK (metric IN (
    'leads', 'conversations', 'emails_sent', 'ai_tokens', 'storage_mb'
  )),

  -- Usage data
  quantity INT NOT NULL DEFAULT 0,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one record per metric per period
  UNIQUE(subscription_id, metric, period_start)
);

-- =====================================================
-- PLAN LIMITS TABLE (cached from config)
-- =====================================================

CREATE TABLE IF NOT EXISTS plan_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  plan_id TEXT UNIQUE NOT NULL,

  -- Limits
  max_leads INT,
  max_conversations INT,
  max_emails_per_month INT,
  max_ai_tokens_per_month INT,
  max_storage_mb INT,
  max_products INT,
  max_team_members INT,

  -- Features
  features JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

CREATE INDEX idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX idx_invoices_user ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);

CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_default ON payment_methods(is_default) WHERE is_default = TRUE;

CREATE INDEX idx_usage_tracking_subscription ON usage_tracking(subscription_id);
CREATE INDEX idx_usage_tracking_period ON usage_tracking(period_start, period_end);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Get active subscription for user
CREATE OR REPLACE FUNCTION get_active_subscription(p_user_id UUID)
RETURNS subscriptions
LANGUAGE plpgsql
AS $$
DECLARE
  subscription subscriptions;
BEGIN
  SELECT * INTO subscription
  FROM subscriptions
  WHERE user_id = p_user_id
    AND status IN ('active', 'trialing')
  ORDER BY created_at DESC
  LIMIT 1;

  RETURN subscription;
END;
$$;

-- Function: Check if user is within plan limits
CREATE OR REPLACE FUNCTION check_plan_limit(
  p_user_id UUID,
  p_metric TEXT,
  p_current_usage INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  subscription subscriptions;
  limits plan_limits;
  limit_value INT;
BEGIN
  -- Get active subscription
  subscription := get_active_subscription(p_user_id);

  IF subscription IS NULL THEN
    RETURN FALSE; -- No active subscription
  END IF;

  -- Get plan limits
  SELECT * INTO limits
  FROM plan_limits
  WHERE plan_id = subscription.plan_id;

  IF limits IS NULL THEN
    RETURN TRUE; -- No limits configured, allow
  END IF;

  -- Check specific metric
  limit_value := CASE p_metric
    WHEN 'leads' THEN limits.max_leads
    WHEN 'conversations' THEN limits.max_conversations
    WHEN 'emails' THEN limits.max_emails_per_month
    WHEN 'ai_tokens' THEN limits.max_ai_tokens_per_month
    WHEN 'storage' THEN limits.max_storage_mb
    WHEN 'products' THEN limits.max_products
    WHEN 'team_members' THEN limits.max_team_members
    ELSE NULL
  END;

  -- If no limit for this metric, allow
  IF limit_value IS NULL THEN
    RETURN TRUE;
  END IF;

  -- Check if within limit
  RETURN p_current_usage < limit_value;
END;
$$;

-- Function: Record usage
CREATE OR REPLACE FUNCTION record_usage(
  p_subscription_id UUID,
  p_user_id UUID,
  p_metric TEXT,
  p_quantity INT DEFAULT 1
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  period_start TIMESTAMPTZ;
  period_end TIMESTAMPTZ;
BEGIN
  -- Calculate current billing period
  period_start := date_trunc('month', NOW());
  period_end := period_start + INTERVAL '1 month';

  -- Insert or update usage
  INSERT INTO usage_tracking (
    subscription_id,
    user_id,
    metric,
    quantity,
    period_start,
    period_end
  ) VALUES (
    p_subscription_id,
    p_user_id,
    p_metric,
    p_quantity,
    period_start,
    period_end
  )
  ON CONFLICT (subscription_id, metric, period_start)
  DO UPDATE SET
    quantity = usage_tracking.quantity + p_quantity,
    created_at = NOW();
END;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Update timestamp
CREATE TRIGGER trigger_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_payment_methods_updated_at
  BEFORE UPDATE ON payment_methods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY subscriptions_select_policy ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid() OR tenant_id = auth.jwt() ->> 'tenant_id');

CREATE POLICY subscriptions_insert_policy ON subscriptions
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY subscriptions_update_policy ON subscriptions
  FOR UPDATE
  USING (user_id = auth.uid());

-- Invoices policies
CREATE POLICY invoices_select_policy ON invoices
  FOR SELECT
  USING (user_id = auth.uid());

-- Payment methods policies
CREATE POLICY payment_methods_select_policy ON payment_methods
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY payment_methods_insert_policy ON payment_methods
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY payment_methods_update_policy ON payment_methods
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY payment_methods_delete_policy ON payment_methods
  FOR DELETE
  USING (user_id = auth.uid());

-- Usage tracking policies
CREATE POLICY usage_tracking_select_policy ON usage_tracking
  FOR SELECT
  USING (user_id = auth.uid());

-- Plan limits are public (read-only)
CREATE POLICY plan_limits_select_policy ON plan_limits
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- =====================================================
-- SEED DATA - Plan Limits
-- =====================================================

INSERT INTO plan_limits (plan_id, max_leads, max_conversations, max_emails_per_month, max_ai_tokens_per_month, max_storage_mb, max_products, max_team_members, features) VALUES
('starter', 100, 500, 1000, 100000, 1024, 3, 1, '{"whatsapp": false, "custom_domain": false, "priority_support": false}'::jsonb),
('pro', 1000, 5000, 10000, 1000000, 10240, 20, 5, '{"whatsapp": true, "custom_domain": true, "priority_support": true}'::jsonb),
('enterprise', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"whatsapp": true, "custom_domain": true, "priority_support": true, "dedicated_support": true, "sla": true}'::jsonb)
ON CONFLICT (plan_id) DO NOTHING;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE subscriptions IS 'Stripe subscriptions for user billing';
COMMENT ON TABLE invoices IS 'Invoice records from Stripe';
COMMENT ON TABLE payment_methods IS 'User payment methods stored in Stripe';
COMMENT ON TABLE usage_tracking IS 'Track usage metrics for billing and limits';
COMMENT ON TABLE plan_limits IS 'Plan limits and features configuration';

COMMENT ON FUNCTION get_active_subscription IS 'Get active subscription for a user';
COMMENT ON FUNCTION check_plan_limit IS 'Check if user is within plan limits for a metric';
COMMENT ON FUNCTION record_usage IS 'Record usage for a metric in current billing period';
