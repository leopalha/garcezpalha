-- Migration: Add lawyer management fields
-- Description: Adds fields to profiles table for lawyer management and specialties
-- Date: 2026-01-01

-- Add lawyer-specific fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS oab_number TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS oab_state TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS specialties TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_oab ON profiles(oab_number, oab_state);
CREATE INDEX IF NOT EXISTS idx_profiles_specialties ON profiles USING GIN(specialties);

-- Create lawyer_statistics table for caching computed stats
CREATE TABLE IF NOT EXISTS lawyer_statistics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lawyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  active_cases INTEGER DEFAULT 0,
  completed_cases INTEGER DEFAULT 0,
  total_cases INTEGER DEFAULT 0,
  workload_percentage INTEGER DEFAULT 0,
  success_rate INTEGER DEFAULT 0,
  avg_case_duration INTEGER DEFAULT 0, -- in days
  client_satisfaction DECIMAL(3,2) DEFAULT 0.00, -- 0.00 to 5.00
  last_calculated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on lawyer_id
CREATE INDEX IF NOT EXISTS idx_lawyer_statistics_lawyer ON lawyer_statistics(lawyer_id);

-- Function to calculate lawyer statistics
CREATE OR REPLACE FUNCTION calculate_lawyer_statistics(p_lawyer_id UUID)
RETURNS void AS $$
DECLARE
  v_active_cases INTEGER;
  v_completed_cases INTEGER;
  v_total_cases INTEGER;
  v_workload_percentage INTEGER;
  v_success_rate INTEGER;
BEGIN
  -- Count active cases
  SELECT COUNT(*) INTO v_active_cases
  FROM cases
  WHERE lawyer_id = p_lawyer_id
    AND status IN ('aguardando_documentos', 'em_analise', 'em_andamento');

  -- Count completed cases
  SELECT COUNT(*) INTO v_completed_cases
  FROM cases
  WHERE lawyer_id = p_lawyer_id
    AND status = 'concluido';

  -- Count total cases
  SELECT COUNT(*) INTO v_total_cases
  FROM cases
  WHERE lawyer_id = p_lawyer_id;

  -- Calculate workload percentage (max 20 active cases = 100%)
  v_workload_percentage := LEAST(ROUND((v_active_cases::DECIMAL / 20) * 100), 100);

  -- Calculate success rate
  IF v_total_cases > 0 THEN
    v_success_rate := ROUND((v_completed_cases::DECIMAL / v_total_cases) * 100);
  ELSE
    v_success_rate := 0;
  END IF;

  -- Insert or update statistics
  INSERT INTO lawyer_statistics (
    lawyer_id,
    active_cases,
    completed_cases,
    total_cases,
    workload_percentage,
    success_rate,
    last_calculated_at
  ) VALUES (
    p_lawyer_id,
    v_active_cases,
    v_completed_cases,
    v_total_cases,
    v_workload_percentage,
    v_success_rate,
    NOW()
  )
  ON CONFLICT (lawyer_id) DO UPDATE SET
    active_cases = EXCLUDED.active_cases,
    completed_cases = EXCLUDED.completed_cases,
    total_cases = EXCLUDED.total_cases,
    workload_percentage = EXCLUDED.workload_percentage,
    success_rate = EXCLUDED.success_rate,
    last_calculated_at = NOW(),
    updated_at = NOW();

END;
$$ LANGUAGE plpgsql;

