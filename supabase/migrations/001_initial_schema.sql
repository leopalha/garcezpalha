-- Garcez Palha Initial Database Schema
-- Migration: 001_initial_schema
-- Date: 2024-01-15

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'partner', 'admin')),
  phone TEXT,
  document TEXT, -- CPF or CNPJ
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==========================================
-- PARTNERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT,
  trading_name TEXT,
  cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  bio TEXT,
  pix_key TEXT,
  pix_key_type TEXT CHECK (pix_key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
  bank_name TEXT,
  account_type TEXT,
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- Percentage
  total_referrals INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  pending_earnings DECIMAL(10,2) DEFAULT 0.00,
  contract_signed_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_partners_user ON partners(user_id);

-- ==========================================
-- LEADS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  service_type TEXT,
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'chatbot', 'referral', 'social', 'other')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES users(id),
  partner_id UUID REFERENCES partners(id),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  notes TEXT,
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  lost_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_partner ON leads(partner_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);

-- ==========================================
-- REFERRALS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'qualified', 'converted', 'lost', 'paid')),
  potential_value DECIMAL(10,2),
  commission_rate DECIMAL(5,2),
  commission_amount DECIMAL(10,2),
  paid_at TIMESTAMPTZ,
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referrals_partner ON referrals(partner_id);
CREATE INDEX idx_referrals_status ON referrals(status);
CREATE INDEX idx_referrals_created ON referrals(created_at DESC);

-- ==========================================
-- SERVICES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  icon TEXT,
  reference_value DECIMAL(10,2), -- OAB Compliance: Not a fixed price, just reference
  price_type TEXT DEFAULT 'reference' CHECK (price_type IN ('reference', 'hourly', 'consultation', 'variable')),
  pricing_disclaimer TEXT DEFAULT 'Orçamento personalizado após análise do caso. Valor de referência sujeito a alteração conforme complexidade.',
  category TEXT NOT NULL,
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active);

-- ==========================================
-- PAYMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  lead_id UUID REFERENCES leads(id),
  service_id UUID REFERENCES services(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  payment_method TEXT NOT NULL CHECK (payment_method IN ('stripe', 'pix', 'bank_transfer', 'cash')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')),
  stripe_payment_id TEXT,
  stripe_session_id TEXT,
  mercadopago_payment_id TEXT,
  pix_code TEXT,
  pix_expiration TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_method ON payments(payment_method);

-- ==========================================
-- PARTNER COMMISSIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS partner_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES referrals(id),
  payment_id UUID REFERENCES payments(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'cancelled')),
  pix_transaction_id TEXT,
  paid_at TIMESTAMPTZ,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_commissions_partner ON partner_commissions(partner_id);
CREATE INDEX idx_commissions_status ON partner_commissions(status);

-- ==========================================
-- CHAT THREADS TABLE (for AI assistant)
-- ==========================================
CREATE TABLE IF NOT EXISTS chat_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  lead_id UUID REFERENCES leads(id),
  session_id TEXT NOT NULL,
  openai_thread_id TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_threads_session ON chat_threads(session_id);
CREATE INDEX idx_chat_threads_user ON chat_threads(user_id);

-- ==========================================
-- CHAT MESSAGES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_thread ON chat_messages(thread_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- ==========================================
-- NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error', 'referral', 'payment', 'lead')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);

-- ==========================================
-- AUDIT LOG TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ==========================================
-- SETTINGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_settings_key ON settings(key);

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_commissions_updated_at BEFORE UPDATE ON partner_commissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chat_threads_updated_at BEFORE UPDATE ON chat_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Partners can view their own data
CREATE POLICY "Partners can view own data" ON partners FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Partners can update own data" ON partners FOR UPDATE USING (auth.uid() = user_id);

-- Partners can view and manage their referrals
CREATE POLICY "Partners can view own referrals" ON referrals FOR SELECT USING (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));
CREATE POLICY "Partners can create referrals" ON referrals FOR INSERT WITH CHECK (partner_id IN (SELECT id FROM partners WHERE user_id = auth.uid()));

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Users can view their chat threads
CREATE POLICY "Users can view own chat threads" ON chat_threads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT USING (thread_id IN (SELECT id FROM chat_threads WHERE user_id = auth.uid()));

-- ==========================================
-- INITIAL DATA
-- ==========================================

-- Insert default services (OAB compliant with reference values)
INSERT INTO services (name, slug, description, short_description, category, reference_value, price_type, features, sort_order) VALUES
('Consultoria Jurídica', 'consultoria-juridica', 'Consultoria especializada em diversas áreas do direito para orientar suas decisões.', 'Orientação jurídica especializada', 'consultoria', 500.00, 'hourly', '["Análise de caso", "Orientação personalizada", "Relatório detalhado"]', 1),
('Direito do Consumidor', 'direito-consumidor', 'Defesa dos seus direitos como consumidor em casos de cobranças indevidas, produtos defeituosos e práticas abusivas.', 'Proteção ao consumidor', 'civil', 1500.00, 'variable', '["Análise do caso", "Negociação extrajudicial", "Ação judicial se necessário", "Acompanhamento completo"]', 2),
('Direito Trabalhista', 'direito-trabalhista', 'Ações trabalhistas para garantir seus direitos como empregado ou defesa para empregadores.', 'Defesa dos direitos trabalhistas', 'trabalhista', 2000.00, 'variable', '["Cálculo de verbas", "Negociação", "Ação judicial", "Recursos"]', 3),
('Direito de Família', 'direito-familia', 'Divórcio, pensão alimentícia, guarda de filhos e outros assuntos familiares.', 'Questões familiares', 'familia', 3000.00, 'variable', '["Mediação", "Acordos", "Ações judiciais", "Inventário"]', 4),
('Contratos', 'contratos', 'Elaboração, revisão e análise de contratos comerciais e civis.', 'Gestão de contratos', 'civil', 800.00, 'fixed', '["Análise de riscos", "Revisão completa", "Negociação de cláusulas"]', 5),
('Direito Imobiliário', 'direito-imobiliario', 'Compra, venda, locação e regularização de imóveis.', 'Assessoria imobiliária', 'imobiliario', 2500.00, 'variable', '["Due diligence", "Contratos", "Regularização", "Usucapião"]', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert default settings
INSERT INTO settings (key, value, description) VALUES
('commission_rate_default', '10.00', 'Default partner commission rate (percentage)'),
('lead_assignment_auto', 'false', 'Automatically assign leads to available team members'),
('notification_email_enabled', 'true', 'Send email notifications'),
('chat_ai_model', '"gpt-4"', 'OpenAI model to use for chat'),
('chat_max_messages', '50', 'Maximum messages per chat thread'),
('payment_pix_expiration_hours', '24', 'PIX payment expiration time in hours')
ON CONFLICT (key) DO NOTHING;

-- Grant service role full access
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
