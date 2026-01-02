-- ============================================================================
-- PJe / e-SAJ INTEGRATION SYSTEM
-- Sistema de integração com tribunais brasileiros para consulta processual
-- ============================================================================

-- Create court_integrations table (configuration for each court)
CREATE TABLE IF NOT EXISTS court_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Court info
  court_name VARCHAR(255) NOT NULL,
  court_code VARCHAR(50) NOT NULL, -- TJ-SP, TRF1, TST, etc.
  court_type VARCHAR(50) NOT NULL, -- 'pje', 'esaj', 'projudi', 'eproc'

  -- API Configuration
  api_endpoint TEXT NOT NULL,
  api_version VARCHAR(20),
  requires_certificate BOOLEAN DEFAULT true,

  -- Authentication
  auth_type VARCHAR(50), -- 'certificate', 'token', 'oauth'
  certificate_id UUID REFERENCES digital_certificates(id),
  api_token TEXT, -- Encrypted
  oauth_config JSONB,

  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive', 'error'
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create process_queries table (consultas processuais)
CREATE TABLE IF NOT EXISTS process_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Process identification
  process_number VARCHAR(50) NOT NULL, -- CNJ unified format
  court_code VARCHAR(50) NOT NULL,

  -- Query details
  query_type VARCHAR(50) DEFAULT 'full', -- 'full', 'movements', 'deadlines', 'parties'

  -- Results
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'success', 'not_found', 'error'
  raw_response JSONB, -- Full API response
  parsed_data JSONB, -- Structured data

  -- Extracted information
  process_status VARCHAR(100),
  process_class VARCHAR(100), -- Classe processual
  process_subject TEXT, -- Assunto
  distribution_date DATE,
  last_movement_date DATE,

  -- Associations
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  requested_by UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Create process_movements table (movimentações processuais)
CREATE TABLE IF NOT EXISTS process_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES process_queries(id) ON DELETE CASCADE NOT NULL,

  -- Movement details
  movement_date TIMESTAMPTZ NOT NULL,
  movement_code VARCHAR(20), -- Código da movimentação (tabela CNJ)
  movement_description TEXT NOT NULL,
  movement_type VARCHAR(100),

  -- Associated document
  document_type VARCHAR(100),
  document_url TEXT,

  -- Metadata
  sequence_number INT, -- Order in process
  is_decision BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create process_parties table (partes do processo)
