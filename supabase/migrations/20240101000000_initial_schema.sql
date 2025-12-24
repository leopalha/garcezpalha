-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- Extends Supabase auth.users with additional user data
-- ============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'lawyer', 'partner', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- LEADS TABLE
-- Stores potential clients from contact forms and chatbot
-- ============================================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service_interest TEXT NOT NULL,
  message TEXT,
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'chatbot', 'referral')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- CLIENTS TABLE
-- Converted leads become clients with active cases
-- ============================================================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  company_name TEXT,
  cpf_cnpj TEXT UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  assigned_lawyer UUID REFERENCES profiles(id) ON DELETE SET NULL,
  total_cases INTEGER DEFAULT 0,
  lifetime_value DECIMAL(10, 2) DEFAULT 0.00,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- APPOINTMENTS TABLE
-- Scheduled consultations and meetings
-- ============================================================================
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  lawyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  appointment_type TEXT NOT NULL CHECK (appointment_type IN ('consultation', 'meeting', 'court', 'other')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  meeting_link TEXT,
  location TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- CONVERSATIONS TABLE
-- Tracks all conversations (WhatsApp, Chatbot, etc.)
-- ============================================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'chatbot', 'email', 'phone')),
  external_id TEXT, -- WhatsApp phone number, etc.
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'archived')),
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MESSAGES TABLE
-- Individual messages within conversations
-- ============================================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'agent', 'ai', 'system')),
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'document', 'audio', 'video', 'system')),
  metadata JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INVOICES TABLE
-- Payment tracking for services
-- ============================================================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  payment_method TEXT CHECK (payment_method IN ('credit_card', 'pix', 'bank_transfer', 'other')),
  payment_gateway TEXT CHECK (payment_gateway IN ('stripe', 'mercadopago', 'manual')),
  external_payment_id TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PARTNERS TABLE
-- Affiliate/referral partners who bring clients
-- ============================================================================
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  partner_code TEXT UNIQUE NOT NULL,
  company_name TEXT,
  contact_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  commission_rate DECIMAL(5, 2) NOT NULL DEFAULT 10.00, -- Percentage
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  total_referrals INTEGER DEFAULT 0,
  total_earnings DECIMAL(10, 2) DEFAULT 0.00,
  payout_method TEXT CHECK (payout_method IN ('pix', 'bank_transfer', 'other')),
  payout_details JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- REFERRALS TABLE
-- Track which partner referred which client
-- ============================================================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'qualified', 'converted', 'paid')),
  commission_amount DECIMAL(10, 2),
  paid_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Profiles
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Leads
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_phone ON leads(phone);

-- Clients
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_assigned_lawyer ON clients(assigned_lawyer);
CREATE INDEX idx_clients_cpf_cnpj ON clients(cpf_cnpj);

-- Appointments
CREATE INDEX idx_appointments_client_id ON appointments(client_id);
CREATE INDEX idx_appointments_lawyer_id ON appointments(lawyer_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX idx_appointments_status ON appointments(status);

-- Conversations
CREATE INDEX idx_conversations_client_id ON conversations(client_id);
CREATE INDEX idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX idx_conversations_channel ON conversations(channel);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_external_id ON conversations(external_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Invoices
CREATE INDEX idx_invoices_client_id ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Partners
CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_partners_partner_code ON partners(partner_code);
CREATE INDEX idx_partners_status ON partners(status);

-- Referrals
CREATE INDEX idx_referrals_partner_id ON referrals(partner_id);
CREATE INDEX idx_referrals_lead_id ON referrals(lead_id);
CREATE INDEX idx_referrals_client_id ON referrals(client_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- Automatically update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Leads: Admins and lawyers can view/manage all leads
CREATE POLICY "Admins and lawyers can view leads" ON leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

CREATE POLICY "Admins and lawyers can insert leads" ON leads
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

CREATE POLICY "Admins and lawyers can update leads" ON leads
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Clients: Clients can view own data, lawyers can view assigned clients, admins can view all
CREATE POLICY "Clients can view own data" ON clients
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Lawyers can view assigned clients" ON clients
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND (role = 'admin' OR (role = 'lawyer' AND id = clients.assigned_lawyer))
    )
  );

CREATE POLICY "Admins and lawyers can manage clients" ON clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Appointments: Clients can view own, lawyers can view their appointments
CREATE POLICY "Users can view their appointments" ON appointments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = appointments.client_id AND clients.user_id = auth.uid()
    ) OR
    appointments.lawyer_id = auth.uid()
  );

CREATE POLICY "Admins and lawyers can manage appointments" ON appointments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Conversations: Users can view their own conversations
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = conversations.client_id AND clients.user_id = auth.uid()
    ) OR
    assigned_to = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Messages: Users can view messages in their conversations
CREATE POLICY "Users can view their messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      JOIN clients ON clients.id = conversations.client_id
      WHERE conversations.id = messages.conversation_id
        AND clients.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
        AND conversations.assigned_to = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'lawyer')
    )
  );

-- Invoices: Clients can view own invoices, admins can view all
CREATE POLICY "Clients can view own invoices" ON invoices
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM clients
      WHERE clients.id = invoices.client_id AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all invoices" ON invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Partners: Partners can view own data, admins can view all
CREATE POLICY "Partners can view own data" ON partners
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can manage partners" ON partners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Referrals: Partners can view own referrals, admins can view all
CREATE POLICY "Partners can view own referrals" ON referrals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM partners
      WHERE partners.id = referrals.partner_id AND partners.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage referrals" ON referrals
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
