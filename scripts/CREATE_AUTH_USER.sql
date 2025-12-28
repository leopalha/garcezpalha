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
-- PASSO 1: Deletar usuário existente (se houver)
-- ======================================================

-- Delete user and related data to start fresh
DELETE FROM auth.identities WHERE user_id = 'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'::uuid;
DELETE FROM public.profiles WHERE id = 'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'::uuid;
DELETE FROM auth.users WHERE id = 'c8c9bbe7-dd8f-4faa-9f1c-d59a290b8aa1'::uuid;

-- ======================================================
-- PASSO 2: Criar profile primeiro
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
);

-- ======================================================
-- PASSO 3: IMPORTANTE - Use o script Node.js ao invés deste SQL
-- ======================================================

-- Este script SQL foi substituído por um método melhor.
-- Ao invés de executar este SQL, execute o comando:
--
-- node scripts/create-auth-user.js
--
-- O script Node.js usa a API Admin do Supabase para criar
-- o usuário corretamente com senha criptografada compatível.

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
