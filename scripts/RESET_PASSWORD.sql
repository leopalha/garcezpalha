/**
 * Script SQL para resetar senha do usuário existente
 *
 * INSTRUÇÕES:
 * 1. Acesse o Supabase Dashboard SQL Editor
 * 2. Execute este script
 * 3. Tente fazer login com a nova senha
 *
 * CREDENCIAIS:
 * Email: leonardo.palha@gmail.com
 * Nova Senha: Admin2025!
 */

-- Atualizar senha do usuário existente
UPDATE auth.users
SET
  encrypted_password = crypt('Admin2025!', gen_salt('bf')),
  updated_at = NOW()
WHERE email = 'leonardo.palha@gmail.com';

-- Verificar atualização
SELECT
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users
WHERE email = 'leonardo.palha@gmail.com';
