# ✅ STRIPE CHECKOUT - CHECKLIST DE TESTE

**Data**: 31/12/2024
**Status Build**: ✅ PASSING (Build ID: VEh3zF3ddTiDMUoSLrOFn)
**Ambiente**: TEST MODE

---

## 🎯 Objetivo

Validar integração Stripe completa antes do deploy em produção.

---

## ✅ PRÉ-REQUISITOS (COMPLETOS)

- [x] Stripe CLI instalado (v1.33.0)
- [x] 5 produtos criados em TEST mode
- [x] 10 preços configurados (3 monthly + 3 yearly + 2 addons)
- [x] Webhook secret configurado em `.env.local`
- [x] Build passando sem erros
- [x] Webhook route implementado (`/api/stripe/webhook`)

---

## 🧪 TESTE 1: Webhook Local (5 min)

### Passo 1: Iniciar Webhook Listener

```bash
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

**Resultado esperado**: `Ready! You are using Stripe API Version...`

### Passo 2: Iniciar Dev Server (terminal separado)

```bash
npm run dev
```

**Resultado esperado**: Server rodando em `http://localhost:3000`

### Passo 3: Testar Evento de Teste

```bash
stripe trigger customer.subscription.created
```

**Resultado esperado**:
- Webhook listener mostra: `✓ customer.subscription.created [200]`
- Console do Next.js mostra: `Subscription created: sub_xxx`

---

## 🧪 TESTE 2: Checkout Flow Completo (10 min)

### Passo 1: Acessar Página de Checkout

```
http://localhost:3000/checkout
```

**Verificar**:
- [x] 3 planos exibidos (Starter, Pro, Enterprise)
- [x] Preços corretos: R$ 297, R$ 697, R$ 1.997
- [x] Botões "Assinar Agora" funcionando

### Passo 2: Criar Sessão de Checkout

1. Clicar em "Assinar Agora" no plano PRO
2. Verificar redirecionamento para Stripe Checkout
3. **Dados de teste**:
   - Email: `test@example.com`
   - Cartão: `4242 4242 4242 4242`
   - Data: Qualquer data futura
   - CVC: Qualquer 3 dígitos
   - CEP: Qualquer

### Passo 3: Completar Pagamento

**Verificar após pagamento**:
- [x] Webhook recebido: `checkout.session.completed`
- [x] Webhook recebido: `customer.subscription.created`
- [x] Webhook recebido: `invoice.paid`
- [x] Dados salvos no Supabase:
  - Tabela `subscriptions`: novo registro criado
  - Tabela `invoices`: invoice registrada
  - Tabela `users`: `current_plan` atualizado para "pro"

---

## 🧪 TESTE 3: Verificar Database (2 min)

### Supabase Dashboard

Acessar: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou

**Verificar tabelas**:

#### `subscriptions`
```sql
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 1;
```

**Campos esperados**:
- `stripe_subscription_id`: sub_xxx
- `status`: active
- `plan_id`: pro
- `billing_cycle`: monthly

#### `invoices`
```sql
SELECT * FROM invoices ORDER BY created_at DESC LIMIT 1;
```

**Campos esperados**:
- `stripe_invoice_id`: in_xxx
- `amount_paid`: 69700 (R$ 697)
- `status`: paid

#### `users`
```sql
SELECT id, email, current_plan FROM users WHERE email = 'test@example.com';
```

**Campo esperado**:
- `current_plan`: pro

---

## 🧪 TESTE 4: Cancelamento (5 min)

### Passo 1: Cancelar via Stripe Dashboard

1. Acessar: https://dashboard.stripe.com/test/subscriptions
2. Encontrar subscription criada
3. Clicar "Cancel subscription"
4. Confirmar cancelamento

### Passo 2: Verificar Webhook

**Webhook esperado**: `customer.subscription.deleted`

### Passo 3: Verificar Database

```sql
SELECT status, canceled_at FROM subscriptions WHERE stripe_subscription_id = 'sub_xxx';
```

**Resultado esperado**:
- `status`: canceled
- `canceled_at`: timestamp atual

---

## 📊 RESULTADO ESPERADO

### ✅ Sucesso Total

- [x] Webhook listener funcionando
- [x] Checkout criado com sucesso
- [x] Pagamento processado
- [x] 3 webhooks recebidos e processados
- [x] Dados salvos corretamente no Supabase
- [x] Cancelamento funcional

### 🚀 Próximos Passos

Se todos os testes passarem:

1. **Commit do teste bem-sucedido**
2. **Deploy em produção (Vercel)**
3. **Configurar Stripe LIVE mode**:
   - Criar produtos em LIVE
   - Atualizar variáveis de ambiente
   - Configurar webhook de produção
4. **Primeiro pagamento real** 💰

---

## 🐛 Troubleshooting

### Webhook não recebe eventos

**Solução**:
```bash
# Verificar se o webhook secret está correto
grep STRIPE_WEBHOOK_SECRET .env.local

# Reiniciar webhook listener
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

### Erro 500 no webhook

**Verificar**:
1. Logs do console Next.js
2. Supabase service role key está configurada
3. Tabelas existem no banco

### Dados não salvam no Supabase

**Verificar**:
1. `metadata` enviado no checkout inclui `user_id`, `plan_id`
2. Supabase RLS policies permitem insert/update
3. Service role key tem permissões corretas

---

**Tempo total estimado**: 20-25 minutos
**Prioridade**: P0 (bloqueador para monetização)
**Responsável**: Deploy team
