-- GARCEZ PALHA - MIGRACOES CONSOLIDADAS
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- URL: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/sql

-- =====================================================
-- PARTE 0: LIMPAR TABELAS EXISTENTES (se houver)
-- =====================================================
-- ATENCAO: Isso vai APAGAR dados existentes nessas tabelas!
-- Comente esta secao se quiser preservar dados

DROP TABLE IF EXISTS public.document_revisions CASCADE;
DROP TABLE IF EXISTS public.review_queue CASCADE;
DROP TABLE IF EXISTS public.document_templates CASCADE;
DROP TABLE IF EXISTS public.generated_documents CASCADE;
DROP TABLE IF EXISTS public.lead_interactions CASCADE;
DROP TABLE IF EXISTS public.follow_up_messages CASCADE;
DROP TABLE IF EXISTS public.proposals CASCADE;
DROP TABLE IF EXISTS public.payment_links CASCADE;
DROP TABLE IF EXISTS public.qualification_sessions CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;

-- Dropar ENUMs existentes
DROP TYPE IF EXISTS lead_category CASCADE;
DROP TYPE IF EXISTS lead_status CASCADE;
DROP TYPE IF EXISTS qualification_status CASCADE;
DROP TYPE IF EXISTS follow_up_status CASCADE;
DROP TYPE IF EXISTS follow_up_channel CASCADE;

-- =====================================================
-- PARTE 1: EXTENSOES E ENUMS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE lead_category AS ENUM ('hot', 'warm', 'cold', 'unqualified');
CREATE TYPE lead_status AS ENUM ('active', 'nurturing', 'converted', 'lost', 'paused');
CREATE TYPE qualification_status AS ENUM ('in_progress', 'completed', 'abandoned');
CREATE TYPE follow_up_status AS ENUM ('scheduled', 'sent', 'delivered', 'read', 'replied', 'failed', 'cancelled');
CREATE TYPE follow_up_channel AS ENUM ('whatsapp', 'email', 'sms');

-- =====================================================
-- PARTE 2: TABELAS PRINCIPAIS
-- =====================================================

-- 2.1 LEADS
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    agent_role TEXT NOT NULL,
    score_total INTEGER NOT NULL CHECK (score_total >= 0 AND score_total <= 100),
    score_urgency INTEGER NOT NULL CHECK (score_urgency >= 0 AND score_urgency <= 100),
    score_probability INTEGER NOT NULL CHECK (score_probability >= 0 AND score_probability <= 100),
    score_complexity INTEGER NOT NULL CHECK (score_complexity >= 0 AND score_complexity <= 100),
    category lead_category NOT NULL,
    score_reasoning TEXT[] DEFAULT '{}',
    status lead_status NOT NULL DEFAULT 'active',
    estimated_value BIGINT,
    estimated_fee BIGINT,
    recommended_action_type TEXT,
    recommended_action_priority TEXT,
    recommended_action_message TEXT,
    source TEXT DEFAULT 'website',
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_contact_at TIMESTAMPTZ,
    converted_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT leads_email_or_phone_check CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- 2.2 QUALIFICATION SESSIONS
CREATE TABLE public.qualification_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    agent_role TEXT NOT NULL,
    status qualification_status NOT NULL DEFAULT 'in_progress',
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    answers JSONB NOT NULL DEFAULT '[]'::jsonb,
    current_question_index INTEGER DEFAULT 0,
    context JSONB DEFAULT '{}'::jsonb,
    client_info JSONB DEFAULT '{}'::jsonb,
    source TEXT DEFAULT 'website',
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- 2.3 PAYMENT LINKS
CREATE TABLE public.payment_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    url TEXT NOT NULL,
    amount BIGINT NOT NULL,
    original_amount BIGINT NOT NULL,
    discount_applied BIGINT DEFAULT 0,
    discount_percentage INTEGER DEFAULT 0,
    installments INTEGER DEFAULT 1,
    expires_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.4 PROPOSALS
