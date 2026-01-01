# 💳 Stripe Setup Guide - Garcez Palha

**Última Atualização:** 30/12/2024

---

## 📋 Overview

Este guia mostra como configurar o Stripe para aceitar pagamentos por assinatura (planos mensais) na plataforma Garcez Palha.

**Funcionalidades Implementadas:**
- ✅ Checkout com Stripe
- ✅ Assinaturas mensais (3 planos)
- ✅ Addons opcionais
- ✅ Customer Portal (gerenciar assinatura)
- ✅ Webhooks para auto-provisioning

---

## 🚀 Passo 1: Criar Conta Stripe

1. Acesse: https://dashboard.stripe.com/register
2. Crie sua conta (use email business)
3. Complete o onboarding
4. Ative sua conta para produção (fornecendo dados da empresa)

---

## 🔑 Passo 2: Obter API Keys

### Ambiente de Teste (Desenvolvimento):

1. Vá para: https://dashboard.stripe.com/test/apikeys
2. Copie:
   - **Publishable key** (começa com `pk_test_`)
   - **Secret key** (revelar e copiar, começa com `sk_test_`)

3. Adicione no `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Ambiente de Produção:

1. Vá para: https://dashboard.stripe.com/apikeys (modo live)
2. Copie as keys **live** (`pk_live_` e `sk_live_`)

---

## 📦 Passo 3: Criar Produtos e Preços

### 3.1: Criar os 3 Planos

Vá para: https://dashboard.stripe.com/test/products

**Plano 1: Starter**
- Nome: `Garcez Palha - Plano Starter`
- Preço: R$ 497,00 / mês
- Billing: Recorrente mensal
- Metadata:
  - `plan_id`: `starter`
  - `agents`: `1`
  - `products`: `10`
  - `conversations`: `100`

Copie o **Price ID** (começa com `price_`)

**Plano 2: Pro** (Mais Popular)
- Nome: `Garcez Palha - Plano Pro`
- Preço: R$ 997,00 / mês
- Billing: Recorrente mensal
- Metadata:
  - `plan_id`: `pro`
  - `agents`: `3`
  - `products`: `unlimited`
  - `conversations`: `500`

**Plano 3: Enterprise**
- Nome: `Garcez Palha - Plano Enterprise`
- Preço: R$ 1.997,00 / mês
- Billing: Recorrente mensal
- Metadata:
  - `plan_id`: `enterprise`
  - `agents`: `8`
  - `products`: `unlimited`
  - `conversations`: `unlimited`

---

### 3.2: Criar Addons Opcionais

**Addon 1: Nicho Extra**
- Nome: `Nicho Extra - Agent IA Adicional`
- Preço: R$ 97,00 / mês
- Billing: Recorrente mensal
- Metadata:
  - `addon_id`: `nicho-extra`

**Addon 2: Catálogo Garcez Palha**
- Nome: `Catálogo Garcez Palha - 57 Produtos`
- Preço: R$ 297,00 / mês
- Billing: Recorrente mensal
- Metadata:
  - `addon_id`: `catalogo`

---

### 3.3: Adicionar Price IDs no .env

Depois de criar todos os produtos, copie os Price IDs e adicione no `.env.local`:

```bash
# Plans
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_1ABC...
NEXT_PUBLIC_STRIPE_PRICE_PRO=price_1XYZ...
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_1DEF...

# Addons
NEXT_PUBLIC_STRIPE_PRICE_ADDON_NICHO=price_1GHI...
NEXT_PUBLIC_STRIPE_PRICE_ADDON_CATALOGO=price_1JKL...
```

---

## 🔔 Passo 4: Configurar Webhooks

Webhooks são necessários para:
- ✅ Provisionar automaticamente após pagamento
- ✅ Atualizar status da assinatura
- ✅ Cancelar acesso quando assinatura expira

### 4.1: Criar Webhook Endpoint

1. Vá para: https://dashboard.stripe.com/test/webhooks
2. Clique em **+ Add endpoint**
3. URL: `https://SEU_DOMINIO/api/stripe/webhook`
   - Exemplo: `https://garcezpalha.com.br/api/stripe/webhook`
