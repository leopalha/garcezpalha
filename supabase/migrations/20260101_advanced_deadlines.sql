-- ============================================================================
-- ADVANCED DEADLINES MANAGEMENT SYSTEM
-- Sistema avançado de gestão de prazos com recorrência e delegação
-- ============================================================================

-- Create deadlines table (enhanced version)
CREATE TABLE IF NOT EXISTS deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL, -- 'hearing', 'filing', 'payment', 'meeting', 'custom'
  priority VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'

  -- Dates and times
  due_date TIMESTAMPTZ NOT NULL,
  due_time TIME, -- Optional specific time
  reminder_date TIMESTAMPTZ, -- When to send reminder
  completed_at TIMESTAMPTZ,

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'overdue', 'cancelled'
  is_recurring BOOLEAN DEFAULT false,

  -- Recurrence settings (JSON)
  recurrence_config JSONB, -- { frequency: 'daily'|'weekly'|'monthly'|'yearly', interval: 1, endDate: null }

  -- Associations
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Delegated lawyer

  -- Completion tracking
  completed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  completion_notes TEXT,

  -- Notifications
  notification_sent BOOLEAN DEFAULT false,
  notification_sent_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create deadline_reminders table (for custom reminder schedules)
CREATE TABLE IF NOT EXISTS deadline_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline_id UUID REFERENCES deadlines(id) ON DELETE CASCADE NOT NULL,

  -- Reminder settings
  reminder_type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push', 'whatsapp'
  reminder_time TIMESTAMPTZ NOT NULL, -- When to send

  -- Status
  sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create deadline_history table (audit trail)
CREATE TABLE IF NOT EXISTS deadline_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadline_id UUID REFERENCES deadlines(id) ON DELETE CASCADE NOT NULL,

  -- Change tracking
  action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'completed', 'cancelled', 'delegated'
  changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  changes JSONB, -- What changed
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_deadlines_due_date ON deadlines(due_date);
CREATE INDEX IF NOT EXISTS idx_deadlines_status ON deadlines(status);
CREATE INDEX IF NOT EXISTS idx_deadlines_case ON deadlines(case_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_assigned ON deadlines(assigned_to);
CREATE INDEX IF NOT EXISTS idx_deadlines_created_by ON deadlines(created_by);
CREATE INDEX IF NOT EXISTS idx_deadlines_recurring ON deadlines(is_recurring) WHERE is_recurring = true;

CREATE INDEX IF NOT EXISTS idx_deadline_reminders_time ON deadline_reminders(reminder_time) WHERE sent = false;
CREATE INDEX IF NOT EXISTS idx_deadline_reminders_deadline ON deadline_reminders(deadline_id);

CREATE INDEX IF NOT EXISTS idx_deadline_history_deadline ON deadline_history(deadline_id);
CREATE INDEX IF NOT EXISTS idx_deadline_history_created ON deadline_history(created_at DESC);

-- Function to automatically mark overdue deadlines
CREATE OR REPLACE FUNCTION mark_overdue_deadlines()
RETURNS void AS $$
BEGIN
  UPDATE deadlines
  SET status = 'overdue'
  WHERE status = 'pending'
    AND due_date < NOW()
    AND completed_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to create next occurrence of recurring deadline
CREATE OR REPLACE FUNCTION create_next_recurring_deadline(p_deadline_id UUID)
RETURNS UUID AS $$
DECLARE
  v_deadline deadlines%ROWTYPE;
  v_new_id UUID;
  v_next_date TIMESTAMPTZ;
  v_frequency VARCHAR(20);
  v_interval INT;
BEGIN
  -- Get the deadline
  SELECT * INTO v_deadline FROM deadlines WHERE id = p_deadline_id;

  IF NOT FOUND OR NOT v_deadline.is_recurring OR v_deadline.recurrence_config IS NULL THEN
    RETURN NULL;
  END IF;

  -- Parse recurrence config
  v_frequency := v_deadline.recurrence_config->>'frequency';
  v_interval := COALESCE((v_deadline.recurrence_config->>'interval')::INT, 1);

  -- Calculate next date
  CASE v_frequency
    WHEN 'daily' THEN
      v_next_date := v_deadline.due_date + (v_interval || ' days')::INTERVAL;
    WHEN 'weekly' THEN
      v_next_date := v_deadline.due_date + (v_interval || ' weeks')::INTERVAL;
    WHEN 'monthly' THEN
      v_next_date := v_deadline.due_date + (v_interval || ' months')::INTERVAL;
    WHEN 'yearly' THEN
      v_next_date := v_deadline.due_date + (v_interval || ' years')::INTERVAL;
    ELSE
      RETURN NULL;
  END CASE;

  -- Check if we should stop (endDate reached)
  IF v_deadline.recurrence_config->>'endDate' IS NOT NULL THEN
    IF v_next_date > (v_deadline.recurrence_config->>'endDate')::TIMESTAMPTZ THEN
      RETURN NULL;
    END IF;
  END IF;

  -- Create new deadline
  INSERT INTO deadlines (
    title,
    description,
    type,
    priority,
    due_date,
    due_time,
    status,
    is_recurring,
    recurrence_config,
    case_id,
    created_by,
    assigned_to
  )
  VALUES (
    v_deadline.title,
    v_deadline.description,
    v_deadline.type,
    v_deadline.priority,
    v_next_date,
    v_deadline.due_time,
    'pending',
    true,
    v_deadline.recurrence_config,
    v_deadline.case_id,
    v_deadline.created_by,
    v_deadline.assigned_to
  )
  RETURNING id INTO v_new_id;

  RETURN v_new_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_deadlines_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_deadlines_updated_at ON deadlines;
CREATE TRIGGER trigger_deadlines_updated_at
  BEFORE UPDATE ON deadlines
  FOR EACH ROW
  EXECUTE FUNCTION update_deadlines_updated_at();

-- Trigger to create history entry on changes
CREATE OR REPLACE FUNCTION create_deadline_history()
RETURNS TRIGGER AS $$
DECLARE
  v_action VARCHAR(50);
  v_changes JSONB;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
    v_changes := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := 'updated';
    v_changes := jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    );

    -- Specific actions
    IF NEW.completed_at IS NOT NULL AND OLD.completed_at IS NULL THEN
      v_action := 'completed';
    ELSIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
      v_action := 'cancelled';
    ELSIF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
      v_action := 'delegated';
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    v_action := 'deleted';
    v_changes := to_jsonb(OLD);
  END IF;

  INSERT INTO deadline_history (
    deadline_id,
    action,
    changed_by,
    changes
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    v_action,
    COALESCE(NEW.updated_by, NEW.created_by, OLD.updated_by),
    v_changes
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_deadline_history ON deadlines;
CREATE TRIGGER trigger_deadline_history
  AFTER INSERT OR UPDATE OR DELETE ON deadlines
  FOR EACH ROW
  EXECUTE FUNCTION create_deadline_history();

-- Trigger to create next recurring deadline when completed
CREATE OR REPLACE FUNCTION handle_recurring_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_recurring
     AND NEW.completed_at IS NOT NULL
     AND OLD.completed_at IS NULL THEN
    PERFORM create_next_recurring_deadline(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_recurring_completion ON deadlines;
CREATE TRIGGER trigger_recurring_completion
  AFTER UPDATE ON deadlines
  FOR EACH ROW
  EXECUTE FUNCTION handle_recurring_completion();

-- RLS Policies
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadline_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadline_history ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
DROP POLICY IF EXISTS deadlines_admin_all ON deadlines;
CREATE POLICY deadlines_admin_all ON deadlines
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lawyers can view deadlines assigned to them or their cases
DROP POLICY IF EXISTS deadlines_lawyer_select ON deadlines;
CREATE POLICY deadlines_lawyer_select ON deadlines
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'lawyer'
      AND (
        id = deadlines.assigned_to
        OR id = deadlines.created_by
        OR id IN (
          SELECT lawyer_id FROM cases WHERE id = deadlines.case_id
        )
      )
    )
  );

