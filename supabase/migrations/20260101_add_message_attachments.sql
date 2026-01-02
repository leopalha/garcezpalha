-- ============================================================================
-- ADD MESSAGE ATTACHMENTS SUPPORT
-- ============================================================================
-- Migration: Add attachments table for chat messages
-- Date: 2026-01-01
-- Description: Allows messages to have file attachments (images, documents)
-- ============================================================================

-- Create message_attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760), -- Max 10MB
  CONSTRAINT valid_mime_type CHECK (
    mime_type LIKE 'image/%' OR
    mime_type = 'application/pdf' OR
    mime_type LIKE 'application/vnd%' OR -- MS Office files
    mime_type LIKE 'application/*document%'
  )
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_message_attachments_message_id ON message_attachments(message_id);
CREATE INDEX idx_message_attachments_created_at ON message_attachments(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE message_attachments ENABLE ROW LEVEL SECURITY;

-- Users can view attachments from their conversations
CREATE POLICY "Users can view attachments from their conversations"
  ON message_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversations c ON c.id = m.conversation_id
      WHERE m.id = message_attachments.message_id
      AND (
        c.client_id::text = auth.uid()::text
        OR EXISTS (
          SELECT 1 FROM leads l
          WHERE l.id::text = c.lead_id::text
          AND l.email = (SELECT email FROM auth.users WHERE id = auth.uid())
        )
      )
    )
  );

-- Admins can view all attachments
CREATE POLICY "Admins can view all attachments"
  ON message_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Users can insert attachments to their own messages
CREATE POLICY "Users can insert attachments to their messages"
  ON message_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      WHERE m.id = message_attachments.message_id
      AND m.sender_id = auth.uid()
    )
  );

-- ============================================================================
-- STORAGE BUCKET FOR CHAT ATTACHMENTS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-attachments', 'chat-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload chat attachments to their folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'chat-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read their chat attachments
CREATE POLICY "Users can read their chat attachments"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'superadmin')
      )
    )
  );

-- Allow users to delete their own chat attachments
CREATE POLICY "Users can delete their chat attachments"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE message_attachments IS 'File attachments for chat messages (images, documents, etc)';
COMMENT ON COLUMN message_attachments.file_size IS 'File size in bytes, max 10MB';
COMMENT ON COLUMN message_attachments.mime_type IS 'MIME type of the file (image/*, application/pdf, etc)';
