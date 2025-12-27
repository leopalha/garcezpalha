# 🔐 Sistema de Gestão de Usuários - Apenas Admin

**Data de Implementação:** 2025-12-25
**Status:** ✅ Completo e Funcional

---

## 📋 Resumo

Sistema completo de gestão de usuários com controle administrativo rigoroso, onde **apenas administradores podem excluir contas de usuários**. Implementado com múltiplas camadas de segurança e validações.

---

## 🛡️ Camadas de Segurança

### 1. Banco de Dados (RLS - Row Level Security)

**Migration:** `20251225000100_user_deletion_admin_only.sql`

#### Políticas Criadas:

```sql
-- Apenas admins podem deletar usuários
CREATE POLICY "Only admins can delete users"
ON users FOR DELETE TO authenticated
USING (is_admin());

-- Admins podem atualizar qualquer usuário
CREATE POLICY "Admins can update any user"
ON users FOR UPDATE TO authenticated
USING (is_admin()) WITH CHECK (is_admin());

-- Usuários podem atualizar apenas seu próprio perfil (exceto role)
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid() AND role = (SELECT role FROM users WHERE id = auth.uid()));
```

#### Funções de Segurança:

**`is_admin()`**
- Verifica se o usuário autenticado é admin
- Usada em políticas RLS
- `SECURITY DEFINER` para proteção

**`admin_delete_user(user_id UUID)`**
- Deleta usuário e dados relacionados
- Retorna JSON com resultado
- Validações:
  - ✅ Verifica se executor é admin
  - ✅ Verifica se usuário existe
  - ✅ Impede admin de deletar a si mesmo
  - ✅ Deleta dados relacionados em cascade

---

### 2. Backend (TRPC Router)

**Arquivo:** `src/lib/trpc/routers/users.ts`

#### Endpoints Protegidos:

**`users.list`**
- Lista todos os usuários com profiles
- Apenas admin pode acessar
- Retorna: id, email, role, created_at, profile (nome, telefone)

**`users.stats`**
- Estatísticas de usuários por role
- Apenas admin pode acessar
- Retorna: total, admins, lawyers, partners, clients

**`users.updateRole`**
- Atualiza role de um usuário
- Apenas admin pode executar
- **Impede admin de mudar seu próprio role**
- Validação: role deve ser um dos valores permitidos

**`users.delete`**
- Deleta usuário permanentemente
- Apenas admin pode executar
- **Impede admin de deletar a si mesmo**
- Chama função `admin_delete_user()` do banco
- Retorna sucesso ou erro

---

### 3. Frontend (Interface Admin)

**Página:** `/admin/usuarios`
**Arquivo:** `src/app/(admin)/admin/usuarios/page.tsx`

#### Funcionalidades:

**Dashboard de Estatísticas**
- Cards com contadores por role
- Total geral de usuários
- Visualização rápida da distribuição

**Filtros e Busca**
- Busca por email ou nome
- Filtro por role (admin, lawyer, partner, client)
- Atualização em tempo real

**Lista de Usuários**
- Email, nome, telefone
- Badge colorido por role
- Data de cadastro
- Botão de exclusão (vermelho)

**Confirmação de Exclusão (Dupla)**
1. Click no botão "Excluir"
2. Dialog de alerta aparece com:
   - ⚠️ Aviso de irreversibilidade
   - Email do usuário a ser excluído
   - Lista do que será perdido
   - Campo de texto para digitar "EXCLUIR"
3. Botão só ativa após digitar "EXCLUIR" corretamente
4. Loading spinner durante exclusão
5. Toast de confirmação ou erro

---

## 🎨 UI/UX

### Cores por Role

```typescript
const roleColors = {
  admin: 'bg-red-100 text-red-800',      // Vermelho
  lawyer: 'bg-blue-100 text-blue-800',   // Azul
  partner: 'bg-purple-100 text-purple-800', // Roxo
  client: 'bg-green-100 text-green-800',  // Verde
}
```

### Labels Traduzidos

```typescript
const roleLabels = {
  admin: 'Administrador',
  lawyer: 'Advogado',
  partner: 'Parceiro',
  client: 'Cliente',
}
```

### Dialog de Exclusão

- ⚠️ **Título em vermelho** para chamar atenção
- **Background amarelo claro** na área de confirmação
- **Lista detalhada** do que será perdido:
  - Todos os dados do usuário
  - Processos, documentos e histórico
  - Ação irreversível
- **Campo de confirmação** tipo texto (não checkbox)
- **Botão vermelho** para ação destrutiva

---

## 🔒 Validações de Segurança

### No Frontend (TypeScript)
1. ✅ Verifica se texto de confirmação é exatamente "EXCLUIR"
2. ✅ Desabilita botão durante loading
3. ✅ Mostra erro se confirmação incorreta
4. ✅ Toast de feedback após operação

### No Backend (TRPC)
1. ✅ Verifica se usuário atual é admin
2. ✅ Verifica se usuário a deletar existe
3. ✅ Impede admin de deletar a si mesmo
4. ✅ Retorna erro detalhado se algo falhar