-- Lawyers can create and update their own deadlines
DROP POLICY IF EXISTS deadlines_lawyer_insert ON deadlines;
CREATE POLICY deadlines_lawyer_insert ON deadlines
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'lawyer'
    )
  );

DROP POLICY IF EXISTS deadlines_lawyer_update ON deadlines;
CREATE POLICY deadlines_lawyer_update ON deadlines
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role = 'lawyer'
      AND (
        id = deadlines.assigned_to
        OR id = deadlines.created_by
      )
    )
  );

-- RLS for reminders (same as deadlines)
DROP POLICY IF EXISTS deadline_reminders_admin_all ON deadline_reminders;
CREATE POLICY deadline_reminders_admin_all ON deadline_reminders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS for history (read-only for lawyers)
DROP POLICY IF EXISTS deadline_history_admin_all ON deadline_history;
CREATE POLICY deadline_history_admin_all ON deadline_history
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS deadline_history_lawyer_select ON deadline_history;
CREATE POLICY deadline_history_lawyer_select ON deadline_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN deadlines d ON d.id = deadline_history.deadline_id
      WHERE p.id = auth.uid()
      AND p.role = 'lawyer'
      AND (
        p.id = d.assigned_to
        OR p.id = d.created_by
      )
    )
  );

-- Comments
COMMENT ON TABLE deadlines IS 'Prazos processuais e tarefas com datas limite';
COMMENT ON TABLE deadline_reminders IS 'Lembretes customizáveis para prazos';
COMMENT ON TABLE deadline_history IS 'Histórico de alterações em prazos (audit trail)';

COMMENT ON COLUMN deadlines.is_recurring IS 'Se o prazo se repete automaticamente';
COMMENT ON COLUMN deadlines.recurrence_config IS 'Configuração de recorrência em JSON';
COMMENT ON COLUMN deadlines.assigned_to IS 'Advogado responsável (delegação)';
