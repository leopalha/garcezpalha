# 📋 GARCEZ PALHA ENGINE - TAREFAS DE IMPLEMENTAÇÃO

**Última Atualização**: 30/12/2024
**Metodologia**: MANUS v7.0
**Modelo**: B2B2C White-Label (Secretária Jurídica IA + Marketing)
**Status**: Implementação Pendente

---

## 📖 REFERÊNCIAS DE DOCUMENTAÇÃO

Antes de implementar, leia nesta ordem:

1. ✅ **[docs/MODELO_CORRETO_FINAL.md](./docs/MODELO_CORRETO_FINAL.md)** - Modelo errado vs correto
2. ✅ **[docs/ESTRUTURA_PRODUTOS.md](./docs/ESTRUTURA_PRODUTOS.md)** - 3 planos (Starter/Pro/Enterprise)
3. ✅ **[docs/IMPLEMENTACAO_SECRETARIA_JURIDICA_ENGINE.md](./docs/IMPLEMENTACAO_SECRETARIA_JURIDICA_ENGINE.md)** - Produto core (15 dias)
4. ✅ **[docs/IMPLEMENTACAO_WHITE_LABEL_ENGINE.md](./docs/IMPLEMENTACAO_WHITE_LABEL_ENGINE.md)** - Multi-tenancy (13 dias)
5. ✅ **[docs/IMPLEMENTACAO_AGENTE_MARKETING.md](./docs/IMPLEMENTACAO_AGENTE_MARKETING.md)** - Add-on Pro (10 dias)

---

## 🎯 ESTRUTURA DO PRODUTO

### **Garcez Palha Engine = Secretária Jurídica IA**

**3 Planos:**
- **Starter** (R$ 497/mês): Secretária IA (chat 24/7, qualificação, agendamento, propostas)
- **Pro** (R$ 997/mês): Starter + Marketing Automation (conteúdo + ads)
- **Enterprise** (R$ 1.997/mês): Pro + API + Custom training + Ilimitado

**Modelo de Negócio:**
- B2C: Google Ads → Clientes diretos (gerenciado pelo parceiro)
- B2B2C: White-Label → Parceiros advogados → Clientes finais

---

## ⏳ P0 - BLOQUEADORES CRÍTICOS (DO NOW!)

### ⏸️ P2-006: MCP Servers (83-107h)
**Status**: PENDENTE (Requer projeto dedicado multi-sprint)
**Prioridade**: 🔴 P0 CRÍTICO

[ ] JusBrasil integration
[ ] PJe integration completa
[ ] ClickSign integration (expandir)
[ ] Stripe integration avançada
[ ] Google Analytics MCP
[ ] Facebook Ads MCP
[ ] Google Ads MCP
[ ] HubSpot MCP
[ ] Intercom MCP
[ ] CNJ MCP

**Estimativa**: 83-107h total
**Detalhes**: Ver `docs/IMPLEMENTACAO_AGENTE_MARKETING.md` seção MCP Servers

---

### 🎯 P0 Próximos Passos P2 (CRÍTICOS)

[ ] Configurar Cron Jobs no Vercel (15 min)
[ ] Configurar Webhooks (Stripe, ClickSign, WhatsApp) (30 min)
[ ] Criar testes unitários para P2 systems (2-4h)
[ ] Validar deploy em produção dos P2 systems (1h)

---

## 🔴 FASE 0: PREPARAÇÃO DO BANCO DE DADOS (2 dias)

**Estimativa**: 2 dias (16h)
**Prioridade**: 🔴 P0 CRÍTICO
**Descrição**: Criar tabelas necessárias para multi-tenancy + secretária IA + marketing

### ✅ Checklist FASE 0

#### Dia 1: Schema Multi-Tenancy (8h)

[ ] **TASK 0.1**: Criar migration `tenants` table
  - Arquivo: `supabase/migrations/YYYYMMDDHHMMSS_create_tenants.sql`
  - Campos: id, name, slug, subdomain, owner_id, logo_url, primary_color, plan, stripe_customer_id
  - RLS policies: owner can read/update own tenant
  - Validação: tenant_id NOT NULL em todas as tabelas principais

[ ] **TASK 0.2**: Criar migration `plans` table
  - Arquivo: `supabase/migrations/YYYYMMDDHHMMSS_create_plans.sql`
  - Campos: id, name, price, limits (JSONB), features (JSONB)
  - 3 planos: starter, pro, enterprise
  - Seed data: INSERT com features dos 3 planos

[ ] **TASK 0.3**: Criar migration `subscriptions` table
  - Arquivo: `supabase/migrations/YYYYMMDDHHMMSS_create_subscriptions.sql`
  - Campos: id, tenant_id, plan_id, status, stripe_subscription_id, current_period_end
  - RLS policies: tenant owner can read own subscriptions

[ ] **TASK 0.4**: Adicionar `tenant_id` em tabelas existentes
  - Tabelas: leads, conversations, messages, invoices, cases, users
  - Migration: ALTER TABLE ADD COLUMN tenant_id UUID REFERENCES tenants(id)
  - Atualizar RLS policies para filtrar por tenant_id

#### Dia 2: Schema Agents + Workflows (8h)

[ ] **TASK 0.5**: Criar migration `agent_configs` table
  - Arquivo: `supabase/migrations/YYYYMMDDHHMMSS_create_agent_configs.sql`
  - Campos: id, tenant_id, agent_type, name, prompt, settings (JSONB), enabled
  - 24 tipos de agentes (CEO, CMO, CFO, COO, CTO, Legal, Marketing, etc.)
  - RLS policies: tenant owner can CRUD own agent configs

