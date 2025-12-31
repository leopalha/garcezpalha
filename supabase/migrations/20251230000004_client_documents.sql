-- Migration: Client Documents Table
-- Description: Create table for storing client documents with AI analysis
-- Date: 2024-12-30
-- Related TODO: src/app/api/documents/route.ts:65

-- Create client_documents table
CREATE TABLE IF NOT EXISTS public.client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- pdf, jpg, png, doc, etc
  file_size INTEGER NOT NULL, -- bytes
  storage_path TEXT NOT NULL, -- Supabase Storage path
  document_type TEXT, -- rg, cpf, contract, medical, etc

  -- AI Analysis fields
  ai_analysis JSONB, -- Full GPT-4 Vision response
  extracted_data JSONB, -- Structured extracted data
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00
  analysis_status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  warnings TEXT[], -- Array of warning messages

  -- Metadata
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  analyzed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_client_documents_lead_id ON public.client_documents(lead_id);
CREATE INDEX idx_client_documents_document_type ON public.client_documents(document_type);
CREATE INDEX idx_client_documents_analysis_status ON public.client_documents(analysis_status);
CREATE INDEX idx_client_documents_uploaded_by ON public.client_documents(uploaded_by);
CREATE INDEX idx_client_documents_created_at ON public.client_documents(created_at DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.client_documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own documents
CREATE POLICY "Users can view their own documents"
  ON public.client_documents
  FOR SELECT
  USING (
    auth.uid() = uploaded_by
    OR
    -- Admins and lawyers can see all
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- Policy: Users can upload documents
CREATE POLICY "Users can upload documents"
  ON public.client_documents
  FOR INSERT
  WITH CHECK (
    auth.uid() = uploaded_by
    OR
    -- Admins and lawyers can upload on behalf of leads
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- Policy: Only admins/lawyers can update (for AI analysis results)
CREATE POLICY "Admins and lawyers can update documents"
  ON public.client_documents
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'lawyer')
    )
  );

-- Policy: Only admins can delete
CREATE POLICY "Only admins can delete documents"
  ON public.client_documents
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_client_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER client_documents_updated_at
  BEFORE UPDATE ON public.client_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_client_documents_updated_at();

-- Add comment
COMMENT ON TABLE public.client_documents IS 'Stores client uploaded documents with AI analysis from GPT-4 Vision';
