-- =====================================================
-- Migration 014 v2: Add Leonardo user to users table
-- Date: 2025-01-06
-- Purpose: Add leonardo.palha@gmail.com with admin123 password
-- =====================================================

-- First, check if user exists
SELECT id, email, name, role, is_active
FROM users
WHERE email = 'leonardo.palha@gmail.com';

-- Delete if exists (to avoid conflicts)
DELETE FROM users WHERE email = 'leonardo.palha@gmail.com';

-- Insert with admin123 password hash
-- Password: admin123
-- Hash: $2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW

INSERT INTO users (id, email, name, password_hash, role, phone, email_verified, is_active, created_at, updated_at)
VALUES (
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'::uuid,
  'leonardo.palha@gmail.com',
  'Leonardo Palha',
  '$2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW',
  'admin',
  NULL,
  true,
  true,
  NOW(),
  NOW()
);

-- Verify insertion
SELECT id, email, name, role, is_active, created_at
FROM users
WHERE email = 'leonardo.palha@gmail.com';

-- =====================================================
-- EXPECTED OUTPUT: 1 row with leonardo.palha@gmail.com
-- =====================================================
-- CREDENTIALS FOR LOGIN:
-- Email: leonardo.palha@gmail.com
-- Senha: admin123
-- =====================================================
