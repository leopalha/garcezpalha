-- Audit Logs Table
-- P1-008: LGPD Art. 37 Compliance - Rastreabilidade de acesso a dados pessoais

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event details
  event_type TEXT NOT NULL,
  action TEXT,

  -- Actor (who did it)
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  tenant_id TEXT,

  -- Resource (what was affected)
  resource_type TEXT,
  resource_id TEXT,

  -- Context
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,

  -- Result
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_event_type ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_success ON audit_logs(success);

-- Composite index for user activity over time
CREATE INDEX idx_audit_logs_user_activity ON audit_logs(user_id, created_at DESC);

-- Composite index for security events
CREATE INDEX idx_audit_logs_security ON audit_logs(event_type, created_at DESC)
  WHERE event_type LIKE 'security.%';

-- RLS Policies
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ));

-- System can insert audit logs (no user context needed)
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);

-- No updates or deletes (audit logs are immutable)
-- This ensures log integrity for compliance

-- Function to get audit log statistics
CREATE OR REPLACE FUNCTION get_audit_stats(
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  total_events BIGINT,
  success_rate NUMERIC,
  security_incidents BIGINT,
  top_events JSONB,
  top_users JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE success = true) as successful,
      COUNT(*) FILTER (WHERE event_type LIKE 'security.%') as security
    FROM audit_logs
    WHERE created_at BETWEEN start_date AND end_date
  ),
  top_e AS (
    SELECT json_agg(row_to_json(e)) as events
    FROM (
      SELECT event_type, COUNT(*) as count
      FROM audit_logs
      WHERE created_at BETWEEN start_date AND end_date
      GROUP BY event_type
      ORDER BY count DESC
      LIMIT 10
    ) e
  ),
  top_u AS (
    SELECT json_agg(row_to_json(u)) as users
    FROM (
      SELECT user_id, COUNT(*) as count
      FROM audit_logs
      WHERE created_at BETWEEN start_date AND end_date
        AND user_id IS NOT NULL
      GROUP BY user_id
      ORDER BY count DESC
      LIMIT 10
    ) u
  )
  SELECT
    stats.total::BIGINT,
    CASE
      WHEN stats.total > 0 THEN (stats.successful::NUMERIC / stats.total::NUMERIC * 100)
      ELSE 0
    END,
    stats.security::BIGINT,
    COALESCE(top_e.events::JSONB, '[]'::JSONB),
    COALESCE(top_u.users::JSONB, '[]'::JSONB)
  FROM stats, top_e, top_u;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean old audit logs (data retention policy)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(
  retention_days INTEGER DEFAULT 365
)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Only allow admins to run this
  IF NOT EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only admins can cleanup audit logs';
  END IF;

  -- Delete logs older than retention period
  DELETE FROM audit_logs
  WHERE created_at < NOW() - (retention_days || ' days')::INTERVAL
  RETURNING COUNT(*) INTO deleted_count;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_audit_stats TO authenticated;
GRANT EXECUTE ON FUNCTION cleanup_old_audit_logs TO authenticated;
