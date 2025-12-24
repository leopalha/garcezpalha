-- =====================================================
-- GARCEZ PALHA - ALL MIGRATIONS CONSOLIDATED
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- =====================================================

-- Migration 001: Initial Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users/Profiles Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'lawyer', 'client', 'partner')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service_interest TEXT,
  message TEXT,
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'telegram', 'chatbot', 'referral', 'partner')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  quality_score INTEGER DEFAULT 0 CHECK (quality_score >= 0 AND quality_score <= 100),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients Table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  company_name TEXT,
  cpf_cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations Table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('website', 'whatsapp', 'telegram')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'spam')),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'bot', 'admin')),
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Referrals Table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  commission_amount DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Commissions Table
CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_id UUID REFERENCES referrals(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  transaction_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_conversations_platform ON conversations(platform);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all" ON users FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage leads" ON leads FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage clients" ON clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage appointments" ON appointments FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage conversations" ON conversations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage messages" ON messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage referrals" ON referrals FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage commissions" ON commissions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage invoices" ON invoices FOR ALL TO authenticated USING (true);

-- Migration 003: Telegram Integration
-- =====================================================

CREATE TABLE IF NOT EXISTS telegram_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_chat_id BIGINT UNIQUE NOT NULL,
  telegram_username TEXT,
  telegram_first_name TEXT,
  telegram_last_name TEXT,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'spam', 'qualified')),
  qualification_score INTEGER DEFAULT 0 CHECK (qualification_score >= 0 AND qualification_score <= 100),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS telegram_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES telegram_conversations(id) ON DELETE CASCADE,
  telegram_message_id BIGINT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'bot')),
  content TEXT NOT NULL,
  ai_processed BOOLEAN DEFAULT false,
  ai_response TEXT,
  ai_intent TEXT,
  ai_entities JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_telegram_conversations_chat_id ON telegram_conversations(telegram_chat_id);
CREATE INDEX IF NOT EXISTS idx_telegram_conversations_lead_id ON telegram_conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_conversation_id ON telegram_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_telegram_messages_created_at ON telegram_messages(created_at DESC);

ALTER TABLE telegram_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage telegram_conversations" ON telegram_conversations FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage telegram_messages" ON telegram_messages FOR ALL TO authenticated USING (true);

-- Auto-update triggers
CREATE OR REPLACE FUNCTION update_telegram_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE telegram_conversations
  SET last_message_at = NOW(), updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_telegram_conversation_timestamp
  AFTER INSERT ON telegram_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_telegram_conversation_timestamp();

-- Auto-create lead when qualified
CREATE OR REPLACE FUNCTION auto_create_lead_from_telegram()
RETURNS TRIGGER AS $$
DECLARE
  new_lead_id UUID;
  conversation_data RECORD;
BEGIN
  IF NEW.status = 'qualified' AND OLD.status != 'qualified' AND NEW.lead_id IS NULL THEN
    SELECT * INTO conversation_data FROM telegram_conversations WHERE id = NEW.id;

    INSERT INTO leads (
      name,
      phone,
      source,
      status,
      quality_score,
      service_interest,
      message
    ) VALUES (
      COALESCE(conversation_data.telegram_first_name || ' ' || conversation_data.telegram_last_name, conversation_data.telegram_username, 'Telegram User'),
      NULL,
      'telegram',
      'qualified',
      conversation_data.qualification_score,
      'Telegram Conversation',
      'Auto-created from qualified Telegram conversation'
    )
    RETURNING id INTO new_lead_id;

    NEW.lead_id = new_lead_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_create_lead_from_telegram
  BEFORE UPDATE ON telegram_conversations
  FOR EACH ROW
  EXECUTE FUNCTION auto_create_lead_from_telegram();

-- Migration 004: OAB Compliance Pricing
-- =====================================================

ALTER TABLE leads
ADD COLUMN IF NOT EXISTS reference_value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS pricing_disclaimer TEXT DEFAULT '⚠️ Valores são meramente referenciais. Proposta final será elaborada após análise detalhada do caso por advogado habilitado (OAB/RJ 219.390).';

CREATE TABLE IF NOT EXISTS oab_compliance_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL CHECK (note_type IN ('disclaimer_shown', 'pricing_explained', 'formal_consultation_offered')),
  note_text TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_oab_notes_lead_id ON oab_compliance_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_oab_notes_created_at ON oab_compliance_notes(created_at DESC);

ALTER TABLE oab_compliance_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage oab_compliance_notes" ON oab_compliance_notes FOR ALL TO authenticated USING (true);

