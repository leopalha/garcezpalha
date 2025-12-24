-- Migration: Restrição de Exclusão de Usuários - Apenas Admin
-- Created: 2025-12-25
-- Description: Adiciona políticas RLS para garantir que apenas admins possam excluir usuários

-- ============================================================================
-- FUNÇÃO AUXILIAR: Verificar se usuário é admin
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- POLÍTICAS RLS PARA TABELA USERS
-- ============================================================================

-- Habilitar RLS na tabela users se ainda não estiver
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas de DELETE se existirem
DROP POLICY IF EXISTS "Users can delete own account" ON users;
DROP POLICY IF EXISTS "Allow delete for admin users" ON users;

-- Política: Apenas admins podem deletar usuários
CREATE POLICY "Only admins can delete users"
ON users
FOR DELETE
TO authenticated
USING (is_admin());

-- Política: Admins podem atualizar qualquer usuário
DROP POLICY IF EXISTS "Admins can update any user" ON users;
CREATE POLICY "Admins can update any user"
ON users
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Política: Usuários podem atualizar apenas seu próprio perfil (exceto role)
DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
ON users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid()
  AND role = (SELECT role FROM users WHERE id = auth.uid()) -- Impede mudança de role
);

-- ============================================================================
-- POLÍTICAS RLS PARA TABELA PROFILES
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem deletar profiles
DROP POLICY IF EXISTS "Only admins can delete profiles" ON profiles;
CREATE POLICY "Only admins can delete profiles"
ON profiles
FOR DELETE
TO authenticated
USING (is_admin());

-- ============================================================================
-- FUNÇÃO: Deletar usuário e dados relacionados (apenas admin)
-- ============================================================================

CREATE OR REPLACE FUNCTION admin_delete_user(user_id_to_delete UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  deleted_email TEXT;
  deleted_role TEXT;
BEGIN
  -- Verificar se usuário atual é admin
  IF NOT is_admin() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Apenas administradores podem excluir usuários'
    );
  END IF;

  -- Verificar se usuário a ser deletado existe
  SELECT email, role INTO deleted_email, deleted_role
  FROM users
  WHERE id = user_id_to_delete;

  IF deleted_email IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Usuário não encontrado'
    );
  END IF;

  -- Impedir que admin delete a si mesmo
  IF user_id_to_delete = auth.uid() THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Você não pode excluir sua própria conta'
    );
  END IF;

  -- Deletar registros relacionados (CASCADE deve cuidar da maioria)
  -- Profile será deletado automaticamente se houver CASCADE
  -- Clients, contracts, etc. também

  -- Deletar o usuário (auth.users será deletado via trigger ou função separada)
  DELETE FROM users WHERE id = user_id_to_delete;

  -- Retornar sucesso
  RETURN jsonb_build_object(
    'success', true,
    'deleted_user', jsonb_build_object(
      'id', user_id_to_delete,
      'email', deleted_email,
      'role', deleted_role
    )
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================================
-- COMENTÁRIOS
-- ============================================================================

COMMENT ON FUNCTION is_admin() IS 'Verifica se o usuário autenticado é admin';
COMMENT ON FUNCTION admin_delete_user(UUID) IS 'Deleta usuário e dados relacionados (apenas admin). Retorna JSON com resultado.';
COMMENT ON POLICY "Only admins can delete users" ON users IS 'Apenas administradores podem excluir contas de usuários';
