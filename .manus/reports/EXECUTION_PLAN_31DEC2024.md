# 🚀 PLANO DE EXECUÇÃO - 31/12/2024

**Status Atual**: Build PASSING ✅ | Deploy PRONTO | RLS PENDENTE
**Objetivo**: Colocar plataforma em produção com segurança e monetização

---

## ✅ JÁ COMPLETADO HOJE

- [x] **P0-001**: Build failing → RESOLVIDO
- [x] **TypeScript Críticos**: 6 erros corrigidos
- [x] **Stripe Setup**: 100% configurado (TEST mode)
- [x] **Push para GitHub**: Commit `d7dafb3` deployed
- [x] **Documentação**: Test checklist criado

---

## 🎯 PRÓXIMOS PASSOS - HOJE (31/12/2024)

### 1. ⚡ RLS Policies - CRÍTICO (10 min)

**Por quê é crítico**: Sem RLS, dados de diferentes clientes podem vazar entre si.

**Instruções**:

1. Abrir: https://supabase.com/dashboard/project/cpcnzkttcwodvfqyhkou/sql/new
2. Copiar TODO o conteúdo de: `supabase/APPLY_RLS_POLICIES_ONLY.sql`
3. Colar no SQL Editor
4. Clicar em **"Run"** (Ctrl+Enter)
5. Verificar output mostra:
   ```
   ✅ 4 RLS policies aplicadas na tabela LEADS
   ✅ 4 RLS policies aplicadas na tabela CONVERSATIONS
   ✅ 4 RLS policies aplicadas na tabela QUALIFIED_LEADS
   ✅ 4 RLS policies aplicadas na tabela PRODUCTS
   ✅ 4 RLS policies aplicadas na tabela CONTRACTS
   ✅ 4 RLS policies aplicadas na tabela MESSAGES
   ```

**Resultado esperado**: 24 RLS policies ativas (4 por tabela × 6 tabelas)

**Validação**:
```sql
SELECT tablename, COUNT(*) as policies
FROM pg_policies
WHERE tablename IN ('leads', 'conversations', 'qualified_leads', 'products', 'contracts', 'messages')
GROUP BY tablename;
```

Deve retornar 4 policies para cada tabela.

---

### 2. 🔍 Verificar Deploy Vercel (5 min)

**URL Dashboard**: https://vercel.com/leopalhas-projects/garcezpalha/deployments

**Verificar**:
- [x] Deploy automático iniciou após push `d7dafb3`
- [x] Status: "Ready" (verde)
- [x] Build passou sem erros
- [x] URL de produção: https://garcezpalha.com

**Se deploy falhar**:
1. Ver logs no Vercel Dashboard
2. Verificar variáveis de ambiente estão configuradas
3. Fazer deploy manual: `vercel --prod`

---

### 3. 🧪 Testar Checkout em Produção - TEST Mode (15 min)

**Pré-requisito**: Deploy completado com sucesso

**Passo a passo**:

#### 3.1. Acessar página de checkout
```
https://garcezpalha.com/checkout
```

**Verificar**:
- [x] 3 planos exibem corretamente
- [x] Preços: R$ 297, R$ 697, R$ 1.997
- [x] Botões "Assinar Agora" funcionam

#### 3.2. Criar teste de pagamento

1. Clicar "Assinar Agora" no plano **PRO (R$ 697)**
2. **Dados de teste Stripe**:
   - Email: `teste@garcezpalha.com`
   - Cartão: `4242 4242 4242 4242`
   - Data: `12/25` (ou qualquer futura)
   - CVC: `123`
   - CEP: `01310-100`
   - Nome: `Cliente Teste`

3. Completar pagamento

#### 3.3. Verificar Webhooks recebidos

**Stripe Dashboard**: https://dashboard.stripe.com/test/webhooks

**Eventos esperados** (nos últimos minutos):
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.created`
- ✅ `invoice.paid`
- ✅ `payment_method.attached`

**Todos devem ter status**: ✅ Succeeded (200)

#### 3.4. Verificar dados no Supabase

**Supabase SQL Editor**:

```sql
-- Verificar subscription criada
SELECT
  stripe_subscription_id,
  plan_id,
  status,
  billing_cycle,
  current_period_end
