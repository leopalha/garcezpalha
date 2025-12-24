-- =====================================================
-- EXECUTE ESTE SQL NO SUPABASE DASHBOARD
-- =====================================================
-- Acesse: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/sql/new
-- Cole este código e clique em RUN
-- =====================================================

-- 1. Deletar usuários antigos
DELETE FROM users WHERE email IN (
  'parceiro1@example.com',
  'parceiro2@example.com',
  'parceiro3@example.com',
  'parceiro@example.com'
);

-- 2. Inserir/Atualizar novos usuários com senhas individuais
INSERT INTO users (id, email, name, password_hash, role, phone, email_verified, is_active, created_at, updated_at) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'admin@garcezpalha.com',
  'Administrador',
  '$2b$10$tvkkaCoiqVBsd3iiR4uiHOadtUuThPzcfgnIMvRmgkDZMrHC84vrW',
  'admin',
  '(21) 99999-0001',
  true,
  true,
  NOW(),
  NOW()
),
(
  'l0000000-0000-0000-0000-000000000001',
  'advogado@garcezpalha.com',
  'Dr. Carlos Advogado',
  '$2b$10$sTzMJSEwFj7YIeMyv82R4.MHp7eXfdd5yvFRkvw2dSXLWj/m3zdya',
  'admin',
  '(21) 99999-0002',
  true,
  true,
  NOW(),
  NOW()
),
(
  'p0000000-0000-0000-0000-000000000001',
  'parceiro@garcezpalha.com',
  'Parceiro Garcez Palha',
  '$2b$10$uBUTB8XEYN3NLJSJJhbkjeBbq2U55NBtJPRpmqaYKtuESPZyq4Akm',
  'partner',
  '(21) 99999-0003',
  true,
  true,
  NOW(),
  NOW()
),
(
  'c0000000-0000-0000-0000-000000000001',
  'cliente@garcezpalha.com',
  'João Cliente',
  '$2b$10$jifi5hqGG/k/CKit1eTx8uU31IQ.CKb6a7K7o4ItxIpfyjZAPVCpS',
  'client',
  '(21) 99999-0004',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- 3. Verificar se funcionou
SELECT email, name, role, is_active FROM users WHERE email LIKE '%garcezpalha.com' ORDER BY email;

-- =====================================================
-- CREDENCIAIS APÓS EXECUTAR:
-- =====================================================
-- Admin:     admin@garcezpalha.com      / admin123
-- Advogado:  advogado@garcezpalha.com   / advogado123
-- Parceiro:  parceiro@garcezpalha.com   / parceiro123
-- Cliente:   cliente@garcezpalha.com    / cliente123
-- =====================================================
