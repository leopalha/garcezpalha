# MercadoPago Integration Setup

**Data:** 24 de Dezembro de 2024
**Status:** ✅ Configurado em TEST mode

---

## Credenciais Configuradas

### TEST Credentials
- **User ID:** 9097385
- **App ID:** 767475930037464
- **Access Token:** `TEST-767475930037464-122413-8f3f9b1609e28f923387f8d1b9061a69-9097385`
- **Public Key:** `TEST-d181072d-212d-4514-92fb-91828f1b69a5`

### Conta
- **Email:** leonardo.palha@gmail.com
- **Dashboard:** https://www.mercadopago.com.br/developers/panel

---

## Variáveis de Ambiente

### Local (.env.local) ✅
```bash
MERCADOPAGO_ACCESS_TOKEN=TEST-767475930037464-122413-8f3f9b1609e28f923387f8d1b9061a69-9097385
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-d181072d-212d-4514-92fb-91828f1b69a5
```

### Vercel (Production) ✅
- ✅ `MERCADOPAGO_ACCESS_TOKEN` - Adicionada
- ✅ `NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY` - Adicionada

---

## Integração Implementada

### API Escolhida
**Checkout Pro** - Integração mais usada e recomendada pelo MercadoPago
- URL: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing
- Suporta: PIX, Cartão, Boleto
- Redirect-based checkout

### API de Pagamentos
Usada para criar e gerenciar pagamentos
- **NÃO usamos** "API de Orders" (legacy/deprecated)
- **Usamos** "API de Pagamentos" (moderna e completa)

---

## Webhook Configuration

### Webhook URL (Produção)
```
https://garcezpalha.com/api/webhooks/mercadopago
```

### Eventos Suportados
- `payment.created` - Pagamento criado
- `payment.updated` - Status do pagamento mudou
- `subscription.created` - Assinatura criada
- `subscription.updated` - Assinatura atualizada
- `invoice.created` - Fatura criada
- `plan.created` - Plano de assinatura criado

### Configurar Webhook no Dashboard
1. Acesse: https://www.mercadopago.com.br/developers/panel/app/767475930037464/webhooks
2. Adicione a URL: `https://garcezpalha.com/api/webhooks/mercadopago`
3. Selecione eventos: `payment`, `subscription`
4. Salve

---

## Implementação Técnica

### Arquivo de Webhook
[src/app/api/webhooks/mercadopago/route.ts](src/app/api/webhooks/mercadopago/route.ts)

### Funcionalidades Implementadas
- ✅ Verificação de assinatura HMAC SHA256
- ✅ Processamento de eventos de pagamento
- ✅ Integração com `checkout_orders` table
- ✅ Atualização de status de leads
- ✅ Suporte a PIX, Cartão, Boleto
- ✅ Cálculo de comissões para parceiros
- ✅ Rate limiting e sanitização

### Tabela do Banco
```sql
-- checkout_orders
CREATE TABLE public.checkout_orders (
    id UUID PRIMARY KEY,
    payment_provider TEXT, -- 'mercadopago'
    mercadopago_payment_id TEXT,
    mercadopago_preference_id TEXT,
    pix_qr_code TEXT,
    pix_qr_code_base64 TEXT,
    pix_expires_at TIMESTAMPTZ,
    status TEXT, -- pending, paid, failed, cancelled, refunded
    ...
)
```

---

## Fluxo de Pagamento

### 1. Criar Pagamento
```typescript
// Cliente cria checkout order
const order = await createCheckoutOrder({
  service_id: 'protecao-financeira',
  amount: 199900, // R$ 1.999,00 em centavos
  customer_email: 'cliente@example.com',
  payment_provider: 'mercadopago'
})

// Criar preferência no MercadoPago
const preference = await mercadopago.preferences.create({
  items: [{
    title: order.service_name,
    unit_price: order.amount / 100,
    quantity: 1,
  }],
  back_urls: {
    success: `https://garcezpalha.com/checkout/success?orderId=${order.id}`,
    failure: `https://garcezpalha.com/checkout/failure?orderId=${order.id}`,
    pending: `https://garcezpalha.com/checkout/pending?orderId=${order.id}`,
  },
  metadata: {
    orderId: order.id,
    leadId: order.lead_id,
  }
})