[ ] **TASK 0.6**: Criar migration `workflows` table
  - Arquivo: `supabase/migrations/YYYYMMDDHHMMSS_create_workflows.sql`
  - Campos: id, tenant_id, name, type, trigger, schedule, actions (JSONB), enabled
  - 8 workflows: 3 daily, 2 weekly, 3 triggers
  - RLS policies: tenant owner can CRUD own workflows

[ ] **TASK 0.7**: Criar migration `chat_sessions` table
  - Arquivo: `supabase/migrations/YYYYMMDDHHMMSS_create_chat_sessions.sql`
  - Campos: id, tenant_id, visitor_id, session_data (JSONB), created_at, expires_at
  - Para Chat Widget stateless
  - Índice em tenant_id + visitor_id

[ ] **TASK 0.8**: Aplicar migrations em Supabase Production
  - Via Supabase Studio SQL Editor
  - Testar cada migration individualmente
  - Validar RLS policies funcionam
  - Regenerar types: `npx supabase gen types typescript`

---

## 🟢 FASE 1: SECRETÁRIA JURÍDICA IA - PRODUTO CORE (15 dias)

**Estimativa**: 15 dias úteis (120h)
**Prioridade**: 🔴 P0 ALTO
**Descrição**: Implementar produto principal (Chat IA + Qualificação + Agendamento + Propostas)

### ✅ Checklist FASE 1

#### Sprint 1.1: Chat Widget Embeddable (3 dias, 24h)

[ ] **TASK 1.1**: Criar `ChatWidget` component
  - Arquivo: `src/components/chat/ChatWidget.tsx`
  - Props: tenantId, sessionId, branding (colors, logo)
  - Features: Floating button, chat window, message list, input field
  - LocalStorage: Persistir session + messages
  - Integração: API `/api/chat/message`
  - Referência: `docs/IMPLEMENTACAO_SECRETARIA_JURIDICA_ENGINE.md` (linhas 180-310)

[ ] **TASK 1.2**: Criar API `/api/chat/widget/message`
  - Arquivo: `src/app/api/chat/widget/message/route.ts`
  - Input: tenantId, sessionId, message, visitorData
  - Process: Chamar agent orchestrator → Classificar → Qualificar
  - Output: { reply, nextStep, score }
  - Edge Runtime: Streaming response

[ ] **TASK 1.3**: Criar API `/api/chat/widget/session`
  - Arquivo: `src/app/api/chat/widget/session/route.ts`
  - GET: Recuperar session existente (tenant_id + visitor_id)
  - POST: Criar nova session (expires em 24h)
  - Persist: `chat_sessions` table

[ ] **TASK 1.4**: Criar embed script `public/embed.js`
  - Arquivo: `public/embed.js`
  - Init: `GarcezPalhaWidget.init({ tenantId, position, theme })`
  - Load: Inject iframe ou React component
  - Branding: Fetch tenant colors/logo via API

#### Sprint 1.2: Sistema de Qualificação (4 dias, 32h)

[ ] **TASK 1.5**: Criar API `/api/chat/qualification/start`
  - Arquivo: `src/app/api/chat/qualification/start/route.ts`
  - Input: tenantId, sessionId, caseType
  - Process: Buscar 103 perguntas por área do direito
  - Output: { qualificationId, questions, currentStep }
  - Persist: Salvar em `conversations.qualification` (JSONB)

[ ] **TASK 1.6**: Criar API `/api/chat/qualification/submit-answer`
  - Arquivo: `src/app/api/chat/qualification/submit-answer/route.ts`
  - Input: qualificationId, questionId, answer
  - Process: Aplicar scoring rules (0-100)
  - Output: { nextQuestion, score, isComplete }
  - Persist: Atualizar `conversations.qualification`

[ ] **TASK 1.7**: Criar API `/api/chat/qualification/complete`
  - Arquivo: `src/app/api/chat/qualification/complete/route.ts`
  - Input: qualificationId
  - Process: Calcular score final (HOT >= 80, WARM 50-79, COLD < 50)
  - Output: { score, classification, recommendedProduct }
  - Trigger: Email para admin se score >= 80

[ ] **TASK 1.8**: Expandir `ChatQualificationManager`
  - Arquivo: `src/lib/ai/qualification/chat-qualification-manager.ts`
  - Adicionar: `getQuestionsByArea()`, `applyScoring()`, `classifyLead()`
  - Integração: 103 perguntas por área do direito (já existem)
  - Validação: TypeScript strict mode

#### Sprint 1.3: Agendamento Automático (3 dias, 24h)

[ ] **TASK 1.9**: Criar API `/api/chat/scheduling/availability`
  - Arquivo: `src/app/api/chat/scheduling/availability/route.ts`
  - Input: tenantId, date (ISO string)
  - Process: Fetch Google Calendar availability
  - Output: { slots: [{ start, end, available }] }
  - Google Calendar API integration

[ ] **TASK 1.10**: Criar API `/api/chat/scheduling/book`
  - Arquivo: `src/app/api/chat/scheduling/book/route.ts`
  - Input: tenantId, sessionId, slot, clientData
  - Process: Create Google Calendar event
  - Output: { eventId, confirmationEmail }
  - Trigger: Email de confirmação via Resend

[ ] **TASK 1.11**: Criar `SchedulingComponent` para Chat Widget
  - Arquivo: `src/components/chat/SchedulingComponent.tsx`
  - Features: Calendar view, slot selection, form (nome, email, telefone)
  - Integration: API `/api/chat/scheduling/availability`
  - UX: Mobile-friendly, loading states