4. Eventos para escutar:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

5. Clique em **Add endpoint**
6. Copie o **Signing secret** (começa com `whsec_`)

### 4.2: Adicionar Webhook Secret no .env

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🔐 Passo 5: Configurar Customer Portal

O Customer Portal permite que clientes gerenciem suas assinaturas (upgrade, downgrade, cancelar).

1. Vá para: https://dashboard.stripe.com/test/settings/billing/portal
2. Configuração recomendada:
   - ✅ **Allow customers to update their payment method**
   - ✅ **Allow customers to update their billing info**
   - ✅ **Allow customers to cancel their subscription**
   - ✅ **Allow customers to switch plans**
   - **Proration behavior:** Charge prorated amount immediately
3. Salve as configurações

---

## ✅ Passo 6: Testar o Fluxo

### 6.1: Teste com Cartão de Teste

Use estes cartões para testar:

**Sucesso:**
- `4242 4242 4242 4242`
- Validade: qualquer data futura
- CVC: qualquer 3 dígitos
- CEP: qualquer

**Falha:**
- `4000 0000 0000 0002` (cartão recusado)

### 6.2: Fluxo Completo

1. Acesse: `http://localhost:3000/app/checkout`
2. Selecione um plano
3. Adicione addons (opcional)
4. Preencha os dados
5. Clique em "Finalizar Assinatura"
6. Você será redirecionado para Stripe Checkout
7. Use cartão de teste `4242 4242 4242 4242`
8. Após pagamento, verifique:
   - ✅ Webhook recebido (Dashboard Stripe → Webhooks)
   - ✅ Usuário provisionado no Supabase
   - ✅ Email de boas-vindas enviado

---

## 📊 Passo 7: Monitoring (Produção)

### Dashboard Stripe:

1. **Customers:** Ver todos os clientes e assinaturas
2. **Subscriptions:** Ver todas as assinaturas ativas
3. **Payments:** Histórico de cobranças
4. **Webhooks:** Ver se todos webhooks estão sendo entregues

### Alertas Importantes:

Configure alertas para:
- ❌ Falhas de pagamento (cobrar novamente ou cancelar)
- ❌ Webhooks falhando (verificar endpoint)
- ✅ Novas assinaturas (celebrar! 🎉)

---

## 🚨 Troubleshooting

### Erro: "No such price"
**Causa:** Price ID incorreto ou não existe
**Solução:** Verifique se copiou o Price ID correto do Dashboard Stripe

### Erro: "Invalid API Key"
**Causa:** API Key incorreta ou expirada
**Solução:** Verifique se está usando a key correta (test vs live)

### Webhook não está sendo recebido
**Causa:** URL incorreta ou webhook não configurado
**Solução:**
1. Verifique URL no Dashboard Stripe
2. Teste manualmente: Dashboard → Webhooks → Send test webhook
3. Verifique logs em: `/api/stripe/webhook`

### Pagamento aprovado mas usuário não provisionado
**Causa:** Webhook não processado corretamente
**Solução:**
1. Verifique logs do webhook
2. Reveja código em `src/app/api/stripe/webhook/route.ts`
3. Teste manualmente reprocessando o webhook

---

## 📚 Recursos Adicionais

- **Stripe Docs:** https://stripe.com/docs
- **Testing:** https://stripe.com/docs/testing
- **Webhooks:** https://stripe.com/docs/webhooks
- **Customer Portal:** https://stripe.com/docs/billing/subscriptions/customer-portal

---

## ✅ Checklist de Produção

Antes de lançar:

- [ ] Conta Stripe ativada (não modo test)
- [ ] Live API keys configuradas
- [ ] 5 produtos criados (3 plans + 2 addons)
- [ ] Webhooks configurados com URL de produção
- [ ] Customer Portal configurado
- [ ] Testado fluxo completo em test mode
- [ ] Métodos de pagamento aceitos: Cartão (PIX futuramente)
- [ ] Impostos configurados (se aplicável)

---

**Status:** ✅ Implementação Completa
**Última atualização:** 30/12/2024
**Responsável:** MANUS v7.0
