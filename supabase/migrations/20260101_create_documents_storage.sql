-- ============================================================================
-- STORAGE BUCKET FOR CLIENT DOCUMENTS
-- ============================================================================
-- Migration: Create storage bucket and policies for client documents
-- Date: 2026-01-01
-- Description: Sets up Supabase Storage for document uploads with RLS
-- ============================================================================

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to their own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read files they uploaded
CREATE POLICY "Users can read their own files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow admins to read all files
CREATE POLICY "Admins can read all files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Allow users to delete their own files (except approved documents - handled in app)
CREATE POLICY "Users can delete their own files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow admins to delete any file
CREATE POLICY "Admins can delete any file"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'documents'
    AND EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- ============================================================================
-- ADD INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for document lookups by user
CREATE INDEX IF NOT EXISTS idx_case_documents_uploaded_by
  ON case_documents(uploaded_by);

-- Index for document lookups by case
CREATE INDEX IF NOT EXISTS idx_case_documents_case_id
  ON case_documents(case_id);

-- Index for document status filtering
CREATE INDEX IF NOT EXISTS idx_case_documents_status
  ON case_documents(status);

-- Compound index for common queries
CREATE INDEX IF NOT EXISTS idx_case_documents_user_status
  ON case_documents(uploaded_by, status);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE case_documents IS 'Client uploaded documents with approval workflow';
COMMENT ON COLUMN case_documents.status IS 'Document review status: pending, approved, rejected, under_review';
COMMENT ON COLUMN case_documents.review_notes IS 'Admin notes about document approval/rejection';
COMMENT ON COLUMN case_documents.reviewed_by IS 'User who reviewed the document';
COMMENT ON COLUMN case_documents.reviewed_at IS 'When the document was reviewed';
