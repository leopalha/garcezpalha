/**
 * Script SQL para criar usuário de autenticação no Supabase
 *
 * INSTRUÇÕES DE EXECUÇÃO:
 *
 * 1. Acesse o Supabase Dashboard: https://cpcnzkttcwodvfqyhkou.supabase.co
 * 2. Vá em "SQL Editor"
 * 3. Copie e cole este script completo
 * 4. Execute (Run)
 *
 * CREDENCIAIS CRIADAS:
 * Email: leonardo.palha@gmail.com
 * Senha: Admin2025!
 * Role: admin
 *
 * IMPORTANTE: Este script usa funções administrativas do Supabase.
 * Não execute em produção sem revisar.
 */

-- ======================================================
-- PASSO 1: Criar usuário no auth.users
-- ======================================================

-- Criar usuário com senha criptografada
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role,
  aud,
  confirmation_token,
  email_change_token_new,
  recovery_token
) VALUES (
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'::uuid,
  '00000000-0000-0000-0000-000000000000',
  'leonardo.palha@gmail.com',
  crypt('Admin2025!', gen_salt('bf')), -- Senha: Admin2025!
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Leonardo"}'::jsonb,
  false,
  'authenticated',
  'authenticated',
  '',
  '',
  ''
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  updated_at = NOW();

-- ======================================================
-- PASSO 2: Criar identidade de autenticação
-- ======================================================

-- Delete existing identity if present (to allow re-running script)
DELETE FROM auth.identities
WHERE user_id = 'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'::uuid
  AND provider = 'email';

-- Insert new identity (provider_id must match the user id for email provider)
INSERT INTO auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1',  -- provider_id is the user's UUID for email provider
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'::uuid,
  json_build_object(
    'sub', 'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1',
    'email', 'leonardo.palha@gmail.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- ======================================================
-- PASSO 3: Criar profile do usuário
-- ======================================================

INSERT INTO public.profiles (
  id,
  role,
  email,
  full_name,
  created_at,
  updated_at
) VALUES (
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'::uuid,
  'admin',
  'leonardo.palha@gmail.com',
  'Leonardo',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- ======================================================
-- PASSO 4: Verificar criação
-- ======================================================

SELECT
  u.id,
  u.email,
  u.email_confirmed_at,
  u.created_at,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.id = 'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1';

-- ======================================================
-- RESULTADO ESPERADO:
-- ======================================================
-- ✅ 1 linha retornada com:
--    - email: leonardo.palha@gmail.com
--    - email_confirmed_at: [timestamp]
--    - role: admin
--    - full_name: Leonardo
--
-- ======================================================
-- PRÓXIMOS PASSOS:
-- ======================================================
-- 1. Execute este script no SQL Editor do Supabase
-- 2. Verifique o resultado da query acima
-- 3. Acesse: http://localhost:3000/login
-- 4. Use as credenciais:
--    Email: leonardo.palha@gmail.com
--    Senha: Admin2025!
-- ======================================================
