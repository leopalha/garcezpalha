# MCP-04: WhatsApp Business API Server

**Status**: ✅ Implemented
**Priority**: P1 - High
**Estimated Time**: 5h

## Overview

MCP Server for WhatsApp Business API automation. Enables 24/7 automated customer service for Garcez Palha through WhatsApp, the primary communication channel in Brazil.

## Features

### 1. Message Sending
- **Text messages**: Simple text communication
- **Template messages**: Pre-approved marketing/service templates
- **Media messages**: Images, documents, audio files
- **Interactive messages**: Buttons and lists for user choices

### 2. Message Management
- Mark messages as read
- Track delivery status (via webhooks)
- Message threading and context

### 3. Contact Management
- Format phone numbers automatically
- Track conversation history
- Lead qualification automation

### 4. Compliance
- Uses official WhatsApp Business Cloud API
- Respects opt-in requirements
- Template approval workflow
- 24-hour session window management

## Setup

### 1. Install Dependencies

```bash
cd mcp-servers/whatsapp
npm install
npm run build
```

### 2. Configure WhatsApp Business

#### A. Create Meta App
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new App → Business → WhatsApp
3. Note your App ID

#### B. Get WhatsApp Phone Number
1. In App Dashboard → WhatsApp → Getting Started
2. Add a phone number or use the test number
3. Copy the **Phone Number ID**

#### C. Generate Access Token
1. Go to App Dashboard → WhatsApp → API Setup
2. Generate a temporary access token (24h) for testing
3. For production, create a System User with permanent token:
   - Business Settings → System Users → Add
   - Generate token with `whatsapp_business_messaging` permission

#### D. Set Environment Variables

```bash
export WHATSAPP_ACCESS_TOKEN="EAAxxxxxxxx"
export WHATSAPP_PHONE_NUMBER_ID="123456789"
export WHATSAPP_BUSINESS_ACCOUNT_ID="987654321"  # Optional
```

### 3. Add to Claude Code MCP Config

```json
{
  "mcpServers": {
    "garcezpalha-whatsapp": {
      "command": "node",
      "args": ["d:\\garcezpalha\\mcp-servers\\whatsapp\\dist\\index.js"],
      "env": {
        "WHATSAPP_ACCESS_TOKEN": "EAAxxxxxxxx",
        "WHATSAPP_PHONE_NUMBER_ID": "123456789"
      }
    }
  }
}
```

## Available Tools

### `whatsapp_send_message`

Send any type of WhatsApp message.

**Parameters**:
- `to` (string, required): Phone number (e.g., `5511999887766`)
- `type` (enum, default: "text"): `text | template | image | document | audio`
- `text` (string): Message text (for type=text)
- `templateName` (string): Template name (for type=template)
- `mediaUrl` (string): Media URL (for image/document/audio)
- `caption` (string): Media caption (optional)
- `filename` (string): File name (for document)

**Example - Text Message**:
```json
{
  "to": "5511999887766",
  "type": "text",
  "text": "Olá! Obrigado por entrar em contato com Garcez Palha Advogados."
}
```

**Example - Image**:
```json
{
  "to": "5511999887766",
  "type": "image",
  "mediaUrl": "https://garcezpalha.com/images/logo.png",
  "caption": "Garcez Palha - Soluções Jurídicas"
}
```

**Example - Document**:
```json
{
  "to": "5511999887766",
  "type": "document",
  "mediaUrl": "https://garcezpalha.com/docs/contrato.pdf",
  "filename": "contrato-servicos.pdf",
  "caption": "Seu contrato de serviços"
}
```

### `whatsapp_send_template`

Send pre-approved template message.

**Parameters**:
- `to` (string, required): Phone number
- `templateName` (string, required): Template name
- `language` (string, default: "pt_BR"): Language code
- `components` (array, optional): Template parameters

**Example - Simple Template**:
```json
{
  "to": "5511999887766",
  "templateName": "welcome_message",
  "language": "pt_BR"
}
```