[ ] **TASK 1.12**: Configurar Google Calendar OAuth2
  - Arquivo: `.env.local` (adicionar GOOGLE_CALENDAR_CLIENT_ID, SECRET)
  - Setup: Google Cloud Console → Enable Calendar API
  - Auth: OAuth2 flow para tenant owner
  - Persist: Refresh token em `tenants.google_refresh_token`

#### Sprint 1.4: Geração de Propostas (3 dias, 24h)

[ ] **TASK 1.13**: Criar API `/api/chat/proposal/generate`
  - Arquivo: `src/app/api/chat/proposal/generate/route.ts`
  - Input: qualificationId, clientData
  - Process: GPT-4 gera proposta customizada (produto, valor, prazo)
  - Output: { proposalId, proposalText, pricingOptions }
  - Persist: `conversations.proposal` (JSONB)

[ ] **TASK 1.14**: Criar `ProposalComponent` para Chat Widget
  - Arquivo: `src/components/chat/ProposalComponent.tsx`
  - Features: Exibir proposta, pricing options (fixo / success fee)
  - Actions: Aceitar → Payment link | Rejeitar → Feedback form
  - UX: Professional design, OAB compliant

[ ] **TASK 1.15**: Criar API `/api/chat/proposal/accept`
  - Arquivo: `src/app/api/chat/proposal/accept/route.ts`
  - Input: proposalId, selectedPricing
  - Process: Create invoice + Generate MercadoPago PIX link
  - Output: { invoiceId, paymentLink }
  - Trigger: State transition → `payment_pending`

[ ] **TASK 1.16**: Integrar com sistema de contratos
  - Arquivo: `src/lib/contracts/proposal-to-contract.ts`
  - Function: `generateContractFromProposal(proposalId)`
  - Process: Buscar proposal data → Usar template específico
  - Output: Contract PDF via ClickSign API
  - Trigger: Após pagamento confirmado (webhook MercadoPago)

#### Sprint 1.5: Dashboard do Parceiro (2 dias, 16h)

[ ] **TASK 1.17**: Criar página `/dashboard/partner/conversations`
  - Arquivo: `src/app/(dashboard)/dashboard/partner/conversations/page.tsx`
  - Features: Lista de conversas ativas, filtro por status, search
  - Data: Fetch `/api/partner/conversations?status=active`
  - Components: ConversationList, StatusBadge, ScoreIndicator

[ ] **TASK 1.18**: Criar página `/dashboard/partner/conversations/[id]`
  - Arquivo: `src/app/(dashboard)/dashboard/partner/conversations/[id]/page.tsx`
  - Features: Ver detalhes da conversa, transcript, qualification score
  - Actions: Assumir conversa (handoff), Gerar proposta manual
  - Data: Fetch `/api/partner/conversations/:id`

[ ] **TASK 1.19**: Criar API `/api/partner/conversations`
  - Arquivo: `src/app/api/partner/conversations/route.ts`
  - GET: Lista conversas do tenant (filter, sort, pagination)
  - Auth: Validar tenant owner via JWT
  - Output: { conversations: [...], total, page }

[ ] **TASK 1.20**: Criar página `/dashboard/partner/settings`
  - Arquivo: `src/app/(dashboard)/dashboard/partner/settings/page.tsx`
  - Features: White-label settings (logo, colors, subdomain)
  - Form: Upload logo → Supabase Storage, ColorPicker
  - Save: API `/api/partner/settings` → Atualizar `tenants` table

---

## 🟡 FASE 2: WHITE-LABEL ENGINE - MULTI-TENANCY (13 dias)

**Estimativa**: 13 dias úteis (104h)
**Prioridade**: 🔴 P0 ALTO
**Descrição**: Infraestrutura multi-tenant + Onboarding 60s + Stripe

### ✅ Checklist FASE 2

#### Sprint 2.1: Tenant Resolution Middleware (2 dias, 16h)

[ ] **TASK 2.1**: Criar `tenantMiddleware.ts`
  - Arquivo: `src/middleware/tenantMiddleware.ts`
  - Logic: Detectar tenant via subdomain OU domain custom
  - Examples: `adv-jose.garcezpalha.com` → tenant "adv-jose"
  - Examples: `josesouza.com.br` → lookup em `tenants.custom_domain`
  - Store: `req.tenant` para uso em API routes

[ ] **TASK 2.2**: Atualizar Next.js middleware
  - Arquivo: `src/middleware.ts`
  - Integration: Chamar `tenantMiddleware` antes de auth
  - Rewrite: `/chat` → `/[tenant]/chat` (dynamic routing)
  - Edge compatible: Runtime "edge"

[ ] **TASK 2.3**: Criar API `/api/tenant/resolve`
  - Arquivo: `src/app/api/tenant/resolve/route.ts`
  - Input: subdomain OR customDomain (query param)
  - Output: { tenantId, name, branding: { logo, colors } }
  - Cache: Redis 15min (performance)

[ ] **TASK 2.4**: Criar Hook `useTenant()`
  - Arquivo: `src/hooks/useTenant.ts`
  - Logic: Fetch tenant data via API, cache in React Context
  - Return: { tenant, loading, error }
  - Usage: `const { tenant } = useTenant()` em components

#### Sprint 2.2: Onboarding 60 Segundos (3 dias, 24h)

