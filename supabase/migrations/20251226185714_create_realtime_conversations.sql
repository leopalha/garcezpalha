-- Tabela para armazenar conversas em tempo real (voice chat)
CREATE TABLE IF NOT EXISTS public.realtime_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,
  mode TEXT NOT NULL CHECK (mode IN ('audio', 'avatar')),
  
  -- Timestamps
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  
  -- Métricas
  total_messages INTEGER DEFAULT 0,
  user_messages INTEGER DEFAULT 0,
  assistant_messages INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned', 'error')),
  converted_to_checkout BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela para mensagens individuais
CREATE TABLE IF NOT EXISTS public.realtime_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.realtime_conversations(id) ON DELETE CASCADE,
  
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Audio metadata (se disponível)
  audio_duration_ms INTEGER,
  transcript_confidence DECIMAL(3, 2),
  
  -- Timestamps
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_realtime_conversations_user_id ON public.realtime_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_realtime_conversations_session_id ON public.realtime_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_realtime_conversations_status ON public.realtime_conversations(status);
CREATE INDEX IF NOT EXISTS idx_realtime_conversations_started_at ON public.realtime_conversations(started_at DESC);

CREATE INDEX IF NOT EXISTS idx_realtime_messages_conversation_id ON public.realtime_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_realtime_messages_timestamp ON public.realtime_messages(timestamp DESC);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_realtime_conversations_updated_at
  BEFORE UPDATE ON public.realtime_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE public.realtime_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.realtime_messages ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver apenas suas próprias conversas
CREATE POLICY "Users can view own conversations"
  ON public.realtime_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir suas próprias conversas
CREATE POLICY "Users can insert own conversations"
  ON public.realtime_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar suas próprias conversas
CREATE POLICY "Users can update own conversations"
  ON public.realtime_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Mensagens seguem as mesmas regras através do conversation_id
CREATE POLICY "Users can view messages from own conversations"
  ON public.realtime_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.realtime_conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own conversations"
  ON public.realtime_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.realtime_conversations
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

-- Admin pode ver tudo
CREATE POLICY "Admins can view all conversations"
  ON public.realtime_conversations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY "Admins can view all messages"
  ON public.realtime_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Comentários
COMMENT ON TABLE public.realtime_conversations IS 'Armazena sessões de conversas em tempo real (voice chat)';
COMMENT ON TABLE public.realtime_messages IS 'Armazena mensagens individuais das conversas em tempo real';
