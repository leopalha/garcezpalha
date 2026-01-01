-- Agent Configurations and Interactions
-- Allows admin to configure and monitor AI agents

CREATE TABLE IF NOT EXISTS agent_configs (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('legal', 'executive', 'marketing', 'operations', 'intelligence')),
  name TEXT NOT NULL,
  description TEXT,
  system_prompt TEXT NOT NULL,
  user_prompt TEXT,
  model TEXT DEFAULT 'llama-3.3-70b-versatile',
  temperature DECIMAL(2,1) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 4000,
  top_p DECIMAL(2,1) DEFAULT 1.0,
  frequency_penalty DECIMAL(2,1) DEFAULT 0.0,
  presence_penalty DECIMAL(2,1) DEFAULT 0.0,
  enabled BOOLEAN DEFAULT true,
  requires_approval BOOLEAN DEFAULT false,
  tools TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Agent interactions log
CREATE TABLE IF NOT EXISTS agent_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT REFERENCES agent_configs(id),
  user_id UUID REFERENCES auth.users(id),
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  duration_ms INTEGER,
  model TEXT,
  temperature DECIMAL(2,1),
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_interactions ENABLE ROW LEVEL SECURITY;

-- Admin can manage all agent configs
CREATE POLICY "Admin full access to agent_configs"
  ON agent_configs
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Users can read active agent configs
CREATE POLICY "Users can read active agent_configs"
  ON agent_configs
  FOR SELECT
  USING (enabled = true);

-- Users can view their own interactions
CREATE POLICY "Users can view own agent_interactions"
  ON agent_interactions
  FOR SELECT
  USING (user_id = auth.uid());

-- Admin can view all interactions
CREATE POLICY "Admin can view all agent_interactions"
  ON agent_interactions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'super_admin')
    )
  );

-- Anyone can insert interactions (logged in users)
CREATE POLICY "Users can create agent_interactions"
  ON agent_interactions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_configs_category ON agent_configs(category);
CREATE INDEX IF NOT EXISTS idx_agent_configs_enabled ON agent_configs(enabled);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_agent_id ON agent_interactions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_user_id ON agent_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_interactions_created_at ON agent_interactions(created_at);

-- Update trigger for agent_configs
CREATE OR REPLACE FUNCTION update_agent_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agent_configs_updated_at
  BEFORE UPDATE ON agent_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_configs_updated_at();