[ ] **TASK 2.5**: Criar Landing Page `/parceiros`
  - Arquivo: `src/app/(marketing)/parceiros/page.tsx`
  - Hero: "Contrate uma Secretária Jurídica IA por R$ 497/mês"
  - VSL: Embed vídeo de 4min30s (problema → solução → prova)
  - CTA: "30 Dias Grátis - Setup em 60 Segundos"
  - Sections: Problem, Solution, Pricing, FAQ, Testimonials

[ ] **TASK 2.6**: Criar página `/onboarding`
  - Arquivo: `src/app/onboarding/page.tsx`
  - Steps: 3 passos (Dados básicos → OAB → Domínio)
  - Form: Nome, Email, Telefone, OAB, Slug (subdomain), Logo upload
  - Validation: Slug disponível (API check), OAB válido (regex)
  - UX: Progress bar, 60 segundos timer

[ ] **TASK 2.7**: Criar API `/api/onboarding/create-tenant`
  - Arquivo: `src/app/api/onboarding/create-tenant/route.ts`
  - Input: { name, email, phone, oab, slug, logo }
  - Process:
    1. Criar user em Supabase Auth
    2. Criar tenant em `tenants` table
    3. Criar trial subscription (30 dias)
    4. Upload logo → Supabase Storage
    5. Configurar DNS (subdomain automático)
  - Output: { tenantId, subdomain, loginUrl }
  - Trigger: Email de boas-vindas via Resend

[ ] **TASK 2.8**: Criar API `/api/onboarding/check-availability`
  - Arquivo: `src/app/api/onboarding/check-availability/route.ts`
  - GET: ?slug=adv-jose
  - Check: `SELECT COUNT(*) FROM tenants WHERE slug = $1`
  - Output: { available: true/false, suggestions: [...] }

#### Sprint 2.3: Stripe Integration - 3 Planos (4 dias, 32h)

[ ] **TASK 2.9**: Configurar Stripe Products + Prices
  - Via Stripe Dashboard: Criar 3 produtos
    - Starter: R$ 497/mês (price_starter_monthly)
    - Pro: R$ 997/mês (price_pro_monthly)
    - Enterprise: R$ 1.997/mês (price_enterprise_monthly)
  - Metadata: plan=starter/pro/enterprise, features (JSONB)
  - Test Mode: Criar preços de teste primeiro

[ ] **TASK 2.10**: Criar API `/api/billing/create-checkout`
  - Arquivo: `src/app/api/billing/create-checkout/route.ts`
  - Input: tenantId, plan (starter/pro/enterprise)
  - Process: Stripe.checkout.sessions.create()
  - Success URL: `/dashboard/billing/success?session_id={CHECKOUT_SESSION_ID}`
  - Cancel URL: `/dashboard/billing/canceled`
  - Output: { checkoutUrl }

[ ] **TASK 2.11**: Criar webhook `/api/webhooks/stripe`
  - Arquivo: `src/app/api/webhooks/stripe/route.ts`
  - Events:
    - `checkout.session.completed` → Ativar subscription
    - `invoice.payment_succeeded` → Renovar subscription
    - `invoice.payment_failed` → Suspender subscription
    - `customer.subscription.deleted` → Cancelar subscription
  - Process: Atualizar `subscriptions` table
  - Signature verification: `stripe.webhooks.constructEvent()`

[ ] **TASK 2.12**: Criar página `/dashboard/billing`
  - Arquivo: `src/app/(dashboard)/dashboard/billing/page.tsx`
  - Features:
    - Current plan badge
    - Usage stats (conversas/mês, usuários)
    - Upgrade/Downgrade buttons
    - Invoice history table
  - Data: Fetch `/api/billing/subscription`

[ ] **TASK 2.13**: Criar API `/api/billing/subscription`
  - Arquivo: `src/app/api/billing/subscription/route.ts`
  - GET: Buscar subscription ativa do tenant
  - Output: { plan, status, currentPeriodEnd, usage: {...} }
  - POST: Update subscription (upgrade/downgrade)
  - Integration: Stripe API `subscriptions.update()`

#### Sprint 2.4: Domain Customizado (2 dias, 16h)

[ ] **TASK 2.14**: Criar API `/api/tenant/domain/verify`
  - Arquivo: `src/app/api/tenant/domain/verify/route.ts`
  - Input: tenantId, customDomain (ex: josesouza.com.br)
  - Process: Gerar TXT record para validação DNS
  - Output: { txtRecord, instructions }
  - Persist: `tenants.custom_domain_pending`

[ ] **TASK 2.15**: Criar API `/api/tenant/domain/validate`
  - Arquivo: `src/app/api/tenant/domain/validate/route.ts`
  - Input: tenantId
  - Process: Verificar DNS TXT record existe (via DNS lookup)
  - Output: { validated: true/false }
  - If valid: Atualizar `tenants.custom_domain` + Configurar Vercel domain

[ ] **TASK 2.16**: Criar página `/dashboard/domain`
  - Arquivo: `src/app/(dashboard)/dashboard/domain/page.tsx`
  - Features:
    - Input custom domain
    - Exibir instruções DNS (TXT record)
    - Botão "Validar" (polling até sucesso)
    - Status: Pending → Validating → Active
  - UX: Step-by-step guide, screenshots

[ ] **TASK 2.17**: Configurar Vercel Domains API
  - Arquivo: `src/lib/vercel/domains.ts`
  - Functions: `addDomain(domain)`, `verifyDomain(domain)`, `removeDomain(domain)`
  - Integration: Vercel API `/v9/projects/:id/domains`
  - Auth: VERCEL_TOKEN (env var)

