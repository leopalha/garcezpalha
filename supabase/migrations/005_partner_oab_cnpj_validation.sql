-- OAB Compliance Migration: Partner OAB/CNPJ Validation
-- Migration: 005_partner_oab_cnpj_validation
-- Date: 2025-11-19
--
-- COMPLIANCE: OAB Resolution 02/2015, Art. 34
-- Prohibition of intermediary commissions to non-lawyers (captação de clientela)
-- Required: Validate OAB registration for lawyer partners OR valid CNPJ for company partners
--
-- This migration:
-- 1. Adds oab_number field for lawyer partners
-- 2. Validates OAB format (OAB/UF XXXXXX)
-- 3. Adds oab_verified flag
-- 4. Prevents commission payments to unverified partners
-- 5. Creates audit trail for validations

-- Step 1: Add OAB validation fields to partners table
ALTER TABLE partners
ADD COLUMN IF NOT EXISTS partner_type TEXT DEFAULT 'company' CHECK (partner_type IN ('lawyer', 'company')),
ADD COLUMN IF NOT EXISTS oab_number TEXT, -- Format: OAB/UF 123456
ADD COLUMN IF NOT EXISTS oab_state TEXT, -- UF (RJ, SP, MG, etc.)
ADD COLUMN IF NOT EXISTS oab_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS oab_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS oab_verified_by UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS cnpj_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS cnpj_verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Step 2: Add comments for clarity
COMMENT ON COLUMN partners.partner_type IS
'Tipo de parceiro: lawyer (advogado com OAB) ou company (empresa com CNPJ válido)';

COMMENT ON COLUMN partners.oab_number IS
'Número OAB completo no formato: OAB/UF 123456. Obrigatório para partner_type=lawyer';

COMMENT ON COLUMN partners.oab_verified IS
'Indica se o número OAB foi verificado manualmente pelo admin. Comissões só pagas se verified=true';

COMMENT ON COLUMN partners.cnpj IS
'CNPJ da empresa. Obrigatório para partner_type=company. Deve ser validado antes de pagar comissões';

-- Step 3: Create validation function for OAB format
CREATE OR REPLACE FUNCTION validate_oab_format(oab_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Format: OAB/UF 123456 or OAB/UF123456
  -- Examples: OAB/RJ 219390, OAB/SP 123456
  RETURN oab_text ~* '^OAB/[A-Z]{2}\s?\d{4,6}$';
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create validation function for CNPJ format
CREATE OR REPLACE FUNCTION validate_cnpj_format(cnpj_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Remove non-digits
  cnpj_text := regexp_replace(cnpj_text, '[^0-9]', '', 'g');

  -- Must be exactly 14 digits
  RETURN LENGTH(cnpj_text) = 14;
END;
$$ LANGUAGE plpgsql;

-- Step 5: Create trigger to enforce validation before insert/update
CREATE OR REPLACE FUNCTION enforce_partner_validation()
RETURNS TRIGGER AS $$
BEGIN
  -- If lawyer, require valid OAB number
  IF NEW.partner_type = 'lawyer' THEN
    IF NEW.oab_number IS NULL OR NEW.oab_number = '' THEN
      RAISE EXCEPTION 'OAB number is required for lawyer partners (OAB Art. 34 compliance)';
    END IF;

    IF NOT validate_oab_format(NEW.oab_number) THEN
      RAISE EXCEPTION 'Invalid OAB format. Expected: OAB/UF 123456 (e.g., OAB/RJ 219390)';
    END IF;

    -- Extract state from OAB number
    NEW.oab_state := substring(NEW.oab_number from 'OAB/([A-Z]{2})');
  END IF;

  -- If company, require valid CNPJ
  IF NEW.partner_type = 'company' THEN
    IF NEW.cnpj IS NULL OR NEW.cnpj = '' THEN
      RAISE EXCEPTION 'CNPJ is required for company partners (OAB Art. 34 compliance)';
    END IF;

    IF NOT validate_cnpj_format(NEW.cnpj) THEN
      RAISE EXCEPTION 'Invalid CNPJ format. Expected: 14 digits (XX.XXX.XXX/XXXX-XX)';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger
DROP TRIGGER IF EXISTS trigger_enforce_partner_validation ON partners;
CREATE TRIGGER trigger_enforce_partner_validation
  BEFORE INSERT OR UPDATE ON partners
  FOR EACH ROW
  EXECUTE FUNCTION enforce_partner_validation();

-- Step 7: Prevent commission payments to unverified partners
CREATE OR REPLACE FUNCTION prevent_unverified_commission_payment()
RETURNS TRIGGER AS $$
DECLARE
  partner_record partners;
BEGIN
  -- Only check when status changes to 'paid'
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    -- Get partner record
    SELECT * INTO partner_record
    FROM partners
    WHERE id = NEW.partner_id;

    -- Check verification based on partner type
    IF partner_record.partner_type = 'lawyer' THEN
      IF NOT partner_record.oab_verified THEN
        RAISE EXCEPTION 'Cannot pay commission to unverified lawyer partner. OAB verification required (Art. 34)';
      END IF;
    ELSIF partner_record.partner_type = 'company' THEN
      IF NOT partner_record.cnpj_verified THEN
        RAISE EXCEPTION 'Cannot pay commission to unverified company partner. CNPJ verification required (Art. 34)';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create trigger on commissions table
DROP TRIGGER IF EXISTS trigger_prevent_unverified_commission ON commissions;
CREATE TRIGGER trigger_prevent_unverified_commission
  BEFORE INSERT OR UPDATE ON commissions
  FOR EACH ROW
  EXECUTE FUNCTION prevent_unverified_commission_payment();

-- Step 9: Create index for faster OAB lookups
CREATE INDEX IF NOT EXISTS idx_partners_oab ON partners(oab_number) WHERE oab_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_partners_cnpj ON partners(cnpj) WHERE cnpj IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_partners_verified ON partners(oab_verified, cnpj_verified);

-- Step 10: Insert compliance note
INSERT INTO oab_compliance_notes (table_name, record_id, compliance_type, note)
VALUES
  ('partners', gen_random_uuid(), 'partner_validation', 'Added OAB/CNPJ validation system to prevent illegal intermediary commissions (Art. 34)');

-- Migration complete
-- All partner commissions are now OAB compliant (Art. 34)
