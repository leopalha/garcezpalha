-- Security Dashboard Helper Functions
-- P1-012: Security Audit Dashboard

-- Function to get top users with failed attempts
CREATE OR REPLACE FUNCTION get_top_failed_users(
  p_tenant_id TEXT,
  p_since TIMESTAMPTZ,
  p_limit INT DEFAULT 5
)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT,
  user_name TEXT,
  failed_count BIGINT,
  last_failed_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id AS user_id,
    u.email AS user_email,
    u.name AS user_name,
    COUNT(*) AS failed_count,
    MAX(al.created_at) AS last_failed_at
  FROM audit_logs al
  JOIN users u ON u.id = al.user_id
  WHERE al.tenant_id = p_tenant_id
    AND al.success = FALSE
    AND al.created_at >= p_since
    AND al.user_id IS NOT NULL
  GROUP BY u.id, u.email, u.name
  ORDER BY failed_count DESC, last_failed_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get security events timeline (hourly aggregation)
CREATE OR REPLACE FUNCTION get_security_events_timeline(
  p_tenant_id TEXT,
  p_since TIMESTAMPTZ,
  p_hours INT DEFAULT 24
)
RETURNS TABLE (
  hour TIMESTAMPTZ,
  total_events BIGINT,
  failed_events BIGINT,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH hourly_data AS (
    SELECT
      DATE_TRUNC('hour', created_at) AS hour,
      COUNT(*) AS total,
      COUNT(*) FILTER (WHERE success = FALSE) AS failed
    FROM audit_logs
    WHERE tenant_id = p_tenant_id
      AND created_at >= p_since
    GROUP BY DATE_TRUNC('hour', created_at)
  )
  SELECT
    hd.hour,
    hd.total AS total_events,
    hd.failed AS failed_events,
    CASE
      WHEN hd.total > 0 THEN ROUND(((hd.total - hd.failed)::NUMERIC / hd.total::NUMERIC) * 100, 2)
      ELSE 100
    END AS success_rate
  FROM hourly_data hd
  ORDER BY hd.hour ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get event type distribution
CREATE OR REPLACE FUNCTION get_event_type_distribution(
  p_tenant_id TEXT,
  p_since TIMESTAMPTZ,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  event_type TEXT,
  total_count BIGINT,
  failed_count BIGINT,
  success_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.event_type,
    COUNT(*) AS total_count,
    COUNT(*) FILTER (WHERE al.success = FALSE) AS failed_count,
    CASE
      WHEN COUNT(*) > 0 THEN ROUND(((COUNT(*) - COUNT(*) FILTER (WHERE al.success = FALSE))::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 100
    END AS success_rate
  FROM audit_logs al
  WHERE al.tenant_id = p_tenant_id
    AND al.created_at >= p_since
  GROUP BY al.event_type
  ORDER BY total_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get IP address activity (for security monitoring)
CREATE OR REPLACE FUNCTION get_ip_activity(
  p_tenant_id TEXT,
  p_since TIMESTAMPTZ,
  p_limit INT DEFAULT 10
)
RETURNS TABLE (
  ip_address TEXT,
  total_requests BIGINT,
  failed_requests BIGINT,
  unique_users BIGINT,
  first_seen TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  suspicious BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.ip_address,
    COUNT(*) AS total_requests,
    COUNT(*) FILTER (WHERE al.success = FALSE) AS failed_requests,
    COUNT(DISTINCT al.user_id) AS unique_users,
    MIN(al.created_at) AS first_seen,
    MAX(al.created_at) AS last_seen,
    -- Mark as suspicious if >50% failure rate or >100 requests/hour
    (
      (COUNT(*) FILTER (WHERE al.success = FALSE)::NUMERIC / COUNT(*)::NUMERIC) > 0.5
      OR COUNT(*) > 100
    ) AS suspicious
  FROM audit_logs al
  WHERE al.tenant_id = p_tenant_id
    AND al.created_at >= p_since
    AND al.ip_address IS NOT NULL
  GROUP BY al.ip_address
  ORDER BY suspicious DESC, failed_requests DESC, total_requests DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_top_failed_users TO authenticated;
GRANT EXECUTE ON FUNCTION get_security_events_timeline TO authenticated;
GRANT EXECUTE ON FUNCTION get_event_type_distribution TO authenticated;
GRANT EXECUTE ON FUNCTION get_ip_activity TO authenticated;

-- Comments
COMMENT ON FUNCTION get_top_failed_users IS 'Get users with most failed attempts for security monitoring';
COMMENT ON FUNCTION get_security_events_timeline IS 'Get hourly aggregation of security events for timeline visualization';
COMMENT ON FUNCTION get_event_type_distribution IS 'Get distribution of event types for analytics';
COMMENT ON FUNCTION get_ip_activity IS 'Get IP address activity for security monitoring';