#### Sprint 2.5: RLS Policies Multi-Tenant (2 dias, 16h)

[ ] **TASK 2.18**: Criar RLS policies para `conversations`
  - Migration: `20YYMMDDHHMMSS_add_rls_conversations.sql`
  - Policy: `tenant_owner_conversations`
  - Rule: `(SELECT owner_id FROM tenants WHERE id = tenant_id) = auth.uid()`
  - Apply: SELECT, INSERT, UPDATE, DELETE

[ ] **TASK 2.19**: Criar RLS policies para `messages`
  - Migration: `20YYMMDDHHMMSS_add_rls_messages.sql`
  - Policy: `tenant_owner_messages`
  - Rule: Via JOIN com `conversations` → Validar tenant_id

[ ] **TASK 2.20**: Criar RLS policies para `leads`
  - Migration: `20YYMMDDHHMMSS_add_rls_leads.sql`
  - Policy: `tenant_owner_leads`
  - Rule: `tenant_id IN (SELECT id FROM tenants WHERE owner_id = auth.uid())`

[ ] **TASK 2.21**: Testar RLS isolation
  - Script: `scripts/test-rls-isolation.ts`
  - Test: Criar 2 tenants → Tentar acessar dados do outro
  - Validation: Deve retornar 0 rows (isolation perfeito)
  - Coverage: All tables com tenant_id

---

## 🟠 FASE 3: MARKETING AUTOMATION - ADD-ON PRO (10 dias)

**Estimativa**: 10 dias úteis (80h)
**Prioridade**: 🟡 P1 MÉDIO
**Descrição**: Marketing automation (conteúdo + ads) para Plano Pro

### ✅ Checklist FASE 3

#### Sprint 3.1: Admin Interface Agents (3 dias, 24h)

[ ] **TASK 3.1**: Criar página `/dashboard/admin/agents`
  - Arquivo: `src/app/(admin)/admin/agents/page.tsx`
  - Features: Lista de 24 agentes, cards com status (enabled/disabled)
  - Actions: Enable/Disable agent, Editar prompt/settings
  - Data: Fetch `/api/admin/agents`

[ ] **TASK 3.2**: Criar página `/dashboard/admin/agents/[id]`
  - Arquivo: `src/app/(admin)/admin/agents/[id]/page.tsx`
  - Features:
    - Form: Edit agent name, prompt (textarea 2000 chars), settings (JSON editor)
    - Test: Enviar mensagem de teste para agent
    - Logs: Últimas 50 interações do agent
  - Data: Fetch `/api/admin/agents/:id`

[ ] **TASK 3.3**: Criar API `/api/admin/agents`
  - Arquivo: `src/app/api/admin/agents/route.ts`
  - GET: Lista todos os agentes (tenant_id = current user)
  - POST: Criar novo agent config
  - Output: { agents: [...] }

[ ] **TASK 3.4**: Criar API `/api/admin/agents/[id]`
  - Arquivo: `src/app/api/admin/agents/[id]/route.ts`
  - GET: Buscar agent por ID
  - PUT: Atualizar agent (name, prompt, settings, enabled)
  - DELETE: Desabilitar agent
  - Validation: TypeScript zod schema

#### Sprint 3.2: Content Generation Workflow (3 dias, 24h)

[ ] **TASK 3.5**: Criar Cron Job `/api/cron/content-schedule`
  - Arquivo: `src/app/api/cron/content-schedule/route.ts`
  - Schedule: Diário às 7 AM (vercel.json)
  - Process:
    1. Fetch todos os tenants com plan=pro OR plan=enterprise
    2. Para cada tenant: Chamar CMO agent → Identificar gaps de conteúdo
    3. Content agent → Gerar 1 post (Instagram OR LinkedIn OR Blog)
    4. Salvar em `content_posts` table
  - Validation: CRON_SECRET header

[ ] **TASK 3.6**: Criar tabela `content_posts`
  - Migration: `20YYMMDDHHMMSS_create_content_posts.sql`
  - Campos: id, tenant_id, type (instagram/linkedin/blog), title, body, image_url, scheduled_for, status, published_at
  - RLS: tenant owner can CRUD

[ ] **TASK 3.7**: Criar página `/dashboard/marketing/content`
  - Arquivo: `src/app/(dashboard)/dashboard/marketing/content/page.tsx`
  - Features:
    - Calendar view com posts agendados
    - Filtros: Instagram, LinkedIn, Blog
    - Actions: Preview, Edit, Publish, Delete
  - Data: Fetch `/api/marketing/content?month=2024-12`

[ ] **TASK 3.8**: Criar API `/api/marketing/content/generate`
  - Arquivo: `src/app/api/marketing/content/generate/route.ts`
  - Input: tenantId, type (instagram/linkedin/blog), topic (optional)
  - Process: Chamar Content Agent → Gerar post
  - Output: { postId, title, body, imagePrompt }
  - Trigger: Generate image via DALL-E 3 (optional)

#### Sprint 3.3: Google Ads Optimization Workflow (2 dias, 16h)

[ ] **TASK 3.9**: Criar Cron Job `/api/cron/ads-optimization`
  - Arquivo: `src/app/api/cron/ads-optimization/route.ts`
  - Schedule: Diário às 6 AM (vercel.json)
  - Process:
    1. Fetch tenants com plan=pro/enterprise
    2. Ads Agent → Analisar performance Google Ads (CTR, CPC, conversão)
    3. CMO Agent → Sugestões de otimização (keywords, bid, copy)
    4. Salvar em `ads_recommendations` table
  - Validation: CRON_SECRET header