-- Trigger to recalculate statistics when a case is created, updated, or deleted
CREATE OR REPLACE FUNCTION trigger_recalculate_lawyer_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Handle INSERT and UPDATE
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    IF NEW.lawyer_id IS NOT NULL THEN
      PERFORM calculate_lawyer_statistics(NEW.lawyer_id);
    END IF;
  END IF;

  -- Handle DELETE and UPDATE (when lawyer changes)
  IF (TG_OP = 'DELETE') THEN
    IF OLD.lawyer_id IS NOT NULL THEN
      PERFORM calculate_lawyer_statistics(OLD.lawyer_id);
    END IF;
  ELSIF (TG_OP = 'UPDATE' AND OLD.lawyer_id IS NOT NULL AND OLD.lawyer_id != NEW.lawyer_id) THEN
    PERFORM calculate_lawyer_statistics(OLD.lawyer_id);
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger on cases table
DROP TRIGGER IF EXISTS trigger_cases_recalculate_lawyer_stats ON cases;
CREATE TRIGGER trigger_cases_recalculate_lawyer_stats
  AFTER INSERT OR UPDATE OR DELETE ON cases
  FOR EACH ROW
  EXECUTE FUNCTION trigger_recalculate_lawyer_stats();

-- Create case_assignments table for tracking case reassignments
CREATE TABLE IF NOT EXISTS case_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID REFERENCES cases(id) ON DELETE CASCADE NOT NULL,
  from_lawyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  to_lawyer_id UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  assigned_by UUID REFERENCES profiles(id) ON DELETE SET NULL NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for case_assignments
CREATE INDEX IF NOT EXISTS idx_case_assignments_case ON case_assignments(case_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_from_lawyer ON case_assignments(from_lawyer_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_to_lawyer ON case_assignments(to_lawyer_id);
CREATE INDEX IF NOT EXISTS idx_case_assignments_created ON case_assignments(created_at DESC);

-- RLS policies for lawyer_statistics
ALTER TABLE lawyer_statistics ENABLE ROW LEVEL SECURITY;

-- Admins can view all statistics
DROP POLICY IF EXISTS lawyer_statistics_admin_select ON lawyer_statistics;
CREATE POLICY lawyer_statistics_admin_select ON lawyer_statistics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lawyers can view their own statistics
DROP POLICY IF EXISTS lawyer_statistics_lawyer_select ON lawyer_statistics;
CREATE POLICY lawyer_statistics_lawyer_select ON lawyer_statistics
  FOR SELECT
  USING (lawyer_id = auth.uid());

-- RLS policies for case_assignments
ALTER TABLE case_assignments ENABLE ROW LEVEL SECURITY;

-- Admins can view all assignments
DROP POLICY IF EXISTS case_assignments_admin_select ON case_assignments;
CREATE POLICY case_assignments_admin_select ON case_assignments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lawyers can view assignments involving them
DROP POLICY IF EXISTS case_assignments_lawyer_select ON case_assignments;
CREATE POLICY case_assignments_lawyer_select ON case_assignments
  FOR SELECT
  USING (
    from_lawyer_id = auth.uid() OR to_lawyer_id = auth.uid()
  );

-- Only admins can create assignments
DROP POLICY IF EXISTS case_assignments_admin_insert ON case_assignments;
CREATE POLICY case_assignments_admin_insert ON case_assignments
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Calculate initial statistics for all existing lawyers
DO $$
DECLARE
  lawyer_record RECORD;
BEGIN
  FOR lawyer_record IN
    SELECT id FROM profiles WHERE role IN ('admin', 'lawyer')
  LOOP
    PERFORM calculate_lawyer_statistics(lawyer_record.id);
  END LOOP;
END $$;

-- Add comments
COMMENT ON COLUMN profiles.oab_number IS 'Número da OAB do advogado';
COMMENT ON COLUMN profiles.oab_state IS 'Estado da OAB (UF)';
COMMENT ON COLUMN profiles.specialties IS 'Array de especialidades jurídicas';
COMMENT ON COLUMN profiles.bio IS 'Biografia/descrição do advogado';
COMMENT ON COLUMN profiles.location IS 'Localização do advogado (cidade/estado)';
COMMENT ON COLUMN profiles.status IS 'Status do advogado: active, inactive, on_leave';

COMMENT ON TABLE lawyer_statistics IS 'Estatísticas calculadas para cada advogado';
COMMENT ON TABLE case_assignments IS 'Histórico de atribuições e reatribuições de casos';
