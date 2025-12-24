-- Add password reset token fields to users table
-- Migration: 012_password_reset_tokens
-- Date: 2024-11-21

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS reset_token TEXT,
ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ;

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

-- Add comment
COMMENT ON COLUMN users.reset_token IS 'SHA256 hash of password reset token';
COMMENT ON COLUMN users.reset_token_expiry IS 'Expiry timestamp for reset token';