-- Seed agent configurations
INSERT INTO agent_configs (id, role, category, name, description, system_prompt, user_prompt, model, temperature, tools, enabled, requires_approval)
VALUES
  -- Legal Agents
  (
    'real-estate',
    'real-estate',
    'legal',
    'Especialista em Imóveis',
    'Contratos, usucapião, registro de imóveis',
    'Você é um especialista em Direito Imobiliário com profundo conhecimento em:
- Contratos de compra e venda
- Usucapião (urbana e rural)
- Registro de imóveis
- Alienação fiduciária
- Locação comercial e residencial
- Regularização fundiária

IMPORTANTE:
- Sempre cite a legislação aplicável (Código Civil, Lei de Registros Públicos)
- Verifique prazos prescricionais
- Alerte sobre necessidade de certidões
- Inclua disclaimer OAB em todas as respostas

AVISO LEGAL: Este conteúdo é de caráter informativo e educacional, não constituindo aconselhamento jurídico específico. Para análise do seu caso particular, consulte um advogado. Garcez Palha Advocacia - OAB/RJ.',
    'Analise o seguinte caso imobiliário e forneça orientação jurídica detalhada:',
    'llama-3.3-70b-versatile',
    0.3,
    ARRAY['registry-checker', 'legal-calculator', 'oab-compliance'],
    true,
    false
  ),
  (
    'criminal',
    'criminal',
    'legal',
    'Direito Criminal',
    'Análise penal, defesa criminal',
    'Você é um especialista em Direito Penal com expertise em crimes contra o patrimônio, contra a pessoa, e análise processual penal.

METODOLOGIA:
1. Identificar o tipo penal
2. Verificar elementos do crime (dolo, culpa, consumação)
3. Analisar circunstâncias agravantes/atenuantes
4. Calcular pena base e regime inicial
5. Avaliar possibilidade de defesa

SEMPRE:
- Cite artigos do Código Penal
- Mencione jurisprudência quando relevante
- Alerte sobre prazos recursais
- Presunção de inocência em todas as respostas

AVISO LEGAL: Conteúdo informativo. Consulte um advogado criminalista para seu caso.',
    'Analise o seguinte caso criminal:',
    'llama-3.3-70b-versatile',
    0.3,
    ARRAY['legal-calculator', 'jurisprudence-search', 'oab-compliance'],
    true,
    true
  ),

  -- Executive Agents
  (
    'ceo',
    'ceo',
    'executive',
    'CEO Agent',
    'Estratégia e decisões executivas',
    'Você é o CEO virtual da Garcez Palha, responsável por visão estratégica, decisões de alto impacto, e alocação de recursos.

FRAMEWORK DE DECISÃO:
1. Avaliar alinhamento com missão (democratizar acesso à justiça)
2. Analisar impacto financeiro (ROI, payback)
3. Considerar risco operacional
4. Verificar capacidade de execução
5. Priorizar por matriz impacto vs esforço

DADOS DISPONÍVEIS: métricas de crescimento, performance de marketing, operações, finanças.',
    'Como CEO da Garcez Palha, analise a seguinte situação e recomende ação:',
    'llama-3.3-70b-versatile',
    0.5,
    ARRAY['metrics-analyzer', 'forecast-model'],
    true,
    true
  ),

  -- Marketing Agents
  (
    'content',
    'content',
    'marketing',
    'Content Agent',
    'Criação de conteúdo educativo',
    'Você é especialista em criação de conteúdo jurídico educativo para blog posts, artigos técnicos, guias práticos.

ESTILO: Tom acessível mas profissional. Evitar juridiquês excessivo. Usar exemplos práticos.

ESTRUTURA: Título chamativo, introdução com gancho, desenvolvimento com subtítulos, exemplos práticos, FAQ, CTA final.

COMPLIANCE: Sempre incluir disclaimer OAB. Não fazer promessas de resultado.',
    'Crie conteúdo sobre o seguinte tema:',
    'llama-3.3-70b-versatile',
    0.8,
    ARRAY['seo-optimizer', 'readability-checker', 'oab-compliance'],
    true,
    false
  ),
  (
    'social',
    'social',
    'marketing',
    'Social Media Agent',
    'Posts para redes sociais',
    'Você cria posts educativos para redes sociais (Instagram, LinkedIn, Facebook) sobre temas jurídicos.

FORMATO:
- Gancho nos primeiros 3 segundos
- Linguagem simples e direta
- Emojis estratégicos
- Hashtags relevantes
- CTA claro

COMPLIANCE: Sempre disclaimer OAB. Não promessas de resultado.',
    'Crie posts para redes sociais sobre:',
    'llama-3.3-70b-versatile',
    0.8,
    ARRAY['hashtag-generator', 'oab-compliance'],
    true,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Function to get agent performance metrics
CREATE OR REPLACE FUNCTION get_agent_performance(agent_id_param TEXT, days_param INTEGER DEFAULT 30)
RETURNS TABLE (
  total_calls BIGINT,
  success_rate DECIMAL,
  avg_tokens INTEGER,
  avg_duration_ms INTEGER,
  total_tokens BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_calls,
    (COUNT(*) FILTER (WHERE success = true)::DECIMAL / NULLIF(COUNT(*), 0) * 100) as success_rate,
    AVG(tokens_used)::INTEGER as avg_tokens,
    AVG(duration_ms)::INTEGER as avg_duration_ms,
    SUM(tokens_used)::BIGINT as total_tokens
  FROM agent_interactions
  WHERE agent_id = agent_id_param
    AND created_at >= NOW() - (days_param || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;
