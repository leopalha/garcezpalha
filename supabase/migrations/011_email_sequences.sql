-- Email Sequences Migration
--
-- Tables for email automation and sequences
--
-- Features:
-- - Email logs (sent/failed tracking)
-- - Email sequences (multi-step campaigns)
-- - Resend webhook events

-- =====================================================
-- Email Logs Table
-- =====================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Email details
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT NOT NULL, -- welcome-1, appointment, payment, etc.

  -- Status
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,

  -- Resend tracking
  resend_id TEXT, -- Resend API email ID

  -- Metadata
  metadata JSONB, -- Additional data (leadId, appointmentId, etc.)

  -- Timestamps
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for email logs
CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_type ON email_logs(template_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_id ON email_logs(resend_id) WHERE resend_id IS NOT NULL;

-- RLS for email logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view all logs
CREATE POLICY "Admins can view email logs"
  ON email_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- =====================================================
-- Email Sequences Table
-- =====================================================

CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Lead reference
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

  -- Sequence details
  sequence_type TEXT NOT NULL CHECK (sequence_type IN ('welcome', 'appointment', 'consultation')),
  current_step INTEGER DEFAULT 0, -- Current step in sequence (0 = not started)
  total_steps INTEGER NOT NULL, -- Total steps in this sequence

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB, -- Lead name, email, service interest, etc.

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for email sequences
CREATE INDEX IF NOT EXISTS idx_email_sequences_lead_id ON email_sequences(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_sequence_type ON email_sequences(sequence_type);
CREATE INDEX IF NOT EXISTS idx_email_sequences_started_at ON email_sequences(started_at DESC);

-- Only one active sequence per lead per type
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_sequences_unique_active
  ON email_sequences(lead_id, sequence_type)
  WHERE status = 'active';

-- RLS for email sequences
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- Admins can manage all sequences
CREATE POLICY "Admins can manage email sequences"
  ON email_sequences
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- =====================================================
-- Email Events Table (Resend Webhooks)
-- =====================================================

CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Resend event details
  resend_id TEXT NOT NULL, -- References email_logs.resend_id
  event_type TEXT NOT NULL, -- delivered, opened, clicked, bounced, complained

  -- Event data
  email_to TEXT NOT NULL,
  metadata JSONB, -- Raw webhook payload

  -- Timestamps
  occurred_at TIMESTAMPTZ NOT NULL, -- When event occurred (from Resend)
  received_at TIMESTAMPTZ DEFAULT NOW() -- When we received webhook
);

-- Indexes for email events
CREATE INDEX IF NOT EXISTS idx_email_events_resend_id ON email_events(resend_id);
CREATE INDEX IF NOT EXISTS idx_email_events_event_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_occurred_at ON email_events(occurred_at DESC);

-- Prevent duplicate events
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_events_unique
  ON email_events(resend_id, event_type, occurred_at);

-- RLS for email events
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

-- Admins can view all events
CREATE POLICY "Admins can view email events"
  ON email_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- =====================================================
-- Triggers
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_email_sequences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_email_sequences_updated_at
  BEFORE UPDATE ON email_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_email_sequences_updated_at();

-- Auto-pause sequence when lead converts
CREATE OR REPLACE FUNCTION auto_pause_sequence_on_conversion()
RETURNS TRIGGER AS $$
BEGIN
  -- If lead status changed to converted, pause active sequences
  IF NEW.status = 'converted' AND OLD.status != 'converted' THEN
    UPDATE email_sequences
    SET status = 'paused'
    WHERE lead_id = NEW.id
    AND status = 'active';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_pause_sequence_on_conversion
  AFTER UPDATE ON leads
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION auto_pause_sequence_on_conversion();

-- =====================================================
-- Comments
-- =====================================================

COMMENT ON TABLE email_logs IS 'Tracks all sent emails with status and Resend IDs';
COMMENT ON TABLE email_sequences IS 'Manages multi-step email campaigns for lead nurturing';
COMMENT ON TABLE email_events IS 'Stores webhook events from Resend (delivered, opened, etc.)';
COMMENT ON COLUMN email_sequences.current_step IS 'Current step (0 = not started, 1+ = step number)';
COMMENT ON COLUMN email_sequences.status IS 'active = running, paused = temporarily stopped, completed = finished, cancelled = user unsubscribed';
