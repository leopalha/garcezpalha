-- Add AI Analysis fields to client_documents table
-- Migration: 030_add_document_ai_analysis
-- Date: 2024-12-30

-- Add columns for AI analysis
ALTER TABLE client_documents
ADD COLUMN IF NOT EXISTS ai_analyzed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ai_analysis JSONB,
ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMPTZ;

-- Add index for AI-analyzed documents
CREATE INDEX IF NOT EXISTS idx_client_documents_ai_analyzed
  ON client_documents(ai_analyzed, created_at DESC);

COMMENT ON COLUMN client_documents.ai_analyzed IS 'Whether document has been analyzed by AI';
COMMENT ON COLUMN client_documents.ai_analysis IS 'JSON containing AI analysis results (extracted data, classification, etc.)';
COMMENT ON COLUMN client_documents.ai_analyzed_at IS 'Timestamp when AI analysis was completed';
