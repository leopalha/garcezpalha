-- ============================================================================
-- TASK MANAGEMENT SYSTEM
-- ============================================================================
-- Migration: Create complete task management with priorities and subtasks
-- Date: 2026-01-01
-- Description: To-do system for lawyers and clients with case integration
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'blocked', 'completed', 'cancelled');

-- ============================================================================
-- TASKS TABLE
-- ============================================================================

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  title TEXT NOT NULL,
  description TEXT,

  -- Status and priority
  status task_status NOT NULL DEFAULT 'todo',
  priority task_priority NOT NULL DEFAULT 'medium',

  -- Relationships
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE, -- For subtasks
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Dates
  due_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Additional metadata
  tags TEXT[], -- Array of tags for categorization
  estimated_hours INTEGER, -- Estimated time in hours
  actual_hours INTEGER, -- Actual time spent

  -- Constraints
  CONSTRAINT valid_estimated_hours CHECK (estimated_hours IS NULL OR estimated_hours > 0),
  CONSTRAINT valid_actual_hours CHECK (actual_hours IS NULL OR actual_hours >= 0),
  CONSTRAINT completed_at_requires_completed_status CHECK (
    (status = 'completed' AND completed_at IS NOT NULL) OR
    (status != 'completed' AND completed_at IS NULL)
  )
);

-- ============================================================================
-- TASK COMMENTS TABLE
-- ============================================================================

CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TASK ATTACHMENTS TABLE
-- ============================================================================

CREATE TABLE task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_file_size CHECK (file_size > 0 AND file_size <= 10485760) -- Max 10MB
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Tasks indexes
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_case_id ON tasks(case_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_tags ON tasks USING GIN(tags);

-- Compound indexes for common queries
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to, status) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_tasks_case_status ON tasks(case_id, status) WHERE case_id IS NOT NULL;

-- Task comments indexes
CREATE INDEX idx_task_comments_task_id ON task_comments(task_id);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);
CREATE INDEX idx_task_comments_created_at ON task_comments(created_at DESC);

-- Task attachments indexes
CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX idx_task_attachments_uploaded_by ON task_attachments(uploaded_by);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-set completed_at
CREATE OR REPLACE FUNCTION auto_set_task_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  ELSIF NEW.status != 'completed' THEN
    NEW.completed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update task comments updated_at
CREATE OR REPLACE FUNCTION update_task_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER trigger_update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_tasks_updated_at();

CREATE TRIGGER trigger_auto_set_task_completed_at
  BEFORE INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION auto_set_task_completed_at();

CREATE TRIGGER trigger_update_task_comments_updated_at
  BEFORE UPDATE ON task_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_task_comments_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

-- Tasks policies
-- Users can view tasks assigned to them or created by them
CREATE POLICY "Users can view their tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    assigned_to = auth.uid()
    OR created_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM cases c
      WHERE c.id = tasks.case_id
      AND c.client_id = auth.uid()
    )
  );

-- Admins can view all tasks
CREATE POLICY "Admins can view all tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Users can create tasks
CREATE POLICY "Users can create tasks"
  ON tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Users can update their own tasks
CREATE POLICY "Users can update their tasks"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    assigned_to = auth.uid()
    OR created_by = auth.uid()
  );

-- Admins can update any task
CREATE POLICY "Admins can update any task"
  ON tasks
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Users can delete their own tasks
CREATE POLICY "Users can delete their tasks"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Admins can delete any task
CREATE POLICY "Admins can delete any task"
  ON tasks
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

-- Task comments policies
CREATE POLICY "Users can view comments on their tasks"
  ON task_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_comments.task_id
      AND (
        tasks.assigned_to = auth.uid()
        OR tasks.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM cases c
          WHERE c.id = tasks.case_id
          AND c.client_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Admins can view all task comments"
  ON task_comments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Users can create comments on accessible tasks"
  ON task_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_comments.task_id
      AND (
        tasks.assigned_to = auth.uid()
        OR tasks.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM cases c
          WHERE c.id = tasks.case_id
          AND c.client_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Users can update their own comments"
  ON task_comments
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON task_comments
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Task attachments policies (similar to comments)
CREATE POLICY "Users can view attachments on their tasks"
  ON task_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_attachments.task_id
      AND (
        tasks.assigned_to = auth.uid()
        OR tasks.created_by = auth.uid()
        OR EXISTS (
          SELECT 1 FROM cases c
          WHERE c.id = tasks.case_id
          AND c.client_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Admins can view all task attachments"
  ON task_attachments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'superadmin')
    )
  );

CREATE POLICY "Users can upload attachments to accessible tasks"
  ON task_attachments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM tasks
      WHERE tasks.id = task_attachments.task_id
      AND (
        tasks.assigned_to = auth.uid()
        OR tasks.created_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can delete their own attachments"
  ON task_attachments
  FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid());

-- ============================================================================
-- STORAGE BUCKET FOR TASK ATTACHMENTS
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('task-attachments', 'task-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload task attachments to their folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'task-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read their task attachments"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'task-attachments'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'superadmin')
      )
    )
  );

CREATE POLICY "Users can delete their task attachments"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'task-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE tasks IS 'Task management system with priorities, subtasks, and case integration';
COMMENT ON COLUMN tasks.parent_task_id IS 'Reference to parent task for subtasks (null = top-level task)';
COMMENT ON COLUMN tasks.tags IS 'Array of tags for categorization and filtering';
COMMENT ON COLUMN tasks.estimated_hours IS 'Estimated time to complete in hours';
COMMENT ON COLUMN tasks.actual_hours IS 'Actual time spent on task in hours';

COMMENT ON TABLE task_comments IS 'Comments/discussions on tasks';
COMMENT ON TABLE task_attachments IS 'File attachments for tasks';
