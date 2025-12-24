-- =====================================================
-- GARCEZ PALHA - SETUP COMPLETO COM USERS + TEST DATA
-- Execute este script INTEIRO no Supabase SQL Editor
-- =====================================================

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
  document TEXT,
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  reset_token TEXT,
  reset_token_expiry TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

-- =====================================================
-- INSERT TEST USERS WITH PASSWORD: demo123
-- =====================================================

-- Password hash for "demo123": $2b$10$DXejxQhiBzHcV2RjreQZAuuRFsh0TS8pj8dASi1UucySdIywzyou.

INSERT INTO users (id, email, name, password_hash, role, phone, email_verified, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@garcezpalha.com', 'Administrador', '$2b$10$DXejxQhiBzHcV2RjreQZAuuRFsh0TS8pj8dASi1UucySdIywzyou.', 'admin', '(21) 99999-0001', true, true),
('b0000000-0000-0000-0000-000000000001', 'advogado@garcezpalha.com', 'Dr. Carlos Advogado', '$2b$10$DXejxQhiBzHcV2RjreQZAuuRFsh0TS8pj8dASi1UucySdIywzyou.', 'admin', '(21) 99999-0005', true, true),
('10000000-0000-0000-0000-000000000001', 'parceiro1@example.com', 'João Silva', '$2b$10$DXejxQhiBzHcV2RjreQZAuuRFsh0TS8pj8dASi1UucySdIywzyou.', 'partner', '(21) 99999-0002', true, true),
('c0000000-0000-0000-0000-000000000001', 'cliente@garcezpalha.com', 'João Cliente', '$2b$10$DXejxQhiBzHcV2RjreQZAuuRFsh0TS8pj8dASi1UucySdIywzyou.', 'client', '(21) 99999-0006', true, true)
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- =====================================================
-- ENABLE RLS
-- =====================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Service role bypass (for API server-side operations)
CREATE POLICY "Service role bypass" ON users
  FOR ALL TO service_role USING (true);

-- Users can view own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT TO authenticated USING (id = auth.uid());

-- Users can update own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated USING (id = auth.uid());

-- =====================================================
-- ✅ SETUP COMPLETE!
-- =====================================================

SELECT
  '✅ Setup complete!' as status,
  COUNT(*) as users_created
FROM users;

-- =====================================================
-- CREDENTIALS FOR TESTING:
-- =====================================================
-- Admin:     admin@garcezpalha.com     / demo123
-- Advogado:  advogado@garcezpalha.com  / demo123  
-- Parceiro:  parceiro1@example.com     / demo123
-- Cliente:   cliente@garcezpalha.com   / demo123
-- =====================================================