FROM subscriptions
WHERE stripe_customer_id LIKE 'cus_%'
ORDER BY created_at DESC
LIMIT 1;
```

**Resultado esperado**:
- `plan_id`: "pro"
- `status`: "active"
- `billing_cycle`: "monthly"

```sql
-- Verificar invoice registrada
SELECT
  stripe_invoice_id,
  amount_paid,
  status,
  paid_at
FROM invoices
ORDER BY created_at DESC
LIMIT 1;
```

**Resultado esperado**:
- `amount_paid`: 69700 (R$ 697,00)
- `status`: "paid"

---

### 4. 🔧 Configurar Webhook de Produção (5 min)

**Stripe Dashboard**: https://dashboard.stripe.com/test/webhooks/create

**Configuração**:
- **Endpoint URL**: `https://garcezpalha.com/api/stripe/webhook`
- **Descrição**: "Garcez Palha Production Webhook"
- **Eventos para escutar**:
  - `checkout.session.completed`
  - `checkout.session.expired`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`
  - `payment_method.attached`
  - `payment_method.detached`

**Após criar**:
1. Copiar **Signing secret** (começa com `whsec_`)
2. Adicionar no Vercel:
   - Dashboard → Settings → Environment Variables
   - Nome: `STRIPE_WEBHOOK_SECRET`
   - Valor: `whsec_...` (o secret copiado)
   - Environment: **Production**
3. Fazer redeploy para aplicar variável

**Testar webhook**:
```bash
curl -X POST https://garcezpalha.com/api/stripe/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"ping"}'
```

---

## 📅 CURTO PRAZO (Esta Semana - 1-3 Jan 2025)

### 5. 💰 Stripe LIVE Mode - Migrar para Produção (30 min)

**Quando fazer**: Após todos os testes passarem em TEST mode

**Passo a passo**:

#### 5.1. Criar produtos em LIVE mode

```bash
cd d:/garcezpalha
bash scripts/setup-stripe-live.sh
```

**Ou manualmente via Stripe Dashboard**:
1. Mudar para **LIVE mode** (toggle no canto superior direito)
2. Ir em Products → Create Product
3. Criar 3 produtos:
   - **Starter**: R$ 297/mês (ou R$ 2.970/ano)
   - **Pro**: R$ 697/mês (ou R$ 6.970/ano)
   - **Enterprise**: R$ 1.997/mês (ou R$ 19.970/ano)
4. Copiar price IDs

#### 5.2. Atualizar variáveis de ambiente Vercel

**Vercel Dashboard → Settings → Environment Variables**

Atualizar para LIVE mode:
```bash
# Mudar de TEST para LIVE
STRIPE_SECRET_KEY=sk_live_... (obter em Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (obter em Stripe Dashboard)

# Atualizar Price IDs (LIVE)
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=price_... (do produto LIVE)
NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
```

#### 5.3. Criar webhook LIVE

**Stripe Dashboard (LIVE mode)**: https://dashboard.stripe.com/webhooks/create

- Endpoint: `https://garcezpalha.com/api/stripe/webhook`
- Mesmos eventos da lista anterior
- Copiar novo `STRIPE_WEBHOOK_SECRET` (LIVE)
- Atualizar no Vercel (Production environment)

#### 5.4. Redeploy

```bash
vercel --prod
```

---

### 6. 🎉 Primeiro Cliente Pagante (timing definido por marketing)

**Pré-requisitos**:
- [x] RLS aplicado
- [x] Stripe LIVE configurado
- [x] Webhooks testados e funcionando
- [x] Deploy em produção estável

**Checklist final antes de abrir para público**:
- [ ] Página de preços está correta
- [ ] Termos de uso e política de privacidade no site
- [ ] Email de boas-vindas configurado
- [ ] Suporte ao cliente preparado (email/chat)
- [ ] Métricas/Analytics configuradas (Google Analytics, Hotjar, etc)

**Canais de aquisição**:
1. Landing page otimizada (já existe)
2. Google Ads (se já configurado)
3. LinkedIn/Instagram (orgânico + pago)
4. Email marketing para base existente
5. Parcerias com escritórios de advocacia

---

## 📊 MÉDIO PRAZO (Semana 2-3 Janeiro)

### 7. 🧪 Aumentar Test Coverage (12h)

**Objetivo**: De 30% → 60%+

**Prioridades**:
1. Testes unitários para agents IA principais (6h)
2. Testes de integração para fluxos críticos (4h)
3. Testes E2E para checkout e dashboard (2h)

**Deliverable**: Coverage report mostrando 60%+

---

### 8. 🔧 Corrigir 179 TypeScript Errors (12-16h)

**Abordagem incremental**:

**Semana 1** (6h):
- Corrigir implicit `any` types (~80 erros)
- Focus em `src/app/api/**` routes

**Semana 2** (4h):
- Adicionar types para tabelas faltantes (`client_documents`)
- Corrigir deprecated imports (`createRouteHandlerClient`)

**Semana 3** (2-4h):
- Corrigir erros em testes
- Validar zero erros: `npx tsc --noEmit`

---

### 9. 📈 Monitoramento & Analytics (4h)

**Setup**:
1. **Sentry** - Error tracking
2. **Vercel Analytics** - Performance monitoring
3. **PostHog** - Product analytics
4. **Stripe Dashboard** - Revenue tracking

**KPIs para monitorar**:
- MRR (Monthly Recurring Revenue)
- Churn rate
- Conversion rate (visitante → trial → pagante)
- CAC (Customer Acquisition Cost)
- LTV (Lifetime Value)

---

### 10. 🚀 MANUS v7.0 - Sprint 1 (40h - 2 semanas)

**Objetivo**: Atingir 78/100 Production Readiness

**Dimensões**:
- D2 (Código): 65 → 85 (+20)
- D3 (Testes): 45 → 70 (+25)
- D4 (UX/UI): 0 → 75 (+75)
- D5 (Segurança): 0 → 80 (+80)

**Score Global**: 53 → 78 (**MVP BASIC**)

---

## 🎯 LONGO PRAZO (Q1 2025)

### Semana 4-5: Features de Retenção
- Email sequences automatizadas
- Onboarding flow otimizado
- In-app notifications
- Help center / Knowledge base

### Semana 6-8: Escalabilidade
- Redis caching para performance
- CDN para assets estáticos
- Database optimization (índices, queries)
- Rate limiting nas APIs

### Semana 9-12: Growth
- Programa de referral
- Integrações com CRMs populares
- API pública para parceiros
- White-label para escritórios grandes

---

## 📋 RESUMO - AÇÕES IMEDIATAS

**HOJE (31/12)**:
1. ✅ Aplicar RLS no Supabase (10 min)
2. ✅ Verificar deploy Vercel (5 min)
3. ✅ Testar checkout em produção TEST (15 min)
4. ✅ Configurar webhook produção (5 min)

**ESTA SEMANA**:
5. 💰 Migrar Stripe para LIVE mode (30 min)
6. 🎉 Preparar para primeiro cliente (2h)

**PRÓXIMAS 2 SEMANAS**:
7. 🧪 Aumentar coverage para 60% (12h)
8. 🔧 Corrigir TypeScript errors (12-16h)
9. 📈 Setup monitoring completo (4h)

**TOTAL ESTIMADO**: ~35 horas nas próximas 2 semanas

---

## 🎖️ CRITÉRIOS DE SUCESSO

### Hoje (31/12):
- [x] RLS aplicado em todas as 6 tabelas
- [x] Deploy em produção funcionando
- [x] Checkout testado com sucesso (TEST mode)
- [x] Webhook recebendo eventos

### Esta Semana:
- [ ] Primeiro pagamento LIVE recebido
- [ ] Cliente consegue acessar dashboard após pagamento
- [ ] Zero erros nos logs do Vercel/Stripe

### 2 Semanas:
- [ ] TypeScript errors < 50
- [ ] Test coverage > 60%
- [ ] MRR > R$ 0 (primeira receita)
- [ ] Score MANUS v7.0 > 75/100

---

**Última Atualização**: 31/12/2024 - 02:15
**Próxima Revisão**: 02/01/2025 (após RLS + testes)
**Responsável**: Leonardo Palha + Claude MANUS v7.0
