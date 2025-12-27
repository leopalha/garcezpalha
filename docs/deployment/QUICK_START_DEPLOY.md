# ⚡ QUICK START - DEPLOY EM PRODUÇÃO

**Tempo estimado:** 30-60 minutos
**Pré-requisitos:** Git, Node.js 18+, Conta Vercel, Conta Supabase

---

## 📋 CHECKLIST RÁPIDO (5 PASSOS)

- [ ] **1. Setup Database** (10 min)
- [ ] **2. Configurar Env Vars** (10 min)
- [ ] **3. Deploy Vercel** (5 min)
- [ ] **4. Criar Admin User** (5 min)
- [ ] **5. Testar Sistema** (10 min)

---

## 🗄️ PASSO 1: SETUP DATABASE (10 min)

### 1.1 Criar Projeto Supabase

```bash
# Opção A: Via Dashboard
1. Acesse: https://supabase.com/dashboard
2. Click: "New Project"
3. Nome: garcezpalha-production
4. Database Password: [gere uma senha forte]
5. Região: South America (sa-east-1) - mais próxima do Brasil
6. Click: "Create new project"
7. Aguarde: ~2 min (provisioning)
```

### 1.2 Executar Migrations

```bash
# Opção B: Via SQL Editor (Mais Fácil)
1. No Supabase Dashboard, vá em: SQL Editor
2. Click: "+ New query"

3. MIGRATION 1 - Leads System:
   - Abra: garcezpalha/supabase/migrations/016_leads_qualification_system.sql
   - Copie TODO o conteúdo
   - Cole no SQL Editor
   - Click: "Run" (ou Ctrl+Enter)
   - Aguarde: ~10s
   - Resultado: "Success. No rows returned"

4. MIGRATION 2 - Documents System:
   - Abra: garcezpalha/supabase/migrations/017_generated_documents.sql
   - Copie TODO o conteúdo
   - Cole no SQL Editor
   - Click: "Run"
   - Aguarde: ~10s
   - Resultado: "Success. No rows returned"
```

### 1.3 Verificar Migrations

```sql
-- No SQL Editor, execute:
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Deve retornar 10 tabelas:
-- ✓ document_revisions
-- ✓ document_templates
-- ✓ follow_up_messages
-- ✓ generated_documents
-- ✓ lead_interactions
-- ✓ leads
-- ✓ payment_links
-- ✓ proposals
-- ✓ qualification_sessions
-- ✓ review_queue
```

### 1.4 Copiar Credenciais Supabase

```bash
# No Supabase Dashboard:
1. Vá em: Settings → API
2. Copie e salve (vamos usar no Passo 2):
   - Project URL: https://xxxxx.supabase.co
   - anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   - service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Checkpoint:** Database configurado com 10 tabelas

---

## 🔑 PASSO 2: CONFIGURAR ENV VARS (10 min)

### 2.1 Criar Conta Vercel

```bash
1. Acesse: https://vercel.com/signup
2. Sign up com GitHub
3. Conecte sua conta GitHub
```

### 2.2 Import Projeto no Vercel

```bash
1. Vercel Dashboard → "Add New..." → "Project"
2. Import Git Repository
3. Selecione: garcezpalha/platform (seu repo)
4. Framework Preset: Next.js (auto-detectado)
5. Root Directory: ./
6. NÃO clique "Deploy" ainda!
```

### 2.3 Configurar Environment Variables

```bash
# No Vercel, seção "Environment Variables", adicione:

# === SUPABASE (obrigatório) ===
NEXT_PUBLIC_SUPABASE_URL
# Valor: https://xxxxx.supabase.co (do passo 1.4)

NEXT_PUBLIC_SUPABASE_ANON_KEY
# Valor: eyJhbGci... (anon key do passo 1.4)

SUPABASE_SERVICE_ROLE_KEY
# Valor: eyJhbGci... (service_role key do passo 1.4)

# === NEXTAUTH (obrigatório) ===
NEXTAUTH_URL
# Valor: https://garcezpalha.com.br
# (ou use a URL da Vercel: https://seu-projeto.vercel.app)

NEXTAUTH_SECRET
# Gerar novo: https://generate-secret.vercel.app/32
# Ou terminal: openssl rand -base64 32

# === OPENAI (obrigatório para documentos) ===
OPENAI_API_KEY
# Valor: sk-proj-... (sua chave OpenAI)
# Get key: https://platform.openai.com/api-keys

