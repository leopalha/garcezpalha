-- =====================================================
-- Migration 013: Test Users with custom passwords
-- Date: 2025-12-23
-- Purpose: Create test users with individual passwords
-- =====================================================

-- Password hashes:
-- admin123:     $2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW
-- advogado123:  $2b$10$sTzMJSEwFj7YIeMyv82R4.MHp7eXfdd5yvFRkvw2dSXLWj/m3zdya
-- parceiro123:  $2b$10$uBUTB8XEYN3NLJSJJhbkjeBbq2U55NBtJPRpmqaYKtuESPZyq4Akm
-- cliente123:   $2b$10$jifi5hqGG/k/CKit1eTx8uU31IQ.CKb6a7K7o4ItxIpfyjZAPVCpS

-- Delete old test users if they exist
DELETE FROM users WHERE email IN (
  'parceiro1@example.com',
  'parceiro2@example.com',
  'parceiro3@example.com',
  'parceiro@example.com'
);

-- Update/Insert test users with new credentials
INSERT INTO users (id, email, name, password_hash, role, phone, email_verified, is_active) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@garcezpalha.com', 'Administrador', '$2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW', 'admin', '(21) 99999-0001', true, true),
('l0000000-0000-0000-0000-000000000001', 'advogado@garcezpalha.com', 'Dr. Carlos Advogado', '$2b$10$sTzMJSEwFj7YIeMyv82R4.MHp7eXfdd5yvFRkvw2dSXLWj/m3zdya', 'admin', '(21) 99999-0002', true, true),
('p0000000-0000-0000-0000-000000000001', 'parceiro@garcezpalha.com', 'Parceiro Garcez Palha', '$2b$10$uBUTB8XEYN3NLJSJJhbkjeBbq2U55NBtJPRpmqaYKtuESPZyq4Akm', 'partner', '(21) 99999-0003', true, true),
('c0000000-0000-0000-0000-000000000001', 'cliente@garcezpalha.com', 'João Cliente', '$2b$10$jifi5hqGG/k/CKit1eTx8uU31IQ.CKb6a7K7o4ItxIpfyjZAPVCpS', 'client', '(21) 99999-0004', true, true)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- =====================================================
-- CREDENTIALS FOR TESTING:
-- =====================================================
-- Admin:     admin@garcezpalha.com      / admin123
-- Advogado:  advogado@garcezpalha.com   / advogado123
-- Parceiro:  parceiro@garcezpalha.com   / parceiro123
-- Cliente:   cliente@garcezpalha.com    / cliente123
-- =====================================================
