-- ============================================================================
-- MIGRATION: Client Portal Tables
-- Description: Creates tables for client cases, timeline, documents, and notifications
-- Date: 2026-01-01
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: cases
-- Description: Legal cases/services contracted by clients
-- ============================================================================

CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Client and lawyer assignment
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,

  -- Case details
  service_type VARCHAR(200) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'aguardando_documentos',
  description TEXT,

  -- Legal process info
  case_number VARCHAR(50), -- número do processo judicial
  court VARCHAR(200), -- tribunal
  value DECIMAL(12,2), -- valor da causa

  -- Progress tracking
  current_phase VARCHAR(200),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  next_step VARCHAR(500),

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT valid_status CHECK (
    status IN (
      'aguardando_documentos',
      'em_analise',
      'em_andamento',
      'concluido',
      'cancelado'
    )
  )
);

-- Indexes for cases
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON cases(client_id);
CREATE INDEX IF NOT EXISTS idx_cases_lawyer_id ON cases(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_cases_status ON cases(status);
CREATE INDEX IF NOT EXISTS idx_cases_created_at ON cases(created_at DESC);

-- RLS (Row Level Security) for cases
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can only see their own cases
DROP POLICY IF EXISTS "Clients can view own cases" ON cases;
CREATE POLICY "Clients can view own cases"
  ON cases FOR SELECT
  USING (
    auth.uid() = client_id OR
    auth.uid() = lawyer_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'lawyer')
    )
  );

-- Policy: Only admins and lawyers can insert cases
DROP POLICY IF EXISTS "Admins and lawyers can create cases" ON cases;
CREATE POLICY "Admins and lawyers can create cases"
  ON cases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'lawyer')
    )
  );

-- Policy: Only assigned lawyer or admin can update
DROP POLICY IF EXISTS "Lawyers and admins can update cases" ON cases;
CREATE POLICY "Lawyers and admins can update cases"
  ON cases FOR UPDATE
  USING (
    auth.uid() = lawyer_id OR
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- ============================================================================
-- TABLE: case_timeline
-- Description: Timeline of events for each case
-- ============================================================================

CREATE TABLE IF NOT EXISTS case_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,

  -- Event details
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,

  -- Event metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Additional data
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT valid_timeline_type CHECK (
    type IN (
      'created',
      'document_submitted',
      'status_changed',
      'message',
      'deadline',
      'payment',
      'meeting',
      'court_update',
      'lawyer_assigned'
    )
  )
);

-- Indexes for case_timeline
CREATE INDEX IF NOT EXISTS idx_case_timeline_case_id ON case_timeline(case_id);
CREATE INDEX IF NOT EXISTS idx_case_timeline_created_at ON case_timeline(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_case_timeline_type ON case_timeline(type);

-- RLS for case_timeline
ALTER TABLE case_timeline ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view timeline of their cases" ON case_timeline;
CREATE POLICY "Users can view timeline of their cases"
  ON case_timeline FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_timeline.case_id
      AND (
        cases.client_id = auth.uid() OR
        cases.lawyer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
      )
    )
  );

DROP POLICY IF EXISTS "Lawyers and admins can insert timeline events" ON case_timeline;
CREATE POLICY "Lawyers and admins can insert timeline events"
  ON case_timeline FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_timeline.case_id
      AND (
        cases.lawyer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
      )
    )
  );

-- ============================================================================
-- TABLE: case_documents
-- Description: Documents related to cases
-- ============================================================================

CREATE TABLE IF NOT EXISTS case_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,

  -- Document details
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  description TEXT,

  -- File info
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,

  -- Status
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  review_notes TEXT,
  reviewed_at TIMESTAMPTZ,

  -- Upload info
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT valid_document_status CHECK (
    status IN ('pending', 'approved', 'rejected', 'under_review')
  )
);

-- Indexes for case_documents
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id ON case_documents(case_id);
CREATE INDEX IF NOT EXISTS idx_case_documents_status ON case_documents(status);
CREATE INDEX IF NOT EXISTS idx_case_documents_uploaded_at ON case_documents(uploaded_at DESC);

-- RLS for case_documents
ALTER TABLE case_documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view documents of their cases" ON case_documents;
CREATE POLICY "Users can view documents of their cases"
  ON case_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_documents.case_id
      AND (
        cases.client_id = auth.uid() OR
        cases.lawyer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
      )
    )
  );

DROP POLICY IF EXISTS "Users can upload documents to their cases" ON case_documents;
CREATE POLICY "Users can upload documents to their cases"
  ON case_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_documents.case_id
      AND (
        cases.client_id = auth.uid() OR
        cases.lawyer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
      )
    )
  );