**Example - Template with Parameters**:
```json
{
  "to": "5511999887766",
  "templateName": "case_update",
  "language": "pt_BR",
  "components": [
    {
      "type": "body",
      "parameters": [
        { "type": "text", "text": "João Silva" },
        { "type": "text", "text": "Aposentadoria Indevida" },
        { "type": "text", "text": "Em análise" }
      ]
    }
  ]
}
```

### `whatsapp_send_interactive`

Send interactive message with buttons or list.

**Parameters**:
- `to` (string, required): Phone number
- `type` (enum, required): `button | list`
- `body` (string, required): Message body
- `header` (string, optional): Header text
- `footer` (string, optional): Footer text
- `buttons` (array): Buttons (1-3, for type=button)
- `listButton` (string): List button text (for type=list)
- `sections` (array): List sections (for type=list)

**Example - Button Message**:
```json
{
  "to": "5511999887766",
  "type": "button",
  "body": "Como podemos ajudá-lo?",
  "footer": "Garcez Palha Advogados",
  "buttons": [
    { "id": "new_case", "title": "Novo Caso" },
    { "id": "track_case", "title": "Acompanhar Caso" },
    { "id": "speak_lawyer", "title": "Falar com Advogado" }
  ]
}
```

**Example - List Message**:
```json
{
  "to": "5511999887766",
  "type": "list",
  "body": "Selecione a área jurídica de interesse:",
  "footer": "Garcez Palha Advogados",
  "listButton": "Ver Áreas",
  "sections": [
    {
      "title": "Direito do Consumidor",
      "rows": [
        { "id": "consumer_01", "title": "Negativação Indevida", "description": "Limpar nome em 5 dias" },
        { "id": "consumer_02", "title": "Vício de Produto", "description": "Troca ou restituição" }
      ]
    },
    {
      "title": "Direito Trabalhista",
      "rows": [
        { "id": "labor_01", "title": "Horas Extras", "description": "Receber o que é seu" },
        { "id": "labor_02", "title": "Rescisão Incorreta", "description": "Corrigir verbas" }
      ]
    }
  ]
}
```

### `whatsapp_mark_as_read`

Mark received message as read.

**Parameters**:
- `messageId` (string, required): Message ID

**Example**:
```json
{
  "messageId": "wamid.xxxxx"
}
```

## Use Cases for Garcez Palha

### 1. Lead Qualification Automation

**Scenario**: New lead contacts via WhatsApp

```
User: "Olá, quero saber sobre aposentadoria"

Claude (via MCP):
1. Sends interactive button message with case types
2. User selects "Aposentadoria Indevida"
3. Sends qualification questions (interactive list)
4. Collects: name, CPF, INSS benefit number
5. Creates lead in Supabase
6. Assigns to lawyer
7. Sends confirmation template
```

**Expected Time**: 2-3 minutes (fully automated)

### 2. Case Status Updates

**Workflow**: Daily automated updates to clients

```typescript
// Claude checks Supabase for cases with updates
const casesWithUpdates = await getCasesToUpdate();

for (const case of casesWithUpdates) {
  await whatsapp_send_template({
    to: case.clientPhone,
    templateName: 'case_update',
    components: [
      { type: 'body', parameters: [
        { type: 'text', text: case.clientName },
        { type: 'text', text: case.caseType },
        { type: 'text', text: case.status }
      ]}
    ]
  });
}
```

### 3. Document Collection

**Scenario**: Lawyer needs documents from client

```
Claude sends interactive message:
- Header: "Documentos Necessários"
- Body: "Para continuar seu processo, precisamos dos seguintes documentos:"
- List: [RG, CPF, Comprovante Residência, Extrato INSS]
- Button: "Enviar Agora"

User clicks "Enviar Agora"
User sends documents via WhatsApp
Claude processes, stores in Supabase
Lawyer gets notification
```

### 4. Appointment Scheduling

**Scenario**: Client wants to schedule consultation

```json
{
  "type": "list",
  "body": "Escolha data e horário para sua consulta:",
  "listButton": "Ver Agenda",
  "sections": [
    {
      "title": "Próximos 3 Dias",
      "rows": [
        { "id": "slot_1", "title": "29/12 - 10:00", "description": "Dra. Maria Silva" },
        { "id": "slot_2", "title": "29/12 - 14:00", "description": "Dr. João Santos" },
        { "id": "slot_3", "title": "30/12 - 09:00", "description": "Dra. Maria Silva" }
      ]
    }
  ]
}
```

