-- Process Alerts Table for Email Monitor
-- Migration: 007_process_alerts_table
-- Date: 2025-11-20
--
-- This migration creates the process_alerts table for FREE email monitoring
-- Alternative to Judit.io (saves R$ 12,000/year)
--
-- Workflow:
-- 1. Cron job monitors Gmail inbox every 15 minutes
-- 2. Detects tribunal notification emails (TJ-RJ, STJ, etc.)
-- 3. Extracts process number, tribunal, update type
-- 4. Creates alert with status 'pending'
-- 5. Admin sees alert in /admin/processos dashboard
-- 6. Admin clicks "Baixar Agora" → Direct link to tribunal portal
-- 7. Admin uploads PDF manually
-- 8. PDF processor extracts text → Supabase Storage
-- 9. Status updated to 'processed'

-- Step 1: Create process_alerts table
CREATE TABLE IF NOT EXISTS process_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Process identification
  process_number TEXT NOT NULL, -- Format: NNNNNNN-DD.YYYY.J.TR.OOOO (CNJ unified)
  tribunal TEXT NOT NULL, -- TJ-RJ, STJ, TRF2, TST, STF, etc.
  update_type TEXT NOT NULL, -- Citação, Intimação, Sentença, Despacho, etc.

  -- Email details
  email_subject TEXT NOT NULL,
  email_date TIMESTAMPTZ NOT NULL,
  email_snippet TEXT, -- Preview of email content
  has_attachment BOOLEAN DEFAULT FALSE,

  -- Processing status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'downloaded', 'processed', 'ignored')),

  -- Admin actions
  download_url TEXT, -- Link to tribunal portal for manual download
  uploaded_pdf_url TEXT, -- Supabase Storage URL after manual upload
  processed_text_url TEXT, -- Supabase Storage URL for extracted TXT

  -- Metadata
  assigned_to UUID REFERENCES users(id), -- Admin/lawyer assigned to handle this
  notes TEXT, -- Admin notes
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  downloaded_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes
CREATE INDEX idx_process_alerts_number ON process_alerts(process_number);
CREATE INDEX idx_process_alerts_tribunal ON process_alerts(tribunal);
CREATE INDEX idx_process_alerts_status ON process_alerts(status);
CREATE INDEX idx_process_alerts_date ON process_alerts(email_date DESC);
CREATE INDEX idx_process_alerts_priority ON process_alerts(priority);
CREATE INDEX idx_process_alerts_assigned ON process_alerts(assigned_to);

-- Step 3: Create unique constraint (prevent duplicate alerts)
CREATE UNIQUE INDEX idx_process_alerts_unique
ON process_alerts(process_number, email_date);

-- Step 4: Add comments
COMMENT ON TABLE process_alerts IS
'Tribunal notification alerts detected from Gmail. FREE alternative to Judit.io (R$ 12,000/year savings).';

COMMENT ON COLUMN process_alerts.process_number IS
'Brazilian unified process number (CNJ format): NNNNNNN-DD.YYYY.J.TR.OOOO';

COMMENT ON COLUMN process_alerts.tribunal IS
'Court that sent the notification: TJ-RJ, STJ, TRF2, TST, STF, etc.';

COMMENT ON COLUMN process_alerts.status IS
'pending: Waiting for download | downloaded: PDF obtained | processed: Text extracted | ignored: Not relevant';

-- Step 5: Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_process_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_process_alerts_updated_at ON process_alerts;
CREATE TRIGGER trigger_update_process_alerts_updated_at
  BEFORE UPDATE ON process_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_process_alerts_updated_at();

-- Step 6: Auto-set timestamps on status change
CREATE OR REPLACE FUNCTION auto_set_process_alert_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  -- Set downloaded_at when status changes to 'downloaded'
  IF NEW.status = 'downloaded' AND (OLD.status IS NULL OR OLD.status != 'downloaded') THEN
    NEW.downloaded_at = NOW();
  END IF;

  -- Set processed_at when status changes to 'processed'
  IF NEW.status = 'processed' AND (OLD.status IS NULL OR OLD.status != 'processed') THEN
    NEW.processed_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_set_process_alert_timestamps ON process_alerts;
CREATE TRIGGER trigger_auto_set_process_alert_timestamps
  BEFORE UPDATE ON process_alerts
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_process_alert_timestamps();

-- Step 7: Row Level Security (RLS) policies
ALTER TABLE process_alerts ENABLE ROW LEVEL SECURITY;

-- Admins can see all alerts
CREATE POLICY process_alerts_admin_all ON process_alerts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Lawyers can only see alerts assigned to them
CREATE POLICY process_alerts_lawyer_assigned ON process_alerts
  FOR SELECT
  TO authenticated
  USING (
    assigned_to = auth.uid()
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- Step 8: Create helper view for dashboard
CREATE OR REPLACE VIEW process_alerts_summary AS
SELECT
  status,
  tribunal,
  priority,
  COUNT(*) as count,
  MAX(email_date) as latest_alert
FROM process_alerts
GROUP BY status, tribunal, priority
ORDER BY latest_alert DESC;

COMMENT ON VIEW process_alerts_summary IS
'Summary view for admin dashboard showing alert counts by status, tribunal, and priority';

-- Step 9: Insert sample data for testing (optional - remove in production)
-- INSERT INTO process_alerts (
--   process_number,
--   tribunal,
--   update_type,
--   email_subject,
--   email_date,
--   email_snippet,
--   has_attachment,
--   status,
--   priority
-- ) VALUES (
--   '0123456-78.2023.8.19.0001',
--   'TJ-RJ',
--   'Intimação',
--   'Intimação - Processo 0123456-78.2023.8.19.0001',
--   NOW() - INTERVAL '2 days',
--   'Fica Vossa Excelência intimado para apresentar contrarrazões no prazo de 15 dias...',
--   true,
--   'pending',
--   'high'
-- );

-- Migration complete
-- Process alerts table ready for email monitoring system
