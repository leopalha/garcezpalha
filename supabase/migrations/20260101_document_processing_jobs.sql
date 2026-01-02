-- ============================================================================
-- FEAT-017: Async Document Processing Worker
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.document_processing_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  process_type TEXT NOT NULL CHECK (process_type IN ('ocr', 'analysis', 'extraction', 'classification', 'fraud_detection')),
  options JSONB DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  result JSONB,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

CREATE INDEX idx_doc_jobs_status ON public.document_processing_jobs(status) WHERE status IN ('pending', 'processing');
CREATE INDEX idx_doc_jobs_document_id ON public.document_processing_jobs(document_id);
CREATE INDEX idx_doc_jobs_created_at ON public.document_processing_jobs(created_at DESC);

-- Add processing fields to documents table
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'not_processed' CHECK (processing_status IN ('not_processed', 'queued', 'processing', 'completed', 'failed')),
  ADD COLUMN IF NOT EXISTS extracted_text TEXT,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS processed_at TIMESTAMPTZ;

CREATE INDEX idx_documents_processing_status ON public.documents(processing_status);

-- RLS Policies
ALTER TABLE public.document_processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view processing jobs"
  ON public.document_processing_jobs FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create processing jobs"
  ON public.document_processing_jobs FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND created_by = auth.uid()
  );

COMMENT ON TABLE public.document_processing_jobs IS 'Fila de processamento assíncrono de documentos';
COMMENT ON COLUMN public.document_processing_jobs.process_type IS 'Tipo: ocr, analysis, extraction, classification, fraud_detection';
COMMENT ON COLUMN public.document_processing_jobs.result IS 'Resultado do processamento em JSON';
