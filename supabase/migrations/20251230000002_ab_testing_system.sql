-- Migration: A/B Testing System for Email Sequences
-- Created: 2025-12-30
-- Description: Tabelas para gerenciar testes A/B de subject lines e conteúdo

-- ============================================================================
-- TABELA DE TESTES A/B
-- ============================================================================

CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  sequence_id TEXT NOT NULL,
  step_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, running, paused, completed
  config JSONB NOT NULL DEFAULT '{
    "trafficSplit": [50, 50],
    "minSampleSize": 100,
    "confidenceLevel": 0.95
  }'::jsonb,
  results JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT ab_tests_status_check CHECK (status IN ('draft', 'running', 'paused', 'completed'))
);

-- ============================================================================
-- TABELA DE VARIANTES (A/B/C...)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ab_test_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Control", "Variant A", "Variant B"
  subject TEXT NOT NULL,
  content TEXT, -- Email body se for testar conteúdo também
  stats JSONB DEFAULT '{
    "sent": 0,
    "delivered": 0,
    "opened": 0,
    "clicked": 0,
    "converted": 0,
    "openRate": 0,
    "clickRate": 0,
    "conversionRate": 0
  }'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABELA DE ATRIBUIÇÕES (qual lead recebeu qual variante)
-- ============================================================================

CREATE TABLE IF NOT EXISTS ab_test_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES ab_test_variants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  events JSONB DEFAULT '{}',
  assigned_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(test_id, lead_id) -- Um lead só pode ter uma variante por teste
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_sequence ON ab_tests(sequence_id);
CREATE INDEX IF NOT EXISTS idx_ab_variants_test ON ab_test_variants(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_assignments_test ON ab_test_assignments(test_id);
CREATE INDEX IF NOT EXISTS idx_ab_assignments_lead ON ab_test_assignments(lead_id);
CREATE INDEX IF NOT EXISTS idx_ab_assignments_variant ON ab_test_assignments(variant_id);

-- ============================================================================
-- TRIGGERS PARA ATUALIZAR updated_at
-- ============================================================================

CREATE TRIGGER update_ab_tests_updated_at
BEFORE UPDATE ON ab_tests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_variants_updated_at
BEFORE UPDATE ON ab_test_variants
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_assignments ENABLE ROW LEVEL SECURITY;

-- Policies (admin pode fazer tudo)
CREATE POLICY "Admin full access to ab_tests"
  ON ab_tests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access to ab_test_variants"
  ON ab_test_variants
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access to ab_test_assignments"
  ON ab_test_assignments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- FUNÇÃO PARA CALCULAR ESTATÍSTICAS DE VARIANTE
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_variant_stats(variant_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
  total_sent INTEGER;
  total_delivered INTEGER;
  total_opened INTEGER;
  total_clicked INTEGER;
  total_converted INTEGER;
BEGIN
  -- Contar eventos
  SELECT
    COUNT(*) as sent,
    COUNT(*) FILTER (WHERE events->>'delivered' IS NOT NULL) as delivered,
    COUNT(*) FILTER (WHERE events->>'opened' IS NOT NULL) as opened,
    COUNT(*) FILTER (WHERE events->>'clicked' IS NOT NULL) as clicked,
    COUNT(*) FILTER (WHERE events->>'converted' IS NOT NULL) as converted
  INTO total_sent, total_delivered, total_opened, total_clicked, total_converted
  FROM ab_test_assignments
  WHERE variant_id = variant_uuid;

  -- Calcular taxas
  stats := jsonb_build_object(
    'sent', total_sent,
    'delivered', total_delivered,
    'opened', total_opened,
    'clicked', total_clicked,
    'converted', total_converted,
    'openRate', CASE
      WHEN total_delivered > 0 THEN ROUND((total_opened::numeric / total_delivered * 100)::numeric, 2)
      ELSE 0
    END,
    'clickRate', CASE
      WHEN total_delivered > 0 THEN ROUND((total_clicked::numeric / total_delivered * 100)::numeric, 2)
      ELSE 0
    END,
    'conversionRate', CASE
      WHEN total_delivered > 0 THEN ROUND((total_converted::numeric / total_delivered * 100)::numeric, 2)
      ELSE 0
    END
  );

  RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNÇÃO PARA ATUALIZAR STATS AUTOMATICAMENTE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_variant_stats_trigger()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE ab_test_variants
  SET stats = calculate_variant_stats(NEW.variant_id)
  WHERE id = NEW.variant_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_variant_stats_on_assignment
AFTER INSERT OR UPDATE ON ab_test_assignments
FOR EACH ROW
EXECUTE FUNCTION update_variant_stats_trigger();

-- ============================================================================
-- DADOS INICIAIS (EXEMPLO DE TESTE A/B)
-- ============================================================================

-- Criar teste de exemplo
INSERT INTO ab_tests (id, name, description, sequence_id, step_id, status, config)
VALUES (
  'ab-test-welcome-1',
  'Teste A/B: Welcome Email Subject',
  'Testar qual subject line tem melhor open rate no primeiro email de boas-vindas',
  'welcome-sequence',
  'welcome-1',
  'draft',
  '{
    "trafficSplit": [50, 50],
    "minSampleSize": 100,
    "confidenceLevel": 0.95
  }'::jsonb
);

-- Criar variantes
INSERT INTO ab_test_variants (test_id, name, subject)
VALUES
  (
    'ab-test-welcome-1',
    'Control',
    '{{firstName}}, bem-vindo à Garcez Palha! Seus direitos começam aqui'
  ),
  (
    'ab-test-welcome-1',
    'Variant A',
    '{{firstName}}, você tem direitos que nem imagina! Descubra quais'
  );

COMMENT ON TABLE ab_tests IS 'Testes A/B para subject lines e conteúdo de emails';
COMMENT ON TABLE ab_test_variants IS 'Variantes de cada teste A/B (control, variant A, B, C...)';
COMMENT ON TABLE ab_test_assignments IS 'Registro de qual lead recebeu qual variante';
COMMENT ON FUNCTION calculate_variant_stats IS 'Calcula estatísticas (open rate, click rate, conversion) de uma variante';
