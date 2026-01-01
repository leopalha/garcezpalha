-- Migration: A/B Testing System for Email Campaigns
-- Created: 2024-12-30
-- Purpose: Enable A/B testing for email subject lines and content

-- =====================================================
-- EMAIL A/B TESTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Reference to campaign/sequence
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  step_id UUID REFERENCES email_sequence_steps(id) ON DELETE CASCADE,

  -- Test configuration
  test_name TEXT NOT NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('subject', 'content', 'both')),

  -- Variants
  variant_a JSONB NOT NULL, -- { subject: "...", body: "..." }
  variant_b JSONB NOT NULL,

  -- Test parameters
  test_metric TEXT NOT NULL CHECK (test_metric IN ('open_rate', 'click_rate', 'conversion_rate')),
  split_ratio INT DEFAULT 50 CHECK (split_ratio >= 10 AND split_ratio <= 90), -- % for variant A
  min_sample_size INT DEFAULT 100,
  confidence_level DECIMAL DEFAULT 0.95,

  -- Results
  winner TEXT CHECK (winner IN ('a', 'b', 'no_clear_winner', NULL)),
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'paused')),

  -- Statistics
  variant_a_sends INT DEFAULT 0,
  variant_a_opens INT DEFAULT 0,
  variant_a_clicks INT DEFAULT 0,
  variant_a_conversions INT DEFAULT 0,

  variant_b_sends INT DEFAULT 0,
  variant_b_opens INT DEFAULT 0,
  variant_b_clicks INT DEFAULT 0,
  variant_b_conversions INT DEFAULT 0,

  -- Statistical significance
  p_value DECIMAL,
  statistical_significance BOOLEAN DEFAULT FALSE,

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AB TEST ASSIGNMENTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS email_ab_test_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References
  ab_test_id UUID NOT NULL REFERENCES email_ab_tests(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  send_id UUID REFERENCES email_sequence_sends(id) ON DELETE SET NULL,

  -- Assignment
  variant TEXT NOT NULL CHECK (variant IN ('a', 'b', 'control')),

  -- Tracking
  opened BOOLEAN DEFAULT FALSE,
  clicked BOOLEAN DEFAULT FALSE,
  converted BOOLEAN DEFAULT FALSE,

  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one assignment per lead per test
  UNIQUE(ab_test_id, lead_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_ab_tests_sequence ON email_ab_tests(sequence_id);
CREATE INDEX idx_ab_tests_step ON email_ab_tests(step_id);
CREATE INDEX idx_ab_tests_status ON email_ab_tests(status);
CREATE INDEX idx_ab_test_assignments_test ON email_ab_test_assignments(ab_test_id);
CREATE INDEX idx_ab_test_assignments_lead ON email_ab_test_assignments(lead_id);
CREATE INDEX idx_ab_test_assignments_variant ON email_ab_test_assignments(variant);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function: Calculate A/B test statistics
CREATE OR REPLACE FUNCTION calculate_ab_test_stats(test_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  test_record RECORD;
  variant_a_rate DECIMAL;
  variant_b_rate DECIMAL;
  result JSONB;
BEGIN
  -- Get test record
  SELECT * INTO test_record FROM email_ab_tests WHERE id = test_id;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Calculate rates based on test metric
  IF test_record.test_metric = 'open_rate' THEN
    variant_a_rate := CASE
      WHEN test_record.variant_a_sends > 0
      THEN (test_record.variant_a_opens::DECIMAL / test_record.variant_a_sends) * 100
      ELSE 0
    END;

    variant_b_rate := CASE
      WHEN test_record.variant_b_sends > 0
      THEN (test_record.variant_b_opens::DECIMAL / test_record.variant_b_sends) * 100
      ELSE 0
    END;

  ELSIF test_record.test_metric = 'click_rate' THEN
    variant_a_rate := CASE
      WHEN test_record.variant_a_sends > 0
      THEN (test_record.variant_a_clicks::DECIMAL / test_record.variant_a_sends) * 100
      ELSE 0
    END;

    variant_b_rate := CASE
      WHEN test_record.variant_b_sends > 0
      THEN (test_record.variant_b_clicks::DECIMAL / test_record.variant_b_sends) * 100
      ELSE 0
    END;

  ELSE -- conversion_rate
    variant_a_rate := CASE
      WHEN test_record.variant_a_sends > 0
      THEN (test_record.variant_a_conversions::DECIMAL / test_record.variant_a_sends) * 100
      ELSE 0
    END;

    variant_b_rate := CASE
      WHEN test_record.variant_b_sends > 0
      THEN (test_record.variant_b_conversions::DECIMAL / test_record.variant_b_sends) * 100
      ELSE 0
    END;
  END IF;

  -- Build result
  result := jsonb_build_object(
    'variant_a', jsonb_build_object(
      'sends', test_record.variant_a_sends,
      'opens', test_record.variant_a_opens,
      'clicks', test_record.variant_a_clicks,
      'conversions', test_record.variant_a_conversions,
      'rate', ROUND(variant_a_rate, 2)
    ),
    'variant_b', jsonb_build_object(
      'sends', test_record.variant_b_sends,
      'opens', test_record.variant_b_opens,
      'clicks', test_record.variant_b_clicks,
      'conversions', test_record.variant_b_conversions,
      'rate', ROUND(variant_b_rate, 2)
    ),
    'difference', ROUND(ABS(variant_a_rate - variant_b_rate), 2),
    'winner', CASE
      WHEN variant_a_rate > variant_b_rate THEN 'a'
      WHEN variant_b_rate > variant_a_rate THEN 'b'
      ELSE 'tie'
    END,
    'total_sends', test_record.variant_a_sends + test_record.variant_b_sends,
    'min_sample_reached', (test_record.variant_a_sends >= test_record.min_sample_size / 2)
                      AND (test_record.variant_b_sends >= test_record.min_sample_size / 2)
  );

  RETURN result;
END;
$$;

-- Function: Auto-determine winner when sample size reached
CREATE OR REPLACE FUNCTION check_ab_test_completion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  stats JSONB;
  min_sample_reached BOOLEAN;
BEGIN
  -- Calculate current stats
  stats := calculate_ab_test_stats(NEW.id);

  -- Check if minimum sample size reached
  min_sample_reached := (stats->>'min_sample_reached')::BOOLEAN;

  -- If sample size reached and still running, determine winner
  IF min_sample_reached AND NEW.status = 'running' THEN
    -- Simple winner determination (in production, use proper statistical test)
    IF (stats->'variant_a'->>'rate')::DECIMAL > (stats->'variant_b'->>'rate')::DECIMAL THEN
      NEW.winner := 'a';
    ELSIF (stats->'variant_b'->>'rate')::DECIMAL > (stats->'variant_a'->>'rate')::DECIMAL THEN
      NEW.winner := 'b';
    ELSE
      NEW.winner := 'no_clear_winner';
    END IF;

    -- Mark as completed
    NEW.status := 'completed';
    NEW.completed_at := NOW();
    NEW.statistical_significance := TRUE; -- Simplified, should use proper test
  END IF;

  RETURN NEW;
END;
$$;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger: Auto-update stats and determine winner
CREATE TRIGGER trigger_ab_test_completion
  BEFORE UPDATE OF variant_a_sends, variant_b_sends ON email_ab_tests
  FOR EACH ROW
  EXECUTE FUNCTION check_ab_test_completion();

-- Trigger: Update timestamp
CREATE TRIGGER trigger_ab_tests_updated_at
  BEFORE UPDATE ON email_ab_tests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- RLS POLICIES
-- =====================================================

ALTER TABLE email_ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_ab_test_assignments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own tests
CREATE POLICY ab_tests_select_policy ON email_ab_tests
  FOR SELECT
  USING (
    sequence_id IN (
      SELECT id FROM email_sequences
      WHERE tenant_id = auth.jwt() ->> 'tenant_id'
    )
  );

-- Policy: Users can create tests for their sequences
CREATE POLICY ab_tests_insert_policy ON email_ab_tests
  FOR INSERT
  WITH CHECK (
    sequence_id IN (
      SELECT id FROM email_sequences
      WHERE tenant_id = auth.jwt() ->> 'tenant_id'
    )
  );

-- Policy: Users can update their own tests
CREATE POLICY ab_tests_update_policy ON email_ab_tests
  FOR UPDATE
  USING (
    sequence_id IN (
      SELECT id FROM email_sequences
      WHERE tenant_id = auth.jwt() ->> 'tenant_id'
    )
  );

-- Policy: Users can view test assignments
CREATE POLICY ab_test_assignments_select_policy ON email_ab_test_assignments
  FOR SELECT
  USING (
    ab_test_id IN (
      SELECT id FROM email_ab_tests
      WHERE sequence_id IN (
        SELECT id FROM email_sequences
        WHERE tenant_id = auth.jwt() ->> 'tenant_id'
      )
    )
  );

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE email_ab_tests IS 'A/B tests for email campaigns - test subject lines, content, or both';
COMMENT ON TABLE email_ab_test_assignments IS 'Assignment of leads to A/B test variants';
COMMENT ON FUNCTION calculate_ab_test_stats IS 'Calculate current statistics for an A/B test';
COMMENT ON FUNCTION check_ab_test_completion IS 'Auto-determine winner when minimum sample size is reached';

-- =====================================================
-- SAMPLE DATA (for development)
-- =====================================================

-- Note: Sample data should only be inserted in development environment
-- Uncomment below for testing purposes

/*
INSERT INTO email_ab_tests (
  sequence_id,
  test_name,
  test_type,
  variant_a,
  variant_b,
  test_metric,
  min_sample_size
) VALUES (
  (SELECT id FROM email_sequences LIMIT 1),
  'Subject Line Test - Welcome Email',
  'subject',
  '{"subject": "Welcome to our platform!", "body": null}'::jsonb,
  '{"subject": "Get started in 5 minutes", "body": null}'::jsonb,
  'open_rate',
  200
);
*/
