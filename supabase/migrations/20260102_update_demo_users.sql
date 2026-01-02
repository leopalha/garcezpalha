-- =====================================================
-- Migration: Update demo users for production
-- Date: 2026-01-02
-- Purpose: Update user roles constraint and demo users
-- =====================================================

-- First, update the CHECK constraint on users table to include 'lawyer'
-- Drop and recreate the constraint
DO $$
BEGIN
  -- Try to drop the existing constraint if it exists
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

  -- Add the new constraint with 'lawyer' included
  ALTER TABLE users
    ADD CONSTRAINT users_role_check
    CHECK (role IN ('client', 'partner', 'admin', 'lawyer'));
EXCEPTION
  WHEN OTHERS THEN
    -- Constraint might already be correct, continue
    NULL;
END $$;

-- =====================================================
-- DEMO USERS FOR PRODUCTION
-- =====================================================

-- Password hashes (bcrypt with 10 rounds):
-- admin123:     $2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW
-- advogado123:  $2b$10$sTzMJSEwFj7YIeMyv82R4.MHp7eXfdd5yvFRkvw2dSXLWj/m3zdya
-- parceiro123:  $2b$10$uBUTB8XEYN3NLJSJJhbkjeBbq2U55NBtJPRpmqaYKtuESPZyq4Akm
-- cliente123:   $2b$10$jifi5hqGG/k/CKit1eTx8uU31IQ.CKb6a7K7o4ItxIpfyjZAPVCpS

-- Upsert demo users with correct roles
INSERT INTO users (id, email, name, password_hash, role, phone, email_verified, is_active) VALUES
  -- Admin
  ('a0000000-0000-0000-0000-000000000001', 'admin@garcezpalha.com', 'Administrador Sistema',
   '$2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW', 'admin',
   '(21) 99999-0001', true, true),

  -- Advogado (ROLE: lawyer, NOT admin)
  ('l0000000-0000-0000-0000-000000000001', 'advogado@garcezpalha.com', 'Dr. Carlos Advogado',
   '$2b$10$sTzMJSEwFj7YIeMyv82R4.MHp7eXfdd5yvFRkvw2dSXLWj/m3zdya', 'lawyer',
   '(21) 99999-0002', true, true),

  -- Parceiro
  ('p0000000-0000-0000-0000-000000000001', 'parceiro@garcezpalha.com', 'Parceiro Garcez Palha',
   '$2b$10$uBUTB8XEYN3NLJSJJhbkjeBbq2U55NBtJPRpmqaYKtuESPZyq4Akm', 'partner',
   '(21) 99999-0003', true, true),

  -- Cliente
  ('c0000000-0000-0000-0000-000000000001', 'cliente@garcezpalha.com', 'João Cliente',
   '$2b$10$jifi5hqGG/k/CKit1eTx8uU31IQ.CKb6a7K7o4ItxIpfyjZAPVCpS', 'client',
   '(21) 99999-0004', true, true)

ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  phone = EXCLUDED.phone,
  email_verified = EXCLUDED.email_verified,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Also update profiles table if it exists
DO $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES
    ('a0000000-0000-0000-0000-000000000001', 'admin@garcezpalha.com', 'Administrador Sistema', 'admin'),
    ('l0000000-0000-0000-0000-000000000001', 'advogado@garcezpalha.com', 'Dr. Carlos Advogado', 'lawyer'),
    ('p0000000-0000-0000-0000-000000000001', 'parceiro@garcezpalha.com', 'Parceiro Garcez Palha', 'partner'),
    ('c0000000-0000-0000-0000-000000000001', 'cliente@garcezpalha.com', 'João Cliente', 'client')
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    updated_at = NOW();
EXCEPTION
  WHEN undefined_table THEN
    -- profiles table doesn't exist, skip
    NULL;
END $$;

-- Create partner record for parceiro user
INSERT INTO partners (user_id, company_name, commission_rate, is_verified)
VALUES ('p0000000-0000-0000-0000-000000000001', 'Parceiro Demo', 10.00, true)
ON CONFLICT (user_id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  is_verified = EXCLUDED.is_verified;

-- =====================================================
-- CREDENTIALS SUMMARY:
-- =====================================================
-- Admin:     admin@garcezpalha.com      / admin123     (role: admin)
-- Advogado:  advogado@garcezpalha.com   / advogado123  (role: lawyer)
-- Parceiro:  parceiro@garcezpalha.com   / parceiro123  (role: partner)
-- Cliente:   cliente@garcezpalha.com    / cliente123   (role: client)
-- =====================================================