[ ] **TASK 3.10**: Criar tabela `ads_recommendations`
  - Migration: `20YYMMDDHHMMSS_create_ads_recommendations.sql`
  - Campos: id, tenant_id, campaign_id, recommendation_type, current_value, suggested_value, expected_improvement, status (pending/applied/rejected)
  - RLS: tenant owner can CRUD

[ ] **TASK 3.11**: Criar página `/dashboard/marketing/ads`
  - Arquivo: `src/app/(dashboard)/dashboard/marketing/ads/page.tsx`
  - Features:
    - Lista de campanhas Google Ads
    - Métricas: CTR, CPC, conversão, ROI
    - Recomendações pendentes (badges)
    - Actions: Ver detalhes, Aplicar recomendação
  - Data: Fetch `/api/marketing/ads/campaigns`

[ ] **TASK 3.12**: Criar API `/api/marketing/ads/apply-recommendation`
  - Arquivo: `src/app/api/marketing/ads/apply-recommendation/route.ts`
  - Input: recommendationId
  - Process:
    1. Fetch recommendation details
    2. Apply via Google Ads API (keywords, bid, copy)
    3. Update status → applied
  - Output: { success: true, appliedAt }

#### Sprint 3.4: VSL Generator (2 dias, 16h)

[ ] **TASK 3.13**: Criar página `/dashboard/marketing/vsl-generator`
  - Arquivo: `src/app/(dashboard)/dashboard/marketing/vsl-generator/page.tsx`
  - Features:
    - Form: Produto (select), Problema (textarea), Solução (textarea)
    - Generate: Chamar API → Gera script VSL 4min30s
    - Preview: Exibir script formatado
    - Export: Download TXT OR PDF
  - UX: Step-by-step wizard

[ ] **TASK 3.14**: Criar API `/api/marketing/vsl/generate`
  - Arquivo: `src/app/api/marketing/vsl/generate/route.ts`
  - Input: tenantId, product, problem, solution, targetAudience
  - Process:
    1. CMO Agent → Estruturar VSL (5 seções: Problem, Agitation, Solution, Proof, CTA)
    2. Content Agent → Escrever copy persuasivo (4min30s)
  - Output: { vslId, script, duration }
  - Persist: `vsl_scripts` table

[ ] **TASK 3.15**: Criar tabela `vsl_scripts`
  - Migration: `20YYMMDDHHMMSS_create_vsl_scripts.sql`
  - Campos: id, tenant_id, product_id, script (TEXT), duration, created_at
  - RLS: tenant owner can CRUD

[ ] **TASK 3.16**: Integrar com Loom/Riverside (opcional)
  - Arquivo: `src/lib/video/loom-integration.ts`
  - Function: `recordVSL(script)` → Opens Loom recording interface
  - Alternative: Instruções para gravar com OBS/Zoom
  - Future: Auto-generate video com D-ID (avatar) OR Synthesia

---

## 🔵 FASE 4: TESTES E VALIDAÇÃO (5 dias)

**Estimativa**: 5 dias úteis (40h)
**Prioridade**: 🟡 P1 MÉDIO
**Descrição**: Testes E2E, unitários, smoke tests, UAT

### ✅ Checklist FASE 4

#### Sprint 4.1: Testes Unitários (2 dias, 16h)

[ ] **TASK 4.1**: Testes para Chat Widget
  - Arquivo: `src/components/chat/__tests__/ChatWidget.test.tsx`
  - Coverage: Render, send message, local storage persist, branding colors
  - Framework: Jest + React Testing Library
  - Target: 80% coverage

[ ] **TASK 4.2**: Testes para Qualification System
  - Arquivo: `src/lib/ai/qualification/__tests__/chat-qualification-manager.test.ts`
  - Coverage: Start qualification, submit answer, apply scoring, classify lead
  - Mocks: API calls
  - Target: 90% coverage

[ ] **TASK 4.3**: Testes para Tenant Middleware
  - Arquivo: `src/middleware/__tests__/tenantMiddleware.test.ts`
  - Coverage: Subdomain detection, custom domain lookup, 404 tenant not found
  - Edge Runtime compatible
  - Target: 100% coverage

[ ] **TASK 4.4**: Executar coverage report
  - Command: `npm run test:coverage`
  - Target: >75% total coverage
  - Generate: HTML report em `coverage/index.html`

#### Sprint 4.2: Testes E2E (2 dias, 16h)

[ ] **TASK 4.5**: Setup Playwright
  - Install: `npm install -D @playwright/test`
  - Config: `playwright.config.ts` (baseURL, browsers)
  - Scripts: `npm run test:e2e`

[ ] **TASK 4.6**: E2E: Onboarding Flow
  - Arquivo: `tests/e2e/onboarding.spec.ts`
  - Steps:
    1. Visit /parceiros
    2. Click "30 Dias Grátis"
    3. Fill form (nome, email, OAB, slug)
    4. Submit → Verify subdomain created
    5. Login → Verify dashboard loads
  - Assertions: 5+ steps

[ ] **TASK 4.7**: E2E: Chat Widget Conversation
  - Arquivo: `tests/e2e/chat-widget.spec.ts`
  - Steps:
    1. Load tenant landing page
    2. Open chat widget
    3. Send message "Preciso de ajuda com divórcio"
    4. Verify agent responds
    5. Complete qualification (10 perguntas)
    6. Verify score calculated
  - Assertions: 10+ steps

