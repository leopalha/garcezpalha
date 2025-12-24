-- =====================================================
-- G4 LEADS SYSTEM MIGRATION
-- Criado: 2024-12-23
-- Descrição: Tabelas para sistema completo de qualificação de leads
-- =====================================================

-- =====================================================
-- 1. LEAD CATEGORIES ENUM
-- =====================================================
DO $$ BEGIN
    CREATE TYPE lead_category AS ENUM ('hot', 'warm', 'cold', 'unqualified');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lead_status AS ENUM ('active', 'nurturing', 'converted', 'lost', 'paused');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE qualification_status AS ENUM ('in_progress', 'completed', 'abandoned');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE follow_up_status AS ENUM ('scheduled', 'sent', 'delivered', 'read', 'replied', 'failed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE follow_up_channel AS ENUM ('whatsapp', 'email', 'sms');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- 2. LEADS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identificação
    client_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,

    -- Produto e Agente
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    agent_role TEXT NOT NULL,

    -- Score e Categoria
    score_total INTEGER NOT NULL CHECK (score_total >= 0 AND score_total <= 100),
    score_urgency INTEGER NOT NULL CHECK (score_urgency >= 0 AND score_urgency <= 100),
    score_probability INTEGER NOT NULL CHECK (score_probability >= 0 AND score_probability <= 100),
    score_complexity INTEGER NOT NULL CHECK (score_complexity >= 0 AND score_complexity <= 100),
    category lead_category NOT NULL,
    score_reasoning TEXT[] DEFAULT '{}',

    -- Status
    status lead_status NOT NULL DEFAULT 'active',

    -- Valores
    estimated_value BIGINT, -- centavos
    estimated_fee BIGINT,   -- centavos

    -- Ação Recomendada
    recommended_action_type TEXT,
    recommended_action_priority TEXT,
    recommended_action_message TEXT,

    -- Source
    source TEXT DEFAULT 'website', -- website, whatsapp, email
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_contact_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Indexes
    CONSTRAINT leads_email_or_phone_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_leads_category ON public.leads(category);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_product_id ON public.leads(product_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_score_total ON public.leads(score_total DESC);
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_session_id ON public.leads(session_id);

-- Busca por texto
CREATE INDEX IF NOT EXISTS idx_leads_client_name_trgm ON public.leads USING gin(client_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_leads_email_trgm ON public.leads USING gin(email gin_trgm_ops);

-- =====================================================
-- 3. QUALIFICATION SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.qualification_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Identificação
    session_id TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,

    -- Produto
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    agent_role TEXT NOT NULL,

    -- Status
    status qualification_status NOT NULL DEFAULT 'in_progress',

    -- State (serialized)
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    current_question_index INTEGER DEFAULT 0,
    context JSONB DEFAULT '{}'::jsonb,

    -- Cliente Info
    client_info JSONB DEFAULT '{}'::jsonb, -- {name, email, phone}

    -- Source
    source TEXT DEFAULT 'website',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_qualification_sessions_session_id ON public.qualification_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_qualification_sessions_lead_id ON public.qualification_sessions(lead_id);
CREATE INDEX IF NOT EXISTS idx_qualification_sessions_status ON public.qualification_sessions(status);
CREATE INDEX IF NOT EXISTS idx_qualification_sessions_created_at ON public.qualification_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qualification_sessions_expires_at ON public.qualification_sessions(expires_at);

-- =====================================================
-- 4. PAYMENT LINKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.payment_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamento
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,

    -- Payment Link Info
    provider TEXT NOT NULL, -- 'mercadopago' | 'stripe'
    provider_id TEXT NOT NULL,
    url TEXT NOT NULL,

    -- Valores (em centavos)
    amount BIGINT NOT NULL,
    original_amount BIGINT NOT NULL,
    discount_applied BIGINT DEFAULT 0,
    discount_percentage INTEGER DEFAULT 0,

    -- Configuração
    installments INTEGER DEFAULT 1,
    expires_at TIMESTAMPTZ NOT NULL,

    -- Status
    status TEXT DEFAULT 'pending', -- pending, paid, expired, cancelled
    paid_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_links_lead_id ON public.payment_links(lead_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_provider ON public.payment_links(provider);
CREATE INDEX IF NOT EXISTS idx_payment_links_status ON public.payment_links(status);
CREATE INDEX IF NOT EXISTS idx_payment_links_expires_at ON public.payment_links(expires_at);

-- =====================================================
-- 5. PROPOSALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamento
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    payment_link_id UUID REFERENCES public.payment_links(id) ON DELETE SET NULL,

    -- Proposta Info
    proposal_id TEXT UNIQUE NOT NULL, -- prop_xxx
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    client_name TEXT NOT NULL,

    -- Conteúdo
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,

    -- Pricing
    base_price BIGINT NOT NULL,
    adjusted_price BIGINT NOT NULL,
    discount BIGINT DEFAULT 0,
    installments INTEGER DEFAULT 1,
    estimated_case_value BIGINT,

    -- Validade
    valid_until TIMESTAMPTZ NOT NULL,

    -- Status
    status TEXT DEFAULT 'sent', -- sent, viewed, accepted, rejected, expired
    viewed_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_proposals_lead_id ON public.proposals(lead_id);
CREATE INDEX IF NOT EXISTS idx_proposals_proposal_id ON public.proposals(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON public.proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_valid_until ON public.proposals(valid_until);

-- =====================================================
-- 6. FOLLOW UP MESSAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.follow_up_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamento
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,

    -- Message Info
    message_id TEXT UNIQUE NOT NULL,
    message TEXT NOT NULL,
    channel follow_up_channel NOT NULL,

    -- Recipient
    recipient_name TEXT,
    recipient_phone TEXT,
    recipient_email TEXT,

    -- Scheduling
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,

    -- Status
    status follow_up_status NOT NULL DEFAULT 'scheduled',
    error_message TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Constraints
    CONSTRAINT follow_up_messages_recipient_check CHECK (
        (channel = 'whatsapp' AND recipient_phone IS NOT NULL) OR
        (channel = 'email' AND recipient_email IS NOT NULL) OR
        (channel = 'sms' AND recipient_phone IS NOT NULL)
    )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_follow_up_messages_lead_id ON public.follow_up_messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_messages_message_id ON public.follow_up_messages(message_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_messages_status ON public.follow_up_messages(status);
CREATE INDEX IF NOT EXISTS idx_follow_up_messages_scheduled_for ON public.follow_up_messages(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_follow_up_messages_channel ON public.follow_up_messages(channel);

-- =====================================================
-- 7. LEAD INTERACTIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.lead_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Relacionamento
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

    -- Interaction Info
    type TEXT NOT NULL, -- question, answer, completion, payment, proposal, follow_up
    message TEXT,

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_session_id ON public.lead_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_type ON public.lead_interactions(type);
CREATE INDEX IF NOT EXISTS idx_lead_interactions_created_at ON public.lead_interactions(created_at DESC);

-- =====================================================
-- 8. TRIGGERS - Updated At
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS update_leads_updated_at ON public.leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_qualification_sessions_updated_at ON public.qualification_sessions;
CREATE TRIGGER update_qualification_sessions_updated_at
    BEFORE UPDATE ON public.qualification_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_links_updated_at ON public.payment_links;
CREATE TRIGGER update_payment_links_updated_at
    BEFORE UPDATE ON public.payment_links
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_proposals_updated_at ON public.proposals;
CREATE TRIGGER update_proposals_updated_at
    BEFORE UPDATE ON public.proposals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_follow_up_messages_updated_at ON public.follow_up_messages;
CREATE TRIGGER update_follow_up_messages_updated_at
    BEFORE UPDATE ON public.follow_up_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;

-- Policies para LEADS
CREATE POLICY "Admins can view all leads"
    ON public.leads FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

CREATE POLICY "Admins can insert leads"
    ON public.leads FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

CREATE POLICY "Admins can update leads"
    ON public.leads FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

-- Policies para QUALIFICATION_SESSIONS
CREATE POLICY "Admins can view all sessions"
    ON public.qualification_sessions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

CREATE POLICY "Anyone can create sessions (anonymous leads)"
    ON public.qualification_sessions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Anyone can update their own sessions"
    ON public.qualification_sessions FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Policies para PAYMENT_LINKS
CREATE POLICY "Admins can view all payment links"
    ON public.payment_links FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

CREATE POLICY "Admins can create payment links"
    ON public.payment_links FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

-- Policies para PROPOSALS
CREATE POLICY "Admins can view all proposals"
    ON public.proposals FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

CREATE POLICY "Admins can create proposals"
    ON public.proposals FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

-- Policies para FOLLOW_UP_MESSAGES
CREATE POLICY "Admins can view all follow up messages"
    ON public.follow_up_messages FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

CREATE POLICY "System can create follow up messages"
    ON public.follow_up_messages FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "System can update follow up messages"
    ON public.follow_up_messages FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policies para LEAD_INTERACTIONS
CREATE POLICY "Admins can view all interactions"
    ON public.lead_interactions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data->>'role' IN ('admin', 'lawyer')
        )
    );

CREATE POLICY "Anyone can create interactions"
    ON public.lead_interactions FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- =====================================================
-- 10. HELPER FUNCTIONS
-- =====================================================

-- Função para calcular estatísticas de leads
CREATE OR REPLACE FUNCTION get_lead_statistics()
RETURNS TABLE (
    total_leads BIGINT,
    hot_leads BIGINT,
    warm_leads BIGINT,
    cold_leads BIGINT,
    unqualified_leads BIGINT,
    active_leads BIGINT,
    converted_leads BIGINT,
    conversion_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*)::BIGINT AS total_leads,
        COUNT(*) FILTER (WHERE category = 'hot')::BIGINT AS hot_leads,
        COUNT(*) FILTER (WHERE category = 'warm')::BIGINT AS warm_leads,
        COUNT(*) FILTER (WHERE category = 'cold')::BIGINT AS cold_leads,
        COUNT(*) FILTER (WHERE category = 'unqualified')::BIGINT AS unqualified_leads,
        COUNT(*) FILTER (WHERE status = 'active')::BIGINT AS active_leads,
        COUNT(*) FILTER (WHERE status = 'converted')::BIGINT AS converted_leads,
        CASE
            WHEN COUNT(*) > 0 THEN
                ROUND((COUNT(*) FILTER (WHERE status = 'converted')::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
            ELSE 0
        END AS conversion_rate
    FROM public.leads;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para obter funil de conversão
CREATE OR REPLACE FUNCTION get_conversion_funnel()
RETURNS TABLE (
    started BIGINT,
    qualified BIGINT,
    proposal BIGINT,
    payment BIGINT,
    converted BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM public.qualification_sessions)::BIGINT AS started,
        (SELECT COUNT(*) FROM public.leads)::BIGINT AS qualified,
        (SELECT COUNT(*) FROM public.proposals)::BIGINT AS proposal,
        (SELECT COUNT(*) FROM public.payment_links WHERE status = 'paid')::BIGINT AS payment,
        (SELECT COUNT(*) FROM public.leads WHERE status = 'converted')::BIGINT AS converted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 11. COMENTÁRIOS
-- =====================================================
COMMENT ON TABLE public.leads IS 'Leads qualificados pelo sistema G4';
COMMENT ON TABLE public.qualification_sessions IS 'Sessões de qualificação em andamento ou completas';
COMMENT ON TABLE public.payment_links IS 'Links de pagamento gerados para leads';
COMMENT ON TABLE public.proposals IS 'Propostas comerciais geradas automaticamente';
COMMENT ON TABLE public.follow_up_messages IS 'Mensagens de follow-up agendadas e enviadas';
COMMENT ON TABLE public.lead_interactions IS 'Log de todas as interações com leads';

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
