-- Migration 035: Email Sequences - Sistema completo de sequências de email
-- Cria tabelas para gerenciar email sequences, steps, subscriptions e envios

-- ============================================================================
-- 1. Tabela de Sequências de Email
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT NOT NULL, -- 'lead-created', 'consultation-scheduled', 'contract-signed', etc
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ============================================================================
-- 2. Tabela de Steps (Etapas) da Sequência
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_sequence_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  template_id TEXT NOT NULL, -- 'welcome-1', 'welcome-2', 'nurture-1', etc
  delay_hours INT NOT NULL DEFAULT 0, -- Delay em relação ao step anterior (0 para primeiro)
  subject TEXT NOT NULL,
  preview_text TEXT,

  -- Condições para envio (opcional)
  condition_type TEXT, -- 'opened-previous', 'clicked-previous', 'not-opened', null (sempre enviar)
  condition_step_id UUID REFERENCES email_sequence_steps(id),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(sequence_id, step_number),
  CHECK (delay_hours >= 0)
);

-- ============================================================================
-- 3. Tabela de Inscrições (Subscriptions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_sequence_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  current_step_id UUID REFERENCES email_sequence_steps(id),

  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'unsubscribed', 'bounced', 'paused')),

  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  paused_at TIMESTAMPTZ,

  -- Metadados
  metadata JSONB DEFAULT '{}',

  UNIQUE(lead_id, sequence_id),

  -- Índices para performance
  CHECK (
    (status = 'completed' AND completed_at IS NOT NULL) OR
    (status = 'unsubscribed' AND unsubscribed_at IS NOT NULL) OR
    (status IN ('active', 'paused', 'bounced'))
  )
);

-- ============================================================================
-- 4. Tabela de Envios (Sends)
-- ============================================================================
CREATE TABLE IF NOT EXISTS email_sequence_sends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID NOT NULL REFERENCES email_sequence_subscriptions(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES email_sequence_steps(id),
  lead_id UUID NOT NULL REFERENCES leads(id),

  -- Dados do envio
  email_id TEXT, -- ID do Resend
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,

  -- Status do envio
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ, -- Quando deve ser enviado

  -- Eventos de tracking
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  complained_at TIMESTAMPTZ, -- Marcado como spam
  unsubscribed_at TIMESTAMPTZ,

  -- Metadados de tracking
  open_count INT DEFAULT 0,
  click_count INT DEFAULT 0,
  links_clicked JSONB DEFAULT '[]', -- Array de URLs clicados

  -- Erro (se houver)
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. Índices para Performance
-- ============================================================================

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_email_subscriptions_status
  ON email_sequence_subscriptions(status)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_email_subscriptions_lead
  ON email_sequence_subscriptions(lead_id);

CREATE INDEX IF NOT EXISTS idx_email_subscriptions_sequence
  ON email_sequence_subscriptions(sequence_id);

-- Sends
CREATE INDEX IF NOT EXISTS idx_email_sends_subscription
  ON email_sequence_sends(subscription_id);

CREATE INDEX IF NOT EXISTS idx_email_sends_lead
  ON email_sequence_sends(lead_id);

CREATE INDEX IF NOT EXISTS idx_email_sends_scheduled
  ON email_sequence_sends(scheduled_for)
  WHERE scheduled_for IS NOT NULL AND sent_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_email_sends_email_id
  ON email_sequence_sends(email_id)
  WHERE email_id IS NOT NULL;

-- ============================================================================
-- 6. Triggers para updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_sequences_updated_at
  BEFORE UPDATE ON email_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_sequence_steps_updated_at
  BEFORE UPDATE ON email_sequence_steps
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_sequence_sends_updated_at
  BEFORE UPDATE ON email_sequence_sends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. Row Level Security (RLS)
-- ============================================================================

ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_sends ENABLE ROW LEVEL SECURITY;

-- Políticas para email_sequences
CREATE POLICY "Admins podem gerenciar sequences"
  ON email_sequences
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Todos podem visualizar sequences ativas"
  ON email_sequences
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Políticas para email_sequence_steps
CREATE POLICY "Admins podem gerenciar steps"
  ON email_sequence_steps
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Todos podem visualizar steps de sequences ativas"
  ON email_sequence_steps
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM email_sequences
      WHERE email_sequences.id = email_sequence_steps.sequence_id
      AND email_sequences.status = 'active'
    )
  );

-- Políticas para subscriptions
CREATE POLICY "Sistema pode gerenciar subscriptions"
  ON email_sequence_subscriptions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Políticas para sends
CREATE POLICY "Sistema pode gerenciar sends"
  ON email_sequence_sends
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- 8. Funções Auxiliares
-- ============================================================================

-- Função para obter próximo step de uma subscription
CREATE OR REPLACE FUNCTION get_next_sequence_step(
  p_subscription_id UUID
)
RETURNS TABLE (
  step_id UUID,
  step_number INT,
  template_id TEXT,
  delay_hours INT,
  subject TEXT,
  should_send BOOLEAN,
  scheduled_for TIMESTAMPTZ
) AS $$
DECLARE
  v_current_step_id UUID;
  v_sequence_id UUID;
  v_subscribed_at TIMESTAMPTZ;
  v_last_sent_at TIMESTAMPTZ;
