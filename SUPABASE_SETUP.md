# 🗄️ SUPABASE SETUP GUIDE

**Projeto:** Garcez Palha - Plataforma Jurídica Autônoma
**Última Atualização:** 27/12/2025

---

## 📋 ÍNDICE

1. [Tabelas Necessárias](#tabelas-necessárias)
2. [Migrations](#migrations)
3. [Row Level Security (RLS)](#row-level-security-rls)
4. [Realtime](#realtime)
5. [Storage](#storage)
6. [Funções e Triggers](#funções-e-triggers)

---

## 1. TABELAS NECESSÁRIAS

### 1.1 `conversations` ✅

**Status:** Já existe

```sql
-- Conversation tracking for agent state machine
CREATE TABLE IF NOT EXISTS public.conversations (
  conversation_id TEXT PRIMARY KEY,
  phone_number TEXT,
  email TEXT,
  channel TEXT CHECK (channel IN ('website', 'whatsapp', 'telegram', 'email')),
  client JSONB DEFAULT '{}'::jsonb,
  classification JSONB DEFAULT '{}'::jsonb,
  qualification JSONB DEFAULT '{}'::jsonb,
  proposal JSONB DEFAULT '{}'::jsonb,
  status JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.2 `messages` 🆕

**Status:** NOVA - Requer migration

**Migration:** `supabase/migrations/20251227_messages_table.sql`

```bash
# Run migration
psql $DATABASE_URL < supabase/migrations/20251227_messages_table.sql
```

**Ou via Supabase Dashboard:**
1. Dashboard → SQL Editor
2. Copiar conteúdo de `supabase/migrations/20251227_messages_table.sql`
3. Execute

**Estrutura:**
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.3 `profiles` ⚠️

**Status:** Necessária para autenticação

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'lawyer', 'client', 'partner')),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );
```

### 1.4 `leads` ✅

**Status:** Já existe

```sql
-- Lead management table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT,
  status TEXT,
  score INTEGER,
  product_id TEXT,
  qualification_data JSONB,
  payment_status TEXT,
  payment_provider TEXT,
  payment_id TEXT,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 2. MIGRATIONS

### Executar Migrations

**Opção 1: Via Supabase CLI**
```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_PROJECT_REF

# Run migrations
supabase db push
```

**Opção 2: Via SQL Editor (Dashboard)**
1. Acessar: https://supabase.com/dashboard/project/YOUR_PROJECT/sql
2. Copiar SQL de `supabase/migrations/20251227_messages_table.sql`
3. Clicar "Run"

### Lista de Migrations

| Arquivo | Data | Descrição | Status |
|---------|------|-----------|--------|
| `20251227_messages_table.sql` | 27/12/2025 | Cria tabela messages + indexes + RLS | 🆕 **EXECUTAR** |

---

## 3. ROW LEVEL SECURITY (RLS)

### Habilitar RLS em Todas as Tabelas

```sql
-- Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

### Policies Críticas

**Admin/Lawyer Access:**
```sql
-- Admins e lawyers podem ver tudo
CREATE POLICY "Admin/Lawyer full access to conversations"
  ON public.conversations
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role IN ('admin', 'lawyer')
    )
  );

CREATE POLICY "Admin/Lawyer full access to messages"
  ON public.messages
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role IN ('admin', 'lawyer')
    )
  );
```

**System/Service Role:**
```sql
-- Service role (APIs) pode fazer tudo
GRANT ALL ON public.conversations TO service_role;
GRANT ALL ON public.messages TO service_role;
GRANT ALL ON public.leads TO service_role;
```

---

## 4. REALTIME

### Habilitar Realtime

**Dashboard → Database → Replication**

Habilitar para as tabelas:
- ✅ `conversations`
- ✅ `messages`
- ✅ `leads`

**Via SQL:**
```sql
-- Enable realtime for conversations
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Enable realtime for leads
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
```

### Testar Realtime

```typescript
const supabase = createClient()

const channel = supabase
  .channel('test-channel')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'messages',
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

---

## 5. STORAGE (OPCIONAL - Para Documentos)

### Criar Bucket

**Dashboard → Storage → Create Bucket**

```
Bucket Name: documents
Public: No (privado)
File size limit: 10 MB
Allowed MIME types: application/pdf, image/*, application/msword
```

**Via SQL:**
```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);
```

### Policies de Storage

```sql
-- Users can upload their own documents
CREATE POLICY "Users can upload documents"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view their own documents
CREATE POLICY "Users can view own documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'documents' AND
    auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );
```

---

## 6. FUNÇÕES E TRIGGERS

### Auto-update `updated_at`

```sql
-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 🚀 CHECKLIST DE SETUP

### Primeira Instalação

- [ ] 1. Criar projeto no Supabase
- [ ] 2. Copiar credenciais (.env):
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
  ```
- [ ] 3. Executar migration `20251227_messages_table.sql`
- [ ] 4. Criar tabela `profiles` (se não existir)
- [ ] 5. Habilitar RLS em todas as tabelas
- [ ] 6. Criar policies de acesso
- [ ] 7. Habilitar Realtime para `conversations`, `messages`, `leads`
- [ ] 8. (Opcional) Criar bucket `documents` para uploads
- [ ] 9. Criar triggers de `updated_at`
- [ ] 10. Testar autenticação e RLS

### Verificação Rápida

```sql
-- Verificar tabelas existentes
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('conversations', 'messages', 'leads', 'profiles');

-- Verificar RLS habilitado
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- Verificar policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';

-- Verificar realtime habilitado
SELECT * FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
```

---

## ⚠️ TROUBLESHOOTING

### Erro: "relation 'messages' does not exist"

**Solução:** Executar migration `20251227_messages_table.sql`

### Erro: "permission denied for table messages"

**Solução:** Verificar RLS policies e service_role grants

### Erro: "realtime subscription failed"

**Solução:**
1. Verificar se Realtime está habilitado
2. Executar: `ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;`

### Erro: "new row violates row-level security policy"

**Solução:**
1. Verificar se usuário está autenticado
2. Verificar se role está correto em `profiles`
3. Revisar policies

---

## 📚 RECURSOS

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Guide](https://supabase.com/docs/guides/realtime)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

**Última Atualização:** 27/12/2025
**Autor:** Claude Sonnet 4.5 (MANUS v6.0)