Claude:
1. Sends available slots
2. Receives user selection
3. Creates appointment in database
4. Sends confirmation template
5. Adds to Google Calendar (via integration)

### 5. Payment Reminders

**Automated flow**: 3 days before due date

```typescript
await whatsapp_send_template({
  to: client.phone,
  templateName: 'payment_reminder',
  components: [
    { type: 'body', parameters: [
      { type: 'text', text: client.name },
      { type: 'text', text: 'R$ 1.500,00' },
      { type: 'text', text: '01/01/2026' }
    ]},
    { type: 'button', index: 0, sub_type: 'url', parameters: [
      { type: 'text', text: 'invoice123' }
    ]}
  ]
});
```

## Business Impact

### Metrics (Expected)

**Before WhatsApp MCP**:
- Manual WhatsApp responses: 5-10 min/lead
- Availability: Business hours only (8am-6pm)
- Lead qualification: 15-20 min
- Response rate: 60% (missed after-hours)

**After WhatsApp MCP**:
- Automated responses: Instant
- Availability: 24/7
- Lead qualification: 2-3 min (automated)
- Response rate: 95%+

### ROI Calculation

**Time Savings**:
- 100 leads/week × 10 min/lead = 16.6 hours/week
- Salary cost: ~R$ 5.000/month → R$ 30/hour
- Savings: R$ 2.000/month

**Conversion Improvement**:
- Before: 60% response rate × 20% conversion = 12% overall
- After: 95% response rate × 25% conversion = 23.75% overall
- Improvement: **+98% more clients**

### Customer Satisfaction

- **Instant response**: No waiting
- **24/7 availability**: Weekends, holidays
- **Consistent quality**: No human errors
- **Personalized**: Uses client name, case details

## Templates to Create

### 1. Welcome Message
```
Olá! Bem-vindo à Garcez Palha Advogados.

Como podemos ajudá-lo hoje?
```

### 2. Case Update
```
Olá {{1}}!

Seu caso de {{2}} foi atualizado.

Status atual: {{3}}

Qualquer dúvida, estamos à disposição.
```

### 3. Appointment Confirmation
```
✅ Consulta Confirmada!

Data: {{1}}
Horário: {{2}}
Advogado(a): {{3}}

Local: Av. Paulista, 1000 - São Paulo

Até breve!
```

### 4. Payment Reminder
```
Olá {{1}}!

Lembrete: Pagamento de R$ {{2}} vence em {{3}}.

Pague agora: {{button_url}}

Dúvidas? Fale conosco!
```

## Integration with Garcez Palha Platform

### Webhook Handler

The platform needs a webhook endpoint to receive incoming messages:

```typescript
// src/app/api/whatsapp-cloud/webhook/route.ts

export async function POST(request: Request) {
  const body = await request.json();

  if (body.entry?.[0]?.changes?.[0]?.value?.messages) {
    const message = body.entry[0].changes[0].value.messages[0];

    // Store message in database
    await storeIncomingMessage(message);

    // Trigger Claude to process
    await processWithClaude(message);

    // Mark as read via MCP
    await whatsapp_mark_as_read({ messageId: message.id });
  }

  return new Response('OK', { status: 200 });
}
```

## Troubleshooting

### Error: "WHATSAPP_ACCESS_TOKEN is required"
Generate a token in Meta App Dashboard → WhatsApp → API Setup.

### Error: "(#131030) Recipient not available on WhatsApp"
Ensure phone number is in international format without spaces or symbols.

### Error: "Template not found"
Create and get approval for templates in Meta Business Manager.

### Error: "Session expired (24h window)"
Use template messages to re-initiate conversations after 24h.

## Next Steps

1. ✅ MCP-04 Complete
2. → MCP-05: Visual Regression Testing
3. → MCP-06: Google Search Console
4. → Remaining 4 MCP servers

---

**Developed**: 28/12/2025
**Status**: Production-Ready
**Maintenance**: Auto-updates via `npm run build`
