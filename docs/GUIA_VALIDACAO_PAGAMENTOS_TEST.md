# 💳 GUIA DE VALIDAÇÃO - PAGAMENTOS TEST MODE

**Data**: 27/12/2025
**Ambiente**: TEST/Sandbox
**Sistemas**: MercadoPago + Stripe
**Status**: Pronto para testar

---

## 🎯 OBJETIVO

Validar que o sistema de pagamentos está funcionando corretamente em modo TEST antes de ativar em produção.

**Fluxo Completo a Testar**:
```
Lead qualificado → Proposta gerada → Link de pagamento →
Cliente paga (TEST) → Webhook confirma → Database atualiza →
Email enviado → Cliente vira ativo
```

---

## 📋 PRÉ-REQUISITOS

### 1. Variáveis de Ambiente Configuradas

Verifique se estas variáveis estão no `.env.local` e no Vercel:

#### MercadoPago (PIX + Boleto - Brasil)
```env
MERCADOPAGO_ACCESS_TOKEN=TEST-XXXX...  # Deve começar com "TEST-"
MERCADOPAGO_PUBLIC_KEY=TEST-XXXX...
```

#### Stripe (Cartão - Internacional)
```env
STRIPE_SECRET_KEY=sk_test_XXXX...      # Deve começar com "sk_test_"
STRIPE_PUBLISHABLE_KEY=pk_test_XXXX...
STRIPE_WEBHOOK_SECRET=whsec_XXXX...
```

### 2. Webhooks Configurados

#### MercadoPago Webhook
```
URL: https://garcezpalha.vercel.app/api/webhooks/mercadopago
Events: payment.created, payment.updated
```

#### Stripe Webhook
```
URL: https://garcezpalha.vercel.app/api/webhooks/stripe
Events: checkout.session.completed, payment_intent.succeeded
```

---

## 🧪 TESTE 1: MERCADOPAGO PIX (RECOMENDADO PARA BRASIL)

### Passo 1: Criar Lead Qualificado

```bash
# Via API ou chat do site
POST https://garcezpalha.vercel.app/api/chat/agent-flow

Body:
{
  "message": "Preciso resolver um problema de conta bancária bloqueada",
  "productId": "desbloqueio-conta-bancaria",
  "productName": "Desbloqueio de Conta Bancária"
}

# Ou use o chat do site diretamente
```

### Passo 2: Gerar Proposta + Link de Pagamento

O sistema deve:
1. Qualificar o lead (score 0-100)
2. Classificar o produto correto
3. Gerar proposta personalizada
4. Criar payment link do MercadoPago

**Verificar**:
- [ ] Proposta salva em `proposals` table
- [ ] Payment link criado em `payment_links` table
- [ ] Link enviado ao cliente (via chat ou email)

### Passo 3: Pagar com PIX (Modo TEST)

**Opção A - Via Sandbox do MercadoPago**:

1. Acesse o link de pagamento gerado
2. Escolha "PIX"
3. **IMPORTANTE**: Não escaneie o QR Code! No modo TEST, use:
   - Email: `test_user_123456@testuser.com`
   - CPF de teste: `123.456.789-01`
4. Clique em "Simular Pagamento Aprovado"

**Opção B - Via API Direta (para automação)**:

```bash
# Simular pagamento aprovado
curl -X POST https://api.mercadopago.com/v1/advanced_payments/{{payment_id}}/disburses \
  -H "Authorization: Bearer TEST-XXXX..." \
  -d '{
    "disbursement_status": "approved"
  }'
```

### Passo 4: Verificar Webhook

O webhook `/api/webhooks/mercadopago` deve:

1. ✅ Receber notificação `payment.updated` com status `approved`
2. ✅ Atualizar `payment_links` set `status = 'paid', paid_at = NOW()`
3. ✅ Atualizar `proposals` set `status = 'accepted'`
4. ✅ Criar `clients` record (se não existir)
5. ✅ Enviar email de confirmação via Resend
6. ✅ Criar entrada em `notification_logs`

**Verificação Manual**:

```sql
-- No Supabase SQL Editor:
SELECT * FROM payment_links WHERE status = 'paid' ORDER BY created_at DESC LIMIT 1;
SELECT * FROM proposals WHERE status = 'accepted' ORDER BY created_at DESC LIMIT 1;
SELECT * FROM notification_logs WHERE type = 'payment_confirmation' ORDER BY created_at DESC LIMIT 1;
```

### Passo 5: Validar Email Enviado

