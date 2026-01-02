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

### 3️⃣ Terceiro: Client Portal Tables (NOVO)
```bash
psql $DATABASE_URL < 20260101_create_client_portal_tables.sql
```

Ou via Dashboard:
1. Supabase Dashboard → SQL Editor
2. Copiar conteúdo de `20260101_create_client_portal_tables.sql`
3. Executar

**O que faz:**
- ✅ Cria tabela `cases` para casos jurídicos do cliente
- ✅ Cria tabela `case_timeline` para histórico de eventos
- ✅ Cria tabela `case_documents` para documentos anexados
- ✅ Cria tabela `notifications` para notificações do usuário
- ✅ Configura RLS completo (clientes veem apenas seus casos)
- ✅ Adiciona triggers automáticos (atualiza timeline ao mudar status)
- ✅ Adiciona triggers de notificação (notifica cliente sobre mudanças)

**Verificar instalação:**
```sql
-- Verificar se as 4 tabelas foram criadas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('cases', 'case_timeline', 'case_documents', 'notifications');

-- Deve retornar 4 linhas
```

**Dados de teste (opcional):**
```sql
-- Substitua os UUIDs pelos IDs reais de seus usuários da tabela profiles
INSERT INTO cases (
  client_id,
  lawyer_id,
  service_type,
  status,
  description,
  current_phase,
  progress,
  next_step
) VALUES (
  'UUID-DO-CLIENTE-AQUI',  -- ID do perfil com role='client'
  'UUID-DO-ADVOGADO-AQUI', -- ID do perfil com role='lawyer'
  'Divórcio Consensual',
  'em_andamento',
  'Processo de divórcio consensual com partilha de bens',
  'Aguardando homologação judicial',
  65,
  'Aguardando homologação do juiz'
) RETURNING id;

-- Use o ID retornado para criar eventos
-- Substitua 'CASE-ID-RETORNADO' pelo ID do caso criado acima
INSERT INTO case_timeline (case_id, type, title, description) VALUES
  ('CASE-ID-RETORNADO', 'created', 'Caso criado', 'Serviço contratado e caso iniciado'),
  ('CASE-ID-RETORNADO', 'document_submitted', 'Documentos enviados', 'RG e CPF aprovados');
```

**APIs já integradas:**
Após executar esta migration, as seguintes APIs já funcionam com dados reais:
- `GET /api/client/dashboard` - Dashboard do cliente
- `GET /api/client/cases` - Lista de casos
- `GET /api/client/cases/[id]` - Detalhes do caso

---

## 📚 Documentação Completa

Consulte `SUPABASE_SETUP.md` na raiz do projeto para guia completo de setup.
