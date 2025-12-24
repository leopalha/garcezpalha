-- Create follow_up_tasks table
CREATE TABLE IF NOT EXISTS follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Lead reference
  lead_id UUID NOT NULL REFERENCES qualified_leads(id) ON DELETE CASCADE,

  -- Scheduling
  scheduled_for TIMESTAMPTZ NOT NULL,
  attempt_number INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hot', 'warm', 'cold', 'very-cold')),

  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMPTZ,
  error TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_lead ON follow_up_tasks(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_status ON follow_up_tasks(status);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_scheduled ON follow_up_tasks(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_category ON follow_up_tasks(category);
CREATE INDEX IF NOT EXISTS idx_follow_up_tasks_pending_scheduled
  ON follow_up_tasks(status, scheduled_for)
  WHERE status = 'pending';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_follow_up_tasks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER follow_up_tasks_updated_at
  BEFORE UPDATE ON follow_up_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_follow_up_tasks_updated_at();

-- Create RLS policies
ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all follow-up tasks"
  ON follow_up_tasks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create analytics view
CREATE OR REPLACE VIEW follow_up_analytics AS
SELECT
  DATE(created_at) as date,
  category,
  status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE status = 'sent') as sent_count,
  COUNT(*) FILTER (WHERE status = 'failed') as failed_count,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
  AVG(EXTRACT(EPOCH FROM (sent_at - scheduled_for))) FILTER (WHERE status = 'sent') as avg_delay_seconds
FROM follow_up_tasks
GROUP BY DATE(created_at), category, status;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON follow_up_tasks TO authenticated;
GRANT SELECT ON follow_up_analytics TO authenticated;

-- Comments
COMMENT ON TABLE follow_up_tasks IS 'Stores automated follow-up tasks for qualified leads';
COMMENT ON COLUMN follow_up_tasks.attempt_number IS 'Sequential attempt number (1, 2, 3, etc.)';
COMMENT ON COLUMN follow_up_tasks.scheduled_for IS 'When this follow-up should be executed';
COMMENT ON COLUMN follow_up_tasks.metadata IS 'Additional data like phone, client name, product name';
