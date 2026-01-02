-- ============================================================================
-- COMPLIANCE & LGPD SYSTEM
-- Sistema completo de conformidade com LGPD e audit trail
-- ============================================================================

-- Create user_consent table (consentimentos LGPD)
CREATE TABLE IF NOT EXISTS user_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Consent types
  consent_type VARCHAR(100) NOT NULL, -- 'terms_of_service', 'privacy_policy', 'marketing', 'data_sharing', 'cookies'

  -- Consent details
  consent_given BOOLEAN DEFAULT false,
  consent_text TEXT, -- Full text shown to user
  consent_version VARCHAR(20) NOT NULL, -- Track policy versions (e.g., 'v1.0', 'v2.1')

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  consent_date TIMESTAMPTZ DEFAULT NOW(),

  -- Revocation
  revoked BOOLEAN DEFAULT false,
  revoked_at TIMESTAMPTZ,
  revoked_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit_logs table (complete audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  user_role VARCHAR(50),

  -- What
  action VARCHAR(100) NOT NULL, -- 'create', 'read', 'update', 'delete', 'export', 'login', 'logout'
  resource_type VARCHAR(100) NOT NULL, -- 'case', 'document', 'invoice', 'user', 'settings'
  resource_id UUID,

  -- Details
  old_values JSONB, -- Previous state
  new_values JSONB, -- New state
  changes JSONB, -- Diff between old and new

  -- Context
  ip_address INET,
  user_agent TEXT,
  request_path TEXT,
  request_method VARCHAR(10),

  -- Metadata
  severity VARCHAR(50) DEFAULT 'info', -- 'debug', 'info', 'warning', 'error', 'critical'
  status VARCHAR(50) DEFAULT 'success', -- 'success', 'failure', 'partial'
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create data_retention_policies table
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Policy details
  data_type VARCHAR(100) NOT NULL, -- 'case', 'document', 'audit_log', 'consent', 'conversation'
  retention_days INT NOT NULL, -- How long to keep

  -- Actions
  action_after_retention VARCHAR(50) DEFAULT 'archive', -- 'archive', 'anonymize', 'delete'

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create data_export_requests table (LGPD data portability)
CREATE TABLE IF NOT EXISTS data_export_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Request details
  request_type VARCHAR(50) DEFAULT 'full', -- 'full', 'cases', 'documents', 'financial'
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'

  -- Export data
  export_format VARCHAR(20) DEFAULT 'json', -- 'json', 'csv', 'pdf'
  export_url TEXT, -- Signed URL for download
  export_size_bytes BIGINT,

  -- Metadata
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Export link expires after 7 days
  downloaded_at TIMESTAMPTZ,

  -- Audit
  ip_address INET,
  user_agent TEXT
);

-- Create data_deletion_requests table (LGPD right to be forgotten)
CREATE TABLE IF NOT EXISTS data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_email VARCHAR(255) NOT NULL,

  -- Request details
  deletion_scope VARCHAR(50) DEFAULT 'complete', -- 'complete', 'partial'
  reason TEXT,

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'completed'
  approval_required BOOLEAN DEFAULT true,
  approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,

  -- Execution
  executed_at TIMESTAMPTZ,
  items_deleted JSONB, -- List of deleted items
  items_anonymized JSONB, -- List of anonymized items

  -- Legal hold
  legal_hold BOOLEAN DEFAULT false, -- Prevent deletion if under legal obligation
  legal_hold_reason TEXT,

  -- Metadata
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create security_events table (security monitoring)
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event details
  event_type VARCHAR(100) NOT NULL, -- 'failed_login', 'suspicious_activity', 'data_breach', 'unauthorized_access'
  severity VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'

  -- Who/What
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  ip_address INET,
  user_agent TEXT,

  -- Details
  description TEXT NOT NULL,
  metadata JSONB,

  -- Response
  status VARCHAR(50) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'false_positive'
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create encryption_keys table (key management)
CREATE TABLE IF NOT EXISTS encryption_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Key details
  key_name VARCHAR(100) NOT NULL UNIQUE,
  key_type VARCHAR(50) NOT NULL, -- 'symmetric', 'asymmetric'
  algorithm VARCHAR(50) DEFAULT 'AES-256-GCM', -- 'AES-256-GCM', 'RSA-2048', etc

  -- Key data (encrypted at rest by database)
  key_hash TEXT NOT NULL, -- Hash for verification
  key_metadata JSONB,

  -- Rotation
  is_active BOOLEAN DEFAULT true,
  rotation_schedule_days INT DEFAULT 90,
  last_rotated_at TIMESTAMPTZ DEFAULT NOW(),
  next_rotation_at TIMESTAMPTZ,

  -- Usage
  purpose TEXT, -- 'document_encryption', 'data_at_rest', 'communication'

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create privacy_settings table (user privacy preferences)
CREATE TABLE IF NOT EXISTS privacy_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Communication preferences
  allow_marketing_emails BOOLEAN DEFAULT false,
  allow_product_updates BOOLEAN DEFAULT true,
  allow_notifications BOOLEAN DEFAULT true,

  -- Data sharing
  allow_analytics BOOLEAN DEFAULT true,
  allow_third_party_sharing BOOLEAN DEFAULT false,

  -- Profile visibility
  profile_visibility VARCHAR(50) DEFAULT 'private', -- 'public', 'private', 'contacts_only'

  -- Data retention preference
  prefer_data_deletion_days INT, -- User preference (may override policy)

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_consent_user ON user_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_type ON user_consent(consent_type);
CREATE INDEX IF NOT EXISTS idx_user_consent_version ON user_consent(consent_version);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);

