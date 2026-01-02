-- ============================================================================
-- AI DOCUMENT ANALYSIS SYSTEM
-- Sistema de análise inteligente de documentos com OCR e extração de dados
-- ============================================================================

-- Create document_analysis table
CREATE TABLE IF NOT EXISTS document_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,

  -- Analysis status
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'

  -- OCR results
  ocr_text TEXT, -- Full extracted text
  ocr_confidence DECIMAL(5,2), -- Confidence score 0-100
  ocr_language VARCHAR(10) DEFAULT 'pt', -- Detected language

  -- Document classification
  document_type VARCHAR(100), -- 'rg', 'cpf', 'cnpj', 'contrato', 'procuracao', 'peticao', etc
  classification_confidence DECIMAL(5,2),

  -- Extracted structured data
  extracted_data JSONB, -- CPF, CNPJ, dates, amounts, names, etc

  -- Document validation
  is_valid BOOLEAN,
  validation_errors JSONB, -- Array of validation errors

  -- AI summary
  summary TEXT, -- Brief summary of document content
  key_points JSONB, -- Array of key points

  -- Metadata
  processing_time_ms INT, -- Time taken to process
  ai_provider VARCHAR(50) DEFAULT 'openai', -- 'openai', 'google', 'aws', 'azure'
  model_version VARCHAR(50),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- Create document_entities table (extracted entities)
CREATE TABLE IF NOT EXISTS document_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES document_analysis(id) ON DELETE CASCADE NOT NULL,

  -- Entity details
  entity_type VARCHAR(50) NOT NULL, -- 'person', 'cpf', 'cnpj', 'date', 'amount', 'address', 'phone', 'email', 'oab'
  entity_value TEXT NOT NULL,
  entity_label VARCHAR(100), -- User-friendly label

  -- Position in document
  page_number INT,
  position_start INT,
  position_end INT,

  -- Confidence
  confidence DECIMAL(5,2),

  -- Validation
  is_valid BOOLEAN DEFAULT true,
  validation_note TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create document_comparisons table (compare documents)
CREATE TABLE IF NOT EXISTS document_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Documents being compared
  document_a_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  document_b_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,

  -- Comparison results
  similarity_score DECIMAL(5,2), -- 0-100
  differences JSONB, -- Array of differences found
  matching_sections JSONB, -- Sections that match

  -- Status
  status VARCHAR(50) DEFAULT 'completed',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_processing_queue table (async processing)
CREATE TABLE IF NOT EXISTS ai_processing_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Task details
  task_type VARCHAR(50) NOT NULL, -- 'ocr', 'classify', 'extract', 'summarize', 'compare', 'validate'
  resource_type VARCHAR(50) NOT NULL, -- 'document', 'case', 'contract'
  resource_id UUID NOT NULL,

  -- Processing
  status VARCHAR(50) DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed', 'cancelled'
  priority INT DEFAULT 5, -- 1-10 (1 = highest)

  -- Input data
  input_data JSONB,

  -- Results
  result_data JSONB,
  error_message TEXT,

  -- Retry logic
  attempts INT DEFAULT 0,
  max_attempts INT DEFAULT 3,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_document_analysis_document ON document_analysis(document_id);
CREATE INDEX IF NOT EXISTS idx_document_analysis_status ON document_analysis(status);
CREATE INDEX IF NOT EXISTS idx_document_analysis_type ON document_analysis(document_type);

CREATE INDEX IF NOT EXISTS idx_document_entities_analysis ON document_entities(analysis_id);
CREATE INDEX IF NOT EXISTS idx_document_entities_type ON document_entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_document_entities_value ON document_entities(entity_value);

CREATE INDEX IF NOT EXISTS idx_document_comparisons_doc_a ON document_comparisons(document_a_id);
CREATE INDEX IF NOT EXISTS idx_document_comparisons_doc_b ON document_comparisons(document_b_id);

