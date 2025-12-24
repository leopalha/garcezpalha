-- OAB Compliance Migration: Rename base_price to reference_value
-- Migration: 004_oab_compliance_pricing
-- Date: 2025-11-19
--
-- COMPLIANCE: OAB Resolution 02/2015, Art. 38
-- Prohibited: Fixed price tables for legal services
-- Required: "Valor de referência" (reference value) subject to case analysis
--
-- This migration:
-- 1. Renames base_price → reference_value
-- 2. Adds OAB compliance comment
-- 3. Updates all existing data
-- 4. Adds disclaimer field for pricing

-- Step 1: Rename column in services table
ALTER TABLE services
RENAME COLUMN base_price TO reference_value;

-- Step 2: Add comment explaining OAB compliance
COMMENT ON COLUMN services.reference_value IS
'Valor de referência (não é preço fixo). Conforme OAB Art. 38, valores devem ser personalizados após análise do caso. Este é apenas um valor estimado para referência.';

-- Step 3: Update price_type values for OAB compliance
-- Change 'fixed' to 'reference' to avoid confusion
UPDATE services
SET price_type = 'reference'
WHERE price_type = 'fixed';

-- Step 4: Update CHECK constraint
ALTER TABLE services
DROP CONSTRAINT IF EXISTS services_price_type_check;

ALTER TABLE services
ADD CONSTRAINT services_price_type_check
CHECK (price_type IN ('reference', 'hourly', 'consultation', 'variable'));

-- Step 5: Add pricing disclaimer field
ALTER TABLE services
ADD COLUMN IF NOT EXISTS pricing_disclaimer TEXT DEFAULT
'Orçamento personalizado após análise do caso. Valor de referência sujeito a alteração conforme complexidade.';

-- Step 6: Create function to ensure disclaimer is always present
CREATE OR REPLACE FUNCTION ensure_pricing_disclaimer()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pricing_disclaimer IS NULL OR NEW.pricing_disclaimer = '' THEN
    NEW.pricing_disclaimer := 'Orçamento personalizado após análise do caso. Valor de referência sujeito a alteração conforme complexidade.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 7: Create trigger to auto-add disclaimer
DROP TRIGGER IF EXISTS trigger_ensure_pricing_disclaimer ON services;
CREATE TRIGGER trigger_ensure_pricing_disclaimer
  BEFORE INSERT OR UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION ensure_pricing_disclaimer();

-- Step 8: Add OAB compliance notes table for audit trail
CREATE TABLE IF NOT EXISTS oab_compliance_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  compliance_type TEXT NOT NULL CHECK (compliance_type IN ('pricing', 'disclaimer', 'partner_validation', 'ai_interaction')),
  note TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_oab_compliance_table ON oab_compliance_notes(table_name, record_id);
CREATE INDEX idx_oab_compliance_type ON oab_compliance_notes(compliance_type);

COMMENT ON TABLE oab_compliance_notes IS
'Audit trail for OAB compliance actions (pricing changes, disclaimers sent, partner validations, etc.)';

-- Step 9: Insert compliance note for this migration
INSERT INTO oab_compliance_notes (table_name, record_id, compliance_type, note)
SELECT 'services', id, 'pricing', 'Migrated from base_price to reference_value for OAB compliance (Art. 38)'
FROM services;

-- Migration complete
-- All pricing references are now OAB compliant
