-- IMPORTANTE: Execute este SQL no Supabase SQL Editor
-- Este script cria um usuário no auth.users com o UUID que já existe na tabela profiles

-- 1. Deletar usuário existente se houver (caso tenha criado com UUID diferente)
DELETE FROM auth.users WHERE email = 'leonardo.palha@gmail.com';

-- 2. Criar usuário com UUID específico que já existe em profiles
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_super_admin,
  last_sign_in_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1',  -- UUID que já existe em profiles
  'authenticated',
  'authenticated',
  'leonardo.palha@gmail.com',
  crypt('Admin2025!', gen_salt('bf')),      -- SENHA: Admin2025! (mude se preferir)
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Leonardo"}',
  NOW(),
  NOW(),
  false,
  NOW()
);

-- 3. Criar entrada na auth.identities
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1',
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1',
  'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1',
  jsonb_build_object(
    'sub', 'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1',
    'email', 'leonardo.palha@gmail.com',
    'email_verified', true,
    'provider', 'email'
  ),
  'email',
  NOW(),
  NOW(),
  NOW()
);

-- 4. Verificar se deu certo
SELECT
  u.id,
  u.email,
  u.created_at,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE u.email = 'leonardo.palha@gmail.com';

-- RESULTADO ESPERADO:
-- id                                   | email                    | role  | full_name
-- -------------------------------------|--------------------------|-------|----------
-- c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1 | leonardo.palha@gmail.com | admin | Leonardo
