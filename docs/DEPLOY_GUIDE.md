# 🚀 GUIA DE DEPLOY - P2 AUTOMATION

**Status:** Pronto para Deploy
**Data:** 30/12/2024
**Tempo Estimado:** 1-2 horas

---

## ✅ PRÉ-REQUISITOS

Antes de começar, certifique-se que você tem:

- [x] Código P2 implementado e testado
- [x] Build passando (`npm run build` ✅)
- [x] Tests passando (`npm test` ✅)
- [x] Git commits realizados
- [ ] Acesso ao Vercel Dashboard
- [ ] Acesso ao Railway (Redis)
- [ ] Acesso ao Resend
- [ ] Acesso ao Meta Business (WhatsApp)

---

## PASSO 1: CONFIGURAR REDIS (15 min)

### Opção A: Railway (Recomendado - Produção)

1. Acesse https://railway.app
2. Click "New Project"
3. Click "Add Redis"
4. Aguarde provisionamento (2-3 min)
5. Copie a URL de conexão:
   ```
   REDIS_URL=redis://default:password@host.railway.app:6379
   ```

### Opção B: Upstash (Free Tier)

1. Acesse https://upstash.com
2. Create Redis Database
3. Copie as credenciais:
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token
   ```

### Opção C: Local (Development Only)

```bash
# Docker
docker run -d -p 6379:6379 redis:alpine

# Variável
REDIS_URL=redis://localhost:6379
```

---

## PASSO 2: GERAR SECRETS (5 min)

Execute no terminal:

```bash
# CRON_SECRET
openssl rand -base64 32
# Output: /0myhbaRyF8f39fJkhcpBBr2Q8yYAs+aQNwmJLomoHM=

# Copie e salve
```

---

## PASSO 3: CRIAR .env.local (10 min)

```bash
# 1. Copiar template
cp .env.example .env.local

# 2. Editar com valores reais
# Use seu editor favorito (VS Code, Vim, Nano)
code .env.local
```

### Variáveis OBRIGATÓRIAS para P2:

```bash
# CORE (já deve ter configurado)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXTAUTH_SECRET=seu-secret-32-chars
OPENAI_API_KEY=sk-proj-...

# P2 AUTOMATION (NOVO - Adicionar agora)
CRON_SECRET=/0myhbaRyF8f39fJkhcpBBr2Q8yYAs+aQNwmJLomoHM=
REDIS_URL=redis://default:password@host.railway.app:6379
RESEND_API_KEY=re_seu_api_key
RESEND_FROM_EMAIL=contato@garcezpalha.com

# WhatsApp (configurar depois do deploy)
WHATSAPP_API_TOKEN=seu-whatsapp-token
WHATSAPP_PHONE_NUMBER_ID=123456789

# PJe (configurar depois do deploy)
PJE_API_URL=https://pje.tjrj.jus.br/api/v1
PJE_API_TOKEN=seu-pje-token

# ClickSign (configurar depois do deploy)
CLICKSIGN_API_TOKEN=seu-clicksign-token
```

---

## PASSO 4: TESTAR LOCALMENTE (15 min)

### 4.1 Iniciar Servidor

```bash
npm run dev
```

Aguarde inicialização (10-20 segundos)

### 4.2 Testar Health Check

```bash
curl http://localhost:3000/api/health
```

**Esperado:**
```json
{"status":"ok","timestamp":"..."}
```

### 4.3 Testar Email Sequences Cron

```bash
curl http://localhost:3000/api/email/sequences/cron \
  -H "Authorization: Bearer /0myhbaRyF8f39fJkhcpBBr2Q8yYAs+aQNwmJLomoHM="
```

**Esperado:**
```json
{
  "success": true,
  "message": "Sequências processadas com sucesso",
  "stats": {
    "activeSubscriptions": 0,
    "emailsSent": 0,
    "emailsScheduled": 0,
    "errors": 0
  }
}
```

### 4.4 Testar Process Monitor Cron

```bash
curl http://localhost:3000/api/process-monitor/cron \
  -H "Authorization: Bearer /0myhbaRyF8f39fJkhcpBBr2Q8yYAs+aQNwmJLomoHM="
```

**Esperado:**
```json
{
  "success": true,
  "message": "Verificação de processos concluída",
  "stats": {...}
}
```

### 4.5 Testar Legal Documents API

```bash
curl http://localhost:3000/api/documents/legal?types=true
```

**Esperado:**
```json
{
  "success": true,
  "types": [
    "peticao-inicial",
    "contestacao",
    ...
  ]
}
```

### 4.6 Testar Reports API

```bash
curl http://localhost:3000/api/reports/generate?types=true
```

**Esperado:**
```json
{
  "reportTypes": [
    "leads-conversion",
    "revenue-monthly",
    ...
  ]
}
```

✅ **Se todos os testes passaram, você está pronto para deploy!**

---

## PASSO 5: CONFIGURAR VERCEL ENV VARS (15 min)

### 5.1 Acessar Dashboard

1. https://vercel.com/garcezpalha
2. Click no projeto
3. Settings → Environment Variables

### 5.2 Adicionar Variáveis P2

Para cada variável, adicione em **Production**, **Preview** e **Development**:

```bash
# 1. CRON_SECRET
Key: CRON_SECRET
Value: /0myhbaRyF8f39fJkhcpBBr2Q8yYAs+aQNwmJLomoHM=
Environment: Production, Preview, Development

