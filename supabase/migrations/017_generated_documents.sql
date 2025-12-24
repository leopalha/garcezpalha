-- Migration: Generated Documents and Review Queue
-- Phase 6: Producao Juridica - AI Document Generation System

-- Table for storing AI-generated legal documents
CREATE TABLE IF NOT EXISTS generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'sent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  review_notes TEXT,
  sent_at TIMESTAMPTZ,
  sent_via TEXT CHECK (sent_via IN ('email', 'whatsapp', 'download', NULL))
);

-- Table for document review queue
CREATE TABLE IF NOT EXISTS review_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES generated_documents(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL,
  title TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
  assigned_to TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  review_notes TEXT
);

-- Table for document templates (optional - for custom templates)
CREATE TABLE IF NOT EXISTS document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('financeiro', 'imobiliario', 'previdenciario', 'criminal', 'trabalhista', 'consumidor', 'geral')),
  description TEXT,
  content TEXT NOT NULL,
  required_variables TEXT[] DEFAULT '{}',
  optional_variables TEXT[] DEFAULT '{}',
  requires_ai BOOLEAN DEFAULT false,
  estimated_pages INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for document revisions (version history)
CREATE TABLE IF NOT EXISTS document_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES generated_documents(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL DEFAULT 1,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  revision_notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_generated_documents_lead_id ON generated_documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_status ON generated_documents(status);
CREATE INDEX IF NOT EXISTS idx_generated_documents_type ON generated_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_generated_documents_created_at ON generated_documents(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_review_queue_status ON review_queue(status);
CREATE INDEX IF NOT EXISTS idx_review_queue_priority ON review_queue(priority);
CREATE INDEX IF NOT EXISTS idx_review_queue_assigned_to ON review_queue(assigned_to);
CREATE INDEX IF NOT EXISTS idx_review_queue_created_at ON review_queue(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_document_revisions_document_id ON document_revisions(document_id);

-- Trigger for updated_at on generated_documents
CREATE OR REPLACE FUNCTION update_generated_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_generated_documents_updated_at ON generated_documents;
CREATE TRIGGER trigger_update_generated_documents_updated_at
  BEFORE UPDATE ON generated_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_generated_documents_updated_at();

-- Trigger for updated_at on review_queue
DROP TRIGGER IF EXISTS trigger_update_review_queue_updated_at ON review_queue;
CREATE TRIGGER trigger_update_review_queue_updated_at
  BEFORE UPDATE ON review_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_generated_documents_updated_at();

-- Enable RLS
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_revisions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for generated_documents
CREATE POLICY "Admins and lawyers can view all documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and lawyers can insert documents"
  ON generated_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins and lawyers can update documents"
  ON generated_documents FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for review_queue
CREATE POLICY "Admins and lawyers can view review queue"
  ON review_queue FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and lawyers can manage review queue"
  ON review_queue FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for document_templates
CREATE POLICY "Anyone can view active templates"
  ON document_templates FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage templates"
  ON document_templates FOR ALL
  TO authenticated
  USING (true);

-- RLS Policies for document_revisions
CREATE POLICY "Admins and lawyers can view revisions"
  ON document_revisions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and lawyers can create revisions"
  ON document_revisions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON generated_documents TO authenticated;
GRANT ALL ON review_queue TO authenticated;
GRANT ALL ON document_templates TO authenticated;
GRANT ALL ON document_revisions TO authenticated;

-- Service role full access
GRANT ALL ON generated_documents TO service_role;
GRANT ALL ON review_queue TO service_role;
GRANT ALL ON document_templates TO service_role;
GRANT ALL ON document_revisions TO service_role;

COMMENT ON TABLE generated_documents IS 'AI-generated legal documents with revision tracking';
COMMENT ON TABLE review_queue IS 'Queue for document review workflow';
COMMENT ON TABLE document_templates IS 'Custom document templates (supplements built-in templates)';
COMMENT ON TABLE document_revisions IS 'Version history for document changes';