DROP POLICY IF EXISTS "Lawyers can update document status" ON case_documents;
CREATE POLICY "Lawyers can update document status"
  ON case_documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM cases
      WHERE cases.id = case_documents.case_id
      AND (
        cases.lawyer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE auth.users.id = auth.uid()
          AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
      )
    )
  );

-- ============================================================================
-- TABLE: notifications
-- Description: User notifications for case updates, messages, etc.
-- ============================================================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Notification details
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description VARCHAR(500),
  link VARCHAR(500),

  -- Status
  read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Constraints
  CONSTRAINT valid_notification_type CHECK (
    type IN ('message', 'document', 'case_update', 'deadline', 'payment')
  )
);

-- Indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read) WHERE read = FALSE;

-- RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can insert notifications" ON notifications;
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true); -- Allow inserts from backend/triggers

DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update cases.updated_at
DROP TRIGGER IF EXISTS update_cases_updated_at ON cases;
CREATE TRIGGER update_cases_updated_at
  BEFORE UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: Create timeline event on case status change
CREATE OR REPLACE FUNCTION create_status_change_timeline()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO case_timeline (case_id, type, title, description, created_by)
    VALUES (
      NEW.id,
      'status_changed',
      'Status atualizado',
      'Status alterado de ' || OLD.status || ' para ' || NEW.status,
      auth.uid()
    );

    -- Create notification for client
    INSERT INTO notifications (user_id, type, title, description, link)
    VALUES (
      NEW.client_id,
      'case_update',
      'Status do caso atualizado',
      'Seu caso "' || NEW.service_type || '" foi atualizado para: ' || NEW.status,
      '/cliente/casos/' || NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create timeline on status change
DROP TRIGGER IF EXISTS on_case_status_change ON cases;
CREATE TRIGGER on_case_status_change
  AFTER UPDATE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION create_status_change_timeline();

-- Function: Create notification on new document
CREATE OR REPLACE FUNCTION notify_on_document_upload()
RETURNS TRIGGER AS $$
DECLARE
  case_data RECORD;
BEGIN
  -- Get case info
  SELECT client_id, lawyer_id, service_type INTO case_data
  FROM cases WHERE id = NEW.case_id;

  -- Notify lawyer if client uploaded
  IF NEW.uploaded_by = case_data.client_id THEN
    INSERT INTO notifications (user_id, type, title, description, link)
    VALUES (
      case_data.lawyer_id,
      'document',
      'Novo documento enviado',
      'Cliente enviou: ' || NEW.name,
      '/admin/casos/' || NEW.case_id
    );
  END IF;

  -- Notify client if document status changed
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO notifications (user_id, type, title, description, link)
    VALUES (
      case_data.client_id,
      'document',
      'Documento ' || NEW.status,
      'Documento "' || NEW.name || '" foi ' || NEW.status,
      '/cliente/casos/' || NEW.case_id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Notify on document changes
DROP TRIGGER IF EXISTS on_document_upload ON case_documents;
CREATE TRIGGER on_document_upload
  AFTER INSERT OR UPDATE ON case_documents
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_document_upload();

-- ============================================================================
-- SEED DATA (Optional - for testing)
-- ============================================================================

-- Note: Uncomment below to insert sample data for testing
-- Make sure to replace UUIDs with actual user IDs from your auth.users table

/*
-- Sample case 1
INSERT INTO cases (
  client_id,
  lawyer_id,
  service_type,
  status,
  description,
  current_phase,
  progress,
  next_step
) VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual client UUID
  '00000000-0000-0000-0000-000000000002', -- Replace with actual lawyer UUID
  'Divórcio Consensual',
  'em_andamento',
  'Processo de divórcio consensual com partilha de bens',
  'Aguardando homologação judicial',
  65,
  'Aguardando homologação do juiz'
);

-- Sample timeline events
INSERT INTO case_timeline (case_id, type, title, description) VALUES
  ((SELECT id FROM cases LIMIT 1), 'created', 'Caso criado', 'Serviço contratado e caso iniciado'),
  ((SELECT id FROM cases LIMIT 1), 'document_submitted', 'Documentos enviados', 'RG, CPF e certidão aprovados');
*/

-- ============================================================================
-- GRANTS
-- ============================================================================

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE ON cases TO authenticated;
GRANT SELECT, INSERT ON case_timeline TO authenticated;
GRANT SELECT, INSERT, UPDATE ON case_documents TO authenticated;
GRANT SELECT, INSERT, UPDATE ON notifications TO authenticated;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
