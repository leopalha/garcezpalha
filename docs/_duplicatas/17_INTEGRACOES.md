# INTEGRACOES DA PLATAFORMA

Este documento descreve todas as integracoes externas da plataforma Garcez Palha.

---

## MAPA DE INTEGRACOES

```
                    +------------------+
                    |   GARCEZ PALHA   |
                    |    PLATFORM      |
                    +--------+---------+
                             |
    +------------------------+------------------------+
    |            |           |           |            |
    v            v           v           v            v
+-------+   +--------+   +------+   +--------+   +--------+
|OpenAI |   |Supabase|   |Stripe|   |MercadoPago|  |Resend |
|Router |   |  DB    |   |      |   |          |  |       |
+-------+   +--------+   +------+   +----------+  +-------+
    |            |           |           |            |
    |            |           |           |            |
+-------+   +--------+   +------+   +--------+   +--------+
|Telegram|  |ClickSign|  |Gmail |   |Calendar|  |WhatsApp|
| Bot   |   |        |   | API  |   |  API   |  | Cloud  |
+-------+   +--------+   +------+   +--------+  +--------+
```

---

## 1. INTELIGENCIA ARTIFICIAL

### 1.1 OpenRouter (GPT-4)

**Status**: OPERACIONAL

**Funcao**: Processar mensagens dos agentes IA

**Configuracao**:
```env
OPENAI_API_KEY=sk-or-v1-...
```

**Arquivo**: `src/lib/ai/openai-client.ts`

**Endpoints**:
- Chat Completions: `https://openrouter.ai/api/v1/chat/completions`

**Modelos Utilizados**:
- `openai/gpt-4-turbo-preview` (principal)

**Custo Estimado**: ~R$ 200/mes

---

## 2. BANCO DE DADOS

### 2.1 Supabase

**Status**: OPERACIONAL

**Funcao**: Armazenamento de dados, autenticacao, storage

**Configuracao**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

**Arquivos**:
- `src/lib/supabase/client.ts` (browser)
- `src/lib/supabase/server.ts` (server)
- `src/lib/supabase/admin.ts` (service role)

**Tabelas**: 20 tabelas (ver WARP.md)

**Storage Buckets**:
- `contracts` - Contratos assinados
- `process-docs` - Documentos de processos
- `uploads` - Uploads gerais

**Custo**: ~R$ 100/mes (Pro)

---

## 3. PAGAMENTOS

### 3.1 Stripe

**Status**: OPERACIONAL

**Funcao**: Pagamentos com cartao de credito

**Configuracao**:
```env
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

**Arquivos**:
- `src/lib/stripe.ts`
- `src/app/api/stripe/create-session/route.ts`
- `src/app/api/stripe/webhook/route.ts`

**Webhook Events**:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

**Webhook URL**: `https://garcezpalha.com/api/stripe/webhook`

### 3.2 MercadoPago

**Status**: AGUARDANDO CREDENCIAIS

**Funcao**: Pagamentos PIX e boleto

**Configuracao**:
```env
MERCADOPAGO_ACCESS_TOKEN=xxx
```

**Arquivos**:
- `src/lib/mercadopago.ts`
- `src/app/api/mercadopago/create-payment/route.ts`
- `src/app/api/mercadopago/webhook/route.ts`

**Webhook URL**: `https://garcezpalha.com/api/mercadopago/webhook`

---

## 4. COMUNICACAO

### 4.1 WhatsApp Cloud API (Meta)

**Status**: OPERACIONAL (aguardando verificacao Meta)

**Funcao**: Atendimento via WhatsApp

**Configuracao**:
```env
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_PHONE_NUMBER_ID=xxx
WHATSAPP_VERIFY_TOKEN=xxx
```

**Arquivos**:
- `src/lib/whatsapp/cloud-api.ts`
- `src/app/api/whatsapp-cloud/webhook/route.ts`
- `src/app/api/whatsapp-cloud/send/route.ts`

**Webhook URL**: `https://garcezpalha.com/api/whatsapp-cloud/webhook`

**Custo**: Gratis ate 1.000 conversas/mes

### 4.2 Telegram Bot

**Status**: OPERACIONAL

**Funcao**: Atendimento via Telegram

**Bot**: @garcezpalha_bot

**Configuracao**:
```env
TELEGRAM_BOT_TOKEN=xxx
```

**Arquivos**:
- `src/lib/telegram/bot-service.ts`
- `src/lib/telegram/ai-chat.ts`
- `src/lib/telegram/lead-qualifier.ts`
- `src/app/api/telegram/webhook/route.ts`
- `src/app/api/telegram/send/route.ts`

**Webhook URL**: `https://garcezpalha.com/api/telegram/webhook`

**Comandos**:
- `/start` - Iniciar conversa
- `/help` - Ajuda
- `/contato` - Informacoes de contato
- `/servicos` - Lista de servicos

**Custo**: Gratis

### 4.3 Resend (Email)

**Status**: AGUARDANDO CREDENCIAIS

**Funcao**: Envio de emails transacionais e marketing

**Configuracao**:
```env
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=contato@garcezpalha.com
```