CREATE INDEX IF NOT EXISTS idx_data_export_user ON data_export_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_data_export_status ON data_export_requests(status);

CREATE INDEX IF NOT EXISTS idx_data_deletion_user ON data_deletion_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_data_deletion_status ON data_deletion_requests(status);

CREATE INDEX IF NOT EXISTS idx_security_events_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS idx_security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_status ON security_events(status);
CREATE INDEX IF NOT EXISTS idx_security_events_created ON security_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_encryption_keys_active ON encryption_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_encryption_keys_rotation ON encryption_keys(next_rotation_at);

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR,
  p_resource_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
  v_changes JSONB;
BEGIN
  -- Calculate changes
  IF p_old_values IS NOT NULL AND p_new_values IS NOT NULL THEN
    v_changes := jsonb_diff(p_old_values, p_new_values);
  END IF;

  INSERT INTO audit_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    changes,
    ip_address,
    user_agent,
    severity,
    status
  )
  VALUES (
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    v_changes,
    p_ip_address,
    p_user_agent,
    'info',
    'success'
  )
  RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql;

-- Helper function to compare JSONB (simplified diff)
CREATE OR REPLACE FUNCTION jsonb_diff(old_data JSONB, new_data JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{}'::JSONB;
  key TEXT;
BEGIN
  -- Find changed/removed keys
  FOR key IN SELECT jsonb_object_keys(old_data)
  LOOP
    IF NOT new_data ? key THEN
      result := result || jsonb_build_object(key, jsonb_build_object('old', old_data->key, 'new', null));
    ELSIF old_data->key != new_data->key THEN
      result := result || jsonb_build_object(key, jsonb_build_object('old', old_data->key, 'new', new_data->key));
    END IF;
  END LOOP;

  -- Find new keys
  FOR key IN SELECT jsonb_object_keys(new_data)
  LOOP
    IF NOT old_data ? key THEN
      result := result || jsonb_build_object(key, jsonb_build_object('old', null, 'new', new_data->key));
    END IF;
  END LOOP;

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to check data retention and cleanup
CREATE OR REPLACE FUNCTION cleanup_expired_data()
RETURNS INT AS $$
DECLARE
  v_count INT := 0;
  v_policy RECORD;
BEGIN
  FOR v_policy IN
    SELECT * FROM data_retention_policies WHERE is_active = true
  LOOP
    -- Cleanup based on policy
    IF v_policy.data_type = 'audit_log' AND v_policy.action_after_retention = 'delete' THEN
      DELETE FROM audit_logs
      WHERE created_at < (NOW() - (v_policy.retention_days || ' days')::INTERVAL)
        AND severity NOT IN ('error', 'critical');
      GET DIAGNOSTICS v_count = ROW_COUNT;
    END IF;

    -- Update last run
    UPDATE data_retention_policies
    SET last_run_at = NOW(),
        next_run_at = NOW() + INTERVAL '1 day'
    WHERE id = v_policy.id;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to anonymize user data (LGPD compliance)
CREATE OR REPLACE FUNCTION anonymize_user_data(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB := '{}'::JSONB;
BEGIN
  -- Anonymize profile
  UPDATE profiles
  SET
    full_name = 'Usuário Anonimizado',
    email = 'anonymized_' || p_user_id || '@deleted.local',
    phone = NULL,
    cpf_cnpj = NULL,
    address = NULL,
    city = NULL,
    state = NULL,
    zip_code = NULL
  WHERE id = p_user_id;

  v_result := v_result || jsonb_build_object('profile', 'anonymized');

  -- Anonymize cases (keep for legal/accounting but remove PII)
  UPDATE cases
  SET
    notes = 'Dados removidos por solicitação LGPD',
    client_notes = NULL
  WHERE client_id = p_user_id;

  v_result := v_result || jsonb_build_object('cases', 'anonymized');

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_compliance_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_user_consent_updated ON user_consent;
CREATE TRIGGER trigger_user_consent_updated
  BEFORE UPDATE ON user_consent
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_updated_at();

DROP TRIGGER IF EXISTS trigger_data_retention_updated ON data_retention_policies;
CREATE TRIGGER trigger_data_retention_updated
  BEFORE UPDATE ON data_retention_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_updated_at();

DROP TRIGGER IF EXISTS trigger_encryption_keys_updated ON encryption_keys;
CREATE TRIGGER trigger_encryption_keys_updated
  BEFORE UPDATE ON encryption_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_updated_at();

DROP TRIGGER IF EXISTS trigger_privacy_settings_updated ON privacy_settings;
CREATE TRIGGER trigger_privacy_settings_updated
  BEFORE UPDATE ON privacy_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_compliance_updated_at();

-- RLS Policies
ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_settings ENABLE ROW LEVEL SECURITY;

-- Users can see their own consent
DROP POLICY IF EXISTS user_consent_own ON user_consent;
CREATE POLICY user_consent_own ON user_consent
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own consent
DROP POLICY IF EXISTS user_consent_update_own ON user_consent;
CREATE POLICY user_consent_update_own ON user_consent
  FOR UPDATE
  USING (user_id = auth.uid());

-- Only admins can see all audit logs
DROP POLICY IF EXISTS audit_logs_admin ON audit_logs;
CREATE POLICY audit_logs_admin ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can see their own audit logs
DROP POLICY IF EXISTS audit_logs_own ON audit_logs;
CREATE POLICY audit_logs_own ON audit_logs
  FOR SELECT
  USING (user_id = auth.uid());

-- Only admins can manage retention policies
DROP POLICY IF EXISTS data_retention_admin ON data_retention_policies;
CREATE POLICY data_retention_admin ON data_retention_policies
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can manage their own export requests
DROP POLICY IF EXISTS data_export_own ON data_export_requests;
CREATE POLICY data_export_own ON data_export_requests
  FOR ALL
  USING (user_id = auth.uid());

-- Users can manage their own deletion requests
DROP POLICY IF EXISTS data_deletion_own ON data_deletion_requests;
CREATE POLICY data_deletion_own ON data_deletion_requests
  FOR SELECT
  USING (user_id = auth.uid());

-- Only admins can see all security events
DROP POLICY IF EXISTS security_events_admin ON security_events;
CREATE POLICY security_events_admin ON security_events
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can manage encryption keys
DROP POLICY IF EXISTS encryption_keys_admin ON encryption_keys;
CREATE POLICY encryption_keys_admin ON encryption_keys
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Users can manage their own privacy settings
DROP POLICY IF EXISTS privacy_settings_own ON privacy_settings;
CREATE POLICY privacy_settings_own ON privacy_settings
  FOR ALL
  USING (user_id = auth.uid());

-- Insert default retention policies
INSERT INTO data_retention_policies (data_type, retention_days, action_after_retention, is_active)
VALUES
  ('audit_log', 365, 'delete', true),
  ('consent', 1825, 'archive', true), -- 5 years
  ('case', 1825, 'archive', true), -- 5 years (legal requirement)
  ('document', 1825, 'archive', true),
  ('conversation', 365, 'delete', true)
ON CONFLICT DO NOTHING;

-- Insert default encryption key metadata (actual keys stored securely elsewhere)
INSERT INTO encryption_keys (key_name, key_type, algorithm, key_hash, purpose, is_active)
VALUES
  ('document_encryption_key', 'symmetric', 'AES-256-GCM', 'placeholder_hash', 'document_encryption', true),
  ('database_encryption_key', 'symmetric', 'AES-256-GCM', 'placeholder_hash', 'data_at_rest', true)
ON CONFLICT (key_name) DO NOTHING;

-- Comments
COMMENT ON TABLE user_consent IS 'Consentimentos LGPD (termos, privacidade, marketing)';
COMMENT ON TABLE audit_logs IS 'Audit trail completo de todas ações na plataforma';
COMMENT ON TABLE data_retention_policies IS 'Políticas de retenção de dados (LGPD compliance)';
COMMENT ON TABLE data_export_requests IS 'Solicitações de exportação de dados (portabilidade LGPD)';
COMMENT ON TABLE data_deletion_requests IS 'Solicitações de exclusão de dados (direito ao esquecimento LGPD)';
COMMENT ON TABLE security_events IS 'Eventos de segurança para monitoramento';
COMMENT ON TABLE encryption_keys IS 'Gerenciamento de chaves de encriptação';
COMMENT ON TABLE privacy_settings IS 'Preferências de privacidade do usuário';

COMMENT ON COLUMN user_consent.consent_version IS 'Versão da política (permite rastrear mudanças nos termos)';
COMMENT ON COLUMN audit_logs.changes IS 'Diff JSON entre old_values e new_values';
COMMENT ON COLUMN data_deletion_requests.legal_hold IS 'Impede exclusão se houver obrigação legal de manter dados';