CREATE TABLE IF NOT EXISTS process_parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES process_queries(id) ON DELETE CASCADE NOT NULL,

  -- Party details
  party_type VARCHAR(50) NOT NULL, -- 'author', 'defendant', 'lawyer', 'other'
  party_role VARCHAR(100), -- Polo Ativo/Passivo, Terceiro, etc.
  party_name VARCHAR(255) NOT NULL,
  party_document VARCHAR(20), -- CPF/CNPJ

  -- Lawyer info (if party is lawyer)
  oab_number VARCHAR(20),
  oab_state VARCHAR(2),

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create process_deadlines_extracted table (prazos extraídos)
CREATE TABLE IF NOT EXISTS process_deadlines_extracted (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_id UUID REFERENCES process_queries(id) ON DELETE CASCADE NOT NULL,

  -- Deadline info
  deadline_type VARCHAR(100) NOT NULL,
  deadline_description TEXT,
  due_date DATE NOT NULL,
  publication_date DATE,

  -- Status
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'expired'

  -- Link to internal deadline (if created)
  deadline_id UUID REFERENCES deadlines(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_court_integrations_code ON court_integrations(court_code);
CREATE INDEX IF NOT EXISTS idx_court_integrations_status ON court_integrations(status);

CREATE INDEX IF NOT EXISTS idx_process_queries_number ON process_queries(process_number);
CREATE INDEX IF NOT EXISTS idx_process_queries_status ON process_queries(status);
CREATE INDEX IF NOT EXISTS idx_process_queries_case ON process_queries(case_id);
CREATE INDEX IF NOT EXISTS idx_process_queries_created ON process_queries(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_process_movements_query ON process_movements(query_id);
CREATE INDEX IF NOT EXISTS idx_process_movements_date ON process_movements(movement_date DESC);

CREATE INDEX IF NOT EXISTS idx_process_parties_query ON process_parties(query_id);
CREATE INDEX IF NOT EXISTS idx_process_parties_type ON process_parties(party_type);

CREATE INDEX IF NOT EXISTS idx_process_deadlines_query ON process_deadlines_extracted(query_id);
CREATE INDEX IF NOT EXISTS idx_process_deadlines_status ON process_deadlines_extracted(status);
CREATE INDEX IF NOT EXISTS idx_process_deadlines_due ON process_deadlines_extracted(due_date);

-- Function to extract deadlines from movements
CREATE OR REPLACE FUNCTION extract_deadlines_from_query(p_query_id UUID)
RETURNS INT AS $$
DECLARE
  v_count INT := 0;
  v_movement RECORD;
  v_deadline_keywords TEXT[] := ARRAY['prazo', 'intimação', 'manifestar', 'cumprir', 'apresentar'];
BEGIN
  -- Look for movements that indicate deadlines
  FOR v_movement IN
    SELECT *
    FROM process_movements
    WHERE query_id = p_query_id
      AND movement_date >= CURRENT_DATE - INTERVAL '30 days'
      AND (
        movement_description ILIKE ANY(ARRAY['%prazo%', '%intimação%', '%intimacao%'])
        OR is_decision = true
      )
  LOOP
    -- Try to extract deadline date (this is simplified - real implementation needs NLP)
    -- For now, we assume deadline is 15 days from movement date
    INSERT INTO process_deadlines_extracted (
      query_id,
      deadline_type,
      deadline_description,
      due_date,
      publication_date,
      status
    )
    VALUES (
      p_query_id,
      v_movement.movement_type,
      v_movement.movement_description,
      (v_movement.movement_date::DATE + INTERVAL '15 days')::DATE,
      v_movement.movement_date::DATE,
      'active'
    )
    ON CONFLICT DO NOTHING;

    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_process_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_court_integrations_updated ON court_integrations;
CREATE TRIGGER trigger_court_integrations_updated
  BEFORE UPDATE ON court_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_process_updated_at();

DROP TRIGGER IF EXISTS trigger_process_queries_updated ON process_queries;
CREATE TRIGGER trigger_process_queries_updated
  BEFORE UPDATE ON process_queries
  FOR EACH ROW
  EXECUTE FUNCTION update_process_updated_at();

-- RLS Policies
ALTER TABLE court_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_deadlines_extracted ENABLE ROW LEVEL SECURITY;

-- Only admins can manage court integrations
DROP POLICY IF EXISTS court_integrations_admin_all ON court_integrations;
CREATE POLICY court_integrations_admin_all ON court_integrations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins and lawyers can query processes
DROP POLICY IF EXISTS process_queries_admin_lawyer ON process_queries;
CREATE POLICY process_queries_admin_lawyer ON process_queries
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Read-only access to movements, parties, deadlines
DROP POLICY IF EXISTS process_movements_read ON process_movements;
CREATE POLICY process_movements_read ON process_movements
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

DROP POLICY IF EXISTS process_parties_read ON process_parties;
CREATE POLICY process_parties_read ON process_parties
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

DROP POLICY IF EXISTS process_deadlines_read ON process_deadlines_extracted;
CREATE POLICY process_deadlines_read ON process_deadlines_extracted
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Comments
COMMENT ON TABLE court_integrations IS 'Configuração de integração com tribunais (PJe, e-SAJ, etc)';
COMMENT ON TABLE process_queries IS 'Consultas processuais realizadas';
COMMENT ON TABLE process_movements IS 'Movimentações processuais extraídas';
COMMENT ON TABLE process_parties IS 'Partes do processo (autores, réus, advogados)';
COMMENT ON TABLE process_deadlines_extracted IS 'Prazos extraídos automaticamente das movimentações';

COMMENT ON COLUMN court_integrations.court_type IS 'Tipo de sistema: pje, esaj, projudi, eproc';
COMMENT ON COLUMN process_queries.process_number IS 'Número do processo no formato CNJ unificado';
COMMENT ON COLUMN process_movements.movement_code IS 'Código da movimentação conforme tabela CNJ';
