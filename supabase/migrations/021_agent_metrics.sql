-- Migration: 021_agent_metrics.sql
-- Description: Create tables for AI agent metrics and performance tracking
-- Created: 2024-12-24

-- =============================================================================
-- AGENT METRICS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS agent_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Agent identification
  agent_role TEXT NOT NULL,
  agent_category TEXT NOT NULL CHECK (agent_category IN (
    'legal', 'executive', 'marketing', 'operations', 'intelligence'
  )),

  -- Request info
  request_id TEXT,
  conversation_id TEXT,
  user_id UUID REFERENCES auth.users(id),

  -- Performance metrics
  response_time_ms INTEGER,
  tokens_prompt INTEGER,
  tokens_completion INTEGER,
  tokens_total INTEGER,

  -- Success/Error tracking
  success BOOLEAN DEFAULT true,
  error_type TEXT,
  error_message TEXT,

  -- Content metrics
  input_length INTEGER,
  output_length INTEGER,

  -- Confidence and relevance
  confidence_score NUMERIC(3,2),
  relevance_score NUMERIC(3,2),

  -- Cost tracking (in cents)
  estimated_cost_cents INTEGER,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_metrics_role ON agent_metrics(agent_role);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_category ON agent_metrics(agent_category);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_created_at ON agent_metrics(created_at);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_success ON agent_metrics(success);
CREATE INDEX IF NOT EXISTS idx_agent_metrics_user ON agent_metrics(user_id);
-- Note: Cannot use DATE(created_at) in index as it's not IMMUTABLE
-- Use created_at directly for range queries

-- =============================================================================
-- AGENT DECISIONS TABLE (for executive agents)
-- =============================================================================

CREATE TABLE IF NOT EXISTS agent_decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Decision context
  agent_role TEXT NOT NULL,
  decision_type TEXT NOT NULL,

  -- Decision details
  title TEXT NOT NULL,
  description TEXT,
  options JSONB DEFAULT '[]'::jsonb,
  selected_option TEXT,
  rationale TEXT,

  -- Impact and priority
  priority TEXT CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  estimated_impact TEXT,

  -- Approval workflow
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  approval_status TEXT CHECK (approval_status IN (
    'pending', 'approved', 'rejected', 'auto_approved'
  )),

  -- Execution
  executed BOOLEAN DEFAULT false,
  executed_at TIMESTAMPTZ,
  execution_result JSONB,

  -- Related entities
  related_entity_type TEXT,
  related_entity_id UUID,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_decisions_role ON agent_decisions(agent_role);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_type ON agent_decisions(decision_type);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_status ON agent_decisions(approval_status);
CREATE INDEX IF NOT EXISTS idx_agent_decisions_created ON agent_decisions(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_agent_decisions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS agent_decisions_updated_at ON agent_decisions;
CREATE TRIGGER agent_decisions_updated_at
  BEFORE UPDATE ON agent_decisions
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_decisions_updated_at();

-- =============================================================================
-- AGENT ALERTS TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS agent_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Alert info
  agent_role TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'performance', 'error', 'threshold', 'anomaly', 'deadline', 'opportunity'
  )),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),

  -- Alert content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,

  -- Related entities
  related_entity_type TEXT,
  related_entity_id UUID,

  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN (
    'new', 'acknowledged', 'in_progress', 'resolved', 'dismissed'
  )),
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_alerts_role ON agent_alerts(agent_role);
CREATE INDEX IF NOT EXISTS idx_agent_alerts_type ON agent_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_agent_alerts_severity ON agent_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_agent_alerts_status ON agent_alerts(status);
CREATE INDEX IF NOT EXISTS idx_agent_alerts_active ON agent_alerts(status, severity)
  WHERE status IN ('new', 'acknowledged', 'in_progress');

-- =============================================================================
-- AGGREGATED METRICS VIEW
-- =============================================================================

CREATE OR REPLACE VIEW agent_performance_daily AS
SELECT
  DATE(created_at) as date,
  agent_role,
  agent_category,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE success = true) as successful_requests,
  COUNT(*) FILTER (WHERE success = false) as failed_requests,
  AVG(response_time_ms) as avg_response_time_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) as p95_response_time_ms,
  SUM(tokens_total) as total_tokens,
  AVG(confidence_score) as avg_confidence,
  SUM(estimated_cost_cents) as total_cost_cents
FROM agent_metrics
GROUP BY DATE(created_at), agent_role, agent_category;

-- =============================================================================
-- AGENT HEALTH VIEW
-- =============================================================================

CREATE OR REPLACE VIEW agent_health AS
SELECT
  agent_role,
  agent_category,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as requests_last_hour,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 hours') as requests_last_24h,
  COUNT(*) FILTER (WHERE success = false AND created_at > NOW() - INTERVAL '1 hour') as errors_last_hour,
  AVG(response_time_ms) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as avg_response_time_1h,
  CASE
    WHEN COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') = 0 THEN 'idle'
    WHEN COUNT(*) FILTER (WHERE success = false AND created_at > NOW() - INTERVAL '1 hour')::float /
         NULLIF(COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour'), 0) > 0.1 THEN 'degraded'
    WHEN AVG(response_time_ms) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') > 10000 THEN 'slow'
    ELSE 'healthy'
  END as status
FROM agent_metrics
GROUP BY agent_role, agent_category;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_alerts ENABLE ROW LEVEL SECURITY;

-- Admins can manage all
CREATE POLICY "Admins can manage agent metrics"
  ON agent_metrics FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage agent decisions"
  ON agent_decisions FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can manage agent alerts"
  ON agent_alerts FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Service role can insert metrics
CREATE POLICY "Service can insert metrics"
  ON agent_metrics FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert decisions"
  ON agent_decisions FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Service can insert alerts"
  ON agent_alerts FOR INSERT TO authenticated
  WITH CHECK (true);

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

GRANT SELECT, INSERT ON agent_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE ON agent_decisions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON agent_alerts TO authenticated;
GRANT SELECT ON agent_performance_daily TO authenticated;
GRANT SELECT ON agent_health TO authenticated;

-- =============================================================================
-- COMMENTS
-- =============================================================================

COMMENT ON TABLE agent_metrics IS 'Stores performance metrics for all AI agents';
COMMENT ON TABLE agent_decisions IS 'Stores decisions made by executive agents for review/approval';
COMMENT ON TABLE agent_alerts IS 'Stores alerts generated by agents for human attention';
COMMENT ON VIEW agent_performance_daily IS 'Daily aggregated performance metrics by agent';
COMMENT ON VIEW agent_health IS 'Real-time health status of each agent';
