-- =====================================================
-- GARCEZ PALHA - ESSENTIAL TABLES FOR MVP
-- Versão simplificada para executar sem conflitos
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to avoid conflicts (CUIDADO: isso apaga dados existentes!)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS ai_analysis_logs CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS case_deadlines CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS legal_cases CASCADE;
DROP TABLE IF EXISTS checkout_orders CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. PROFILES TABLE
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'lawyer', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS TABLE
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  service_interest TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  quality_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CLIENTS TABLE
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
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

-- 4. APPOINTMENTS TABLE
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LEGAL CASES TABLE (Processos)
CREATE TABLE legal_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  case_number TEXT UNIQUE NOT NULL,
  case_type TEXT NOT NULL,
  court TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'closed')),
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DOCUMENTS TABLE
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES legal_cases(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CASE DEADLINES TABLE (Prazos)
CREATE TABLE case_deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES legal_cases(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  deadline_date DATE NOT NULL,
  deadline_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENTS TABLE (Pagamentos)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  case_id UUID REFERENCES legal_cases(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_method TEXT,
  payment_date TIMESTAMPTZ,
  due_date DATE,
  description TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CHAT MESSAGES TABLE
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
  agent_used TEXT,
  confidence DECIMAL(3,2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AI ANALYSIS LOGS TABLE
CREATE TABLE ai_analysis_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID REFERENCES legal_cases(id) ON DELETE SET NULL,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  agent_type TEXT NOT NULL,
  input_text TEXT,
  output_text TEXT,
  confidence_score DECIMAL(3,2),
  tokens_used INTEGER,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ACTIVITY LOGS TABLE
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  description TEXT NOT NULL,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CHECKOUT ORDERS TABLE
CREATE TABLE checkout_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_cpf_cnpj TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'pix', 'boleto')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  stripe_session_id TEXT,
  mercadopago_payment_id TEXT,
  description TEXT,
  urgency TEXT DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent')),
  metadata JSONB,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX idx_clients_profile_id ON clients(profile_id);

CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

CREATE INDEX idx_legal_cases_client_id ON legal_cases(client_id);
CREATE INDEX idx_legal_cases_case_number ON legal_cases(case_number);
CREATE INDEX idx_legal_cases_status ON legal_cases(status);

CREATE INDEX idx_documents_case_id ON documents(case_id);
CREATE INDEX idx_documents_client_id ON documents(client_id);

CREATE INDEX idx_case_deadlines_case_id ON case_deadlines(case_id);
CREATE INDEX idx_case_deadlines_deadline_date ON case_deadlines(deadline_date);
CREATE INDEX idx_case_deadlines_status ON case_deadlines(status);

CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_case_id ON payments(case_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_date ON payments(payment_date DESC);

CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);

CREATE INDEX idx_ai_analysis_logs_case_id ON ai_analysis_logs(case_id);
CREATE INDEX idx_ai_analysis_logs_document_id ON ai_analysis_logs(document_id);
CREATE INDEX idx_ai_analysis_logs_created_at ON ai_analysis_logs(created_at DESC);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs(entity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

CREATE INDEX idx_checkout_orders_payment_status ON checkout_orders(payment_status);
CREATE INDEX idx_checkout_orders_customer_email ON checkout_orders(customer_email);
CREATE INDEX idx_checkout_orders_created_at ON checkout_orders(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_orders ENABLE ROW LEVEL SECURITY;

-- Allow service role to bypass RLS (for server-side operations)
CREATE POLICY "Service role can manage all profiles" ON profiles FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all leads" ON leads FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all clients" ON clients FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all appointments" ON appointments FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all legal_cases" ON legal_cases FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all documents" ON documents FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all case_deadlines" ON case_deadlines FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all payments" ON payments FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all chat_messages" ON chat_messages FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all ai_analysis_logs" ON ai_analysis_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all notifications" ON notifications FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all activity_logs" ON activity_logs FOR ALL TO service_role USING (true);
CREATE POLICY "Service role can manage all checkout_orders" ON checkout_orders FOR ALL TO service_role USING (true);

-- Authenticated users can read their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "Clients can view own data" ON clients FOR SELECT TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Clients can view own appointments" ON appointments FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Clients can view own cases" ON legal_cases FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Clients can view own documents" ON documents FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Clients can view own deadlines" ON case_deadlines FOR SELECT TO authenticated
  USING (case_id IN (SELECT id FROM legal_cases WHERE client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid())));

CREATE POLICY "Clients can view own payments" ON payments FOR SELECT TO authenticated
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

CREATE POLICY "Users can view own chat messages" ON chat_messages FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own chat messages" ON chat_messages FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- DONE! ✅
-- =====================================================

SELECT 'Essential tables created successfully! 🎉' AS status;