### No Banco de Dados (RLS)
1. ✅ Política RLS valida permissão admin
2. ✅ Função `is_admin()` verifica role
3. ✅ Função `admin_delete_user()` faz validações adicionais
4. ✅ Cascade delete para dados relacionados

---

## 📊 Estatísticas

A página mostra 5 cards de estatísticas:

1. **Total** - Todos os usuários
2. **Admins** - Administradores (vermelho)
3. **Advogados** - Lawyers (azul)
4. **Parceiros** - Partners (roxo)
5. **Clientes** - Clients (verde)

---

## 🧪 Como Testar

### 1. Acesso à Página
```
URL: https://garcezpalha.com/admin/usuarios
Requer: Login como admin
```

### 2. Testar Permissões

**Como Admin:**
- ✅ Deve ver todos os usuários
- ✅ Deve conseguir filtrar e buscar
- ✅ Deve ver botão "Excluir"
- ✅ Deve conseguir excluir outros usuários
- ❌ Não deve conseguir excluir a si mesmo

**Como Lawyer/Partner/Client:**
- ❌ Não deve ter acesso à página `/admin/usuarios`
- ❌ Requisições diretas à API devem retornar erro 403

### 3. Testar Exclusão

```typescript
// 1. Click em "Excluir" para um usuário
// 2. Dialog abre com confirmação
// 3. Digite exatamente "EXCLUIR"
// 4. Botão ativa
// 5. Click em "Excluir Permanentemente"
// 6. Aguarde spinner
// 7. Toast de sucesso aparece
// 8. Lista atualiza automaticamente
```

---

## 🚀 Endpoints TRPC

### Listar Usuários
```typescript
const users = await trpc.users.list.useQuery()
// Retorna: { id, email, role, created_at, profiles: { full_name, phone } }[]
```

### Obter Estatísticas
```typescript
const stats = await trpc.users.stats.useQuery()
// Retorna: { total, admins, lawyers, partners, clients }
```

### Deletar Usuário
```typescript
await trpc.users.delete.useMutation({
  userId: 'uuid-do-usuario'
})
// Retorna: { success: true, data: {...} }
```

### Atualizar Role
```typescript
await trpc.users.updateRole.useMutation({
  userId: 'uuid-do-usuario',
  role: 'lawyer'
})
// Retorna: user atualizado
```

---

## 📁 Arquivos Criados/Modificados

### Novos Arquivos
```
supabase/migrations/20251225000100_user_deletion_admin_only.sql
src/lib/trpc/routers/users.ts
src/app/(admin)/admin/usuarios/page.tsx
```

### Arquivos Modificados
```
src/lib/trpc/routers/index.ts  // Adicionado usersRouter
src/app/(admin)/layout.tsx      // Adicionado menu "Usuários"
```

---

## 🔧 Comandos SQL Úteis

### Verificar Políticas
```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

### Verificar Usuários
```sql
SELECT id, email, role, created_at FROM users ORDER BY created_at DESC;
```

### Contar por Role
```sql
SELECT role, COUNT(*) FROM users GROUP BY role;
```

### Testar Função is_admin (como admin)
```sql
SELECT is_admin(); -- Deve retornar true
```

---

## ⚠️ Avisos Importantes

1. **Backup Antes de Excluir**
   - Sempre faça backup antes de excluir usuários em produção
   - Exclusão é irreversível

2. **Admin Não Pode se Excluir**
   - Proteção para evitar lockout
   - Precisa de outro admin para excluir

3. **Dados em Cascade**
   - Profiles são deletados automaticamente
   - Clients, contracts, etc. também são deletados
   - Revise relacionamentos antes de excluir

4. **Apenas para Admins**
   - Lawyers NÃO têm acesso
   - Partners NÃO têm acesso
   - Clients NÃO têm acesso
   - Apenas role='admin'

---

## 🎯 Próximas Melhorias Sugeridas

1. **Soft Delete** - Ao invés de excluir, marcar como "inativo"
2. **Histórico de Exclusões** - Log de quem deletou quem e quando
3. **Restauração** - Possibilidade de restaurar usuário excluído (30 dias)
4. **Exportação** - Exportar dados do usuário antes de excluir
5. **Notificação** - Email para usuário avisando da exclusão
6. **Audit Log** - Log detalhado de todas as ações admin

---

## 📝 Changelog

**v1.0.0 - 2025-12-25**
- ✅ Implementação inicial
- ✅ RLS policies no Supabase
- ✅ Funções de segurança is_admin() e admin_delete_user()
- ✅ TRPC router users com 4 endpoints
- ✅ Interface admin completa
- ✅ Confirmação dupla para exclusão
- ✅ Testes e validações

---

**Desenvolvido por:** Claude Sonnet 4.5
**Data:** 2025-12-25
**Status:** ✅ Produção
**Segurança:** 🔒 Alta

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do Supabase
2. Teste com role='admin' confirmado
3. Revise as políticas RLS
4. Consulte este documento