CREATE TABLE public.proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    payment_link_id UUID REFERENCES public.payment_links(id) ON DELETE SET NULL,
    proposal_id TEXT UNIQUE NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    client_name TEXT NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    base_price BIGINT NOT NULL,
    adjusted_price BIGINT NOT NULL,
    discount BIGINT DEFAULT 0,
    installments INTEGER DEFAULT 1,
    estimated_case_value BIGINT,
    valid_until TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'sent',
    viewed_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.5 FOLLOW UP MESSAGES
CREATE TABLE public.follow_up_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    message_id TEXT UNIQUE NOT NULL,
    message TEXT NOT NULL,
    channel follow_up_channel NOT NULL,
    recipient_name TEXT,
    recipient_phone TEXT,
    recipient_email TEXT,
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    replied_at TIMESTAMPTZ,
    status follow_up_status NOT NULL DEFAULT 'scheduled',
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT follow_up_messages_recipient_check CHECK (
        (channel = 'whatsapp' AND recipient_phone IS NOT NULL) OR
        (channel = 'email' AND recipient_email IS NOT NULL) OR
        (channel = 'sms' AND recipient_phone IS NOT NULL)
    )
);

-- 2.6 LEAD INTERACTIONS
CREATE TABLE public.lead_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    session_id TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.7 GENERATED DOCUMENTS
CREATE TABLE public.generated_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'sent')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT,
    review_notes TEXT,
    sent_at TIMESTAMPTZ,
    sent_via TEXT CHECK (sent_via IN ('email', 'whatsapp', 'download', NULL))
);

-- 2.8 REVIEW QUEUE
CREATE TABLE public.review_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.generated_documents(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    document_type TEXT NOT NULL,
    title TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_review', 'approved', 'rejected')),
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    reviewed_by TEXT,
    review_notes TEXT
);

-- 2.9 DOCUMENT TEMPLATES
CREATE TABLE public.document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('financeiro', 'imobiliario', 'previdenciario', 'criminal', 'trabalhista', 'consumidor', 'geral')),
    description TEXT,
    content TEXT NOT NULL,
    required_variables TEXT[] DEFAULT '{}',
    optional_variables TEXT[] DEFAULT '{}',
    requires_ai BOOLEAN DEFAULT false,
    estimated_pages INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.10 DOCUMENT REVISIONS
CREATE TABLE public.document_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.generated_documents(id) ON DELETE CASCADE,
    revision_number INTEGER NOT NULL DEFAULT 1,
    content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT,
    revision_notes TEXT
);

-- =====================================================
-- PARTE 3: INDICES
-- =====================================================
CREATE INDEX idx_leads_category ON public.leads(category);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_product_id ON public.leads(product_id);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_score_total ON public.leads(score_total DESC);
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_session_id ON public.leads(session_id);

CREATE INDEX idx_qualification_sessions_session_id ON public.qualification_sessions(session_id);
CREATE INDEX idx_qualification_sessions_lead_id ON public.qualification_sessions(lead_id);
CREATE INDEX idx_qualification_sessions_status ON public.qualification_sessions(status);
CREATE INDEX idx_qualification_sessions_created_at ON public.qualification_sessions(created_at DESC);

CREATE INDEX idx_payment_links_lead_id ON public.payment_links(lead_id);
CREATE INDEX idx_payment_links_provider ON public.payment_links(provider);
CREATE INDEX idx_payment_links_status ON public.payment_links(status);

CREATE INDEX idx_proposals_lead_id ON public.proposals(lead_id);
CREATE INDEX idx_proposals_proposal_id ON public.proposals(proposal_id);
CREATE INDEX idx_proposals_status ON public.proposals(status);

CREATE INDEX idx_follow_up_messages_lead_id ON public.follow_up_messages(lead_id);
CREATE INDEX idx_follow_up_messages_status ON public.follow_up_messages(status);
CREATE INDEX idx_follow_up_messages_scheduled_for ON public.follow_up_messages(scheduled_for);

CREATE INDEX idx_lead_interactions_lead_id ON public.lead_interactions(lead_id);
CREATE INDEX idx_lead_interactions_type ON public.lead_interactions(type);
CREATE INDEX idx_lead_interactions_created_at ON public.lead_interactions(created_at DESC);

CREATE INDEX idx_generated_documents_lead_id ON public.generated_documents(lead_id);
CREATE INDEX idx_generated_documents_status ON public.generated_documents(status);
CREATE INDEX idx_generated_documents_type ON public.generated_documents(document_type);

