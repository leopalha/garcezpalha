-- Process Documents Table for PDF Storage
-- Migration: 008_process_documents_table
-- Date: 2025-11-20
--
-- This migration creates tables for storing processed legal documents
-- and automatically extracted deadlines
--
-- Workflow:
-- 1. Admin uploads PDF from process alert
-- 2. PDF processor extracts text (pdf-parse library)
-- 3. Original PDF stored in Supabase Storage bucket 'process-docs'
-- 4. Extracted TXT stored in same bucket
-- 5. Full text saved to database for searchability
-- 6. Deadlines automatically detected and saved
-- 7. Google Calendar sync (Sprint 5.4)

-- Step 1: Create process_documents table
CREATE TABLE IF NOT EXISTS process_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to alert
  alert_id UUID REFERENCES process_alerts(id) ON DELETE CASCADE,

  -- Storage URLs
  pdf_url TEXT NOT NULL, -- Supabase Storage public URL
  text_url TEXT NOT NULL, -- Extracted text file URL

  -- Extracted content (for full-text search)
  extracted_text TEXT, -- Full text content (searchable)

  -- PDF metadata
  num_pages INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}', -- PDF metadata (title, author, creation date, etc.)

  -- File info
  file_size BIGINT, -- Size in bytes
  original_filename TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create process_deadlines table
CREATE TABLE IF NOT EXISTS process_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to alert and document
  alert_id UUID REFERENCES process_alerts(id) ON DELETE CASCADE,
  document_id UUID REFERENCES process_documents(id) ON DELETE SET NULL,

  -- Deadline details
  deadline_type TEXT NOT NULL, -- "Apresentar Contrarrazões", "Interpor Recurso", etc.
  due_date TIMESTAMPTZ NOT NULL,
  description TEXT, -- Context from document

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'cancelled')),

  -- Calendar integration
  google_calendar_event_id TEXT, -- Synced with Google Calendar
  reminder_sent BOOLEAN DEFAULT FALSE,

  -- Metadata
  notes TEXT, -- Admin notes
  completed_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create indexes for fast queries
CREATE INDEX idx_process_documents_alert ON process_documents(alert_id);
CREATE INDEX idx_process_documents_created ON process_documents(created_at DESC);

CREATE INDEX idx_process_deadlines_alert ON process_deadlines(alert_id);
CREATE INDEX idx_process_deadlines_document ON process_deadlines(document_id);
CREATE INDEX idx_process_deadlines_due_date ON process_deadlines(due_date ASC);
CREATE INDEX idx_process_deadlines_status ON process_deadlines(status);

-- Step 4: Full-text search index on extracted_text
CREATE INDEX idx_process_documents_text_search
ON process_documents
USING gin(to_tsvector('portuguese', extracted_text));

-- Step 5: Add comments
COMMENT ON TABLE process_documents IS
'Processed legal documents with extracted text for full-text search';

COMMENT ON TABLE process_deadlines IS
'Automatically extracted deadlines from legal documents with Google Calendar sync';

COMMENT ON COLUMN process_documents.extracted_text IS
'Full text extracted from PDF using pdf-parse. Indexed for full-text search in Portuguese.';

COMMENT ON COLUMN process_deadlines.deadline_type IS
'Type of action required: Contrarrazões, Recurso, Manifestação, etc.';

COMMENT ON COLUMN process_deadlines.google_calendar_event_id IS
'Google Calendar event ID for automatic sync and reminders (Sprint 5.4)';

-- Step 6: Auto-update updated_at triggers
CREATE OR REPLACE FUNCTION update_process_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_process_documents_updated_at ON process_documents;
CREATE TRIGGER trigger_update_process_documents_updated_at
  BEFORE UPDATE ON process_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_process_documents_updated_at();

CREATE OR REPLACE FUNCTION update_process_deadlines_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_process_deadlines_updated_at ON process_deadlines;
CREATE TRIGGER trigger_update_process_deadlines_updated_at
  BEFORE UPDATE ON process_deadlines
  FOR EACH ROW
  EXECUTE FUNCTION update_process_deadlines_updated_at();

-- Step 7: Auto-set completed_at when status changes
CREATE OR REPLACE FUNCTION auto_set_deadline_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    NEW.completed_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_set_deadline_completed_at ON process_deadlines;
CREATE TRIGGER trigger_auto_set_deadline_completed_at
  BEFORE UPDATE ON process_deadlines
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_deadline_completed_at();

-- Step 8: Auto-expire old deadlines (run daily)
CREATE OR REPLACE FUNCTION auto_expire_deadlines()
RETURNS void AS $$
BEGIN
  UPDATE process_deadlines
  SET status = 'expired'
  WHERE status = 'pending'
  AND due_date < NOW()
  AND status != 'completed';
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_expire_deadlines() IS
'Automatically marks past deadlines as expired. Should be run daily via cron job.';

-- Step 9: Row Level Security (RLS) policies
ALTER TABLE process_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_deadlines ENABLE ROW LEVEL SECURITY;

-- Admins can see all documents
CREATE POLICY process_documents_admin_all ON process_documents
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admins can see all deadlines
CREATE POLICY process_deadlines_admin_all ON process_deadlines
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Lawyers can see documents/deadlines assigned to them
CREATE POLICY process_documents_lawyer_assigned ON process_documents
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM process_alerts
      WHERE process_alerts.id = alert_id
      AND process_alerts.assigned_to = auth.uid()
    )
  );

CREATE POLICY process_deadlines_lawyer_assigned ON process_deadlines
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM process_alerts
      WHERE process_alerts.id = alert_id
      AND process_alerts.assigned_to = auth.uid()
    )
  );

-- Step 10: Create view for upcoming deadlines dashboard
CREATE OR REPLACE VIEW upcoming_deadlines AS
SELECT
  d.id,
  d.deadline_type,
  d.due_date,
  d.description,
  d.status,
  a.process_number,
  a.tribunal,
  a.priority,
  EXTRACT(DAY FROM (d.due_date - NOW())) as days_remaining
FROM process_deadlines d
JOIN process_alerts a ON d.alert_id = a.id
WHERE d.status = 'pending'
  AND d.due_date >= NOW()
ORDER BY d.due_date ASC;

COMMENT ON VIEW upcoming_deadlines IS
'Dashboard view showing all pending deadlines ordered by due date with days remaining';

-- Step 11: Create Supabase Storage bucket (run manually in Supabase Dashboard)
-- Bucket name: process-docs
-- Public: true (with RLS policies)
-- File size limit: 50MB
-- Allowed MIME types: application/pdf, text/plain

-- To create bucket via SQL (if Storage API is available):
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('process-docs', 'process-docs', true);

-- Migration complete
-- Process documents and deadlines tables ready for PDF processor
