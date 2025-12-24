-- Client Documents Table
-- Migration: 014_client_documents
-- Date: 2024-12-22

-- Create client_documents table for storing document metadata
CREATE TABLE IF NOT EXISTS client_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  category TEXT NOT NULL DEFAULT 'Pessoal',
  process_id UUID REFERENCES leads(id), -- Link to a legal case/process
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_client_documents_user ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_category ON client_documents(category);
CREATE INDEX IF NOT EXISTS idx_client_documents_process ON client_documents(process_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_created ON client_documents(created_at DESC);

-- Apply updated_at trigger
CREATE TRIGGER update_client_documents_updated_at
  BEFORE UPDATE ON client_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

-- Users can only view their own documents
CREATE POLICY "Users can view own documents" ON client_documents
  FOR SELECT USING (auth.uid() = user_id);

-- Users can upload their own documents
CREATE POLICY "Users can insert own documents" ON client_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own documents
CREATE POLICY "Users can delete own documents" ON client_documents
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket if not exists (run in Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('client-documents', 'client-documents', true);

COMMENT ON TABLE client_documents IS 'Stores metadata for client-uploaded documents';
COMMENT ON COLUMN client_documents.storage_path IS 'Path in Supabase Storage bucket';
COMMENT ON COLUMN client_documents.category IS 'Document category: Pessoal, Processo, Empresarial';
