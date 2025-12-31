-- Two-Factor Authentication Support
-- P1-001: MFA/2FA for Admin Users

-- Add 2FA fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_method TEXT CHECK (two_factor_method IN ('totp', 'sms', 'email'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_backup_codes TEXT[];
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_verified_at TIMESTAMPTZ;

-- Create table for temporary 2FA codes (SMS/Email)
CREATE TABLE IF NOT EXISTS two_factor_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for quick lookups
CREATE INDEX idx_two_factor_codes_user_id ON two_factor_codes(user_id);
CREATE INDEX idx_two_factor_codes_expires_at ON two_factor_codes(expires_at);

-- RLS Policies for two_factor_codes
ALTER TABLE two_factor_codes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own codes
CREATE POLICY "Users can view own 2FA codes"
  ON two_factor_codes FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert codes
CREATE POLICY "System can insert 2FA codes"
  ON two_factor_codes FOR INSERT
  WITH CHECK (true);

-- Users can mark codes as used
CREATE POLICY "Users can update own 2FA codes"
  ON two_factor_codes FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to clean up expired 2FA codes
CREATE OR REPLACE FUNCTION cleanup_expired_2fa_codes()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM two_factor_codes
  WHERE expires_at < NOW()
  RETURNING COUNT(*) INTO deleted_count;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enforce 2FA for admin users (trigger)
CREATE OR REPLACE FUNCTION enforce_admin_2fa()
RETURNS TRIGGER AS $$
BEGIN
  -- If user is being promoted to admin, require 2FA
  IF NEW.role = 'admin' AND (OLD.role IS NULL OR OLD.role != 'admin') THEN
    -- Log the change
    INSERT INTO audit_logs (event_type, user_id, metadata)
    VALUES (
      'admin.role_changed',
      NEW.id,
      jsonb_build_object(
        'old_role', OLD.role,
        'new_role', NEW.role,
        'requires_2fa', true
      )
    );

    -- Send notification (future: integrate with notification system)
    -- For now, just log
    RAISE NOTICE 'User % promoted to admin - 2FA required', NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for admin role changes
DROP TRIGGER IF EXISTS trigger_enforce_admin_2fa ON users;
CREATE TRIGGER trigger_enforce_admin_2fa
  AFTER UPDATE OF role ON users
  FOR EACH ROW
  WHEN (NEW.role = 'admin' AND (OLD.role IS NULL OR OLD.role != 'admin'))
  EXECUTE FUNCTION enforce_admin_2fa();

-- Function to check if 2FA is required for user
CREATE OR REPLACE FUNCTION is_2fa_required(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  user_2fa_enabled BOOLEAN;
BEGIN
  SELECT role, two_factor_enabled
  INTO user_role, user_2fa_enabled
  FROM users
  WHERE id = user_id;

  -- 2FA is required for all admin users
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- Otherwise, check if user has enabled it
  RETURN COALESCE(user_2fa_enabled, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION cleanup_expired_2fa_codes TO authenticated;
GRANT EXECUTE ON FUNCTION is_2fa_required TO authenticated;

-- Create indexes for users 2FA fields
CREATE INDEX idx_users_two_factor_enabled ON users(two_factor_enabled) WHERE two_factor_enabled = TRUE;
CREATE INDEX idx_users_two_factor_method ON users(two_factor_method) WHERE two_factor_method IS NOT NULL;

-- Comment documentation
COMMENT ON COLUMN users.two_factor_enabled IS 'Whether 2FA is enabled for this user';
COMMENT ON COLUMN users.two_factor_method IS 'Method of 2FA: totp (authenticator app), sms, or email';
COMMENT ON COLUMN users.two_factor_secret IS 'TOTP secret key (base32 encoded)';
COMMENT ON COLUMN users.two_factor_backup_codes IS 'Hashed backup recovery codes';
COMMENT ON COLUMN users.two_factor_phone IS 'Phone number for SMS 2FA';
COMMENT ON COLUMN users.two_factor_verified_at IS 'When 2FA was last verified';

COMMENT ON TABLE two_factor_codes IS 'Temporary codes for SMS/Email 2FA verification';
COMMENT ON FUNCTION is_2fa_required IS 'Check if 2FA is required for a given user (admins always require it)';