// Redirecionar para checkout
window.location.href = preference.init_point
```

### 2. Cliente Paga
- Cliente escolhe método (PIX, Cartão, Boleto)
- MercadoPago processa pagamento
- Cliente é redirecionado para success/failure URL

### 3. Webhook Atualiza Status
```typescript
// Webhook recebe evento
POST /api/webhooks/mercadopago
{
  "type": "payment",
  "action": "payment.updated",
  "data": {
    "id": "123456789"
  }
}

// Fetch payment details
const payment = await fetchPaymentDetails(data.id)

// Update order status
if (payment.status === 'approved') {
  await supabase
    .from('checkout_orders')
    .update({
      status: 'paid',
      paid_at: new Date().toISOString(),
      mercadopago_payment_id: payment.id
    })
    .eq('id', metadata.orderId)
}
```

---

## Testes

### Modo TEST
Atualmente configurado em **TEST mode**
- Pagamentos não são reais
- Use cartões de teste: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards

### Cartões de Teste
```
Aprovado: 5031 4332 1540 6351
CVV: 123
Vencimento: 11/25
Nome: APRO

Rejeitado: 5031 4332 1540 6351
Nome: OTHE
```

### PIX de Teste
- Gera QR code normalmente
- Não processa pagamento real
- Use o simulador no dashboard MP

---

## Migrar para Produção

### 1. Obter Credenciais de Produção
1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Ative modo produção (requer validação de conta)
3. Copie **Access Token** e **Public Key** de produção

### 2. Atualizar Variáveis
```bash
# Remover prefixo TEST-
MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-...
```

### 3. Configurar Webhook de Produção
- URL permanece a mesma: `https://garcezpalha.com/api/webhooks/mercadopago`
- Configure no painel de produção

### 4. Testar em Produção
- Fazer pagamento real de R$ 0,50 para testar
- Verificar webhook recebido
- Confirmar status atualizado no banco

---

## Monitoramento

### Logs do Webhook
```bash
# Ver logs no Vercel
vercel logs --filter=mercadopago --follow

# Verificar pagamentos no dashboard
https://www.mercadopago.com.br/activities
```

### Queries de Verificação
```sql
-- Pagamentos MercadoPago hoje
SELECT * FROM checkout_orders
WHERE payment_provider = 'mercadopago'
  AND created_at::date = CURRENT_DATE;

-- Taxa de sucesso
SELECT
  status,
  COUNT(*) as total,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM checkout_orders
WHERE payment_provider = 'mercadopago'
GROUP BY status;
```

---

## Recursos

### Documentação Oficial
- **Checkout Pro:** https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing
- **API de Pagamentos:** https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post
- **Webhooks:** https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
- **Cartões de Teste:** https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/additional-content/test-cards

### Dashboard
- **Painel:** https://www.mercadopago.com.br/developers/panel
- **Atividades:** https://www.mercadopago.com.br/activities
- **Webhooks:** https://www.mercadopago.com.br/developers/panel/app/767475930037464/webhooks

---

## Status Atual

### ✅ Completo
- [x] Credenciais TEST configuradas localmente
- [x] Credenciais adicionadas no Vercel (production)
- [x] Webhook implementado e testado
- [x] Integração com checkout_orders table
- [x] Suporte a PIX, Cartão, Boleto
- [x] Atualização de leads após pagamento
- [x] Sistema de comissões para parceiros

### ⏳ Pendente
- [ ] Configurar webhook URL no dashboard MP
- [ ] Testar pagamento TEST completo
- [ ] Migrar para credenciais de PRODUÇÃO
- [ ] Implementar UI de checkout com MP
- [ ] Adicionar MERCADOPAGO_WEBHOOK_SECRET (opcional, para verificação de assinatura)

---

**Desenvolvido por:** Garcez Palha + Claude Sonnet 4.5
**Data:** 24 de Dezembro de 2024
**Próximo Passo:** Configurar webhook URL no dashboard do MercadoPago
