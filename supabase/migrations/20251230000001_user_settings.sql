-- User Settings Table
-- Stores user preferences and configurations

CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Profile Settings
  full_name TEXT,
  phone TEXT,
  bio TEXT,

  -- Notification Preferences
  notify_new_leads BOOLEAN DEFAULT true,
  notify_client_messages BOOLEAN DEFAULT true,
  notify_invoices_due BOOLEAN DEFAULT true,
  notify_appointments BOOLEAN DEFAULT true,
  notify_newsletter BOOLEAN DEFAULT false,

  -- Notification Channels
  channel_email BOOLEAN DEFAULT true,
  channel_push BOOLEAN DEFAULT true,
  channel_sms BOOLEAN DEFAULT false,

  -- Appearance Settings
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'auto')),
  accent_color TEXT DEFAULT 'blue' CHECK (accent_color IN ('blue', 'purple', 'green', 'orange', 'red', 'pink')),
  compact_mode BOOLEAN DEFAULT false,
  animations_enabled BOOLEAN DEFAULT true,
  sidebar_collapsed BOOLEAN DEFAULT false,

  -- Integration Settings (stored as JSON for flexibility)
  integrations JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Unique constraint: one settings record per user
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- RLS Policies
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users can only read their own settings
CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own settings
CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own settings
CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own settings
CREATE POLICY "Users can delete own settings"
  ON user_settings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_settings_timestamp
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_user_settings_updated_at();

-- Seed default settings for existing users (optional)
-- This will create default settings for users who don't have them yet
INSERT INTO user_settings (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

COMMENT ON TABLE user_settings IS 'User preferences and configuration settings';
COMMENT ON COLUMN user_settings.integrations IS 'JSON object storing integration-specific settings (e.g., WhatsApp API keys, email configs)';
