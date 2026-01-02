-- ============================================================================
-- FEAT-012: Task Attachments - File Upload Support
-- ============================================================================

-- Create task_attachments table
CREATE TABLE IF NOT EXISTS public.task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL UNIQUE,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT task_attachments_file_size_check CHECK (file_size > 0 AND file_size <= 10485760) -- Max 10MB
);

-- Indexes
CREATE INDEX idx_task_attachments_task_id ON public.task_attachments(task_id);
CREATE INDEX idx_task_attachments_uploaded_by ON public.task_attachments(uploaded_by);
CREATE INDEX idx_task_attachments_uploaded_at ON public.task_attachments(uploaded_at DESC);

-- RLS Policies
ALTER TABLE public.task_attachments ENABLE ROW LEVEL SECURITY;

-- Select: Users can view attachments from tasks they have access to
CREATE POLICY "Users can view task attachments"
  ON public.task_attachments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.tasks
      WHERE tasks.id = task_attachments.task_id
      AND (
        tasks.assigned_to = auth.uid()
        OR tasks.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.user_roles
          WHERE user_id = auth.uid()
          AND role_name IN ('ADMIN', 'MANAGER')
        )
      )
    )
  );

-- Insert: Authenticated users can upload attachments
CREATE POLICY "Authenticated users can upload attachments"
  ON public.task_attachments
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.tasks
      WHERE tasks.id = task_attachments.task_id
    )
  );

-- Delete: Only uploader or admins can delete
CREATE POLICY "Users can delete own attachments or admins can delete all"
  ON public.task_attachments
  FOR DELETE
  USING (
    uploaded_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role_name IN ('ADMIN', 'MANAGER')
    )
  );

-- Comments
COMMENT ON TABLE public.task_attachments IS 'Anexos de arquivos vinculados a tarefas';
COMMENT ON COLUMN public.task_attachments.file_size IS 'Tamanho do arquivo em bytes (máx 10MB)';
COMMENT ON COLUMN public.task_attachments.storage_path IS 'Caminho no Supabase Storage bucket "documents"';
