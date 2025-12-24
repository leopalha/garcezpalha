-- Create qualified_leads table
CREATE TABLE IF NOT EXISTS qualified_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Client information
  client_name TEXT,
  phone TEXT NOT NULL,
  email TEXT,

  -- Product information
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,

  -- Score information
  score_total INTEGER NOT NULL,
  score_urgency INTEGER NOT NULL,
  score_probability INTEGER NOT NULL,
  score_complexity INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hot', 'warm', 'cold', 'very-cold')),

  -- Qualification data
  answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  reasoning JSONB DEFAULT '[]'::jsonb,

  -- Source and session
  source TEXT NOT NULL CHECK (source IN ('whatsapp', 'website', 'phone', 'email')),
  session_id TEXT NOT NULL,

  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in-progress', 'converted', 'lost')),
  assigned_to UUID REFERENCES auth.users(id),

  -- Follow-up tracking
  contacted_at TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_qualified_leads_phone ON qualified_leads(phone);
CREATE INDEX IF NOT EXISTS idx_qualified_leads_product ON qualified_leads(product_id);
CREATE INDEX IF NOT EXISTS idx_qualified_leads_category ON qualified_leads(category);
CREATE INDEX IF NOT EXISTS idx_qualified_leads_status ON qualified_leads(status);
CREATE INDEX IF NOT EXISTS idx_qualified_leads_source ON qualified_leads(source);
CREATE INDEX IF NOT EXISTS idx_qualified_leads_created ON qualified_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qualified_leads_session ON qualified_leads(session_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_qualified_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER qualified_leads_updated_at
  BEFORE UPDATE ON qualified_leads
  FOR EACH ROW
  EXECUTE FUNCTION update_qualified_leads_updated_at();

-- Create RLS policies
ALTER TABLE qualified_leads ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage all qualified leads"
  ON qualified_leads
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy: Users can view their assigned leads
CREATE POLICY "Users can view assigned leads"
  ON qualified_leads
  FOR SELECT
  TO authenticated
  USING (assigned_to = auth.uid());

-- Create analytics view
CREATE OR REPLACE VIEW qualified_leads_analytics AS
SELECT
  DATE(created_at) as date,
  product_id,
  category,
  source,
  status,
  COUNT(*) as count,
  AVG(score_total) as avg_score,
  AVG(score_urgency) as avg_urgency,
  AVG(score_probability) as avg_probability,
  AVG(score_complexity) as avg_complexity
FROM qualified_leads
GROUP BY DATE(created_at), product_id, category, source, status;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON qualified_leads TO authenticated;
GRANT SELECT ON qualified_leads_analytics TO authenticated;

-- Comments
COMMENT ON TABLE qualified_leads IS 'Stores qualified leads from the automated qualification system';
COMMENT ON COLUMN qualified_leads.score_total IS 'Total score (0-100) calculated from weighted average';
COMMENT ON COLUMN qualified_leads.category IS 'Lead category based on score: hot (75-100), warm (50-74), cold (25-49), very-cold (0-24)';
COMMENT ON COLUMN qualified_leads.reasoning IS 'Array of reasoning strings explaining the score';
COMMENT ON COLUMN qualified_leads.answers IS 'Full array of question-answer pairs from qualification';
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
