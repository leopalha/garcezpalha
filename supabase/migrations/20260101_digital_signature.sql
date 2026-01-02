-- ============================================================================
-- DIGITAL SIGNATURE INTEGRATION SYSTEM
-- Sistema de integração com provedores de assinatura digital
-- ============================================================================

-- Create signature_documents table
CREATE TABLE IF NOT EXISTS signature_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Document info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL, -- Original document URL
  signed_file_url TEXT, -- Signed document URL

  -- Provider info
  provider VARCHAR(50) NOT NULL, -- 'clicksign', 'docusign', 'manual'
  provider_document_id VARCHAR(255), -- External ID from provider
  provider_envelope_id VARCHAR(255), -- For providers like DocuSign

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'signed', 'cancelled', 'expired'

  -- Associations
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Create signature_signers table (multiple signers per document)
CREATE TABLE IF NOT EXISTS signature_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES signature_documents(id) ON DELETE CASCADE NOT NULL,

  -- Signer info
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  cpf_cnpj VARCHAR(20),
  phone VARCHAR(20),

  -- Type and order
  signer_type VARCHAR(50) DEFAULT 'signer', -- 'signer', 'witness', 'approver'
  signing_order INT DEFAULT 1, -- Order of signing

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'viewed', 'signed', 'declined'
  signed_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,

  -- Provider specific
  provider_signer_id VARCHAR(255), -- External signer ID
  signature_token VARCHAR(255), -- Unique token for this signer

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create signature_webhooks table (for provider callbacks)
CREATE TABLE IF NOT EXISTS signature_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Provider info
  provider VARCHAR(50) NOT NULL,
  event_type VARCHAR(100) NOT NULL, -- 'document.signed', 'signer.signed', etc.

  -- Related entities
  document_id UUID REFERENCES signature_documents(id) ON DELETE SET NULL,
  signer_id UUID REFERENCES signature_signers(id) ON DELETE SET NULL,

  -- Payload
  raw_payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create digital_certificates table (for Brazilian ICP-Brasil certificates)
CREATE TABLE IF NOT EXISTS digital_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Certificate info
  certificate_name VARCHAR(255) NOT NULL,
  certificate_type VARCHAR(50) NOT NULL, -- 'A1', 'A3', 'e-CPF', 'e-CNPJ'
  subject_name VARCHAR(255) NOT NULL, -- CN from certificate
  issuer_name VARCHAR(255),

  -- Validity
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  serial_number VARCHAR(255),

  -- Certificate data (encrypted)
  certificate_data TEXT, -- Base64 encoded certificate (A1 only)
  is_cloud_certificate BOOLEAN DEFAULT false, -- For A3 (cloud HSM)

  -- Associations
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'expired', 'revoked'

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_signature_documents_status ON signature_documents(status);
CREATE INDEX IF NOT EXISTS idx_signature_documents_case ON signature_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_signature_documents_provider ON signature_documents(provider, provider_document_id);

CREATE INDEX IF NOT EXISTS idx_signature_signers_document ON signature_signers(document_id);
CREATE INDEX IF NOT EXISTS idx_signature_signers_status ON signature_signers(status);
CREATE INDEX IF NOT EXISTS idx_signature_signers_email ON signature_signers(email);

CREATE INDEX IF NOT EXISTS idx_signature_webhooks_provider ON signature_webhooks(provider, event_type);
CREATE INDEX IF NOT EXISTS idx_signature_webhooks_processed ON signature_webhooks(processed) WHERE processed = false;

CREATE INDEX IF NOT EXISTS idx_digital_certificates_user ON digital_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_digital_certificates_validity ON digital_certificates(valid_until) WHERE status = 'active';

-- Function to check certificate expiration
CREATE OR REPLACE FUNCTION check_certificate_expiration()
RETURNS void AS $$
BEGIN
  UPDATE digital_certificates
  SET status = 'expired'
  WHERE status = 'active'
    AND valid_until < NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to check document expiration
CREATE OR REPLACE FUNCTION check_document_expiration()
RETURNS void AS $$
BEGIN
  UPDATE signature_documents
  SET status = 'expired'
  WHERE status IN ('pending', 'sent')
    AND expires_at IS NOT NULL
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_signature_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_signature_documents_updated ON signature_documents;
CREATE TRIGGER trigger_signature_documents_updated
  BEFORE UPDATE ON signature_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_signature_updated_at();

DROP TRIGGER IF EXISTS trigger_signature_signers_updated ON signature_signers;
CREATE TRIGGER trigger_signature_signers_updated
  BEFORE UPDATE ON signature_signers
  FOR EACH ROW
  EXECUTE FUNCTION update_signature_updated_at();

DROP TRIGGER IF EXISTS trigger_digital_certificates_updated ON digital_certificates;
CREATE TRIGGER trigger_digital_certificates_updated
  BEFORE UPDATE ON digital_certificates
  FOR EACH ROW
  EXECUTE FUNCTION update_signature_updated_at();

-- RLS Policies
ALTER TABLE signature_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE signature_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_certificates ENABLE ROW LEVEL SECURITY;

-- Admins and lawyers can manage signature documents
DROP POLICY IF EXISTS signature_documents_admin_all ON signature_documents;
CREATE POLICY signature_documents_admin_all ON signature_documents
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Clients can view documents related to their cases
DROP POLICY IF EXISTS signature_documents_client_select ON signature_documents;
CREATE POLICY signature_documents_client_select ON signature_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN cases c ON c.id = signature_documents.case_id
      WHERE p.id = auth.uid()
      AND p.role = 'client'
      AND c.client_id = p.id
    )
  );

-- Signers policies (read-only for signers table)
DROP POLICY IF EXISTS signature_signers_admin_all ON signature_signers;
CREATE POLICY signature_signers_admin_all ON signature_signers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Webhooks (system only)
DROP POLICY IF EXISTS signature_webhooks_admin_all ON signature_webhooks;
CREATE POLICY signature_webhooks_admin_all ON signature_webhooks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Digital certificates (users own their certificates)
DROP POLICY IF EXISTS digital_certificates_owner ON digital_certificates;
CREATE POLICY digital_certificates_owner ON digital_certificates
  FOR ALL
  USING (user_id = auth.uid());

-- Comments
COMMENT ON TABLE signature_documents IS 'Documentos para assinatura digital (ClickSign, DocuSign, etc)';
COMMENT ON TABLE signature_signers IS 'Signatários de documentos (múltiplos por documento)';
COMMENT ON TABLE signature_webhooks IS 'Webhooks de provedores de assinatura (callbacks)';
COMMENT ON TABLE digital_certificates IS 'Certificados digitais ICP-Brasil (e-CPF, e-CNPJ, A1, A3)';

COMMENT ON COLUMN signature_documents.provider IS 'Provedor: clicksign, docusign, manual';
COMMENT ON COLUMN signature_signers.signer_type IS 'Tipo: signer (assina), witness (testemunha), approver (aprova)';
COMMENT ON COLUMN digital_certificates.certificate_type IS 'Tipo ICP-Brasil: A1 (software), A3 (token/smartcard), e-CPF, e-CNPJ';
