# 18 - GUIA DE DEPLOY

Guia completo para deploy da plataforma em producao.

---

## 1. PRE-REQUISITOS

### 1.1 Contas Necessarias

- [x] Vercel (hosting)
- [x] Supabase (database)
- [x] OpenRouter (AI)
- [x] Stripe (pagamentos)
- [ ] MercadoPago (PIX)
- [ ] Resend (email)
- [ ] ClickSign (assinatura)
- [ ] Google Cloud (Gmail/Calendar)
- [ ] Meta Business (WhatsApp)
- [ ] Telegram (Bot)

### 1.2 Dominio

- Dominio: `garcezpalha.com`
- DNS: Configurar no registrador
- SSL: Automatico via Vercel

---

## 2. VERCEL SETUP

### 2.1 Criar Projeto

1. Acesse [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import do GitHub: `leopalha/garcezpalha`
4. Framework: Next.js (auto-detectado)

### 2.2 Build Settings

```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Root Directory: ./
```

### 2.3 Environment Variables

Adicionar no Vercel Dashboard > Settings > Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Auth
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://garcezpalha.com

# AI
OPENAI_API_KEY=sk-or-v1-xxx

# Pagamentos
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
MERCADOPAGO_ACCESS_TOKEN=xxx

# Mensagens
TELEGRAM_BOT_TOKEN=xxx
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_PHONE_NUMBER_ID=xxx

# Email
RESEND_API_KEY=re_xxx

# Assinatura
CLICKSIGN_API_KEY=xxx

# Google
GMAIL_CLIENT_ID=xxx
GMAIL_CLIENT_SECRET=xxx
GMAIL_REFRESH_TOKEN=xxx
GOOGLE_CALENDAR_ID=xxx

# Cron
CRON_SECRET=xxx
```

### 2.4 Dominio

1. Vercel Dashboard > Domains
2. Add Domain: `garcezpalha.com`
3. Copiar DNS records
4. Configurar no registrador:
   - A Record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`
5. Aguardar propagacao (ate 48h)

---

## 3. SUPABASE SETUP

### 3.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. New Project
3. Escolher regiao: South America (Sao Paulo)
4. Gerar senha forte

### 3.2 Executar Migrations

No SQL Editor, executar em ordem:

```sql
-- supabase/migrations/
001_initial_schema.sql
002_seed_data.sql
003_telegram_integration.sql
004_oab_compliance_pricing.sql
005_partner_oab_cnpj_validation.sql
006_contracts_table.sql
007_process_alerts_table.sql
008_process_documents_table.sql
009_notification_logs_table.sql
010_appointments_automation.sql
011_email_sequences.sql
012_password_reset_tokens.sql
```

### 3.3 Configurar Storage

1. Storage > Create Bucket
2. Criar buckets:
   - `contracts` (private)
   - `process-docs` (private)
   - `uploads` (public)

### 3.4 Verificar RLS

Todas as tabelas devem ter RLS habilitado:
```sql
ALTER TABLE nome_tabela ENABLE ROW LEVEL SECURITY;
```

---

## 4. WEBHOOKS

### 4.1 Stripe

1. Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://garcezpalha.com/api/stripe/webhook`
3. Eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copiar Signing Secret para `STRIPE_WEBHOOK_SECRET`

### 4.2 MercadoPago

1. MercadoPago Developers > Webhooks
2. URL: `https://garcezpalha.com/api/mercadopago/webhook`
3. Eventos: Payment

### 4.3 Telegram

```bash
# Configurar webhook
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://garcezpalha.com/api/telegram/webhook"
```

### 4.4 WhatsApp

1. Meta Business Suite > WhatsApp > Configuration
2. Webhook URL: `https://garcezpalha.com/api/whatsapp-cloud/webhook`
3. Verify Token: mesmo valor de `WHATSAPP_VERIFY_TOKEN`
4. Subscribir: messages

### 4.5 ClickSign

1. ClickSign Dashboard > Configuracoes > Webhooks
2. URL: `https://garcezpalha.com/api/clicksign/webhook`
3. Eventos: document.signed

### 4.6 Resend

1. Resend Dashboard > Webhooks
2. URL: `https://garcezpalha.com/api/resend/webhook`
3. Eventos: delivered, opened, clicked, bounced

---

## 5. CRON JOBS

Ja configurados em `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/deadline-reminders",
      "schedule": "0 9 * * *"
    },
    {
      "path": "/api/cron/monitor-emails",
      "schedule": "0 8 * * *"
    }
  ]
}
```

Verificar que `CRON_SECRET` esta configurado.

---

## 6. CHECKLIST PRE-DEPLOY

### 6.1 Codigo

- [ ] `npm run build` local sem erros
- [ ] `npm run typecheck` sem erros
- [ ] Todas env vars de producao prontas
- [ ] Remover console.logs de debug

### 6.2 Database

- [ ] Migrations executadas
- [ ] RLS habilitado em todas tabelas
- [ ] Storage buckets criados
- [ ] Indices criados

### 6.3 Integracoes

- [ ] Stripe webhook testado
- [ ] Telegram bot respondendo
- [ ] WhatsApp verificado
- [ ] Email enviando

### 6.4 Seguranca

- [ ] NEXTAUTH_SECRET forte (32+ chars)
- [ ] CRON_SECRET forte
- [ ] Chaves de API em env vars (nunca no codigo)
- [ ] HTTPS ativo

---

## 7. DEPLOY

### 7.1 Primeiro Deploy

```bash
# Push para main
git add .
git commit -m "Production deploy"
git push origin main

# Vercel faz deploy automatico
```

### 7.2 Verificar Deploy

1. Vercel Dashboard > Deployments
2. Verificar build logs
3. Acessar URL de preview
4. Testar funcionalidades criticas

### 7.3 Promover para Producao

Se usando preview:
1. Vercel Dashboard > Deployments
2. Click nos ... do deployment
3. "Promote to Production"

---

## 8. POS-DEPLOY

### 8.1 Smoke Tests

- [ ] Homepage carrega
- [ ] Login funciona
- [ ] Chat responde
- [ ] Checkout redireciona para Stripe
- [ ] Webhooks recebem eventos

### 8.2 Monitoramento

1. Vercel Analytics: Ativar
2. Sentry: Configurar (opcional)
3. Uptime: Configurar alertas

### 8.3 SEO

- [ ] Google Search Console configurado
- [ ] Sitemap.xml acessivel
- [ ] Robots.txt correto
- [ ] Meta tags OG

---

## 9. ROLLBACK

Se algo der errado:

### 9.1 Via Vercel

1. Deployments > Deploy anterior
2. Click nos ...
3. "Redeploy"

### 9.2 Via Git

```bash
git revert HEAD
git push origin main
```

---

## 10. MANUTENCAO

### 10.1 Updates

```bash
# Atualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Fix automatico
npm audit fix
```

### 10.2 Backup

- Supabase: Backups automaticos diarios
- Codigo: Git (GitHub)
- Env vars: Backup seguro local

### 10.3 Logs

- Vercel: Functions > Logs
- Supabase: Database > Logs
- Aplicacao: Console do browser/DevTools
