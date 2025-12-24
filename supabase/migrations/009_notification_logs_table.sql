-- Notification Logs Table
-- Migration: 009_notification_logs_table
-- Date: 2025-11-20
--
-- This migration creates the notification_logs table for audit trail
-- Tracks all notifications sent to clients (email, WhatsApp, SMS)

-- Step 1: Create notification_logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Notification details
  notification_type TEXT NOT NULL, -- 'process_update', 'deadline_reminder', 'welcome', etc.
  process_number TEXT, -- Optional: link to process if applicable

  -- Recipient info
  recipient_email TEXT NOT NULL,
  recipient_phone TEXT,

  -- Delivery channels
  channels_used JSONB DEFAULT '{}', -- {"email": true, "whatsapp": false}

  -- Status tracking
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending', 'delivered')),
  error_message TEXT, -- If failed, store error

  -- Timestamps
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'
);

-- Step 2: Create indexes
CREATE INDEX idx_notification_logs_type ON notification_logs(notification_type);
CREATE INDEX idx_notification_logs_process ON notification_logs(process_number);
CREATE INDEX idx_notification_logs_email ON notification_logs(recipient_email);
CREATE INDEX idx_notification_logs_sent ON notification_logs(sent_at DESC);

-- Step 3: Add comments
COMMENT ON TABLE notification_logs IS
'Audit trail for all notifications sent to clients. Tracks email, WhatsApp, and SMS delivery.';

COMMENT ON COLUMN notification_logs.channels_used IS
'JSON object tracking which channels were used: {"email": true, "whatsapp": false, "sms": false}';

-- Step 4: Row Level Security (RLS)
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Admins can see all notification logs
CREATE POLICY notification_logs_admin_all ON notification_logs
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Clients can only see their own notification logs
CREATE POLICY notification_logs_client_own ON notification_logs
  FOR SELECT
  TO authenticated
  USING (
    recipient_email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- Migration complete
