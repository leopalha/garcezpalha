-- Migration: Add onboarding fields to profiles table
-- Description: Adds fields to track client onboarding progress
-- Date: 2026-01-01

-- Add onboarding columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_data JSONB DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- Add address fields if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cep TEXT;

-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  platform_tour_completed BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Create messages table if it doesn't exist (for activation checklist tracking)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_case ON messages(case_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Create appointments table if it doesn't exist (referenced in onboarding)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lawyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration INTEGER DEFAULT 30, -- minutes
  type TEXT DEFAULT 'video_call', -- video_call, phone, in_person
  status TEXT DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  meeting_link TEXT,
  location TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for appointments
CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_lawyer ON appointments(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Add RLS policies for appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Clients can view their own appointments
DROP POLICY IF EXISTS appointments_client_select ON appointments;
CREATE POLICY appointments_client_select ON appointments
  FOR SELECT
  USING (auth.uid() = client_id);

-- Lawyers can view their assigned appointments
DROP POLICY IF EXISTS appointments_lawyer_select ON appointments;
CREATE POLICY appointments_lawyer_select ON appointments
  FOR SELECT
  USING (auth.uid() = lawyer_id);

-- Clients can insert their own appointments
DROP POLICY IF EXISTS appointments_client_insert ON appointments;
CREATE POLICY appointments_client_insert ON appointments
  FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Lawyers can update their appointments
DROP POLICY IF EXISTS appointments_lawyer_update ON appointments;
CREATE POLICY appointments_lawyer_update ON appointments
  FOR UPDATE
  USING (auth.uid() = lawyer_id);

-- Add RLS policies for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages they sent or received
DROP POLICY IF EXISTS messages_user_select ON messages;
CREATE POLICY messages_user_select ON messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can send messages
DROP POLICY IF EXISTS messages_user_insert ON messages;
CREATE POLICY messages_user_insert ON messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they received (mark as read)
DROP POLICY IF EXISTS messages_user_update ON messages;
CREATE POLICY messages_user_update ON messages
  FOR UPDATE
  USING (auth.uid() = recipient_id);

-- Add RLS policies for user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
DROP POLICY IF EXISTS user_preferences_select ON user_preferences;
CREATE POLICY user_preferences_select ON user_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own preferences
DROP POLICY IF EXISTS user_preferences_update ON user_preferences;
CREATE POLICY user_preferences_update ON user_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
DROP POLICY IF EXISTS user_preferences_insert ON user_preferences;
CREATE POLICY user_preferences_insert ON user_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to auto-create user preferences on profile creation
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create preferences
DROP TRIGGER IF EXISTS trigger_create_user_preferences ON profiles;
CREATE TRIGGER trigger_create_user_preferences
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_preferences();

-- Add comments
COMMENT ON COLUMN profiles.onboarding_completed IS 'Whether the client has completed the onboarding flow';
COMMENT ON COLUMN profiles.onboarding_step IS 'Current step in the onboarding process (1-6)';
COMMENT ON COLUMN profiles.onboarding_data IS 'JSON data from onboarding form';
COMMENT ON COLUMN profiles.onboarding_completed_at IS 'Timestamp when onboarding was completed';

COMMENT ON TABLE appointments IS 'Scheduled appointments between clients and lawyers';
COMMENT ON TABLE messages IS 'Messages between clients and lawyers';
COMMENT ON TABLE user_preferences IS 'User preferences for notifications and features';
