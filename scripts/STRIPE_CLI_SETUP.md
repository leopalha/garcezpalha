# 🚀 Setup Automático do Stripe via CLI

Este guia mostra como configurar automaticamente todos os produtos e preços do Stripe usando a Stripe CLI.

## 📋 Pré-requisitos

1. **Stripe CLI instalada**: ✅ Já instalada (versão 1.33.0)
2. **Conta Stripe**: Acesso à sua conta Stripe
3. **Autenticação**: Fazer login na Stripe CLI

## 🔐 1. Autenticar na Stripe CLI

Primeiro, faça login na sua conta Stripe:

```bash
stripe login
```

Isso abrirá o navegador para você autorizar a CLI.

### Verificar autenticação

```bash
stripe config --list
```

## ⚡ 2. Executar o Script de Setup

### Executar o script (funciona em Windows/Linux/Mac):

```bash
cd d:/garcezpalha
bash scripts/setup-stripe.sh
```

**Nota**: O script `setup-stripe.sh` funciona perfeitamente no Git Bash (Windows), Linux e Mac.

## 📦 O que o script faz?

O script cria automaticamente:

### **5 Produtos:**
1. ✅ **Starter Plan** - Plano inicial (3 produtos, 100 leads/mês)
2. ✅ **Pro Plan** - Plano profissional (10 produtos, 500 leads/mês)
3. ✅ **Enterprise Plan** - Plano enterprise (ilimitado)
4. ✅ **Addon: Nicho Extra** - Adiciona 1 nicho ao plano
5. ✅ **Addon: Catálogo Premium** - 47 nichos pré-configurados

### **10 Preços:**

**Planos Mensais:**
- Starter: R$ 297/mês
- Pro: R$ 697/mês
- Enterprise: R$ 1.997/mês

**Planos Anuais (20% desconto):**
- Starter: R$ 2.970/ano
- Pro: R$ 6.970/ano
- Enterprise: R$ 19.970/ano

**Addons:**
- Nicho Extra: R$ 97/mês
- Catálogo Premium: R$ 197/mês

### **Arquivo .env.stripe.local:**

O script gera automaticamente um arquivo com todas as variáveis de ambiente necessárias:

```env
STRIPE_PRODUCT_STARTER=prod_xxxxx
STRIPE_PRODUCT_PRO=prod_xxxxx
STRIPE_PRODUCT_ENTERPRISE=prod_xxxxx
STRIPE_PRODUCT_ADDON_NICHO=prod_xxxxx
STRIPE_PRODUCT_ADDON_CATALOGO=prod_xxxxx

NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxxxx

NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_YEARLY=price_xxxxx

NEXT_PUBLIC_STRIPE_PRICE_ADDON_NICHO=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ADDON_CATALOGO=price_xxxxx
```

## 📝 3. Copiar Variáveis para .env

Após executar o script:

1. Abra o arquivo `.env.stripe.local` gerado
2. Copie todas as variáveis
3. Cole no seu arquivo `.env` (ou `.env.local`)

```bash
# Windows
type .env.stripe.local >> .env.local

# Linux/Mac
cat .env.stripe.local >> .env.local
```

## 🔗 4. Configurar Webhook (Desenvolvimento)

Para testar webhooks localmente:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copie o **webhook signing secret** que aparece e adicione ao `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## 🧪 5. Testar o Checkout

1. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

2. Acesse: http://localhost:3000/app/checkout

3. Selecione um plano e teste o fluxo completo

4. Use os [cartões de teste do Stripe](https://stripe.com/docs/testing#cards):
   - Sucesso: `4242 4242 4242 4242`
   - Falha: `4000 0000 0000 0002`

## 🚀 6. Deploy para Produção

### 6.1. Criar produtos em produção

1. Mude para o modo **LIVE** na Stripe CLI:

```bash
stripe login --live
```

2. Execute o script novamente:

```powershell
.\scripts\setup-stripe-products.ps1
```

3. Copie as novas variáveis para o `.env` de produção

### 6.2. Configurar webhook em produção

1. Acesse: https://dashboard.stripe.com/webhooks
2. Clique em **"Add endpoint"**
3. URL: `https://garcezpalha.com/api/stripe/webhook`
4. Eventos a escutar:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_method.attached`
   - `payment_method.detached`

5. Copie o **Signing secret** e adicione ao Vercel:

```bash
vercel env add STRIPE_WEBHOOK_SECRET
```

## 🔍 Verificar Configuração

### Listar produtos criados:

```bash
stripe products list
```

### Listar preços:

```bash
stripe prices list
```

### Ver detalhes de um produto:

```bash
stripe products retrieve prod_xxxxx
```

### Ver detalhes de um preço:

```bash
stripe prices retrieve price_xxxxx
```

## 🛠️ Comandos Úteis

### Atualizar metadados de um produto:

```bash
stripe products update prod_xxxxx \
  --metadata[max_products]=5
```

### Criar um novo preço para produto existente:

```bash
stripe prices create \
  --product=prod_xxxxx \
  --currency=brl \
  --unit-amount=50000 \
  --recurring[interval]=month
```

### Desativar um preço:

```bash
stripe prices update price_xxxxx --active=false
```

## 📊 Estrutura dos Metadados

Cada produto tem metadados com os limites do plano:

```json
{
  "plan_id": "starter",
  "tier": "basic",
  "max_products": "3",
  "max_leads": "100",
  "max_conversations": "500",
  "max_emails_per_month": "1000"
}
```

Esses metadados são usados pela API `/api/subscriptions/current` para enforcement de limites.

## 🐛 Troubleshooting

### Erro: "stripe: command not found"

Instale a Stripe CLI:
- Windows: `scoop install stripe`
- Mac: `brew install stripe/stripe-cli/stripe`
- Linux: https://stripe.com/docs/stripe-cli#install

### Erro: "Not authenticated"

Execute: `stripe login`

### Erro: "Rate limit exceeded"

Aguarde 1 minuto e tente novamente.

### Produtos duplicados

Para limpar e recriar:

```bash
# Listar produtos
stripe products list

# Deletar produto
stripe products delete prod_xxxxx

# Executar script novamente
.\scripts\setup-stripe-products.ps1
```

## 📚 Referências

- [Stripe CLI Docs](https://stripe.com/docs/stripe-cli)
- [Products API](https://stripe.com/docs/api/products)
- [Prices API](https://stripe.com/docs/api/prices)
- [Subscriptions](https://stripe.com/docs/billing/subscriptions/overview)
- [Testing](https://stripe.com/docs/testing)

## ✅ Checklist Final

- [ ] Stripe CLI autenticada
- [ ] Script executado com sucesso
- [ ] Variáveis copiadas para `.env`
- [ ] Webhook configurado (dev)
- [ ] Checkout testado localmente
- [ ] Produtos criados em produção (LIVE mode)
- [ ] Webhook configurado em produção
- [ ] Variáveis adicionadas no Vercel
- [ ] Deploy realizado
- [ ] Teste completo em produção

---

**Tempo estimado**: 15-20 minutos
**Dificuldade**: Fácil ⭐
**Status**: ✅ Pronto para uso