-- Migration 005: Partner OAB/CNPJ Validation
-- =====================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS partner_type TEXT CHECK (partner_type IN ('lawyer', 'company')),
ADD COLUMN IF NOT EXISTS oab_number TEXT,
ADD COLUMN IF NOT EXISTS oab_state TEXT,
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS oab_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cnpj_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

CREATE INDEX IF NOT EXISTS idx_users_oab_number ON users(oab_number) WHERE oab_number IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_cnpj ON users(cnpj) WHERE cnpj IS NOT NULL;

-- Validation function
CREATE OR REPLACE FUNCTION validate_partner_credentials()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'partner' THEN
    IF NEW.partner_type = 'lawyer' THEN
      IF NEW.oab_number IS NULL OR NEW.oab_state IS NULL THEN
        RAISE EXCEPTION 'Parceiros advogados devem informar número OAB e estado';
      END IF;
      IF LENGTH(NEW.oab_number) < 3 THEN
        RAISE EXCEPTION 'Número OAB inválido';
      END IF;
    ELSIF NEW.partner_type = 'company' THEN
      IF NEW.cnpj IS NULL THEN
        RAISE EXCEPTION 'Parceiros empresas devem informar CNPJ';
      END IF;
      IF LENGTH(REGEXP_REPLACE(NEW.cnpj, '[^0-9]', '', 'g')) != 14 THEN
        RAISE EXCEPTION 'CNPJ deve ter 14 dígitos';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_partner_credentials
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION validate_partner_credentials();

-- Block commission payments to unverified partners
CREATE OR REPLACE FUNCTION block_unverified_partner_payment()
RETURNS TRIGGER AS $$
DECLARE
  partner_data RECORD;
BEGIN
  IF NEW.paid_at IS NOT NULL AND OLD.paid_at IS NULL THEN
    SELECT u.* INTO partner_data
    FROM referrals r
    JOIN users u ON r.partner_id = u.id
    WHERE r.id = (SELECT referral_id FROM commissions WHERE id = NEW.id);

    IF partner_data.partner_type = 'lawyer' AND NOT partner_data.oab_verified THEN
      RAISE EXCEPTION 'Não é possível pagar comissão: OAB do parceiro não verificada';
    END IF;

    IF partner_data.partner_type = 'company' AND NOT partner_data.cnpj_verified THEN
      RAISE EXCEPTION 'Não é possível pagar comissão: CNPJ do parceiro não verificado';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_block_unverified_partner_payment
  BEFORE UPDATE ON commissions
  FOR EACH ROW
  EXECUTE FUNCTION block_unverified_partner_payment();

-- Migration 006: Contracts Table
-- =====================================================

CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  contract_type TEXT NOT NULL,
  clicksign_document_key TEXT UNIQUE,
  clicksign_request_signature_key TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'signed', 'cancelled')),
  signed_at TIMESTAMPTZ,
  pdf_url TEXT,
  pdf_storage_path TEXT,
  reference_value DECIMAL(10,2),
  contract_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_lead_id ON contracts(lead_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_clicksign_key ON contracts(clicksign_document_key);

ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all contracts" ON contracts
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Clients can view own contracts" ON contracts
  FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE user_id = auth.uid()));

-- Auto-convert lead to client on signature
CREATE OR REPLACE FUNCTION auto_convert_lead_on_signature()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'signed' AND OLD.status != 'signed' THEN
    UPDATE leads
    SET status = 'converted', updated_at = NOW()
    WHERE id = NEW.lead_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_convert_lead_on_signature
  AFTER UPDATE ON contracts
  FOR EACH ROW
  EXECUTE FUNCTION auto_convert_lead_on_signature();

-- Migration 007: Process Alerts Table
-- =====================================================

CREATE TABLE IF NOT EXISTS process_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_number TEXT NOT NULL,
  tribunal TEXT NOT NULL,
  email_subject TEXT,
  email_from TEXT,
  email_date TIMESTAMPTZ,
  email_snippet TEXT,
  update_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'downloaded', 'processed', 'ignored')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  portal_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_alerts_process_number ON process_alerts(process_number);
