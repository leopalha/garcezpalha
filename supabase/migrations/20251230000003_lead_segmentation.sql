-- Migration: Lead Segmentation System
-- Created: 2025-12-30
-- Description: Sistema de segmentação automática de leads baseado em comportamento

-- ============================================================================
-- TABELA DE SEGMENTOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS segments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL DEFAULT '{}',
  color TEXT DEFAULT '#3b82f6',
  priority INTEGER DEFAULT 5,
  email_sequence TEXT, -- ID da sequência a ser automaticamente atribuída
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABELA DE ATRIBUIÇÕES LEAD-SEGMENTO
-- ============================================================================

CREATE TABLE IF NOT EXISTS lead_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  segment_id TEXT REFERENCES segments(id) ON DELETE CASCADE,
  auto_assigned BOOLEAN DEFAULT true, -- Se foi atribuído automaticamente
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  removed_at TIMESTAMPTZ DEFAULT NULL,

  -- Constraints
  UNIQUE(lead_id, segment_id)
);

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_lead_segments_lead ON lead_segments(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_segments_segment ON lead_segments(segment_id);
CREATE INDEX IF NOT EXISTS idx_lead_segments_active ON lead_segments(removed_at) WHERE removed_at IS NULL;

-- ============================================================================
-- TRIGGERS PARA ATUALIZAR updated_at
-- ============================================================================

CREATE TRIGGER update_segments_updated_at
BEFORE UPDATE ON segments
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_segments ENABLE ROW LEVEL SECURITY;

-- Policies (admin pode fazer tudo)
CREATE POLICY "Admin full access to segments"
  ON segments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin full access to lead_segments"
  ON lead_segments
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- FUNÇÃO PARA CALCULAR ESTATÍSTICAS DE LEADS
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_lead_email_stats(lead_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
  total_sent INTEGER;
  total_opened INTEGER;
  total_clicked INTEGER;
BEGIN
  -- Contar emails enviados via subscriptions
  SELECT
    COUNT(ses.*) as sent,
    COUNT(*) FILTER (WHERE ses.opened_at IS NOT NULL) as opened,
    COUNT(*) FILTER (WHERE ses.clicked_at IS NOT NULL) as clicked
  INTO total_sent, total_opened, total_clicked
  FROM email_sequence_subscriptions ess
  JOIN email_sequence_sends ses ON ses.subscription_id = ess.id
  WHERE ess.lead_id = lead_uuid;

  -- Calcular taxas
  stats := jsonb_build_object(
    'totalSent', total_sent,
    'totalOpened', total_opened,
    'totalClicked', total_clicked,
    'openRate', CASE
      WHEN total_sent > 0 THEN ROUND((total_opened::numeric / total_sent * 100)::numeric, 2)
      ELSE 0
    END,
    'clickRate', CASE
      WHEN total_sent > 0 THEN ROUND((total_clicked::numeric / total_sent * 100)::numeric, 2)
      ELSE 0
    END
  );

  RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNÇÃO PARA AUTO-SEGMENTAÇÃO
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_segment_lead(lead_uuid UUID)
RETURNS TEXT[] AS $$
DECLARE
  lead_data RECORD;
  segment_data RECORD;
  matched_segments TEXT[] := ARRAY[]::TEXT[];
  email_stats JSONB;
  days_since_signup INTEGER;
  days_since_last_contact INTEGER;
BEGIN
  -- Buscar dados do lead
  SELECT * INTO lead_data
  FROM leads
  WHERE id = lead_uuid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Lead not found: %', lead_uuid;
  END IF;

  -- Calcular estatísticas de email
  email_stats := calculate_lead_email_stats(lead_uuid);

  -- Calcular dias
  days_since_signup := EXTRACT(DAY FROM NOW() - lead_data.created_at);
  days_since_last_contact := CASE
    WHEN lead_data.last_contact_at IS NOT NULL
    THEN EXTRACT(DAY FROM NOW() - lead_data.last_contact_at)
    ELSE 99999
  END;

  -- Iterar sobre segmentos ativos
  FOR segment_data IN
    SELECT * FROM segments WHERE is_active = true ORDER BY priority ASC
  LOOP
    DECLARE
      matches BOOLEAN := true;
      criteria JSONB := segment_data.criteria;
    BEGIN
      -- Verificar score
      IF criteria->>'scoreMin' IS NOT NULL AND
         lead_data.score < (criteria->>'scoreMin')::INTEGER THEN
        matches := false;
      END IF;

      IF criteria->>'scoreMax' IS NOT NULL AND
         lead_data.score > (criteria->>'scoreMax')::INTEGER THEN
        matches := false;
      END IF;

      -- Verificar openRate
      IF criteria->'openRate'->>'min' IS NOT NULL AND
         (email_stats->>'openRate')::NUMERIC < (criteria->'openRate'->>'min')::NUMERIC THEN
        matches := false;
      END IF;

      IF criteria->'openRate'->>'max' IS NOT NULL AND
         (email_stats->>'openRate')::NUMERIC > (criteria->'openRate'->>'max')::NUMERIC THEN
        matches := false;
      END IF;

      -- Verificar clickRate
      IF criteria->'clickRate'->>'min' IS NOT NULL AND
         (email_stats->>'clickRate')::NUMERIC < (criteria->'clickRate'->>'min')::NUMERIC THEN
        matches := false;
      END IF;

      -- Verificar daysSinceSignup
      IF criteria->'daysSinceSignup'->>'max' IS NOT NULL AND
         days_since_signup > (criteria->'daysSinceSignup'->>'max')::INTEGER THEN
        matches := false;
      END IF;

      -- Verificar daysSinceLastContact
      IF criteria->'daysSinceLastContact'->>'min' IS NOT NULL AND
         days_since_last_contact < (criteria->'daysSinceLastContact'->>'min')::INTEGER THEN
        matches := false;
      END IF;

      IF criteria->'daysSinceLastContact'->>'max' IS NOT NULL AND
         days_since_last_contact > (criteria->'daysSinceLastContact'->>'max')::INTEGER THEN
        matches := false;
      END IF;

      -- Se matched, adicionar ao segmento
      IF matches THEN
        matched_segments := array_append(matched_segments, segment_data.id);

        -- Inserir atribuição (se não existir)
        INSERT INTO lead_segments (lead_id, segment_id, auto_assigned)
        VALUES (lead_uuid, segment_data.id, true)
        ON CONFLICT (lead_id, segment_id) DO NOTHING;

        -- Auto-subscrever em sequência se aplicável
        IF segment_data.email_sequence IS NOT NULL THEN
          INSERT INTO email_sequence_subscriptions (lead_id, sequence_id, status)
          VALUES (lead_uuid, segment_data.email_sequence, 'active')
          ON CONFLICT (lead_id, sequence_id) DO NOTHING;
        END IF;
      END IF;
    END;
  END LOOP;

  RETURN matched_segments;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- DADOS INICIAIS (SEGMENTOS PRÉ-DEFINIDOS)
-- ============================================================================

INSERT INTO segments (id, name, description, criteria, color, priority, email_sequence)
VALUES
  (
    'hot-leads',
    'Hot Leads',
    'Leads altamente engajados com score 80+',
    '{
      "scoreMin": 80,
      "openRate": {"min": 60},
      "daysSinceLastContact": {"max": 3}
    }'::jsonb,
    '#ef4444',
    1,
    'upsell-sequence'
  ),
  (
    'warm-leads',
    'Warm Leads',
    'Leads engajados com score 50-79',
    '{
      "scoreMin": 50,
      "scoreMax": 79,
      "openRate": {"min": 30},
      "daysSinceLastContact": {"max": 7}
    }'::jsonb,
    '#f59e0b',
    2,
    'welcome-sequence'
  ),
  (
    'cold-leads',
    'Cold Leads',
    'Leads com baixo engajamento (score < 50)',
    '{
      "scoreMax": 49,
      "openRate": {"max": 20}
    }'::jsonb,
    '#3b82f6',
    3,
    'nurture-sequence'
  ),
  (
    'dormant-leads',
    'Dormant Leads',
    'Leads inativos há 30+ dias',
    '{
      "daysSinceLastContact": {"min": 30},
      "hasConverted": false
    }'::jsonb,
    '#6b7280',
    4,
    'reengagement-sequence'
  ),
  (
    'high-intent',
    'High Intent',
    'Leads com múltiplos cliques e visitas recentes',
    '{
      "clickRate": {"min": 15},
      "daysSinceLastContact": {"max": 2},
      "hasConverted": false
    }'::jsonb,
    '#8b5cf6',
    1,
    'upsell-sequence'
  ),
  (
    'converted',
    'Converted Customers',
    'Leads que já converteram',
    '{
      "hasConverted": true
    }'::jsonb,
    '#10b981',
    5,
    NULL
  ),
  (
    'at-risk',
    'At Risk',
    'Clientes que pararam de engajar',
    '{
      "hasConverted": true,
      "daysSinceLastContact": {"min": 14},
      "openRate": {"max": 10}
    }'::jsonb,
    '#dc2626',
    1,
    'reengagement-sequence'
  ),
  (
    'new-signups',
    'New Signups',
    'Leads cadastrados nos últimos 7 dias',
    '{
      "daysSinceSignup": {"max": 7}
    }'::jsonb,
    '#06b6d4',
    2,
    'welcome-sequence'
  )
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE segments IS 'Segmentos de leads com critérios automáticos de classificação';
COMMENT ON TABLE lead_segments IS 'Atribuições de leads a segmentos';
COMMENT ON FUNCTION calculate_lead_email_stats IS 'Calcula estatísticas de email (open rate, click rate) de um lead';
COMMENT ON FUNCTION auto_segment_lead IS 'Segmenta automaticamente um lead baseado em critérios pré-definidos';
