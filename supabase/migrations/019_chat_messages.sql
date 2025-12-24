-- Migration: Chat Messages Table
-- Tabela para armazenar histórico de mensagens do chat

-- Criar tabela chat_messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Thread/Session
    thread_id TEXT NOT NULL,
    session_id UUID,

    -- Relacionamentos opcionais
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Mensagem
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,

    -- Agente IA (quando role='assistant')
    agent_used TEXT,
    agent_confidence DECIMAL(3,2),

    -- Metadados
    metadata JSONB DEFAULT '{}',

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_thread_id ON public.chat_messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_lead_id ON public.chat_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON public.chat_messages(role);

-- Habilitar RLS
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "chat_messages_service_all" ON public.chat_messages
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

CREATE POLICY "chat_messages_auth_select_own" ON public.chat_messages
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "chat_messages_auth_insert" ON public.chat_messages
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "chat_messages_anon_insert" ON public.chat_messages
    FOR INSERT TO anon
    WITH CHECK (true);

-- Grants
GRANT ALL ON public.chat_messages TO authenticated, service_role;
GRANT INSERT, SELECT ON public.chat_messages TO anon;

-- Comentário
COMMENT ON TABLE public.chat_messages IS 'Histórico de mensagens do chat - conversas com IA e leads';
