# 🚀 Deployment Guide - Garcez Palha

Guia completo para deploy da plataforma Garcez Palha em produção.

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração de Ambiente](#configuração-de-ambiente)
3. [Deploy na Vercel](#deploy-na-vercel)
4. [Configuração Twilio WhatsApp](#configuração-twilio-whatsapp)
5. [Configuração de Cron Jobs](#configuração-de-cron-jobs)
6. [Troubleshooting](#troubleshooting)

---

## Pré-requisitos

### Contas Necessárias

- ✅ [GitHub](https://github.com) - Repositório do código
- ✅ [Vercel](https://vercel.com) - Hospedagem e deploy
- ✅ [Supabase](https://supabase.com) - Database PostgreSQL
- ✅ [OpenAI](https://platform.openai.com) - API de IA (GPT-4)
- ✅ [Twilio](https://twilio.com) - WhatsApp Business API
- ✅ [Stripe](https://stripe.com) - Gateway de pagamento
- ⚙️ [Resend](https://resend.com) - Email transacional (opcional)

### Ferramentas

```bash
Node.js 18+
npm ou yarn
Git
Vercel CLI (opcional): npm i -g vercel
```

---

## Configuração de Ambiente

### 1. Variáveis Obrigatórias

Crie um arquivo `.env.local` com as seguintes variáveis:

```bash
# Database - Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Authentication - NextAuth
NEXTAUTH_URL=https://garcezpalha.com
NEXTAUTH_SECRET=your-secret-here-use-openssl-rand-base64-32

# AI - OpenAI
OPENAI_API_KEY=sk-proj-...

# Cron Jobs Security
CRON_SECRET=your-cron-secret-use-openssl-rand-base64-32
```

### 2. Variáveis Opcionais (Recomendadas)

```bash
# WhatsApp - Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# AI - Groq (Fallback/Transcription)
GROQ_API_KEY=gsk_...

# Payment - Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email - Resend
RESEND_API_KEY=re_...

# Telegram Bot (opcional)
TELEGRAM_BOT_TOKEN=1234567890:ABC...
```

### 3. Gerar Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -base64 32
```

---

## Deploy na Vercel

### Opção 1: Via Dashboard (Recomendado)

1. **Acesse [Vercel Dashboard](https://vercel.com/new)**

2. **Importe o Repositório**
   - Conecte sua conta GitHub
   - Selecione o repositório `garcezpalha/platform`
   - Click em "Import"

3. **Configure o Projeto**
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Adicione Environment Variables**
   - Cole todas as variáveis do `.env.local`
   - Marque as públicas (NEXT_PUBLIC_*) como expostas

5. **Deploy**
   - Click em "Deploy"
   - Aguarde ~2-3 minutos
   - Acesse o domínio fornecido

### Opção 2: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy em staging
vercel

# Deploy em produção
vercel --prod
```

### Configurar Domínio Customizado

1. **Vercel Dashboard > Settings > Domains**
2. Adicione `garcezpalha.com` e `www.garcezpalha.com`
3. Configure DNS:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Aguarde propagação DNS (até 48h)

---

## Configuração Twilio WhatsApp

### 1. Criar Conta Twilio

1. Acesse [Twilio Console](https://console.twilio.com)
2. Create Account / Login
3. Navegue para **Messaging > Try it out > Send a WhatsApp message**

### 2. Configurar Sandbox (Desenvolvimento)

```bash
# Número do Sandbox Twilio
whatsapp:+14155238886

# Para testar, envie do seu WhatsApp:
join electricity-about
```

### 3. Configurar Produção (Requer Aprovação)

#### Opção A: Usar número Twilio novo

1. **Console Twilio > Phone Numbers > Buy a number**
2. Compre um número compatível com WhatsApp
3. **Messaging > Senders > WhatsApp senders**
4. Click em "Request to enable my Twilio number for WhatsApp"
5. Preencha formulário de negócio
6. Aguarde aprovação (2-5 dias úteis)

#### Opção B: Usar número próprio (Recomendado)

1. Compre novo chip/SIM card
2. **Console Twilio > Messaging > Senders**
3. Click em "New Sender" > WhatsApp
4. Selecione "Use my own number"
5. Insira o número do novo chip
6. Siga processo de verificação via SMS
7. Aguarde aprovação Meta (2-5 dias)

### 4. Configurar Webhook

1. **Console Twilio > Messaging > Settings > WhatsApp sender**
2. Em "When a message comes in":
   ```
   https://garcezpalha.com/api/whatsapp
   ```
3. Method: `POST`
4. Salve

### 5. Testar Integração

```bash
# Envie mensagem do seu WhatsApp para o número configurado
Olá!

# Deve receber resposta automática do bot
```

### 6. Adicionar Variáveis na Vercel

```bash
# Vercel Dashboard > Settings > Environment Variables

TWILIO_ACCOUNT_SID=ACxxxxxxxx...
TWILIO_AUTH_TOKEN=xxxxxxxxx...
TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

---

## Configuração de Cron Jobs

### Limitações Vercel Hobby Plan

⚠️ **IMPORTANTE**: Vercel Hobby permite apenas **2 cron jobs diários**.

### Cron Jobs Configurados

Arquivo: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/send-follow-ups",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/escalate-hot-leads",
      "schedule": "0 10 * * *"
    }
  ]
}
```

### Schedules

| Job | Horário | Frequência | Descrição |
|-----|---------|------------|-----------|
| `send-follow-ups` | 09:00 AM | Diário | Envia follow-ups automáticos |
| `escalate-hot-leads` | 10:00 AM | Diário | Escala leads quentes |

### Proteger Cron Jobs

Todos os cron jobs verificam o `CRON_SECRET`:

```typescript
// src/app/api/cron/send-follow-ups/route.ts
const authHeader = request.headers.get('authorization')
const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

if (authHeader !== expectedAuth) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Testar Cron Jobs Localmente

```bash
# Com autenticação
curl -X GET http://localhost:3000/api/cron/send-follow-ups \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Fazer Upgrade (Mais Cron Jobs)

Se precisar de mais cron jobs:

1. **Vercel Pro Plan** ($20/mês) - Até 60 cron jobs
2. **Vercel Enterprise** - Ilimitado

Ou usar serviço externo:
- [Cron-job.org](https://cron-job.org) (grátis)
- [EasyCron](https://www.easycron.com)
- [GitHub Actions](https://github.com/features/actions)

---

## Troubleshooting

### Problema: Deploy falha com erro de cron jobs

**Erro:**
```
Error: Your plan allows your team to create up to 2 Cron Jobs.
```

**Solução:**
1. Abra `vercel.json`
2. Mantenha apenas 2 cron jobs:
   ```json
   {
     "crons": [
       { "path": "/api/cron/send-follow-ups", "schedule": "0 9 * * *" },
       { "path": "/api/cron/escalate-hot-leads", "schedule": "0 10 * * *" }
     ]
   }
   ```
3. Commit e redeploy

### Problema: WhatsApp não responde

**Verificações:**

1. **Webhook configurado?**
   ```bash
   curl https://garcezpalha.com/api/whatsapp
   # Deve retornar: {"service":"WhatsApp Webhook","status":"active"}
   ```

2. **Variáveis configuradas?**
   ```bash
   # Vercel Dashboard > Settings > Environment Variables
   # Verificar: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
   ```

3. **Número registrado?**
   - Sandbox: Enviou "join electricity-about"?
   - Produção: Número foi aprovado pela Meta?

4. **Logs Twilio:**
   - Console Twilio > Monitor > Logs > Errors
   - Verificar erros de webhook ou delivery

5. **Logs Vercel:**
   - Vercel Dashboard > Deployments > Latest > Runtime Logs
   - Procurar por erros `[WhatsApp Webhook]`

### Problema: Variável de ambiente não reconhecida

**Soluções:**

1. **Redeploy após adicionar variável**
   ```bash
   # Após adicionar variável na Vercel:
   vercel --prod --force
   ```

2. **Verificar nome da variável**
   - Deve ser exatamente igual ao `.env.local`
   - Case-sensitive: `OPENAI_API_KEY` ≠ `openai_api_key`

3. **Variável pública precisa de NEXT_PUBLIC_**
   ```bash
   # ✅ Correto (acessível no client)
   NEXT_PUBLIC_SUPABASE_URL=...

   # ❌ Errado (não acessível no client)
   SUPABASE_URL=...
   ```

### Problema: Build falha

**Verificações:**

1. **Dependências instaladas?**
   ```bash
   npm install
   ```

2. **TypeScript compilando?**
   ```bash
   npm run build
   ```

3. **Variáveis obrigatórias definidas?**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_SECRET`

### Problema: API 500 Internal Server Error

**Debug:**

1. **Verificar logs Vercel:**
   ```
   Vercel Dashboard > Deployments > Latest > Runtime Logs
   ```

2. **Verificar variáveis:**
   ```typescript
   // src/lib/utils/env-validator.ts
   import { validateGarcezPalhaEnv, logEnvValidation } from '@/lib/utils/env-validator'

   const result = validateGarcezPalhaEnv()
   logEnvValidation(result)
   ```

3. **Testar localmente:**
   ```bash
   npm run dev
   # Replicar erro localmente para ver stack trace completo
   ```

---

## Checklist de Deploy

### Pré-Deploy
- [ ] Todas as variáveis de ambiente configuradas
- [ ] `.env.local` não commitado no Git (verificar `.gitignore`)
- [ ] Build local funciona: `npm run build`
- [ ] Testes passam (se houver): `npm test`

### Deploy
- [ ] Push para branch `main` no GitHub
- [ ] Vercel faz deploy automático
- [ ] Build completa com sucesso
- [ ] Domínio personalizado configurado
- [ ] SSL ativo (HTTPS)

### Pós-Deploy
- [ ] Homepage carrega: https://garcezpalha.com
- [ ] API de saúde funciona: https://garcezpalha.com/api/health
- [ ] WhatsApp webhook ativo: https://garcezpalha.com/api/whatsapp
- [ ] Chatbot responde no site
- [ ] WhatsApp responde mensagens
- [ ] Cron jobs agendados corretamente

### Monitoramento
- [ ] Configurar alertas Vercel
- [ ] Monitorar logs diariamente
- [ ] Verificar métricas de uso
- [ ] Backup database semanal (Supabase automático)

---

## Suporte

### Documentação Oficial

- [Next.js Docs](https://nextjs.org/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)

### Contato

Para problemas técnicos:
- Email: tech@garcezpalha.com
- GitHub Issues: https://github.com/garcezpalha/platform/issues

---

**Garcez Palha - Inteligência Jurídica**
*364 anos de tradição, nobreza e excelência.*