# === MERCADOPAGO (opcional - pode usar teste) ===
MERCADOPAGO_ACCESS_TOKEN
# Teste: TEST-xxxxx
# Produção: APP_USR-xxxxx
# Get: https://www.mercadopago.com.br/developers/panel

NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
# Teste: TEST-xxxxx
# Produção: APP_USR-xxxxx

# === STRIPE (opcional - pode usar teste) ===
STRIPE_SECRET_KEY
# Teste: sk_test_xxxxx
# Produção: sk_live_xxxxx
# Get: https://dashboard.stripe.com/apikeys

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# Teste: pk_test_xxxxx
# Produção: pk_live_xxxxx

# === WHATSAPP (opcional - pode configurar depois) ===
WHATSAPP_CLOUD_TOKEN
# Get: Meta Business Suite
# Pode deixar em branco por enquanto

WHATSAPP_PHONE_NUMBER_ID
# Get: Meta Business Suite
# Pode deixar em branco por enquanto

# === RESEND (opcional - para emails) ===
RESEND_API_KEY
# Get: https://resend.com/api-keys
# Pode deixar em branco por enquanto

# === GOOGLE CALENDAR (opcional) ===
GOOGLE_CLIENT_ID
# Get: Google Cloud Console
# Pode deixar em branco por enquanto

GOOGLE_CLIENT_SECRET
# Get: Google Cloud Console
# Pode deixar em branco por enquanto
```

### 2.4 Aplicar para Todos Ambientes

```bash
# Para cada variável, selecione:
☑ Production
☑ Preview
☑ Development
```

✅ **Checkpoint:** Mínimo 5 variáveis obrigatórias configuradas:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXTAUTH_URL
- NEXTAUTH_SECRET

---

## 🚀 PASSO 3: DEPLOY VERCEL (5 min)

### 3.1 Primeiro Deploy

```bash
# No Vercel:
1. Click: "Deploy"
2. Aguarde: Build em progresso (~2-3 min)
3. Status: Building... → Ready
```

### 3.2 Verificar Build

```bash
# Enquanto builda, verifique logs:
- TypeScript: ✓ Checking validity of types
- Build: ✓ Compiled successfully
- Routes: ✓ Generating static pages (146/146)
- Status: ✓ Build completed

# Se houver erros:
- Verifique env vars estão corretas
- Rebuild: Deployments → ... → Redeploy
```

### 3.3 Acessar Site

```bash
# Após "Ready":
1. Click na URL: https://seu-projeto.vercel.app
2. Homepage deve carregar
3. Componentes G4 devem aparecer
4. WhatsApp float no canto direito
```

### 3.4 Configurar Domínio (Opcional)

```bash
# Se tiver domínio próprio:
1. Vercel → Settings → Domains
2. Add: garcezpalha.com.br
3. Seguir instruções DNS
4. Aguardar propagação (~1h)
```

✅ **Checkpoint:** Site acessível em Vercel URL

---

## 👤 PASSO 4: CRIAR ADMIN USER (5 min)

### 4.1 Criar Usuário Admin via SQL

```sql
-- No Supabase SQL Editor:
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
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@garcezpalha.com.br',  -- ← ALTERE SEU EMAIL
  crypt('SuaSenhaForte123!', gen_salt('bf')),  -- ← ALTERE SUA SENHA
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","name":"Admin Principal"}',
  NOW(),
  NOW()
);

-- Execute (Run)
-- Resultado: "Success. 1 row affected"
```

### 4.2 Testar Login

```bash
1. Acesse: https://seu-projeto.vercel.app/login
2. Email: admin@garcezpalha.com.br (que você definiu)
3. Senha: SuaSenhaForte123! (que você definiu)
4. Click: "Entrar"
5. Deve: Redirecionar para /admin
```

✅ **Checkpoint:** Login admin funciona

---

## 🧪 PASSO 5: TESTAR SISTEMA (10 min)

### 5.1 Teste Qualificação de Lead

```bash
# Na homepage:
1. Click no WhatsApp float (canto direito)
2. Digite: "Minha conta foi bloqueada"
3. Aguarde resposta do bot (~2s)
4. Responda as perguntas (mínimo 3):
   - Exemplo: "Banco do Brasil"
   - "Há 5 dias"
   - "Não recebi notificação"
5. Complete até o fim
6. Deve: Mostrar proposta + payment link
```

### 5.2 Verificar Lead no Banco

```sql
-- No Supabase SQL Editor:
SELECT * FROM leads ORDER BY created_at DESC LIMIT 1;

