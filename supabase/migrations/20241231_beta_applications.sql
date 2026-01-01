-- Beta Applications Table
-- Stores beta tester applications and approval status

CREATE TABLE IF NOT EXISTS beta_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Personal Info
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,

  -- Professional Info
  profession TEXT NOT NULL,
  oab TEXT,
  company TEXT,
  city TEXT,
  state TEXT,

  -- Interests & Experience
  interests TEXT[] DEFAULT '{}',
  tech_familiarity TEXT NOT NULL,
  weekly_hours TEXT,
  used_other_platforms TEXT NOT NULL,
  other_platforms TEXT,
  can_dedicate_time TEXT NOT NULL,
  motivation TEXT NOT NULL,

  -- Application Status
  status TEXT NOT NULL DEFAULT 'pending',
  -- Status values: 'pending', 'approved', 'rejected', 'waitlist'

  -- Metadata
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),
  rejection_reason TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_beta_applications_email ON beta_applications(email);
CREATE INDEX idx_beta_applications_status ON beta_applications(status);
CREATE INDEX idx_beta_applications_applied_at ON beta_applications(applied_at DESC);

-- RLS Policies
ALTER TABLE beta_applications ENABLE ROW LEVEL SECURITY;

-- Admin can view all applications
CREATE POLICY "Admins can view all beta applications"
  ON beta_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admin can update applications (approve/reject)
CREATE POLICY "Admins can update beta applications"
  ON beta_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Anyone can insert (signup is public)
CREATE POLICY "Anyone can submit beta application"
  ON beta_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Users can view their own application
CREATE POLICY "Users can view own application"
  ON beta_applications
  FOR SELECT
  TO authenticated
  USING (email = (SELECT email FROM users WHERE id = auth.uid()));

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_beta_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER beta_applications_updated_at
  BEFORE UPDATE ON beta_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_beta_applications_updated_at();

-- Comments
COMMENT ON TABLE beta_applications IS 'Beta tester applications and approval workflow';
COMMENT ON COLUMN beta_applications.status IS 'Application status: pending, approved, rejected, waitlist';
COMMENT ON COLUMN beta_applications.tech_familiarity IS 'Tech familiarity level 1-5';
