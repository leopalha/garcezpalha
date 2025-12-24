-- Contracts Table for Digital Signature Workflow
-- Migration: 006_contracts_table
-- Date: 2025-11-19
--
-- This migration creates the contracts table for ClickSign digital signature workflow
-- Tracks contract lifecycle: created → sent → signed → payment
--
-- Workflow:
-- 1. Admin creates contract from lead
-- 2. Contract sent to ClickSign
-- 3. Client receives email with signing link
-- 4. Client signs digitally
-- 5. Webhook triggers: download PDF, store in Supabase, send payment link
-- 6. Client pays
-- 7. Contract complete, lead converted to client

-- Step 1: Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id),
  service_type TEXT NOT NULL,
  template_key TEXT, -- ClickSign template key used
  clicksign_document_key TEXT UNIQUE, -- ClickSign document ID

  -- Contract details (OAB compliant)
  reference_value DECIMAL(10,2) NOT NULL, -- Not fixed price, reference only
  pricing_disclaimer TEXT DEFAULT 'Orçamento personalizado após análise do caso. Valor de referência sujeito a alteração conforme complexidade.',

  -- Signers
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_cpf TEXT NOT NULL,
  client_phone TEXT,

  lawyer_name TEXT DEFAULT 'Leonardo Mendonça Palha da Silva',
  lawyer_oab TEXT DEFAULT 'OAB/RJ 219.390',

  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'running', 'signed', 'closed', 'cancelled', 'expired')),

  -- URLs
  signing_url TEXT, -- ClickSign signing URL
  signed_document_url TEXT, -- Supabase Storage URL after signing

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ, -- When sent to client for signing
  signed_at TIMESTAMPTZ, -- When client signed
  closed_at TIMESTAMPTZ, -- When signing process completed
  cancelled_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Signing deadline

  -- Payment tracking
  payment_link TEXT, -- Stripe/MercadoPago payment link
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  paid_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  notes TEXT,

  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes for faster queries
CREATE INDEX idx_contracts_lead ON contracts(lead_id);
CREATE INDEX idx_contracts_client ON contracts(client_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_clicksign ON contracts(clicksign_document_key);
CREATE INDEX idx_contracts_created ON contracts(created_at DESC);

-- Step 3: Add comments
COMMENT ON TABLE contracts IS
'Digital signature contracts created via ClickSign. Tracks complete workflow from creation to payment.';

COMMENT ON COLUMN contracts.reference_value IS
'Valor de referência (OAB compliant). NOT a fixed price. Subject to case analysis.';

COMMENT ON COLUMN contracts.clicksign_document_key IS
'ClickSign document ID. Used to match webhook notifications.';

-- Step 4: Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger
DROP TRIGGER IF EXISTS trigger_update_contracts_updated_at ON contracts;
CREATE TRIGGER trigger_update_contracts_updated_at
  BEFORE UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION update_contracts_updated_at();

-- Step 6: Create function to auto-convert lead when signed
CREATE OR REPLACE FUNCTION auto_convert_lead_on_signature()
RETURNS TRIGGER AS $$
BEGIN
  -- When contract is signed, update lead to 'converted'
  IF NEW.status = 'signed' AND (OLD.status IS NULL OR OLD.status != 'signed') THEN
    UPDATE leads
    SET
      status = 'converted',
      converted_at = NOW()
    WHERE id = NEW.lead_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger for auto-conversion
DROP TRIGGER IF EXISTS trigger_auto_convert_lead ON contracts;
CREATE TRIGGER trigger_auto_convert_lead
  AFTER UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION auto_convert_lead_on_signature();

-- Step 8: Row Level Security (RLS) policies
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

-- Admins can see all contracts
CREATE POLICY contracts_admin_all ON contracts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Clients can only see their own contracts
CREATE POLICY contracts_client_own ON contracts
  FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid()
    OR client_email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- Step 9: Insert compliance note
INSERT INTO oab_compliance_notes (table_name, record_id, compliance_type, note)
VALUES
  ('contracts', gen_random_uuid(), 'pricing', 'Created contracts table with reference_value (not fixed price) for OAB compliance');

-- Migration complete
-- Contracts table ready for ClickSign digital signature workflow