CREATE INDEX IF NOT EXISTS idx_ai_queue_status ON ai_processing_queue(status);
CREATE INDEX IF NOT EXISTS idx_ai_queue_priority ON ai_processing_queue(priority DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_ai_queue_retry ON ai_processing_queue(next_retry_at) WHERE status = 'failed';

-- Function to validate CPF
CREATE OR REPLACE FUNCTION validate_cpf(cpf TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  cleaned_cpf TEXT;
  digit1 INT;
  digit2 INT;
  sum INT;
  i INT;
BEGIN
  -- Remove non-digits
  cleaned_cpf := regexp_replace(cpf, '[^0-9]', '', 'g');

  -- Check length
  IF length(cleaned_cpf) != 11 THEN
    RETURN FALSE;
  END IF;

  -- Check for known invalid CPFs
  IF cleaned_cpf IN ('00000000000', '11111111111', '22222222222', '33333333333',
                     '44444444444', '55555555555', '66666666666', '77777777777',
                     '88888888888', '99999999999') THEN
    RETURN FALSE;
  END IF;

  -- Calculate first digit
  sum := 0;
  FOR i IN 1..9 LOOP
    sum := sum + (substring(cleaned_cpf, i, 1)::INT * (11 - i));
  END LOOP;
  digit1 := 11 - (sum % 11);
  IF digit1 >= 10 THEN
    digit1 := 0;
  END IF;

  -- Calculate second digit
  sum := 0;
  FOR i IN 1..10 LOOP
    sum := sum + (substring(cleaned_cpf, i, 1)::INT * (12 - i));
  END LOOP;
  digit2 := 11 - (sum % 11);
  IF digit2 >= 10 THEN
    digit2 := 0;
  END IF;

  -- Validate
  RETURN substring(cleaned_cpf, 10, 1)::INT = digit1
     AND substring(cleaned_cpf, 11, 1)::INT = digit2;
END;
$$ LANGUAGE plpgsql;

-- Function to validate CNPJ
CREATE OR REPLACE FUNCTION validate_cnpj(cnpj TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  cleaned_cnpj TEXT;
  digit1 INT;
  digit2 INT;
  sum INT;
  i INT;
  multiplier INT;
BEGIN
  -- Remove non-digits
  cleaned_cnpj := regexp_replace(cnpj, '[^0-9]', '', 'g');

  -- Check length
  IF length(cleaned_cnpj) != 14 THEN
    RETURN FALSE;
  END IF;

  -- Check for known invalid CNPJs
  IF cleaned_cnpj IN ('00000000000000', '11111111111111', '22222222222222', '33333333333333',
                      '44444444444444', '55555555555555', '66666666666666', '77777777777777',
                      '88888888888888', '99999999999999') THEN
    RETURN FALSE;
  END IF;

  -- Calculate first digit
  sum := 0;
  multiplier := 5;
  FOR i IN 1..12 LOOP
    sum := sum + (substring(cleaned_cnpj, i, 1)::INT * multiplier);
    multiplier := multiplier - 1;
    IF multiplier < 2 THEN
      multiplier := 9;
    END IF;
  END LOOP;
  digit1 := 11 - (sum % 11);
  IF digit1 >= 10 THEN
    digit1 := 0;
  END IF;

  -- Calculate second digit
  sum := 0;
  multiplier := 6;
  FOR i IN 1..13 LOOP
    sum := sum + (substring(cleaned_cnpj, i, 1)::INT * multiplier);
    multiplier := multiplier - 1;
    IF multiplier < 2 THEN
      multiplier := 9;
    END IF;
  END LOOP;
  digit2 := 11 - (sum % 11);
  IF digit2 >= 10 THEN
    digit2 := 0;
  END IF;

  -- Validate
  RETURN substring(cleaned_cnpj, 13, 1)::INT = digit1
     AND substring(cleaned_cnpj, 14, 1)::INT = digit2;
END;
$$ LANGUAGE plpgsql;

-- Function to extract and validate CPFs from text
CREATE OR REPLACE FUNCTION extract_cpfs(text_content TEXT)
RETURNS TABLE(cpf TEXT, is_valid BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DISTINCT regexp_replace(match[1], '[^0-9]', '', 'g') as cpf,
    validate_cpf(regexp_replace(match[1], '[^0-9]', '', 'g')) as is_valid
  FROM regexp_matches(text_content, '(\d{3}\.?\d{3}\.?\d{3}-?\d{2})', 'g') as match
  WHERE length(regexp_replace(match[1], '[^0-9]', '', 'g')) = 11;
END;
$$ LANGUAGE plpgsql;

-- Function to extract and validate CNPJs from text
CREATE OR REPLACE FUNCTION extract_cnpjs(text_content TEXT)
RETURNS TABLE(cnpj TEXT, is_valid BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DISTINCT regexp_replace(match[1], '[^0-9]', '', 'g') as cnpj,
    validate_cnpj(regexp_replace(match[1], '[^0-9]', '', 'g')) as is_valid
  FROM regexp_matches(text_content, '(\d{2}\.?\d{3}\.?\d{3}/?\d{4}-?\d{2})', 'g') as match
  WHERE length(regexp_replace(match[1], '[^0-9]', '', 'g')) = 14;
END;
$$ LANGUAGE plpgsql;

-- Function to get next queued task
CREATE OR REPLACE FUNCTION get_next_ai_task()
RETURNS UUID AS $$
DECLARE
  task_id UUID;
BEGIN
  -- Get highest priority queued task or failed task ready for retry
  SELECT id INTO task_id
  FROM ai_processing_queue
  WHERE (status = 'queued' OR (status = 'failed' AND next_retry_at <= NOW()))
    AND attempts < max_attempts
  ORDER BY priority DESC, created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED;

  -- Update to processing
  IF task_id IS NOT NULL THEN
    UPDATE ai_processing_queue
    SET status = 'processing',
        started_at = NOW(),
        attempts = attempts + 1
    WHERE id = task_id;
  END IF;

  RETURN task_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update completed_at
CREATE OR REPLACE FUNCTION update_analysis_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_analysis_completed ON document_analysis;
CREATE TRIGGER trigger_analysis_completed
  BEFORE UPDATE ON document_analysis
  FOR EACH ROW
  EXECUTE FUNCTION update_analysis_completed_at();

DROP TRIGGER IF EXISTS trigger_ai_queue_completed ON ai_processing_queue;
CREATE TRIGGER trigger_ai_queue_completed
  BEFORE UPDATE ON ai_processing_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_analysis_completed_at();

-- RLS Policies
ALTER TABLE document_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_processing_queue ENABLE ROW LEVEL SECURITY;

-- Users can see analysis of their own documents
DROP POLICY IF EXISTS document_analysis_own ON document_analysis;
CREATE POLICY document_analysis_own ON document_analysis
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM documents
      WHERE id = document_analysis.document_id
        AND user_id = auth.uid()
    )
  );

-- Admins and lawyers can see all analyses
DROP POLICY IF EXISTS document_analysis_admin_lawyer ON document_analysis;
CREATE POLICY document_analysis_admin_lawyer ON document_analysis
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Similar policies for entities
DROP POLICY IF EXISTS document_entities_own ON document_entities;
CREATE POLICY document_entities_own ON document_entities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM document_analysis da
      JOIN documents d ON d.id = da.document_id
      WHERE da.id = document_entities.analysis_id
        AND d.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS document_entities_admin_lawyer ON document_entities;
CREATE POLICY document_entities_admin_lawyer ON document_entities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Only admins can manage AI queue
DROP POLICY IF EXISTS ai_queue_admin ON ai_processing_queue;
CREATE POLICY ai_queue_admin ON ai_processing_queue
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Comments
COMMENT ON TABLE document_analysis IS 'Análise inteligente de documentos com OCR e extração de dados';
COMMENT ON TABLE document_entities IS 'Entidades extraídas de documentos (CPF, CNPJ, nomes, datas, etc)';
COMMENT ON TABLE document_comparisons IS 'Comparações entre documentos';
COMMENT ON TABLE ai_processing_queue IS 'Fila de processamento assíncrono de tarefas de IA';

COMMENT ON COLUMN document_analysis.ocr_text IS 'Texto completo extraído via OCR';
COMMENT ON COLUMN document_analysis.extracted_data IS 'Dados estruturados extraídos (CPF, CNPJ, valores, etc)';
COMMENT ON COLUMN document_entities.entity_type IS 'Tipo: person, cpf, cnpj, date, amount, address, phone, email, oab';
COMMENT ON COLUMN ai_processing_queue.priority IS '1-10 (1 = highest priority)';