[ ] **TASK 4.8**: E2E: Billing Flow
  - Arquivo: `tests/e2e/billing.spec.ts`
  - Steps:
    1. Login as tenant owner
    2. Go to /dashboard/billing
    3. Click "Upgrade para Pro"
    4. Complete Stripe checkout (test mode)
    5. Verify subscription updated
  - Assertions: 5+ steps

#### Sprint 4.3: UAT - User Acceptance Testing (1 dia, 8h)

[ ] **TASK 4.9**: Smoke Tests Production
  - Checklist manual (30 min):
    - [ ] Homepage carrega
    - [ ] /parceiros carrega (VSL funciona)
    - [ ] Onboarding flow completa
    - [ ] Chat Widget responde
    - [ ] Dashboard carrega (admin, partner)
    - [ ] Billing checkout funciona (test mode)
    - [ ] Webhooks respondem (Stripe, MercadoPago)

[ ] **TASK 4.10**: Testar com 3 advogados reais (Beta)
  - Convidar: 3 advogados conhecidos
  - Setup: Onboarding completo (60s)
  - Usar: 7 dias de trial
  - Coletar: Feedback via formulário
  - Métricas: Tempo setup, conversas qualificadas, taxa conversão

[ ] **TASK 4.11**: Corrigir bugs críticos
  - Priority: P0 bugs impedem uso
  - Lista: Documentar bugs encontrados
  - Fix: Corrigir em hotfix branch
  - Deploy: Patch em produção

[ ] **TASK 4.12**: Validar métricas de sucesso
  - [ ] Onboarding: <60s (target: 45s avg)
  - [ ] Chat responde: <2s (target: 1s avg)
  - [ ] Qualification completa: <10min (target: 7min avg)
  - [ ] Score accuracy: >90% (comparar com manual)
  - [ ] Uptime: >99.5% (Vercel analytics)

---

## 🟣 FASE 5: DEPLOY E LANÇAMENTO (3 dias)

**Estimativa**: 3 dias úteis (24h)
**Prioridade**: 🟡 P1 MÉDIO
**Descrição**: Deploy final, DNS, marketing, lançamento oficial

### ✅ Checklist FASE 5

#### Sprint 5.1: Deploy Final (1 dia, 8h)

[ ] **TASK 5.1**: Configurar variáveis de ambiente PROD
  - Vercel Dashboard → Environment Variables → Production
  - Adicionar 40+ env vars:
    - Supabase (ANON_KEY, SERVICE_ROLE_KEY, URL)
    - OpenAI (API_KEY, ORG_ID)
    - Stripe (PROD keys: SECRET_KEY, WEBHOOK_SECRET)
    - MercadoPago (PROD keys: ACCESS_TOKEN)
    - Resend (API_KEY)
    - Google (CLIENT_ID, CLIENT_SECRET, CALENDAR_CREDENTIALS)
    - Vercel (TOKEN para domains API)
    - CRON_SECRET (generate random 32 chars)
  - Validation: Testar cada integração

