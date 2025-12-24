-- Add client/lead link to process_alerts
-- Migration: 015_process_alerts_client_link
-- Date: 2024-12-22
-- Purpose: Enable sending notifications to the actual client of a process

-- Add lead_id to link process to client
ALTER TABLE process_alerts
ADD COLUMN IF NOT EXISTS lead_id UUID REFERENCES leads(id) ON DELETE SET NULL;

-- Add client_user_id for direct user link (when lead is converted to user)
ALTER TABLE process_alerts
ADD COLUMN IF NOT EXISTS client_user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_process_alerts_lead ON process_alerts(lead_id);
CREATE INDEX IF NOT EXISTS idx_process_alerts_client ON process_alerts(client_user_id);

-- Add description field for deadline details
ALTER TABLE process_alerts
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add deadline_date field
ALTER TABLE process_alerts
ADD COLUMN IF NOT EXISTS deadline_date TIMESTAMPTZ;

-- Create index for deadline queries
CREATE INDEX IF NOT EXISTS idx_process_alerts_deadline ON process_alerts(deadline_date);

COMMENT ON COLUMN process_alerts.lead_id IS 'Link to original lead for this process';
COMMENT ON COLUMN process_alerts.client_user_id IS 'Link to client user account (if converted)';
COMMENT ON COLUMN process_alerts.description IS 'Description of the deadline or alert';
COMMENT ON COLUMN process_alerts.deadline_date IS 'Due date for this process alert';
