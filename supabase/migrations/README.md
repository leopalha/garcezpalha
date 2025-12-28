# 📦 Supabase Migrations

Migrations SQL para configuração do banco de dados Supabase.

## ⚠️ ORDEM DE EXECUÇÃO

**IMPORTANTE:** Execute as migrations na ordem abaixo para evitar erros de dependência:

### 1️⃣ Primeiro: Profiles Table
```bash
psql $DATABASE_URL < 20251227_profiles_table.sql
```

Ou via Dashboard:
1. Supabase Dashboard → SQL Editor
2. Copiar conteúdo de `20251227_profiles_table.sql`
3. Executar

**O que faz:**
- ✅ Cria tabela `profiles` para autenticação
- ✅ Configura RLS (Row Level Security)
- ✅ Cria policies de acesso (admin/lawyer/user)
- ✅ Adiciona trigger de `updated_at`

**Após executar, crie seu primeiro admin:**
```sql
-- 1. Primeiro crie um usuário via Supabase Auth Dashboard
-- 2. Copie o UUID do usuário criado
-- 3. Execute:
INSERT INTO public.profiles (id, role, email, full_name)
VALUES ('UUID-DO-USUARIO', 'admin', 'seu@email.com', 'Seu Nome');
```

---

### 2️⃣ Segundo: Messages Table
```bash
psql $DATABASE_URL < 20251227_messages_table.sql
```

Ou via Dashboard:
1. Supabase Dashboard → SQL Editor
2. Copiar conteúdo de `20251227_messages_table.sql`
3. Executar

**O que faz:**
- ✅ Cria tabela `messages` para histórico de conversas
- ✅ Adiciona índices para performance
- ✅ Configura RLS baseado em `profiles.role`
- ✅ Cria foreign key para `conversations`
- ✅ Adiciona trigger de `updated_at`
- ✅ Cria view `recent_messages` para analytics

**Nota:** Esta migration é resiliente - se `profiles` não existir, ela criará a tabela mas não as policies. Execute `profiles` primeiro para obter funcionalidade completa.

---

## 🔍 Verificação

Após executar as migrations, verifique se tudo está correto:

```sql
-- Verificar tabelas criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'messages');

-- Verificar RLS habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'messages');

-- Verificar policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verificar se há algum profile admin
SELECT id, role, email, full_name
FROM public.profiles
WHERE role = 'admin';
```

---

## 🆘 Troubleshooting

### Erro: "relation 'profiles' does not exist"
**Solução:** Execute a migration `20251227_profiles_table.sql` primeiro.

### Erro: "column 'role' does not exist"
**Solução:** A tabela `profiles` não tem a coluna `role`. Recrie a tabela usando a migration correta.

### Erro: "permission denied"
**Solução:** Verifique se você está usando a `service_role_key` ou se seu usuário tem permissões adequadas.

### Messages table criada mas sem policies
**Solução:** Execute novamente a migration `messages_table.sql` DEPOIS de criar `profiles`.

---

## 📚 Documentação Completa

Consulte `SUPABASE_SETUP.md` na raiz do projeto para guia completo de setup.