**Arquivos**:
- `src/lib/email/email-service.ts`
- `src/lib/email/email-templates.ts`
- `src/lib/email/sequences.ts`
- `src/app/api/resend/webhook/route.ts`

**Templates**:
- Welcome
- Appointment confirmation
- Payment confirmation
- Contract signed
- Follow-up sequences

**Webhook URL**: `https://garcezpalha.com/api/resend/webhook`

**Custo**: Gratis ate 3.000 emails/mes

---

## 5. ASSINATURA DIGITAL

### 5.1 ClickSign

**Status**: AGUARDANDO CREDENCIAIS

**Funcao**: Assinatura digital de contratos

**Configuracao**:
```env
CLICKSIGN_API_KEY=xxx
```

**Arquivos**:
- `src/lib/signature/clicksign-service.ts`
- `src/app/api/clicksign/webhook/route.ts`

**Workflow**:
1. Gerar documento no sistema
2. Enviar para ClickSign
3. Cliente recebe link para assinar
4. Webhook notifica assinatura
5. Sistema baixa PDF assinado
6. Converte lead para cliente

**Webhook URL**: `https://garcezpalha.com/api/clicksign/webhook`

**Custo**: R$ 79/mes (10 assinaturas)

---

## 6. GOOGLE APIS

### 6.1 Gmail API

**Status**: AGUARDANDO CREDENCIAIS

**Funcao**: Monitorar emails de tribunais

**Configuracao**:
```env
GMAIL_CLIENT_ID=xxx
GMAIL_CLIENT_SECRET=xxx
GMAIL_REFRESH_TOKEN=xxx
```

**Arquivos**:
- `src/lib/email/monitor-service.ts`
- `src/app/api/cron/monitor-emails/route.ts`

**Funcionalidades**:
- Detectar emails de tribunais (TJ-RJ, STJ, TRF2, TST, STF)
- Extrair numero de processo
- Criar alertas no sistema
- Extrair anexos PDF

**Cron**: Diario as 8h

### 6.2 Google Calendar API

**Status**: AGUARDANDO CREDENCIAIS

**Funcao**: Sincronizar prazos e agendamentos

**Configuracao**:
```env
GOOGLE_CALENDAR_ID=xxx
# Reutiliza credenciais do Gmail
```

**Arquivos**:
- `src/lib/calendar/google-calendar-service.ts`

**Funcionalidades**:
- Criar eventos para prazos
- Reminders: 7, 3, 1 dia antes
- Sync com agendamentos
- Cancelamento sincronizado

---

## 7. WEBHOOKS - CONFIGURACAO

### URLs de Webhook em Producao

| Integracao | URL |
|------------|-----|
| Stripe | `https://garcezpalha.com/api/stripe/webhook` |
| MercadoPago | `https://garcezpalha.com/api/mercadopago/webhook` |
| ClickSign | `https://garcezpalha.com/api/clicksign/webhook` |
| Telegram | `https://garcezpalha.com/api/telegram/webhook` |
| WhatsApp | `https://garcezpalha.com/api/whatsapp-cloud/webhook` |
| Resend | `https://garcezpalha.com/api/resend/webhook` |

### Verificacao de Seguranca

Todos os webhooks implementam:
- Verificacao de assinatura (quando disponivel)
- Validacao de origem
- Rate limiting
- Logging de eventos

---

## 8. CRON JOBS

Configurados em `vercel.json`:

| Job | Schedule | Endpoint |
|-----|----------|----------|
| Deadline Reminders | Diario 9h | `/api/cron/deadline-reminders` |
| Email Monitor | Diario 8h | `/api/cron/monitor-emails` |
| Email Sequences | A cada 2h | `/api/cron/email-sequences` |

**Seguranca**:
```typescript
// Todos os cron jobs verificam:
const authHeader = request.headers.get('authorization')
if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  return new Response('Unauthorized', { status: 401 })
}
```

---

## 9. STATUS DAS INTEGRACOES

| Integracao | Status | Prioridade |
|------------|--------|------------|
| OpenRouter | OPERACIONAL | - |
| Supabase | OPERACIONAL | - |
| Stripe | OPERACIONAL | - |
| Telegram | OPERACIONAL | - |
| WhatsApp | IMPLEMENTADO | P1 |
| MercadoPago | AGUARDANDO | P1 |
| Gmail API | IMPLEMENTADO | P1 |
| Calendar API | IMPLEMENTADO | P1 |
| Resend | IMPLEMENTADO | P1 |
| ClickSign | IMPLEMENTADO | P1 |

---

## 10. CUSTOS MENSAIS

| Servico | Custo |
|---------|-------|
| OpenRouter (GPT-4) | R$ 200 |
| Supabase Pro | R$ 100 |
| Vercel Pro | R$ 100 |
| ClickSign | R$ 79 |
| Google Workspace | R$ 30 |
| WhatsApp Cloud | R$ 0* |
| Telegram | R$ 0 |
| Resend | R$ 0* |
| Stripe | % por transacao |
| MercadoPago | % por transacao |
| **TOTAL FIXO** | **R$ 509/mes** |

\* Gratis ate limite de uso