CREATE INDEX IF NOT EXISTS idx_process_alerts_tribunal ON process_alerts(tribunal);
CREATE INDEX IF NOT EXISTS idx_process_alerts_status ON process_alerts(status);
CREATE INDEX IF NOT EXISTS idx_process_alerts_priority ON process_alerts(priority);
CREATE INDEX IF NOT EXISTS idx_process_alerts_created_at ON process_alerts(created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_process_alerts_unique
  ON process_alerts(process_number, email_date);

ALTER TABLE process_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage process_alerts" ON process_alerts
  FOR ALL TO authenticated USING (true);

-- Migration 008: Process Documents Table
-- =====================================================

CREATE TABLE IF NOT EXISTS process_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_id UUID REFERENCES process_alerts(id) ON DELETE CASCADE,
  process_number TEXT NOT NULL,
  document_type TEXT DEFAULT 'intimacao',
  pdf_storage_path TEXT,
  pdf_url TEXT,
  extracted_text TEXT,
  extraction_status TEXT DEFAULT 'pending' CHECK (extraction_status IN ('pending', 'processing', 'completed', 'failed')),
  extraction_error TEXT,
  file_size_bytes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS process_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES process_documents(id) ON DELETE CASCADE,
  process_number TEXT NOT NULL,
  deadline_type TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  days_count INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  google_calendar_event_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_documents_alert_id ON process_documents(alert_id);
CREATE INDEX IF NOT EXISTS idx_process_documents_process_number ON process_documents(process_number);
CREATE INDEX IF NOT EXISTS idx_process_documents_extraction_status ON process_documents(extraction_status);

CREATE INDEX IF NOT EXISTS idx_process_deadlines_document_id ON process_deadlines(document_id);
CREATE INDEX IF NOT EXISTS idx_process_deadlines_process_number ON process_deadlines(process_number);
CREATE INDEX IF NOT EXISTS idx_process_deadlines_deadline_date ON process_deadlines(deadline_date);
CREATE INDEX IF NOT EXISTS idx_process_deadlines_status ON process_deadlines(status);

ALTER TABLE process_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage process_documents" ON process_documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins can manage process_deadlines" ON process_deadlines FOR ALL TO authenticated USING (true);

-- Migration 009: Notification Logs Table
-- =====================================================

CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('process_update', 'deadline_reminder', 'appointment_reminder')),
  recipient_email TEXT,
  recipient_phone TEXT,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  subject TEXT,
  content TEXT NOT NULL,
  error_message TEXT,
  metadata JSONB,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_type ON notification_logs(notification_type);
CREATE INDEX IF NOT EXISTS idx_notification_logs_channel ON notification_logs(channel);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created_at ON notification_logs(created_at DESC);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage notification_logs" ON notification_logs FOR ALL TO authenticated USING (true);

-- Migration 010: Appointments Automation
-- =====================================================

ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS reminder_24h_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reminder_2h_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS followup_3d_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS nps_7d_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS upsell_30d_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT;

-- Migration 011: Email Sequences
-- =====================================================

CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  resend_id TEXT,
  metadata JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  sequence_type TEXT NOT NULL CHECK (sequence_type IN ('welcome', 'appointment', 'consultation')),
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resend_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  email_to TEXT NOT NULL,
  metadata JSONB,
  occurred_at TIMESTAMPTZ NOT NULL,
  received_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_template_type ON email_logs(template_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_resend_id ON email_logs(resend_id) WHERE resend_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_email_sequences_lead_id ON email_sequences(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_status ON email_sequences(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_sequence_type ON email_sequences(sequence_type);
CREATE INDEX IF NOT EXISTS idx_email_sequences_started_at ON email_sequences(started_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_sequences_unique_active
  ON email_sequences(lead_id, sequence_type) WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_email_events_resend_id ON email_events(resend_id);
CREATE INDEX IF NOT EXISTS idx_email_events_event_type ON email_events(event_type);
CREATE INDEX IF NOT EXISTS idx_email_events_occurred_at ON email_events(occurred_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_email_events_unique
  ON email_events(resend_id, event_type, occurred_at);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email logs" ON email_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'lawyer'))
);

CREATE POLICY "Admins can manage email sequences" ON email_sequences FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'lawyer'))
);

CREATE POLICY "Admins can view email events" ON email_events FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role IN ('admin', 'lawyer'))
);

-- Update email sequences timestamp
CREATE OR REPLACE FUNCTION update_email_sequences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_email_sequences_updated_at
  BEFORE UPDATE ON email_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_email_sequences_updated_at();

-- Auto-pause sequence on conversion
CREATE OR REPLACE FUNCTION auto_pause_sequence_on_conversion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'converted' AND OLD.status != 'converted' THEN
    UPDATE email_sequences
    SET status = 'paused'
    WHERE lead_id = NEW.id AND status = 'active';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_pause_sequence_on_conversion
  AFTER UPDATE ON leads
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION auto_pause_sequence_on_conversion();

-- Add email_valid column to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email_valid BOOLEAN DEFAULT TRUE;

-- =====================================================
-- DONE! All migrations executed successfully
-- =====================================================

SELECT 'All migrations completed successfully!' AS status;
