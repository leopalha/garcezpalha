-- =====================================================
-- Migration 014: Add Leonardo user to users table
-- Date: 2025-01-06
-- Purpose: Add leonardo.palha@gmail.com with admin123 password
-- =====================================================

-- Password hash for admin123:
-- $2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW

INSERT INTO users (id, email, name, password_hash, role, phone, email_verified, is_active) VALUES
('c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1', 'leonardo.palha@gmail.com', 'Leonardo Palha', '$2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW', 'admin', NULL, true, true)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  email_verified = EXCLUDED.email_verified;

-- =====================================================
-- CREDENTIALS:
-- =====================================================
-- Email: leonardo.palha@gmail.com
-- Senha: admin123
-- Role: admin
-- =====================================================