CREATE INDEX idx_review_queue_status ON public.review_queue(status);
CREATE INDEX idx_review_queue_priority ON public.review_queue(priority);

CREATE INDEX idx_document_revisions_document_id ON public.document_revisions(document_id);

-- =====================================================
-- PARTE 4: TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PARTE 5: TRIGGERS
-- =====================================================
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qualification_sessions_updated_at BEFORE UPDATE ON public.qualification_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_links_updated_at BEFORE UPDATE ON public.payment_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_follow_up_messages_updated_at BEFORE UPDATE ON public.follow_up_messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_documents_updated_at BEFORE UPDATE ON public.generated_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_review_queue_updated_at BEFORE UPDATE ON public.review_queue FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PARTE 6: ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualification_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_revisions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PARTE 7: POLICIES
-- =====================================================

-- LEADS
CREATE POLICY "leads_service_all" ON public.leads FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "leads_auth_select" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "leads_auth_insert" ON public.leads FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "leads_auth_update" ON public.leads FOR UPDATE TO authenticated USING (true);

-- QUALIFICATION SESSIONS
CREATE POLICY "qual_service_all" ON public.qualification_sessions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "qual_auth_all" ON public.qualification_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "qual_anon_insert" ON public.qualification_sessions FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "qual_anon_update" ON public.qualification_sessions FOR UPDATE TO anon USING (true);

-- PAYMENT LINKS
CREATE POLICY "pay_service_all" ON public.payment_links FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "pay_auth_select" ON public.payment_links FOR SELECT TO authenticated USING (true);

-- PROPOSALS
CREATE POLICY "prop_service_all" ON public.proposals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "prop_auth_all" ON public.proposals FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FOLLOW UP MESSAGES
CREATE POLICY "follow_service_all" ON public.follow_up_messages FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "follow_auth_all" ON public.follow_up_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- LEAD INTERACTIONS
CREATE POLICY "interact_service_all" ON public.lead_interactions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "interact_auth_all" ON public.lead_interactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "interact_anon_insert" ON public.lead_interactions FOR INSERT TO anon WITH CHECK (true);

-- GENERATED DOCUMENTS
CREATE POLICY "gendocs_service_all" ON public.generated_documents FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "gendocs_auth_all" ON public.generated_documents FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- REVIEW QUEUE
CREATE POLICY "review_service_all" ON public.review_queue FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "review_auth_all" ON public.review_queue FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- DOCUMENT TEMPLATES
CREATE POLICY "templates_service_all" ON public.document_templates FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "templates_auth_select" ON public.document_templates FOR SELECT TO authenticated USING (true);

-- DOCUMENT REVISIONS
CREATE POLICY "revisions_service_all" ON public.document_revisions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "revisions_auth_all" ON public.document_revisions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- PARTE 8: GRANTS
-- =====================================================
GRANT ALL ON public.leads TO authenticated, service_role;
GRANT ALL ON public.qualification_sessions TO authenticated, service_role;
GRANT ALL ON public.payment_links TO authenticated, service_role;
GRANT ALL ON public.proposals TO authenticated, service_role;
GRANT ALL ON public.follow_up_messages TO authenticated, service_role;
GRANT ALL ON public.lead_interactions TO authenticated, service_role;
GRANT ALL ON public.generated_documents TO authenticated, service_role;
GRANT ALL ON public.review_queue TO authenticated, service_role;
GRANT ALL ON public.document_templates TO authenticated, service_role;
GRANT ALL ON public.document_revisions TO authenticated, service_role;

GRANT INSERT, UPDATE ON public.qualification_sessions TO anon;
GRANT INSERT ON public.lead_interactions TO anon;

-- =====================================================
-- VERIFICACAO FINAL
-- =====================================================
SELECT 'MIGRACAO CONCLUIDA COM SUCESSO!' AS resultado;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'leads', 'qualification_sessions', 'payment_links',
  'proposals', 'follow_up_messages', 'lead_interactions',
  'generated_documents', 'review_queue', 'document_templates', 'document_revisions'
)
ORDER BY table_name;
