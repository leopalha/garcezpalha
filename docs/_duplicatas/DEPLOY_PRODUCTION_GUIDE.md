# 🚀 GUIA COMPLETO DE DEPLOY - GARCEZ PALHA PLATFORM

**Versão**: 2.0.0 (P1 + P2 Complete)
**Data**: 30/12/2024
**Plataforma**: Vercel + Supabase
**Tempo Estimado**: 2-3 horas

---

## 📋 PRÉ-REQUISITOS

### ✅ Contas Necessárias:

**Obrigatórias (CORE)**:
1. ✅ [Vercel](https://vercel.com) - Hospedagem (Free tier OK para começar)
2. ✅ [Supabase](https://supabase.com) - Database PostgreSQL (Free tier OK)
3. ✅ [OpenAI](https://platform.openai.com) - GPT-4 (~$20/mês estimado)
4. ✅ [D-ID](https://studio.d-id.com) - Avatar visual ($5/mês trial)

**Recomendadas (P2 Automation)**:
5. ⭐ [Resend](https://resend.com) - Emails (3k/mês grátis!)
6. ⭐ [Railway](https://railway.app) - Redis ($5/mês)
7. ⭐ [ClickSign](https://clicksign.com) - Assinaturas digitais (R$ 79/mês)
8. ⭐ [Meta Business](https://business.facebook.com) - WhatsApp Cloud API (Grátis!)

**Opcionais**:
9. [MercadoPago](https://mercadopago.com.br) - Pagamentos PIX
10. [Google Cloud](https://console.cloud.google.com) - Calendar API
11. [Telegram](https://telegram.org) - Notificações

---

## 🗄️ PASSO 1: DATABASE SETUP (30 min)

### 1.1 Criar Projeto Supabase

```bash
1. Acesse: https://supabase.com/dashboard
2. Clique: "New Project"
3. Preencha:
   - Name: garcez-palha-prod
   - Database Password: [GERE UMA SENHA FORTE - guarde bem!]
   - Region: South America (sa-east-1) # Mais próximo do Brasil
4. Clique: "Create new project"
5. Aguarde ~2 minutos
```

### 1.2 Aplicar Migrations

**Via SQL Editor (Recomendado)**:

```bash
# 1. Supabase Dashboard → SQL Editor → New query

# 2. Copie e execute UMA POR VEZ (em ordem):

# Core schemas
d:\garcezpalha\supabase\migrations\001_initial_schema.sql
d:\garcezpalha\supabase\migrations\002_seed_data.sql

# Integrations
d:\garcezpalha\supabase\migrations\003_telegram_integration.sql
d:\garcezpalha\supabase\migrations\004_oab_compliance_pricing.sql

# Features P1
d:\garcezpalha\supabase\migrations\014_client_documents.sql
d:\garcezpalha\supabase\migrations\020_add_products_table.sql

# Conversations (P2)
d:\garcezpalha\supabase\migrations\20251227120000_create_conversations_messages.sql

# AI Analysis (P1-009)
d:\garcezpalha\supabase\migrations\030_add_document_ai_analysis.sql

# NPS System (P2)
d:\garcezpalha\supabase\migrations\20251229000001_add_nps_system.sql

# ⚠️ IMPORTANTE: Execute uma migration por vez!
# Verifique mensagens de erro antes de continuar
```

### 1.3 Criar Usuário Admin

```sql
-- Via SQL Editor

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
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'leonardo.palha@gmail.com', -- ⚠️ ALTERAR PARA SEU EMAIL
  crypt('SuaSenhaSegura123!', gen_salt('bf')), -- ⚠️ ALTERAR SENHA
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin","full_name":"Leonardo Palha"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- ✅ Se executou sem erro, user admin foi criado!
```

### 1.4 Copiar API Keys

```bash
# Supabase Dashboard → Settings → API

# ✅ Copie estes 3 valores (vamos usar no passo 2):

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (NUNCA EXPONHA!)
```

---

## ⚙️ PASSO 2: ENVIRONMENT VARIABLES (20 min)

### 2.1 Gerar Secrets

```bash
# Abra terminal e execute:

# NEXTAUTH_SECRET
openssl rand -base64 32
# Resultado: algo como "a1B2c3D4e5F6g7H8i9J0..."

# CRON_SECRET
openssl rand -base64 32
# Resultado: diferente do anterior
```

### 2.2 Criar .env.local

```bash
# Na raiz do projeto
cp .env.example .env.local
```

### 2.3 Preencher CORE (Obrigatório)

```env
# ===== SUPABASE (do passo 1.4) =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ===== NEXTAUTH (gerado no passo 2.1) =====
NEXTAUTH_URL=http://localhost:3000 # Dev - trocar em produção
NEXTAUTH_SECRET=a1B2c3D4e5F6g7H8... # Do passo 2.1

# ===== OPENAI (pegar em https://platform.openai.com/api-keys) =====
OPENAI_API_KEY=sk-proj-xxxxx...
NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxx... # Mesmo valor

# ===== D-ID (pegar em https://studio.d-id.com/account-settings) =====
DID_API_KEY=your-d-id-key-here

# ===== GENERAL =====
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 2.4 Adicionar P2 Automation (Recomendado)

```env
# ===== REDIS (Railway - https://railway.app) =====
# 1. Criar projeto no Railway
# 2. Add → Redis
# 3. Copiar variável "REDIS_URL"
REDIS_URL=redis://default:password@monorail.proxy.rlwy.net:12345

# ===== RESEND (https://resend.com) =====
# 1. Create API Key
# 2. Verify domain (garcezpalha.com)
RESEND_API_KEY=re_xxxxx...
RESEND_FROM_EMAIL=contato@garcezpalha.com
RESEND_WEBHOOK_SECRET=whsec_xxxxx...

# ===== WHATSAPP CLOUD API (https://business.facebook.com) =====
# 1. Create Business App
# 2. Add WhatsApp Product
# 3. Get Phone Number ID and Token
WHATSAPP_CLOUD_TOKEN=EAAxxxxx...
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_VERIFY_TOKEN=seu_token_personalizado_aqui

# ===== CLICKSIGN (https://app.clicksign.com) =====
# 1. Settings → API
# 2. Generate token
CLICKSIGN_API_TOKEN=xxxxx-xxxxx-xxxxx
CLICKSIGN_WEBHOOK_SECRET=your_secret

# ===== CRON SECRET (gerado no passo 2.1) =====
CRON_SECRET=X9y8Z7w6V5u4... # Do passo 2.1
```

### 2.5 Opcionais (Adicionar se quiser)

```env
# MERCADOPAGO (Pagamentos)
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxxx... # Teste primeiro!
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-xxxxx...

# GOOGLE CALENDAR (Agendamentos)
GOOGLE_CALENDAR_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CALENDAR_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_CALENDAR_REFRESH_TOKEN=1//xxxxx
ADMIN_EMAIL=leonardo.palha@gmail.com

# TELEGRAM (Notificações)
TELEGRAM_BOT_TOKEN=123456789:ABCdef...

# GOOGLE ANALYTICS
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

## 🧪 PASSO 3: TESTAR LOCALMENTE (15 min)

### 3.1 Instalar Dependências

```bash
npm install
```

### 3.2 Build

```bash
npm run build
```

**✅ Se build passou sem erros, está OK para deploy!**

### 3.3 Testar Desenvolvimento

```bash
npm run dev
```

**Acessar**: http://localhost:3000

**Testar**:
- ✅ Login funciona (/login)
- ✅ Chat carrega (/)
- ✅ Admin dashboard acessível (/admin)

---

## 📦 PASSO 4: DEPLOY NA VERCEL (30 min)

### 4.1 Conectar Git

```bash
# Se ainda não fez:
git init
git add .
git commit -m "feat: P1 + P2 complete - ready for production"
git branch -M main
git remote add origin https://github.com/seu-usuario/garcez-palha.git
git push -u origin main
```

### 4.2 Import no Vercel

```bash
1. Acesse: https://vercel.com/new
2. "Import Git Repository"
3. Selecione: garcez-palha (ou seu repo)
4. Framework Preset: Next.js (detectado automaticamente)
5. Root Directory: ./
6. NÃO clique em "Deploy" ainda!
```

### 4.3 Configurar Environment Variables

```bash
# Vercel Dashboard → Settings → Environment Variables

# ⚠️ IMPORTANTE: Adicionar TODAS as variáveis de .env.local

# Para cada variável:
# 1. Name: NEXT_PUBLIC_SUPABASE_URL (exemplo)
# 2. Value: https://xxxxx.supabase.co
# 3. Environments: ✅ Production ✅ Preview ✅ Development
# 4. Click "Add"

# ⚠️ DICA: Use valores de PRODUÇÃO, não teste!

# Variables CRÍTICAS:
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY (NÃO expor!)
✅ NEXTAUTH_SECRET
✅ NEXTAUTH_URL (https://garcezpalha.com em prod)
✅ OPENAI_API_KEY
✅ NEXT_PUBLIC_OPENAI_API_KEY
✅ DID_API_KEY
✅ CRON_SECRET

# Variables P2 (se configurou):
✅ REDIS_URL
✅ RESEND_API_KEY
✅ WHATSAPP_CLOUD_TOKEN
✅ CLICKSIGN_API_TOKEN
```

### 4.4 Deploy!

```bash
# Vercel Dashboard
1. Click "Deploy"
2. Aguarde 3-5 minutos
3. ✅ Ver "Visit" quando concluir
```

### 4.5 Configurar Domínio (Opcional)

```bash
# Vercel → Settings → Domains
1. Add Domain: garcezpalha.com
2. Seguir instruções DNS
3. Aguardar propagação (até 48h)
4. ✅ Verify

# Atualizar NEXTAUTH_URL:
NEXTAUTH_URL=https://garcezpalha.com
```

---

## ⏰ PASSO 5: CONFIGURAR CRON JOBS (10 min)

### 5.1 Verificar vercel.json

Já existe em `d:\garcezpalha\vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/email/sequences/cron",
      "schedule": "*/15 * * * *"
    },
    {
      "path": "/api/process-monitor/cron",
      "schedule": "*/30 * * * *"
    },
    {
      "path": "/api/appointments/reminders/cron",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/nps/send-surveys/cron",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### 5.2 Ativar Crons

```bash
# Vercel detecta automaticamente vercel.json

# Para verificar:
1. Vercel Dashboard → Project → Settings → Cron
2. ✅ Deve mostrar 4 crons ativos
```

### 5.3 Testar Crons

```bash
# Via curl (trocar URL e CRON_SECRET)

curl -X POST https://garcezpalha.com/api/email/sequences/cron \
  -H "Authorization: Bearer SEU_CRON_SECRET_AQUI"

# ✅ Esperado: Status 200
# ❌ Se 401: CRON_SECRET incorreto
```

---

## 📊 PASSO 6: MONITORING (30 min)

### 6.1 Vercel Analytics (Grátis)

```bash
# Já ativo automaticamente!

# Para ver:
Vercel → Project → Analytics
```

### 6.2 Sentry (Error Tracking)

```bash
# 1. Criar conta: https://sentry.io/signup
# 2. Create Project → Next.js
# 3. Instalar:

npm install @sentry/nextjs

# 4. Inicializar:
npx @sentry/wizard@latest -i nextjs

# 5. Copiar DSN:
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# 6. Adicionar no Vercel Environment Variables
```

### 6.3 Better Uptime (Healthcheck)

```bash
# 1. Criar conta: https://betteruptime.com (Free tier OK)
# 2. Add Monitor → HTTP(S)
# 3. URL: https://garcezpalha.com/api/health
# 4. Interval: 1 minute
# 5. Notifications: Email/SMS

# ✅ Vai alertar se site cair!
```

### 6.4 LogRocket (Session Replay - Opcional)

```bash
# 1. Criar conta: https://logrocket.com
# 2. Create Application
# 3. Instalar:

npm install logrocket

# 4. Adicionar em _app.tsx (já feito se usou template)

# 5. Copiar App ID:
NEXT_PUBLIC_LOGROCKET_ID=xxx/xxx
```

---

## ✅ PASSO 7: VALIDAÇÃO PÓS-DEPLOY (20 min)

### 7.1 Healthcheck

```bash
curl https://garcezpalha.com/api/health

# ✅ Esperado:
{
  "status": "ok",
  "timestamp": "2024-12-30T...",
  "services": {
    "database": "connected",
    "openai": "ok",
    "redis": "connected"
  }
}
```

### 7.2 Testar Fluxos

✅ **Login**:
```
1. https://garcezpalha.com/login
2. Email: leonardo.palha@gmail.com (do passo 1.3)
3. Senha: a que definiu
4. ✅ Deve redirecionar para /admin
```

✅ **Chat de Voz**:
```
1. https://garcezpalha.com
2. Permitir microfone
3. Falar: "Olá, preciso de ajuda"
4. ✅ Avatar deve responder com áudio e lip sync
```

✅ **Auto-Escalation (P2-002)**:
```
1. Iniciar conversa no chat
2. Simular lead com score >= 80
3. ✅ Deve escalar automaticamente
4. ✅ Admin recebe notificação (email se configurou Resend)
```

✅ **Geração de Proposta (P1-007)**:
```
1. /admin/leads
2. Selecionar lead
3. Gerar proposta
4. ✅ Email enviado (se Resend configurado)
```

✅ **Upload de Documentos (P1-009)**:
```
1. Cliente faz upload de RG
2. ✅ AI analisa e extrai dados
3. ✅ Dados aparecem no admin
```

### 7.3 Verificar Logs

```bash
# Vercel Dashboard → Project → Logs

# Filtros úteis:
- Status Code: 500 (erros)
- Function Duration: > 5s (lento)
- Search: "error" ou "failed"
```

### 7.4 Monitorar por 24h

```bash
# Checklist primeiras 24h:

- [ ] Healthcheck verde no Better Uptime
- [ ] Nenhum erro crítico no Sentry
- [ ] Crons executando (ver logs Vercel)
- [ ] Zero erros 500
- [ ] Performance < 3s (ver Analytics)
```

---

## 🔒 PASSO 8: SEGURANÇA (15 min)

### 8.1 Verificar RLS Policies

```sql
-- Supabase → SQL Editor

-- Verificar que RLS está ativo
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- ✅ Todas as tabelas devem ter rowsecurity = true
```

### 8.2 Backup Database

```bash
# Supabase → Database → Backups

# Configurar:
✅ Daily backups (7 dias retenção)
✅ Enable Point-in-Time Recovery

# ✅ Backups automáticos ativos!
```

### 8.3 Rate Limiting

```typescript
// Já implementado em middleware.ts
// Limite: 100 req/min por IP

// Para verificar:
// Ver logs de "429 Too Many Requests"
```

### 8.4 Secrets Rotation Schedule

```bash
# Configurar alarme para rotacionar a cada 90 dias:

1. NEXTAUTH_SECRET
2. CRON_SECRET
3. Supabase Service Role Key
4. API Keys (OpenAI, Resend, etc)

# Como rotacionar:
# 1. Gerar novo secret: openssl rand -base64 32
# 2. Atualizar no Vercel
# 3. Redeploy
# 4. Testar
# 5. Remover secret antigo
```

---

## 🎯 CHECKLIST FINAL

### Antes do Deploy
- [x] P1 + P2 implementado
- [x] Testes passando (35/35)
- [x] Build local OK
- [x] .env.local configurado

### Database
- [ ] Supabase project criado
- [ ] Migrations aplicadas
- [ ] User admin criado
- [ ] API keys copiadas

### Deploy
- [ ] Git repo atualizado
- [ ] Vercel project criado
- [ ] Environment vars configuradas
- [ ] Deploy realizado
- [ ] SSL ativo

### Crons
- [ ] vercel.json verificado
- [ ] 4 crons ativos
- [ ] CRON_SECRET configurado
- [ ] Testados manualmente

### Monitoring
- [ ] Vercel Analytics ativo
- [ ] Sentry configurado
- [ ] Better Uptime monitorando
- [ ] LogRocket instalado (opcional)

### Validação
- [ ] /api/health retorna 200
- [ ] Login funciona
- [ ] Chat operacional
- [ ] Auto-escalation OK
- [ ] Proposta gerada
- [ ] Upload de docs OK

### Segurança
- [ ] RLS ativo
- [ ] Backups configurados
- [ ] Rate limiting funcionando
- [ ] Rotation schedule definido

---

## 🆘 PROBLEMAS COMUNS

### Build Failing

```bash
# Erro: Module not found
npm install --legacy-peer-deps

# Erro: TypeScript
npm run type-check
# Corrigir erros apontados

# Erro: Out of memory
# Vercel → Settings → Functions → Memory: 1024MB
```

### Database Connection

```bash
# Erro: Connection refused

# 1. Verificar URL correto
# 2. Verificar keys não expiraram
# 3. Testar:
curl https://xxxxx.supabase.co/rest/v1/

# 4. Ver RLS policies ativas
```

### Crons Not Running

```bash
# 1. Verificar vercel.json commitado
# 2. Verificar CRON_SECRET configurado
# 3. Ver logs: Vercel → Functions
# 4. Testar manual (curl)
```

### OpenAI Rate Limits

```bash
# Erro: 429 Too Many Requests

# 1. Ver usage: https://platform.openai.com/usage
# 2. Aumentar billing limit
# 3. Usar GPT-4-turbo (mais barato)
# 4. Implementar cache (já tem no código)
```

---

## 📞 SUPORTE

### Docs
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs

### Status
- Health: https://garcezpalha.com/api/health
- Vercel: https://vercel.com/status
- Supabase: https://status.supabase.com

---

**🎉 DEPLOY CONCLUÍDO COM SUCESSO!**

**Próximo passo**: Monitorar por 24-48h e ajustar configurações conforme necessário.

**Boa sorte! 🚀**
