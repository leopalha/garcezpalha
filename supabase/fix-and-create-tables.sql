-- =====================================================
-- GARCEZ PALHA - FIX AND CREATE TABLES
-- Este script cria as tabelas essenciais sem conflitos
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PARTE 1: CRIAR TABELAS PRINCIPAIS
-- =====================================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('admin', 'lawyer', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS
CREATE TABLE IF NOT EXISTS leads (
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

-- 3. CLIENTS
CREATE TABLE IF NOT EXISTS clients (
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

-- 4. APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
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

-- 5. LEGAL CASES (Processos)
CREATE TABLE IF NOT EXISTS legal_cases (
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

-- 6. DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
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

-- 7. CASE DEADLINES (Prazos)
CREATE TABLE IF NOT EXISTS case_deadlines (
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

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
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

-- 9. CHAT MESSAGES
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'assistant', 'system')),
  agent_used TEXT,
  confidence DECIMAL(3,2),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. AI ANALYSIS LOGS
CREATE TABLE IF NOT EXISTS ai_analysis_logs (
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

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
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

-- 13. CHECKOUT ORDERS
CREATE TABLE IF NOT EXISTS checkout_orders (
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
-- PARTE 2: CRIAR ÍNDICES (só se não existirem)
-- =====================================================

DO $$
BEGIN
  -- Leads indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_leads_status') THEN
    CREATE INDEX idx_leads_status ON leads(status);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_leads_created_at') THEN
    CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
  END IF;

  -- Clients indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_clients_profile_id') THEN
    CREATE INDEX idx_clients_profile_id ON clients(profile_id);
  END IF;

  -- Appointments indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_appointments_client_id') THEN
    CREATE INDEX idx_appointments_client_id ON appointments(client_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_appointments_scheduled_at') THEN
    CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_appointments_status') THEN
    CREATE INDEX idx_appointments_status ON appointments(status);
  END IF;

  -- Legal cases indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_legal_cases_client_id') THEN
    CREATE INDEX idx_legal_cases_client_id ON legal_cases(client_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_legal_cases_case_number') THEN
    CREATE INDEX idx_legal_cases_case_number ON legal_cases(case_number);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_legal_cases_status') THEN
    CREATE INDEX idx_legal_cases_status ON legal_cases(status);
  END IF;

  -- Documents indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_documents_case_id') THEN
    CREATE INDEX idx_documents_case_id ON documents(case_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_documents_client_id') THEN
    CREATE INDEX idx_documents_client_id ON documents(client_id);
  END IF;

  -- Case deadlines indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_case_deadlines_case_id') THEN
    CREATE INDEX idx_case_deadlines_case_id ON case_deadlines(case_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_case_deadlines_deadline_date') THEN
    CREATE INDEX idx_case_deadlines_deadline_date ON case_deadlines(deadline_date);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_case_deadlines_status') THEN
    CREATE INDEX idx_case_deadlines_status ON case_deadlines(status);
  END IF;

  -- Payments indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_client_id') THEN
    CREATE INDEX idx_payments_client_id ON payments(client_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payments_status') THEN
    CREATE INDEX idx_payments_status ON payments(status);
  END IF;

  -- Chat messages indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_messages_user_id') THEN
    CREATE INDEX idx_chat_messages_user_id ON chat_messages(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_chat_messages_created_at') THEN
    CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
  END IF;

  -- Notifications indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_user_id') THEN
    CREATE INDEX idx_notifications_user_id ON notifications(user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_notifications_read') THEN
    CREATE INDEX idx_notifications_read ON notifications(read);
  END IF;

  -- Checkout orders indexes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_checkout_orders_payment_status') THEN
    CREATE INDEX idx_checkout_orders_payment_status ON checkout_orders(payment_status);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_checkout_orders_customer_email') THEN
    CREATE INDEX idx_checkout_orders_customer_email ON checkout_orders(customer_email);
  END IF;
END $$;

-- =====================================================
-- PARTE 3: HABILITAR RLS
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

-- =====================================================
-- PARTE 4: CRIAR POLÍTICAS RLS
-- =====================================================

-- Service role bypass (importante para API server-side)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all profiles') THEN
    CREATE POLICY "Service role can manage all profiles" ON profiles FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all leads') THEN
    CREATE POLICY "Service role can manage all leads" ON leads FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all clients') THEN
    CREATE POLICY "Service role can manage all clients" ON clients FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all appointments') THEN
    CREATE POLICY "Service role can manage all appointments" ON appointments FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all legal_cases') THEN
    CREATE POLICY "Service role can manage all legal_cases" ON legal_cases FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all documents') THEN
    CREATE POLICY "Service role can manage all documents" ON documents FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all case_deadlines') THEN
    CREATE POLICY "Service role can manage all case_deadlines" ON case_deadlines FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all payments') THEN
    CREATE POLICY "Service role can manage all payments" ON payments FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all chat_messages') THEN
    CREATE POLICY "Service role can manage all chat_messages" ON chat_messages FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all ai_analysis_logs') THEN
    CREATE POLICY "Service role can manage all ai_analysis_logs" ON ai_analysis_logs FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all notifications') THEN
    CREATE POLICY "Service role can manage all notifications" ON notifications FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all activity_logs') THEN
    CREATE POLICY "Service role can manage all activity_logs" ON activity_logs FOR ALL TO service_role USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Service role can manage all checkout_orders') THEN
    CREATE POLICY "Service role can manage all checkout_orders" ON checkout_orders FOR ALL TO service_role USING (true);
  END IF;
END $$;

-- =====================================================
-- DONE! ✅
-- =====================================================

SELECT
  'Database setup complete! 🎉' as status,
  COUNT(*) as tables_created
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';