[ ] **TASK 5.2**: Configurar domínio principal
  - Domain: `garcezpalha.com.br`
  - DNS: Apontar A record para Vercel (76.76.21.21)
  - SSL: Auto-provisionado via Vercel (Let's Encrypt)
  - Validation: HTTPS funciona

[ ] **TASK 5.3**: Configurar wildcard subdomain
  - DNS: Adicionar CNAME `*.garcezpalha.com.br` → `cname.vercel-dns.com`
  - Purpose: Subdomínios automáticos para tenants (adv-jose.garcezpalha.com.br)
  - Validation: Criar tenant teste → Verificar subdomain funciona

[ ] **TASK 5.4**: Ativar Cron Jobs no Vercel
  - Arquivo: `vercel.json` → Seção "crons"
  - Jobs:
    - `/api/cron/content-schedule` → Daily 7 AM
    - `/api/cron/ads-optimization` → Daily 6 AM
  - Headers: `Authorization: Bearer ${CRON_SECRET}`
  - Logs: Monitorar primeiras execuções (Vercel Logs)

#### Sprint 5.2: Marketing de Lançamento (1 dia, 8h)

[ ] **TASK 5.5**: Criar VSL de lançamento (4min30s)
  - Script: Usar `docs/MODELO_CORRETO_FINAL.md` seção VSL
  - Gravar: Leonardo (advogado) apresentando
  - Editar: Cortes, legendas, CTA no final
  - Publish: YouTube (unlisted) → Embed em /parceiros

[ ] **TASK 5.6**: Lançar campanha Google Ads
  - Campanha: "Secretária Jurídica IA - Garcez Palha"
  - Keywords: 20 keywords (advogado secretaria, automatizar escritório, etc.)
  - Budget: R$ 50/dia (teste inicial)
  - Landing Page: /parceiros
  - Tracking: Google Analytics 4 + conversion tracking

[ ] **TASK 5.7**: Criar posts de lançamento (LinkedIn)
  - Post 1: Problema (advogados perdem 73% dos leads)
  - Post 2: Solução (Secretária IA 24/7)
  - Post 3: Prova social (Beta testers results)
  - Post 4: CTA (30 dias grátis)
  - Schedule: 4 posts em 2 semanas (2x/week)

[ ] **TASK 5.8**: Configurar analytics completo
  - Google Analytics 4: Eventos customizados (signup, trial_start, conversion)
  - Hotjar: Heatmaps + recordings (homepage, /parceiros, /onboarding)
  - Vercel Analytics: Web vitals, performance
  - Dashboards: Criar dashboard Vercel Speed Insights

#### Sprint 5.3: Documentação Final (1 dia, 8h)

[ ] **TASK 5.9**: Atualizar README.md
  - Seções: Sobre, Features, Planos, Setup, Deploy, API Docs
  - Add: Screenshots de dashboard, chat widget
  - Add: Badge "Production Ready" + link demo

[ ] **TASK 5.10**: Criar docs/API.md
  - Documentar: 15+ endpoints principais
  - Format: OpenAPI 3.0 (Swagger)
  - Examples: cURL, TypeScript, Python
  - Auth: JWT token, API key

[ ] **TASK 5.11**: Criar docs/ONBOARDING_GUIDE.md
  - Para parceiros: Como fazer onboarding em 60s
  - Screenshots: Step-by-step
  - FAQ: 20 perguntas comuns
  - Troubleshooting: Problemas comuns

[ ] **TASK 5.12**: Criar CHANGELOG.md
  - Versão 1.0.0 (Data de lançamento)
  - Features: 50+ features implementadas
  - Breaking changes: N/A (first release)
  - Migration guide: N/A

---

## 📊 MÉTRICAS DE SUCESSO

### Técnicas:
- [ ] Onboarding: <60s (target: 45s avg)
- [ ] Chat response time: <2s (target: 1s avg)
- [ ] Qualification completion: <10min (target: 7min avg)
- [ ] Uptime: >99.9% (Vercel SLA)
- [ ] Lighthouse Score: >90 (Performance, Accessibility, SEO)
- [ ] Test coverage: >75%

### Negócio (30 dias pós-lançamento):
- [ ] 10+ parceiros onboarding (trial)
- [ ] 100+ conversas qualificadas
- [ ] 50+ leads HOT (score >= 80)
- [ ] 5+ conversões (trial → pago)
- [ ] R$ 2.5k+ MRR
- [ ] NPS > 8.0

### Automação:
- [ ] 80%+ conversas resolvidas por IA (sem handoff)
- [ ] 90%+ accuracy de qualificação (vs manual)
- [ ] 100% proposals geradas automaticamente
- [ ] 0 downtime em workflows (cron jobs)

---

## 🎯 CRONOGRAMA GERAL

| Fase | Dias | Início | Fim | Status |
|------|------|--------|-----|--------|
| **FASE 0** | 2 dias | 02/01 | 03/01 | ⏳ Pendente |
| **FASE 1** | 15 dias | 06/01 | 24/01 | ⏳ Pendente |
| **FASE 2** | 13 dias | 27/01 | 14/02 | ⏳ Pendente |
| **FASE 3** | 10 dias | 17/02 | 03/03 | ⏳ Pendente |
| **FASE 4** | 5 dias | 04/03 | 10/03 | ⏳ Pendente |
| **FASE 5** | 3 dias | 11/03 | 13/03 | ⏳ Pendente |
| **TOTAL** | **48 dias** | **02/01** | **13/03** | ⏳ Pendente |

**Lançamento Oficial**: 14/03/2025 🚀

---

## 🚨 DEPENDÊNCIAS E BLOQUEADORES

### Dependências Externas:
- [ ] Stripe Account (Production mode)
- [ ] MercadoPago Account (Production credentials)
- [ ] Google Cloud Project (Calendar API, OAuth2)
- [ ] Vercel Pro Account (Cron jobs, custom domains)
- [ ] Supabase Pro Account (RLS, storage)
- [ ] Resend Account (Email API)
- [ ] DNS Access (garcezpalha.com.br)

### Decisões Pendentes:
- [ ] Escolher provider de vídeo para VSL (YouTube, Vimeo, Wistia?)
- [ ] Decidir se gera imagens automaticamente (DALL-E 3) ou usa banco de imagens
- [ ] Validar preços finais (R$ 497, R$ 997, R$ 1.997)
- [ ] Definir limites de uso por plano (conversas/mês, usuários)

---

## 📝 NOTAS IMPORTANTES

1. **Multi-tenancy é crítico**: Todas as queries devem filtrar por `tenant_id`
2. **RLS deve estar ativo**: Testar isolation entre tenants antes de produção
3. **Stripe Test Mode**: Sempre testar com cards de teste antes de produção
4. **Cron Jobs**: Validar `CRON_SECRET` header para segurança
5. **Rate Limiting**: Implementar para APIs públicas (chat widget)
6. **Backup**: Configurar backups automáticos Supabase (Point-in-time recovery)
7. **Monitoring**: Setup Sentry para error tracking
8. **Logs**: Estruturar logs com contexto (tenant_id, user_id, request_id)

---

## 🔄 PROTOCOLO MANUS v7.0

### Atualização de Tasks:
- Atualizar este arquivo após cada sessão de trabalho
- Marcar tasks concluídas com ✅
- Adicionar descobertas/bloqueadores em notas
- Estimar tempo real vs estimado

### Priorização:
- **P0** (Bloqueador): Resolver AGORA
- **P1** (Alta): 1-2 semanas
- **P2** (Média): 1-2 meses
- **P3** (Baixa): Backlog futuro

### Comunicação:
- Daily standup: O que foi feito, o que falta, bloqueadores
- Weekly review: Progresso vs cronograma, ajustes
- Monthly: Métricas de negócio, decisões estratégicas

---

*Última atualização: 30/12/2024*
*Responsável: MANUS v7.0 Agent*
*Total Tasks: 89*
*Estimativa Total: 48 dias úteis*
*Lançamento: 14/03/2025 🚀*
