-- White-Label Configuration Migration
-- Date: 2026-01-01
-- Feature: UX-005 - Save White-Label Configuration
-- Description: Allows users to customize their brand identity (logo, colors, firm info, etc)

-- ==========================================
-- WHITE LABEL CONFIG TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS white_label_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Visual Identity
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(7) DEFAULT '#0066CC',
  secondary_color VARCHAR(7) DEFAULT '#003366',
  accent_color VARCHAR(7) DEFAULT '#FFB84D',
  font_family VARCHAR(100) DEFAULT 'Inter',

  -- Firm Information
  firm_name VARCHAR(255),
  oab_number VARCHAR(50),
  cnpj VARCHAR(18),
  tagline VARCHAR(255),
  description TEXT,

  -- Contact Information
  email VARCHAR(255),
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(2),
  zip_code VARCHAR(10),

  -- Social Media
  facebook_url TEXT,
  instagram_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,

  -- Custom Domain
  custom_domain VARCHAR(255),
  domain_configured BOOLEAN DEFAULT FALSE,
  domain_verified_at TIMESTAMPTZ,

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_user_config UNIQUE(user_id)
);

-- Indexes
CREATE INDEX idx_white_label_user ON white_label_config(user_id);
CREATE INDEX idx_white_label_active ON white_label_config(is_active);
CREATE INDEX idx_white_label_domain ON white_label_config(custom_domain) WHERE custom_domain IS NOT NULL;

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE white_label_config ENABLE ROW LEVEL SECURITY;

-- Users can only view/edit their own configuration
CREATE POLICY "Users can view own white-label config"
  ON white_label_config
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own white-label config"
  ON white_label_config
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own white-label config"
  ON white_label_config
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own white-label config"
  ON white_label_config
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can view all configurations
CREATE POLICY "Admins can view all white-label configs"
  ON white_label_config
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Function to get or create default white-label config for a user
CREATE OR REPLACE FUNCTION get_or_create_white_label_config(p_user_id UUID)
RETURNS white_label_config AS $$
DECLARE
  v_config white_label_config;
  v_profile RECORD;
BEGIN
  -- Try to get existing config
  SELECT * INTO v_config
  FROM white_label_config
  WHERE user_id = p_user_id;

  -- If not found, create default config with profile data
  IF v_config IS NULL THEN
    -- Get user profile data
    SELECT name, email, phone INTO v_profile
    FROM profiles
    WHERE id = p_user_id;

    -- Create default config
    INSERT INTO white_label_config (
      user_id,
      firm_name,
      email,
      phone
    ) VALUES (
      p_user_id,
      COALESCE(v_profile.name, 'Seu Escritório'),
      v_profile.email,
      v_profile.phone
    )
    RETURNING * INTO v_config;
  END IF;

  RETURN v_config;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate custom domain DNS configuration
CREATE OR REPLACE FUNCTION verify_custom_domain(
  p_config_id UUID,
  p_domain VARCHAR(255)
)
RETURNS BOOLEAN AS $$
DECLARE
  v_verified BOOLEAN := FALSE;
BEGIN
  -- This is a placeholder function
  -- In production, this would make an actual DNS lookup
  -- For now, we just mark it as needing manual verification

  UPDATE white_label_config
  SET
    custom_domain = p_domain,
    domain_configured = FALSE,
    updated_at = NOW()
  WHERE id = p_config_id;

  RETURN v_verified;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_white_label_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_white_label_config_timestamp
  BEFORE UPDATE ON white_label_config
  FOR EACH ROW
  EXECUTE FUNCTION update_white_label_config_timestamp();

-- ==========================================
-- COMMENTS
-- ==========================================
COMMENT ON TABLE white_label_config IS 'Stores white-label branding configuration for users/firms';
COMMENT ON COLUMN white_label_config.user_id IS 'Reference to the user/firm that owns this configuration';
COMMENT ON COLUMN white_label_config.primary_color IS 'Main brand color in hex format (#RRGGBB)';
COMMENT ON COLUMN white_label_config.custom_domain IS 'Custom domain for white-label site (e.g., escritorio.com.br)';
COMMENT ON COLUMN white_label_config.domain_configured IS 'Whether DNS is properly configured for custom domain';