Verificar em:
- [ ] Resend Dashboard (https://resend.com/emails)
- [ ] Email do cliente (se TEST com email real)
- [ ] Logs da aplicação (Vercel Logs)

**Email deve conter**:
- Confirmação de pagamento
- Valor pago
- Próximos passos
- Link para portal do cliente

---

## 🧪 TESTE 2: STRIPE CARTÃO (INTERNACIONAL)

### Passo 1: Criar Checkout Session

```bash
# Via API
POST https://garcezpalha.vercel.app/api/checkout/create-session

Body:
{
  "productId": "consultoria-imobiliaria",
  "packageName": "Básico",
  "amount": 50000,  // R$ 500,00 em centavos
  "customerEmail": "test@example.com",
  "customerName": "Cliente Teste"
}

Response:
{
  "sessionId": "cs_test_xxx",
  "url": "https://checkout.stripe.com/c/pay/cs_test_xxx"
}
```

### Passo 2: Pagar com Cartão de Teste

1. Acesse a URL do checkout
2. Use os cartões de teste do Stripe:

**Cartões de Teste Válidos**:

| Cartão | Número | CVC | Data | Resultado |
|--------|--------|-----|------|-----------|
| Visa | `4242 4242 4242 4242` | Qualquer 3 dígitos | Futuro | ✅ Sucesso |
| Mastercard | `5555 5555 5555 4444` | Qualquer 3 dígitos | Futuro | ✅ Sucesso |
| Amex | `3782 822463 10005` | Qualquer 4 dígitos | Futuro | ✅ Sucesso |
| Decline | `4000 0000 0000 0002` | Qualquer 3 dígitos | Futuro | ❌ Recusado |
| 3D Secure | `4000 0027 6000 3184` | Qualquer 3 dígitos | Futuro | ⚠️ Autenticação |

3. Preencher:
   - **Email**: qualquer email válido
   - **Nome**: qualquer nome
   - **CEP**: qualquer CEP válido (ex: 01310-100)

4. Clicar em "Pay"

### Passo 3: Verificar Webhook Stripe

O webhook `/api/webhooks/stripe` deve:

1. ✅ Receber evento `checkout.session.completed`
2. ✅ Atualizar payment no database
3. ✅ Enviar email de confirmação
4. ✅ Criar cliente ativo

**Verificação**:

```sql
SELECT * FROM checkout_orders
WHERE payment_status = 'paid'
AND stripe_session_id IS NOT NULL
ORDER BY created_at DESC LIMIT 1;
```

### Passo 4: Testar Cartão Recusado

Use o cartão `4000 0000 0000 0002` (Generic Decline).

**Resultado Esperado**:
- ❌ Pagamento recusado
- ⚠️ Mensagem de erro exibida
- ⏳ Status permanece `pending` no database
- 📧 Não envia email de confirmação

---

## 🧪 TESTE 3: BOLETO MERCADOPAGO

### Passo 1: Gerar Boleto TEST

```bash
POST https://garcezpalha.vercel.app/api/mercadopago/create-payment

Body:
{
  "amount": 50000,  // R$ 500,00
  "description": "Consultoria Jurídica - Teste",
  "paymentMethod": "bolbradesco",
  "payer": {
    "email": "test@example.com",
    "firstName": "Cliente",
    "lastName": "Teste",
    "identification": {
      "type": "CPF",
      "number": "12345678901"
    }
  }
}

Response:
{
  "id": "123456789",
  "status": "pending",
  "transaction_details": {
    "external_resource_url": "https://www.mercadopago.com.br/payments/123456789/ticket"
  }
}
```

### Passo 2: Simular Pagamento de Boleto

**No Sandbox do MercadoPago**:

1. Acesse: https://www.mercadopago.com.br/developers/pt/support/test-cards
2. Use CPF de teste: `123.456.789-01`
3. Simule pagamento do boleto

**Via API** (mais rápido):

```bash
curl -X PUT \
  https://api.mercadopago.com/v1/payments/{{payment_id}} \
  -H "Authorization: Bearer TEST-XXXX..." \
  -d '{"status": "approved"}'
```

### Passo 3: Verificar Webhook

Mesmas validações do Teste 1 (PIX).

---

## 📊 CHECKLIST DE VALIDAÇÃO COMPLETA

### MercadoPago (PIX + Boleto)

- [ ] **Criar payment link** - API `/api/mercadopago/create-preference`
- [ ] **Pagar com PIX** - Sandbox mode
- [ ] **Webhook recebido** - `payment.updated` com status `approved`
- [ ] **Database atualizado** - `payment_links.status = 'paid'`
- [ ] **Email enviado** - Confirmação de pagamento
- [ ] **Cliente criado** - Record em `clients` table
- [ ] **Pagar com Boleto** - Sandbox mode
- [ ] **Webhook boleto** - Status `approved`
- [ ] **Testar recusa** - Simular pagamento recusado

### Stripe (Cartão)

- [ ] **Criar checkout session** - API `/api/checkout/create-session`
- [ ] **Pagar com Visa** - Cartão `4242 4242 4242 4242`
- [ ] **Webhook recebido** - `checkout.session.completed`
- [ ] **Database atualizado** - `checkout_orders.payment_status = 'paid'`
- [ ] **Email enviado** - Confirmação Stripe
- [ ] **Testar recusa** - Cartão `4000 0000 0000 0002`
- [ ] **Testar 3D Secure** - Cartão `4000 0027 6000 3184`
- [ ] **Pagar com Mastercard** - Cartão `5555 5555 5555 4444`
- [ ] **Pagar com Amex** - Cartão `3782 822463 10005`

### Fluxo End-to-End

- [ ] **Lead → Proposta** - Chat qualifica e gera proposta
- [ ] **Proposta → Pagamento** - Link de pagamento criado
- [ ] **Pagamento → Confirmação** - Webhook processa
- [ ] **Confirmação → Email** - Cliente recebe email
- [ ] **Email → Onboarding** - Próximos passos claros
- [ ] **Onboarding → Portal** - Cliente acessa portal
- [ ] **Portal → Documentos** - Upload de documentos funciona

---

## 🐛 TROUBLESHOOTING

### Problema: Webhook não chega

**Diagnóstico**:
```bash
# Verificar logs do Vercel
vercel logs --follow

# Verificar no dashboard do MercadoPago/Stripe
# Se webhook retorna 4xx/5xx, não processa
```

**Solução**:
1. Verificar URL do webhook está correta
2. Verificar se route handler existe
3. Testar manualmente com Postman
4. Ver logs de erro no Vercel

### Problema: Email não envia

**Diagnóstico**:
```bash
# Verificar Resend API key
echo $RESEND_API_KEY

# Testar direto na API
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -d '{"to":"test@example.com","subject":"Test","text":"Test"}'
```

**Solução**:
1. Verificar RESEND_API_KEY configurada
2. Verificar domínio verificado no Resend
3. Verificar remetente permitido

### Problema: Database não atualiza

**Diagnóstico**:
```sql
-- Ver se RLS está bloqueando
SELECT * FROM payment_links WHERE id = 'xxx';

-- Ver policies
SELECT * FROM pg_policies WHERE tablename = 'payment_links';
```

**Solução**:
1. Verificar RLS policies
2. Usar service_role key se necessário
3. Verificar SQL no webhook handler

---

## ✅ CRITÉRIOS DE APROVAÇÃO

Para considerar **VALIDADO**, todos devem passar:

### Funcional (100%)
- ✅ Pagamento PIX completa
- ✅ Pagamento Cartão completa
- ✅ Webhook processa corretamente
- ✅ Database atualiza
- ✅ Email enviado

### Performance (90%+)
- ✅ Webhook responde em < 3s
- ✅ Email enviado em < 10s
- ✅ Database query em < 500ms

### Confiabilidade (100%)
- ✅ Webhook retry funciona (se falhar)
- ✅ Idempotência (mesmo webhook 2x não duplica)
- ✅ Error handling (cartão recusado = mensagem clara)

---

## 🚀 APÓS VALIDAÇÃO TEST

Quando TODOS os testes passarem:

### 1. Migrar para PRODUCTION

```env
# Trocar keys TEST por PRODUCTION
MERCADOPAGO_ACCESS_TOKEN=APP-XXXX...  # Remove "TEST-"
STRIPE_SECRET_KEY=sk_live_XXXX...     # Troca "test" por "live"
```

### 2. Configurar Webhooks Production

- MercadoPago: `https://garcezpalha.com/api/webhooks/mercadopago`
- Stripe: `https://garcezpalha.com/api/webhooks/stripe`

### 3. Smoke Tests em Production

Testar com 1 pagamento REAL de valor baixo (R$ 1,00):
- [ ] PIX R$ 1,00 → Confirma
- [ ] Estornar manualmente
- [ ] Validar que sistema funciona

---

## 📞 SUPORTE

### Documentação Oficial:

- **MercadoPago**: https://www.mercadopago.com.br/developers/pt/docs
- **Stripe**: https://stripe.com/docs/testing

### Logs e Monitoramento:

- Vercel Logs: `vercel logs --follow`
- Supabase Logs: Dashboard → Logs
- Resend Dashboard: https://resend.com/emails

---

**🎉 BOM TESTE! SIGA ESTE GUIA PASSO A PASSO E VALIDE TUDO!**

*Criado em: 27/12/2025*
*Versão: 1.0*
*MANUS v6.0*