-- Deve retornar: 1 lead com:
-- ✓ client_name
-- ✓ score_total (0-100)
-- ✓ category (hot/warm/cold)
-- ✓ status (active)
```

### 5.3 Verificar Dashboard Admin

```bash
1. Acesse: /admin/leads
2. Deve: Ver lead recém-criado na lista
3. Dados: Nome, email, score, categoria
4. Status: Active
```

### 5.4 Testar Geração de Documento

```bash
1. Acesse: /admin/documentos
2. Click: "Gerar Documento"
3. Selecione: "Petição Desbloqueio Conta"
4. Preencha variáveis obrigatórias
5. Click: "Gerar"
6. Aguarde: ~3s (IA processando)
7. Deve: Documento aparece na fila de revisão
8. Click: "Revisar" → "Aprovar"
9. Click: "Download DOCX"
10. Abra arquivo: Formatação correta
```

✅ **Checkpoint:** Sistema funcionando end-to-end

---

## ✅ DEPLOY COMPLETO!

### O que está funcionando agora:

✅ **Frontend:**
- Homepage G4
- 26 páginas de produto
- Chat widget

✅ **Backend:**
- Database (10 tabelas)
- APIs (16 endpoints)
- Auth (NextAuth)

✅ **Funcionalidades:**
- Qualificação de leads
- Score automático
- Payment links
- Propostas profissionais
- Geração de documentos
- Dashboard admin

---

## 📊 PRÓXIMOS PASSOS

### Imediato (Hoje)

1. **Testar todos fluxos**
   - Qualificação completa
   - Payment link (não pagar)
   - Geração de documento
   - Dashboard admin

2. **Verificar métricas**
   - Vercel Analytics
   - Supabase Database health

3. **Compartilhar com equipe**
   - URL de produção
   - Credenciais admin
   - Documentação

### Semana 1

1. **Configurar integrações opcionais**
   - WhatsApp Cloud API (production)
   - Resend (email marketing)
   - Google Calendar

2. **Setup monitoring**
   - Uptime monitor
   - Error tracking (Sentry)

3. **Testes com leads reais**
   - Capturar 5-10 leads
   - Validar qualificação
   - Ajustar se necessário

### Semana 2-4 (Fase 10)

1. **Real-time features**
   - WebSockets (Supabase Realtime)
   - Live dashboard updates

2. **Automação**
   - Cron jobs (follow-ups)
   - Payment reminders
   - Relatórios automáticos

Ver [tasks.md](./tasks.md) para planejamento completo.

---

## 🆘 TROUBLESHOOTING RÁPIDO

### Build falha no Vercel

```bash
# Verificar:
1. Env vars estão configuradas?
2. NEXT_PUBLIC_SUPABASE_URL está correto?
3. Logs mostram erro específico?

# Solução:
1. Corrigir env var
2. Redeploy
```

### Login não funciona

```bash
# Verificar:
1. Usuário criado no Supabase?
2. Email/senha corretos?
3. NEXTAUTH_SECRET configurado?

# Solução:
1. Recriar usuário (SQL do passo 4.1)
2. Verificar NEXTAUTH_URL aponta para domínio correto
```

### Lead não salva

```bash
# Verificar:
1. Migrations executadas?
2. RLS policies ativas?
3. SUPABASE_SERVICE_ROLE_KEY configurado?

# Solução:
1. Re-executar migrations
2. Verificar SQL Editor: SELECT * FROM leads;
3. Check logs Vercel
```

### Erro "OPENAI_API_KEY not set"

```bash
# Causa: Tentou gerar documento sem chave OpenAI

# Solução:
1. Adicionar OPENAI_API_KEY no Vercel
2. Redeploy
```

---

## 📞 SUPORTE

**Documentação completa:**
- [README.md](./README.md) - Guia principal
- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) - Checklist detalhado
- [tasks.md](./tasks.md) - Próximas fases

**Issues?**
- Logs Vercel: Deployments → Build logs
- Logs Supabase: Logs & Reports
- Database: SQL Editor para queries

---

## 🎉 PARABÉNS!

Sistema G4 está **LIVE EM PRODUÇÃO**! 🚀

Agora você pode:
- ✅ Receber leads via chat
- ✅ Qualificar automaticamente
- ✅ Gerar payment links
- ✅ Criar propostas profissionais
- ✅ Produzir documentos com IA
- ✅ Monitorar no dashboard admin

**Meta:** R$ 75.000 MRR em 6 meses 🎯

---

*QUICK_START_DEPLOY.md v1.0*
*Criado: 2024-12-23*
*Tempo: 30-60 min*
*Dificuldade: ⭐⭐ Fácil (seguindo o passo a passo)*
