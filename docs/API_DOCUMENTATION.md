# API DOCUMENTATION - GARCEZ PALHA

**Versao**: 1.0
**Data**: 2024-12-23
**Base URL**: `https://garcezpalha.com.br/api`

---

## Sumario

1. [Autenticacao](#1-autenticacao)
2. [Contato e Leads](#2-contato-e-leads)
3. [Chat e IA](#3-chat-e-ia)
4. [Pagamentos](#4-pagamentos)
5. [Documentos](#5-documentos)
6. [Comunicacao](#6-comunicacao)
7. [Analytics](#7-analytics)
8. [Cron Jobs](#8-cron-jobs)
9. [Webhooks](#9-webhooks)
10. [Utilitarios](#10-utilitarios)

---

## Informacoes Gerais

### Rate Limits

| Endpoint | Limite |
|----------|--------|
| POST /api/contact | 3 requisicoes/hora por IP |
| POST /api/chat | 20 mensagens/minuto |
| Geral | 100 requisicoes/15min |

### Codigos de Erro

| Codigo | Descricao |
|--------|-----------|
| 400 | Bad Request - Parametros invalidos |
| 401 | Unauthorized - Token ausente/invalido |
| 403 | Forbidden - Sem permissao |
| 404 | Not Found - Recurso nao encontrado |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error |

---

## 1. Autenticacao

### POST /api/auth/[...nextauth]
Handler do NextAuth para autenticacao.

**Acoes suportadas:**
- Sign-in
- Sign-out
- Gerenciamento de sessao

---

### POST /api/auth/signup
Registro de novo usuario.

**Body:**
```json
{
  "name": "string (min 3 chars)",
  "email": "string",
  "password": "string (min 8 chars)"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "client"
}
```

---

### POST /api/auth/forgot-password
Solicitar reset de senha.

**Body:**
```json
{
  "email": "string"
}
```

**Response 200:**
```json
{
  "message": "Se o email existir, enviaremos instrucoes"
}
```

---

### POST /api/auth/reset-password
Confirmar reset de senha.

**Body:**
```json
{
  "token": "string",
  "password": "string (min 8 chars)"
}
```

**Response 200:**
```json
{
  "message": "Senha atualizada com sucesso"
}
```

---

## 2. Contato e Leads

### POST /api/contact
Enviar formulario de contato.

**Rate Limit:** 3/hora por IP

**Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string (opcional)",
  "message": "string",
  "service": "string (opcional)",
  "source": "string (opcional)"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "message": "Contato recebido com sucesso"
}
```

---

### GET /api/admin/leads
Listar leads (admin).

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| page | number | Pagina (default: 1) |
| limit | number | Itens por pagina (default: 20) |
| category | string | hot, warm, cold, unqualified |
| status | string | active, nurturing, converted, lost |
| search | string | Busca por nome/email/telefone |

**Response 200:**
```json
{
  "leads": [...],
  "total": 100,
  "page": 1,
  "totalPages": 5,
  "stats": {
    "total": 100,
    "hot": 20,
    "warm": 30,
    "cold": 40,
    "unqualified": 10
  }
}
```

---

### GET /api/admin/leads/stats
Estatisticas de leads (admin).

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "total": 100,
  "hot": 20,
  "warm": 30,
  "cold": 40,
  "unqualified": 10,
  "conversionRate": 15.5,
  "avgQualityScore": 72,
  "totalEstimatedValue": 500000
}
```

---

### GET /api/admin/leads/dashboard
Dados do dashboard (admin).

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "categoryDistribution": {...},
  "conversionFunnel": {...},
  "recentActivity": [...],
  "chartData": {...}
}
```

---

## 3. Chat e IA

### POST /api/chat
Enviar mensagem ao assistente IA.

**Rate Limit:** 20/minuto

**Body:**
```json
{
  "message": "string",
  "threadId": "string (opcional)",
  "context": {
    "page": "string",
    "service": "string"
  }
}
```

**Response 200:**
```json
{
  "reply": "string",
  "threadId": "string",
  "suggestions": ["string"],
  "action": {
    "type": "redirect|form|call",
    "data": {...}
  }
}
```

---

### POST /api/chat/qualify
Sistema de qualificacao via chat.

**Body:**
```json
{
  "sessionId": "string",
  "message": "string",
  "productId": "string (opcional)"
}
```

**Response 200:**
```json
{
  "reply": "string",
  "question": {...},
  "progress": 0.5,
  "completed": false
}
```

---

### GET /api/chat/qualify
Status da sessao de qualificacao.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| sessionId | string | ID da sessao |

**Response 200:**
```json
{
  "sessionId": "string",
  "status": "in_progress",
  "progress": 0.5,
  "leadId": "uuid (se completo)"
}
```

---

### DELETE /api/chat/qualify
Cancelar sessao de qualificacao.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| sessionId | string | ID da sessao |

---

## 4. Pagamentos

### POST /api/stripe/create-session
Criar sessao de checkout Stripe.

**Body:**
```json
{
  "serviceId": "string",
  "serviceName": "string",
  "amount": 10000,
  "customerEmail": "string",
  "customerName": "string",
  "metadata": {...}
}
```

**Response 200:**
```json
{
  "sessionId": "string",
  "url": "https://checkout.stripe.com/..."
}
```

---

### POST /api/mercadopago/create-payment
Criar pagamento PIX.

**Body:**
```json
{
  "serviceId": "string",
  "serviceName": "string",
  "amount": 10000,
  "customerEmail": "string",
  "customerName": "string",
  "customerCpf": "string"
}
```

**Response 200:**
```json
{
  "id": "string",
  "qrCode": "string (base64)",
  "qrCodeText": "string",
  "expiresAt": "ISO date"
}
```

---

### POST /api/webhooks/stripe
Webhook do Stripe.

**Headers:** `stripe-signature: string`

**Eventos:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `invoice.paid`
- `customer.subscription.*`

---

### POST /api/mercadopago/webhook
Webhook do MercadoPago.

**Body:**
```json
{
  "action": "payment.updated",
  "data": {
    "id": "string"
  }
}
```

---

## 5. Documentos

### POST /api/documents/upload
Upload de documento.

**Headers:** `Authorization: Bearer <token>`

**Body:** `multipart/form-data`
| Campo | Tipo | Descricao |
|-------|------|-----------|
| file | File | PDF, DOC, DOCX, JPG, PNG (max 10MB) |
| name | string | Nome do documento |
| category | string | Categoria |

**Response 201:**
```json
{
  "id": "uuid",
  "name": "string",
  "url": "string",
  "size": 1024
}
```

---

### GET /api/documents
Listar documentos do usuario.

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "documents": [
    {
      "id": "uuid",
      "name": "string",
      "url": "string",
      "category": "string",
      "createdAt": "ISO date"
    }
  ]
}
```

---

### DELETE /api/documents
Excluir documento.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| id | uuid | ID do documento |

---

### POST /api/documents/generate
Gerar documento juridico com IA.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "leadId": "uuid",
  "documentType": "peticao_inicial|contestacao|recurso|...",
  "clientData": {
    "nome": "string",
    "cpf": "string",
    ...
  },
  "caseData": {...}
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "title": "string",
  "status": "draft",
  "content": "string (preview)"
}
```

---

### GET /api/documents/generate
Listar templates disponiveis.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| type | string | Tipo especifico (opcional) |
| category | string | Categoria (opcional) |

**Response 200:**
```json
{
  "templates": [
    {
      "type": "peticao_inicial",
      "title": "Peticao Inicial",
      "category": "geral",
      "requiredVariables": ["nome", "cpf"],
      "optionalVariables": ["endereco"]
    }
  ]
}
```

---

### GET /api/documents/review
Fila de revisao de documentos.

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| status | string | pending, in_review, approved, rejected |
| priority | string | high, medium, low |
| assignedTo | string | Email do revisor |
| limit | number | Limite (default: 20) |
| offset | number | Offset (default: 0) |
| stats | boolean | Retornar estatisticas |

**Response 200:**
```json
{
  "items": [...],
  "total": 50,
  "stats": {
    "pending": 30,
    "inReview": 10,
    "approved": 8,
    "rejected": 2
  }
}
```

---

### POST /api/documents/review
Acao de revisao.

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "documentId": "uuid",
  "action": "assign|approve|reject|request-revision",
  "assignedTo": "string (para assign)",
  "notes": "string (opcional)"
}
```

---

### GET /api/documents/export
Exportar documento.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| documentId | uuid | ID do documento |
| format | string | docx, text, json |

**Response:** File download ou JSON

---

### POST /api/documents/export
Exportar como base64.

**Body:**
```json
{
  "documentId": "uuid"
}
```

**Response 200:**
```json
{
  "filename": "documento.docx",
  "content": "base64 string",
  "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}
```

---

## 6. Comunicacao

### POST /api/whatsapp-cloud/send
Enviar mensagem WhatsApp.

**Body:**
```json
{
  "to": "5521999999999",
  "message": "string"
}
```

**Response 200:**
```json
{
  "success": true,
  "messageId": "string"
}
```

---

### GET /api/whatsapp-cloud/webhook
Verificacao do webhook Meta.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| hub.mode | string | subscribe |
| hub.verify_token | string | Token de verificacao |
| hub.challenge | string | Challenge |

---

### POST /api/whatsapp-cloud/webhook
Receber mensagens WhatsApp.

**Body:** Payload da Meta WhatsApp Cloud API

---

### POST /api/telegram/send
Enviar mensagem Telegram.

**Body:**
```json
{
  "chatId": "string",
  "text": "string",
  "parseMode": "HTML|Markdown (opcional)"
}
```

---

### POST /api/telegram/webhook
Webhook do Telegram Bot.

**Body:** Telegram Update object

---

## 7. Analytics

### POST /api/analytics
Registrar evento.

**Body:**
```json
{
  "event": "page_view|lead|referral|payment|chat|engagement|error|conversion",
  "category": "string",
  "action": "string",
  "label": "string (opcional)",
  "value": "number (opcional)",
  "metadata": {...}
}
```

**Response 200:**
```json
{
  "id": "uuid",
  "recorded": true
}
```

---

### GET /api/analytics
Resumo de analytics.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| category | string | Filtrar por categoria |
| hours | number | Periodo em horas (default: 24) |

**Response 200:**
```json
{
  "totalEvents": 1000,
  "byCategory": {...},
  "byAction": {...},
  "conversions": 50,
  "errors": 5
}
```

---

### GET /api/analytics/advanced
Metricas avancadas de negocios.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| period | string | 7d, 30d, 90d |

**Response 200:**
```json
{
  "metrics": {
    "mrr": 50000,
    "cac": 150,
    "ltv": 2000,
    "churnRate": 5
  },
  "partnerPerformance": [...],
  "salesFunnel": {...}
}
```

---

### GET /api/health
Health check.

**Response 200:**
```json
{
  "status": "healthy",
  "services": {
    "database": "ok",
    "openai": "ok",
    "stripe": "ok",
    "mercadopago": "ok",
    "resend": "ok",
    "whatsapp": "ok"
  },
  "timestamp": "ISO date"
}
```

---

### POST /api/performance
Enviar metricas de performance.

**Body:**
```json
{
  "webVitals": {...},
  "apiTimings": [...],
  "componentMetrics": [...],
  "dbMetrics": [...]
}
```

---

### GET /api/performance
Resumo de performance.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| format | string | summary, raw |

**Response 200:**
```json
{
  "webVitals": {
    "LCP": { "avg": 2.5, "p95": 3.5, "p99": 4.0 },
    "FID": {...},
    "CLS": {...}
  },
  "apiTimings": {...}
}
```

---

## 8. Cron Jobs

Endpoints executados automaticamente pelo Vercel Cron.

| Endpoint | Frequencia | Descricao |
|----------|------------|-----------|
| GET /api/cron/monitor-emails | 15 min | Monitorar emails do tribunal |
| GET /api/cron/deadline-reminders | Diario 9h | Lembretes de prazos |
| GET /api/cron/sync-calendar | Diario 10h | Sync Google Calendar |
| GET /api/cron/appointment-automation | 2h | Lembretes de consultas |
| GET /api/cron/partner-reports | Mensal (dia 1) | Relatorios de parceiros |
| GET /api/cron/email-sequences | 2h | Sequencias de email |

---

## 9. Webhooks

### POST /api/resend/webhook
Eventos de email (Resend).

**Eventos:**
- `email.delivered`
- `email.opened`
- `email.clicked`
- `email.bounced`
- `email.complained`

---

### POST /api/clicksign/webhook
Eventos de assinatura (ClickSign).

**Eventos:**
- `document.signed`
- `document.closed`
- `document.cancelled`

---

## 10. Utilitarios

### GET /api/docs
Documentacao da API (JSON).

### POST /api/errors
Reportar erro do cliente.

**Body:**
```json
{
  "message": "string",
  "stack": "string",
  "component": "string",
  "page": "string",
  "severity": "low|medium|high|critical"
}
```

### GET /api/errors
Resumo de erros.

**Query Params:**
| Param | Tipo | Descricao |
|-------|------|-----------|
| severity | string | Filtrar por severidade |
| hours | number | Periodo em horas |

### GET /api/test-env
Verificar variaveis de ambiente (dev only).

---

## Estatisticas

| Metrica | Valor |
|---------|-------|
| Total de Endpoints | 55 |
| Autenticacao | NextAuth + Supabase |
| Banco de Dados | Supabase (PostgreSQL) |
| Servicos Externos | Stripe, MercadoPago, OpenAI, Google Calendar, Resend, Telegram, WhatsApp, ClickSign |

---

## Changelog

| Versao | Data | Mudancas |
|--------|------|----------|
| 1.0 | 2024-12-23 | Documentacao inicial completa |