# 2. REDIS_URL
Key: REDIS_URL
Value: redis://default:password@host.railway.app:6379
Environment: Production, Preview, Development

# 3. RESEND_API_KEY
Key: RESEND_API_KEY
Value: re_seu_api_key
Environment: Production, Preview, Development

# 4. RESEND_FROM_EMAIL
Key: RESEND_FROM_EMAIL
Value: contato@garcezpalha.com
Environment: Production, Preview, Development

# 5. WHATSAPP_API_TOKEN (se já tiver)
Key: WHATSAPP_API_TOKEN
Value: seu-whatsapp-token
Environment: Production

# 6. WHATSAPP_PHONE_NUMBER_ID (se já tiver)
Key: WHATSAPP_PHONE_NUMBER_ID
Value: 123456789
Environment: Production

# 7. PJE_API_URL (se já tiver)
Key: PJE_API_URL
Value: https://pje.tjrj.jus.br/api/v1
Environment: Production

# 8. PJE_API_TOKEN (se já tiver)
Key: PJE_API_TOKEN
Value: seu-pje-token
Environment: Production

# 9. CLICKSIGN_API_TOKEN (se já tiver)
Key: CLICKSIGN_API_TOKEN
Value: seu-clicksign-token
Environment: Production
```

**IMPORTANTE:** Click "Save" após cada variável!

---

## PASSO 6: DEPLOY TO VERCEL (5 min)

### 6.1 Commit Final (se houver alterações)

```bash
git status
git add .
git commit -m "chore: Ready for P2 production deploy"
```

### 6.2 Push to GitHub

```bash
git push origin main
```

### 6.3 Aguardar Auto-Deploy

1. Acesse https://vercel.com/garcezpalha/deployments
2. Aguarde deploy completar (3-5 minutos)
3. Procure por "Building..." → "Completed"

✅ **Deploy completo quando ver status "Ready"**

---

## PASSO 7: VERIFICAR DEPLOY (10 min)

### 7.1 Smoke Tests em Produção

```bash
# 1. Health check
curl https://garcezpalha.com/api/health

# 2. Legal documents types
curl https://garcezpalha.com/api/documents/legal?types=true

# 3. Reports types
curl https://garcezpalha.com/api/reports/generate?types=true

# 4. Process monitor
curl https://garcezpalha.com/api/process-monitor
```

### 7.2 Verificar Cron Jobs Ativos

1. Vercel Dashboard → Cron Jobs
2. Verificar 2 crons configurados:
   - `/api/email/sequences/cron` (*/15 * * * *)
   - `/api/process-monitor/cron` (*/30 * * * *)
3. Status deve estar "Active"

### 7.3 Verificar Primeira Execução

1. Aguardar 15-30 minutos
2. Vercel Dashboard → Functions → Logs
3. Procurar por execuções de:
   - `api/email/sequences/cron`
   - `api/process-monitor/cron`
4. Verificar status 200 OK

---

## PASSO 8: CONFIGURAR WEBHOOKS (30 min)

### 8.1 Stripe Webhook

1. Acesse https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Configurar:
   ```
   Endpoint URL: https://garcezpalha.com/api/webhooks/stripe
   Description: P2 Payment Events
   Events to send:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   ```
4. Click "Add endpoint"
5. Copiar "Signing secret" (whsec_...)
6. Adicionar no Vercel:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_seu_secret
   ```

### 8.2 ClickSign Webhook

1. Acesse https://app.clicksign.com/configuracoes/api
2. Scroll até "Webhooks"
3. Click "Adicionar URL"
4. Configurar:
   ```
   URL: https://garcezpalha.com/api/webhooks/clicksign
   Eventos:
   - Documento assinado
   - Documento visualizado
   ```
5. Gerar token de verificação
6. Adicionar no Vercel:
   ```
   CLICKSIGN_WEBHOOK_SECRET=seu_token
   ```

### 8.3 WhatsApp Webhook

1. Acesse https://developers.facebook.com/apps
2. Selecione seu app WhatsApp
3. WhatsApp → Configuration
4. Configurar:
   ```
   Callback URL: https://garcezpalha.com/api/webhooks/whatsapp
   Verify Token: (gerar token seguro com openssl rand -base64 32)
   ```
5. Adicionar no Vercel:
   ```
   WHATSAPP_VERIFY_TOKEN=seu_token
   ```
6. Click "Verify and Save"
7. Subscribe to webhooks:
   - messages
   - message_status

---

## PASSO 9: MONITORAMENTO (Contínuo)

### 9.1 Primeiras 2 Horas

Verifique a cada 30 minutos:

```bash
# Vercel Dashboard → Functions → Logs
# Procurar por:
- Email sequences cron executions
- Process monitor cron executions
- Erros (status 500)
```

### 9.2 Primeiras 24 Horas

Métricas a observar:

| Métrica | Target | Como Verificar |
|---------|--------|----------------|
| Cron Success Rate | >90% | Vercel → Cron Jobs → Executions |
| API Response Time | <2s | Vercel → Functions → Insights |
| Error Rate | <5% | Vercel → Functions → Logs |
| Email Delivery | >95% | Resend Dashboard → Logs |
| WhatsApp Delivery | >95% | Meta Business → Insights |

### 9.3 Red Flags 🚨

**Pare e investigue se:**

- Cron jobs falhando >10% das vezes
- Erros de timeout frequentes
- Email bounce rate >5%
- WhatsApp não entregando mensagens
- Logs mostrando erros de conexão Redis

---

## TROUBLESHOOTING

### Cron Job Não Executa

**Sintomas:** Nenhuma execução nos logs

**Diagnóstico:**
```bash
# 1. Verificar cron está ativo
Vercel Dashboard → Cron Jobs → Status

# 2. Verificar CRON_SECRET
Vercel Dashboard → Settings → Environment Variables → CRON_SECRET

# 3. Testar endpoint manualmente
curl https://garcezpalha.com/api/email/sequences/cron \
  -H "Authorization: Bearer SEU_CRON_SECRET"
```

**Soluções:**
- Redeployar projeto (Vercel → Deployments → Redeploy)
- Verificar se endpoint existe (build logs)
- Verificar se CRON_SECRET está correto

---

### Email Não Envia

**Sintomas:** Cron executa mas emails não chegam

**Diagnóstico:**
```bash
# 1. Verificar Resend Dashboard
https://resend.com/logs

# 2. Verificar domínio verificado
https://resend.com/domains

# 3. Verificar bounce list
https://resend.com/suppressions
```

**Soluções:**
- Verificar RESEND_API_KEY correto
- Verificar domínio verificado
- Verificar RESEND_FROM_EMAIL permitido
- Remover emails da bounce list

---

### WhatsApp Não Entrega

**Sintomas:** API retorna 200 mas mensagens não chegam

**Diagnóstico:**
```bash
# 1. Verificar templates aprovados
Meta Business → WhatsApp → Message Templates

# 2. Verificar limites
Meta Business → Insights → Messaging Limits

# 3. Verificar número destinatário
Formato: +5521999999999 (com +55)
```

**Soluções:**
- Aprovar templates no Meta Business
- Verificar não excedeu limite de mensagens
- Verificar WHATSAPP_API_TOKEN válido
- Verificar número no formato correto

---

### Redis Connection Error

**Sintomas:** Logs mostram "Redis connection failed"

**Diagnóstico:**
```bash
# 1. Verificar Redis está online
Railway Dashboard → Redis → Status

# 2. Testar conexão
redis-cli -u "redis://default:password@host.railway.app:6379" ping
```

**Soluções:**
- Verificar REDIS_URL correto
- Verificar Railway não está em pausa (free tier)
- Reiniciar Redis no Railway
- Sistema tem fallback automático para memória

---

## CHECKLIST FINAL

### Antes do Deploy
- [x] Código implementado
- [x] Testes criados
- [x] Build passando
- [x] Git commits
- [ ] .env.local criado
- [ ] Testes locais passando
- [ ] Redis configurado (Railway/Upstash)
- [ ] CRON_SECRET gerado

### Durante Deploy
- [ ] Environment vars no Vercel
- [ ] Git push origin main
- [ ] Deploy completo (Vercel Dashboard)
- [ ] Cron jobs ativos

### Após Deploy
- [ ] Smoke tests em produção
- [ ] Cron executando (primeiros 30 min)
- [ ] Logs sem erros (primeiras 2h)
- [ ] Webhooks configurados
- [ ] Monitoramento ativo

---

## PRÓXIMOS PASSOS APÓS DEPLOY

### Semana 1
- [ ] Monitorar métricas diariamente
- [ ] Ajustar frequência dos crons se necessário
- [ ] Coletar feedback inicial
- [ ] Otimizar templates de email

### Mês 1
- [ ] Implementar Sentry (error tracking)
- [ ] Implementar analytics avançado
- [ ] Criar dashboards de métricas
- [ ] A/B test email sequences

### Futuro
- [ ] P2-006: MCP Servers (10 integrações)
- [ ] Mobile App (React Native)
- [ ] IA Avançada (Fine-tuning)
- [ ] Expansão produtos (30 novos nichos)

---

## 📞 SUPORTE

**Problemas urgentes:**
- leonardo.palha@gmail.com
- WhatsApp: (configurar)

**Documentação:**
- [PROXIMOS_PASSOS_P2.md](./PROXIMOS_PASSOS_P2.md)
- [EXEMPLOS_PRATICOS.md](./docs/EXEMPLOS_PRATICOS.md)
- [ARQUITETURA_SISTEMA.md](./docs/ARQUITETURA_SISTEMA.md)

**Logs e Monitoring:**
- Vercel: https://vercel.com/garcezpalha
- Resend: https://resend.com/logs
- Railway: https://railway.app

---

**Pronto! Boa sorte com o deploy! 🚀**

Score esperado após deploy: 100/100 ⭐⭐⭐⭐⭐
