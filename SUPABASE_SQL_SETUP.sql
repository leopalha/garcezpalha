-- ====================================================================
-- GARCEZ PALHA PLATFORM - COMPLETE DATABASE SETUP
-- Run this SQL in Supabase SQL Editor
-- URL: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/editor
-- ====================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- CLIENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  document TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  partner_id UUID REFERENCES partners(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_user ON clients(user_id);
CREATE INDEX IF NOT EXISTS idx_clients_partner ON clients(partner_id);

-- ==========================================
-- PROCESSES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  process_number TEXT UNIQUE NOT NULL,
  case_type TEXT NOT NULL,
  court TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'closed', 'archived')),
  description TEXT,
  attorney_name TEXT,
  oab_number TEXT,
  value DECIMAL(10,2),
  notes TEXT,
  started_at DATE,
  closed_at DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_processes_client ON processes(client_id);
CREATE INDEX IF NOT EXISTS idx_processes_number ON processes(process_number);
CREATE INDEX IF NOT EXISTS idx_processes_status ON processes(status);

-- ==========================================
-- DEADLINES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS deadlines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  deadline_date DATE NOT NULL,
  deadline_time TIME,
  type TEXT DEFAULT 'other' CHECK (type IN ('hearing', 'submission', 'appeal', 'payment', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'missed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  reminder_days INTEGER DEFAULT 7,
  reminded_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deadlines_process ON deadlines(process_id);
CREATE INDEX IF NOT EXISTS idx_deadlines_date ON deadlines(deadline_date);
CREATE INDEX IF NOT EXISTS idx_deadlines_status ON deadlines(status);

-- ==========================================
-- CONTRACTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  document_url TEXT,
  clicksign_document_key TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_signature', 'signed', 'cancelled', 'expired')),
  signed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_client ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);

-- ==========================================
-- PROCESS ALERTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS process_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  pdf_url TEXT,
  pdf_filename TEXT,
  extracted_text TEXT,
  processed BOOLEAN DEFAULT FALSE,
  deadline_extracted TIMESTAMPTZ,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_alerts_process ON process_alerts(process_id);
CREATE INDEX IF NOT EXISTS idx_process_alerts_processed ON process_alerts(processed);

-- ==========================================
-- PROCESS DOCUMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS process_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_documents_process ON process_documents(process_id);

-- ==========================================
-- NOTIFICATION LOGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID,
  recipient_email TEXT,
  recipient_phone TEXT,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'telegram')),
  type TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced')),
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_recipient ON notification_logs(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON notification_logs(created_at DESC);

-- ==========================================
-- APPOINTMENTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meet_link TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no_show')),
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_client ON appointments(client_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ==========================================
-- EMAIL SEQUENCES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  emails JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- EMAIL SEQUENCE SUBSCRIBERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS email_sequence_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID REFERENCES email_sequences(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'unsubscribed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_sent_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_seq_subs_sequence ON email_sequence_subscribers(sequence_id);
CREATE INDEX IF NOT EXISTS idx_email_seq_subs_client ON email_sequence_subscribers(client_id);

-- ====================================================================
-- SETUP COMPLETE!
-- All tables have been created successfully.
-- You can now use the Garcez Palha platform.
-- ====================================================================
