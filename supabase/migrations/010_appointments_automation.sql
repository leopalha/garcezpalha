-- Appointments Automation Enhancement
-- Migration: 010_appointments_automation
-- Date: 2025-11-20
--
-- This migration adds automation flags for appointment reminders and follow-ups

-- Step 1: Add automation tracking columns to appointments table
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS reminder_24h_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_2h_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS followup_3d_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nps_7d_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS upsell_30d_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT;

-- Step 2: Add comments
COMMENT ON COLUMN appointments.reminder_24h_sent IS
'Email reminder sent 24 hours before appointment';

COMMENT ON COLUMN appointments.reminder_2h_sent IS
'WhatsApp reminder sent 2 hours before appointment';

COMMENT ON COLUMN appointments.followup_3d_sent IS
'Follow-up email sent 3 days after completed appointment';

COMMENT ON COLUMN appointments.nps_7d_sent IS
'NPS survey sent 7 days after completed appointment';

COMMENT ON COLUMN appointments.upsell_30d_sent IS
'Upsell offer sent 30 days after completed appointment';

COMMENT ON COLUMN appointments.google_calendar_event_id IS
'Google Calendar event ID for automatic sync';

-- Step 3: Create index for automated queries
CREATE INDEX IF NOT EXISTS idx_appointments_automation
ON appointments(status, scheduled_at)
WHERE status IN ('scheduled', 'confirmed', 'completed');

-- Migration complete