BEGIN
  -- Buscar dados da subscription
  SELECT
    current_step_id,
    sequence_id,
    subscribed_at
  INTO
    v_current_step_id,
    v_sequence_id,
    v_subscribed_at
  FROM email_sequence_subscriptions
  WHERE id = p_subscription_id;

  -- Se não tem step atual, pegar o primeiro
  IF v_current_step_id IS NULL THEN
    RETURN QUERY
    SELECT
      s.id AS step_id,
      s.step_number,
      s.template_id,
      s.delay_hours,
      s.subject,
      true AS should_send,
      v_subscribed_at + (s.delay_hours || ' hours')::INTERVAL AS scheduled_for
    FROM email_sequence_steps s
    WHERE s.sequence_id = v_sequence_id
      AND s.step_number = 1
    LIMIT 1;

    RETURN;
  END IF;

  -- Buscar último envio
  SELECT MAX(sent_at)
  INTO v_last_sent_at
  FROM email_sequence_sends
  WHERE subscription_id = p_subscription_id;

  -- Buscar próximo step
  RETURN QUERY
  SELECT
    s.id AS step_id,
    s.step_number,
    s.template_id,
    s.delay_hours,
    s.subject,
    CASE
      WHEN s.condition_type IS NULL THEN true
      WHEN s.condition_type = 'opened-previous' THEN
        EXISTS (
          SELECT 1 FROM email_sequence_sends
          WHERE subscription_id = p_subscription_id
            AND step_id = s.condition_step_id
            AND opened_at IS NOT NULL
        )
      WHEN s.condition_type = 'clicked-previous' THEN
        EXISTS (
          SELECT 1 FROM email_sequence_sends
          WHERE subscription_id = p_subscription_id
            AND step_id = s.condition_step_id
            AND clicked_at IS NOT NULL
        )
      WHEN s.condition_type = 'not-opened' THEN
        NOT EXISTS (
          SELECT 1 FROM email_sequence_sends
          WHERE subscription_id = p_subscription_id
            AND step_id = s.condition_step_id
            AND opened_at IS NOT NULL
        )
      ELSE false
    END AS should_send,
    v_last_sent_at + (s.delay_hours || ' hours')::INTERVAL AS scheduled_for
  FROM email_sequence_steps s
  WHERE s.sequence_id = v_sequence_id
    AND s.step_number > (
      SELECT step_number FROM email_sequence_steps
      WHERE id = v_current_step_id
    )
  ORDER BY s.step_number
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. Seed: Sequência de Boas-Vindas (4 emails)
-- ============================================================================

INSERT INTO email_sequences (id, name, description, trigger_event, status)
VALUES (
  'seq_welcome_001',
  'Sequência de Boas-Vindas',
  'Sequência de 4 emails enviada automaticamente após criação de novo lead',
  'lead-created',
  'active'
)
ON CONFLICT DO NOTHING;

-- Step 1: Email imediato
INSERT INTO email_sequence_steps (sequence_id, step_number, template_id, delay_hours, subject, preview_text)
VALUES (
  'seq_welcome_001',
  1,
  'welcome-1',
  0,
  'Bem-vindo ao Garcez Palha 👋',
  'Sua consulta foi recebida. Veja como podemos ajudar.'
)
ON CONFLICT DO NOTHING;

-- Step 2: 72h depois (3 dias)
INSERT INTO email_sequence_steps (sequence_id, step_number, template_id, delay_hours, subject, preview_text)
VALUES (
  'seq_welcome_001',
  2,
  'welcome-2',
  72,
  'Como funciona o processo jurídico ⚖️',
  'Entenda as etapas do seu caso em 5 minutos.'
)
ON CONFLICT DO NOTHING;

-- Step 3: 168h depois (7 dias do email anterior)
INSERT INTO email_sequence_steps (sequence_id, step_number, template_id, delay_hours, subject, preview_text)
VALUES (
  'seq_welcome_001',
  3,
  'welcome-3',
  168,
  'Seus direitos e possibilidades 📋',
  'Veja casos similares que ganhamos.'
)
ON CONFLICT DO NOTHING;

-- Step 4: 336h depois (14 dias do email anterior)
INSERT INTO email_sequence_steps (sequence_id, step_number, template_id, delay_hours, subject, preview_text)
VALUES (
  'seq_welcome_001',
  4,
  'welcome-4',
  336,
  'Pronto para começar? 🚀',
  'Agende sua consulta gratuita agora.'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 10. Comentários e Documentação
-- ============================================================================

COMMENT ON TABLE email_sequences IS 'Sequências de email automatizadas (drip campaigns)';
COMMENT ON TABLE email_sequence_steps IS 'Etapas individuais de cada sequência com delays e condições';
COMMENT ON TABLE email_sequence_subscriptions IS 'Inscrições de leads em sequências de email';
COMMENT ON TABLE email_sequence_sends IS 'Histórico de envios e tracking de cada email';

COMMENT ON COLUMN email_sequence_steps.delay_hours IS 'Delay em horas em relação ao step anterior (0 para primeiro step)';
COMMENT ON COLUMN email_sequence_steps.condition_type IS 'Condição para enviar: opened-previous, clicked-previous, not-opened, ou null (sempre enviar)';
COMMENT ON COLUMN email_sequence_subscriptions.status IS 'Status: active (recebendo), completed (terminou sequência), unsubscribed (cancelou), bounced (email inválido), paused (pausado)';
