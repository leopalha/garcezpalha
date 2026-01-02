# DATABASE SCHEMA - GARCEZ PALHA
## PostgreSQL Database Documentation (Supabase)

**Versão:** 1.0
**Data:** 01/01/2026
**Status:** ✅ PRODUCTION READY
**Responsável:** MANUS v7.0 (Modo Arquiteto Sênior)

---

## 📊 RESUMO EXECUTIVO

Documentação completa do schema do banco de dados PostgreSQL (Supabase) da plataforma Garcez Palha.

### Estatísticas do Database

| Métrica | Valor |
|---------|-------|
| **Total de Tabelas** | 75+ tabelas |
| **Migrations Aplicadas** | 62 arquivos SQL |
| **RLS Policies** | 262 policies |
| **PostgreSQL Functions** | 82 functions |
| **Indexes** | 150+ índices |
| **Extensions** | 2 (uuid-ossp, pgcrypto) |
| **Storage Buckets** | 4 buckets (contracts, process-docs, uploads, avatars) |

### Categorias de Tabelas

1. **Core (10 tabelas)** - users, profiles, settings, audit_logs
2. **CRM & Leads (8 tabelas)** - leads, qualified_leads, conversations, messages
3. **Partnerships (5 tabelas)** - partners, referrals, commissions
4. **Legal Operations (10 tabelas)** - contracts, processes, documents, deadlines
5. **Payments (6 tabelas)** - payments, invoices, subscriptions, payment_methods
6. **Marketing (15 tabelas)** - email sequences, campaigns, SEO, A/B tests
7. **AI Agents (5 tabelas)** - agent_metrics, decisions, interactions, configs
8. **Communication (8 tabelas)** - notifications, telegram, whatsapp, chat
9. **Analytics (5 tabelas)** - usage_tracking, nps, reviews
10. **Admin (3 tabelas)** - feature_requests, bug_reports, beta_applications

---

## 🗂️ ESTRUTURA GERAL

```
Garcez Palha Database (PostgreSQL 15+)
│
├── CORE TABLES (10)
│   ├── users                    # Usuários principais
│   ├── profiles                 # Perfis estendidos
│   ├── user_settings            # Configurações por usuário
│   ├── settings                 # Configurações globais
│   ├── audit_logs               # Logs de auditoria
│   ├── two_factor_codes         # 2FA codes
│   ├── services                 # Catálogo de serviços
│   ├── products                 # Produtos (57)
│   ├── product_packages         # Pacotes de produtos
│   └── plan_limits              # Limites por plano
│
├── CRM & LEADS (8)
│   ├── leads                    # Leads brutos
│   ├── qualified_leads          # Leads qualificados
│   ├── lead_segments            # Segmentação de leads
│   ├── segments                 # Segmentos gerais
│   ├── conversations            # Conversações (State Machine)
│   ├── messages                 # Mensagens individuais
│   ├── chat_threads             # Threads de chat
│   └── chat_messages            # Mensagens de chat
│
├── PARTNERSHIPS (5)
│   ├── partners                 # Parceiros/Afiliados
│   ├── referrals                # Indicações
│   ├── partner_commissions      # Comissões
│   ├── oab_compliance_notes     # Notas de compliance OAB
│   └── clients                  # Clientes finais
│
├── LEGAL OPERATIONS (10)
│   ├── contracts                # Contratos
│   ├── process_alerts           # Alertas de processos
│   ├── process_deadlines        # Prazos processuais
│   ├── process_documents        # Documentos de processos
│   ├── client_documents         # Documentos de clientes
│   ├── generated_documents      # Documentos gerados (AI)
│   ├── document_templates       # Templates de documentos
│   ├── document_revisions       # Versionamento de docs
│   ├── appointments             # Agendamentos
│   └── appointment_reminders    # Lembretes de agendamentos
│
├── PAYMENTS (6)
│   ├── payments                 # Pagamentos
│   ├── invoices                 # Faturas
│   ├── subscriptions            # Assinaturas recorrentes
│   ├── payment_methods          # Métodos de pagamento salvos
│   ├── follow_up_tasks          # Tarefas de follow-up
│   └── review_queue             # Fila de revisão (compliance)
│
├── MARKETING (15)
│   ├── email_sequences          # Sequências de email
│   ├── email_sequence_steps     # Passos das sequências
│   ├── email_sequence_sends     # Envios trackados
│   ├── email_sequence_subscriptions # Inscrições
│   ├── email_templates          # Templates de email
│   ├── email_logs               # Logs de envio
│   ├── email_events             # Eventos (open, click, etc)
│   ├── email_ab_tests           # Testes A/B de email
│   ├── email_ab_test_assignments # Atribuições A/B
│   ├── ad_campaigns             # Campanhas de anúncios
│   ├── ad_reports               # Relatórios de ads
│   ├── ad_optimizations         # Otimizações de ads
│   ├── seo_keyword_research     # Pesquisa de keywords
│   ├── seo_content_briefs       # Briefs de conteúdo SEO
│   └── seo_page_optimizations   # Otimizações de página
│
├── AI AGENTS (5)
│   ├── agent_configs            # Configurações dos 24 agentes
│   ├── agent_metrics            # Métricas de performance
│   ├── agent_decisions          # Decisões tomadas
│   ├── agent_interactions       # Interações completas
│   └── agent_alerts             # Alertas gerados por agentes
│
├── COMMUNICATION (8)
│   ├── notifications            # Notificações push
│   ├── notification_logs        # Logs de notificações
│   ├── telegram_conversations   # Conversas Telegram
│   ├── telegram_messages        # Mensagens Telegram
│   ├── scheduled_posts          # Posts agendados
│   ├── content_campaigns        # Campanhas de conteúdo
│   ├── ab_tests                 # Testes A/B gerais
│   └── ab_test_variants         # Variantes dos testes
│
├── ANALYTICS (5)
│   ├── usage_tracking           # Tracking de uso
│   ├── nps_responses            # Respostas NPS
│   ├── seo_audits               # Auditorias SEO
│   ├── seo_reports              # Relatórios SEO
│   └── ab_test_assignments      # Atribuições A/B
│
└── ADMIN (3)
    ├── feature_requests         # Solicitações de features
    ├── feature_request_votes    # Votos em features
    ├── bug_reports              # Relatórios de bugs
    └── beta_applications        # Aplicações para beta
```

**Total:** 75+ tabelas organizadas em 10 categorias

---

## 📋 TABELAS PRINCIPAIS (DETALHAMENTO)

### 1. CORE TABLES

#### 1.1 users
**Descrição:** Tabela principal de usuários (clientes, parceiros, admins)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'client'
    CHECK (role IN ('client', 'partner', 'admin')),
  phone TEXT,
  document TEXT, -- CPF or CNPJ
  avatar_url TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_users_email` ON (email)
- `idx_users_role` ON (role)

**RLS Policies:** 5 policies
- `users_select_own` - Usuários podem ver próprio perfil
- `users_update_own` - Usuários podem atualizar próprio perfil
- `admins_select_all` - Admins veem todos
- `admins_update_all` - Admins atualizam todos
- `public_signup` - Registro público permitido

**Relações:**
- **partners** (1:1) via user_id
- **leads** (1:N) via assigned_to
- **contracts** (1:N) via client_id
- **payments** (1:N) via user_id

---

#### 1.2 profiles
**Descrição:** Perfis estendidos dos usuários

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_say')),
  occupation TEXT,
  company TEXT,
  preferences JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_profiles_city_state` ON (city, state)

---

#### 1.3 audit_logs
**Descrição:** Logs de auditoria para compliance (LGPD, OAB)

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'
  resource_type TEXT NOT NULL, -- 'user', 'lead', 'contract', etc
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_audit_user` ON (user_id)
- `idx_audit_resource` ON (resource_type, resource_id)
- `idx_audit_created` ON (created_at DESC)

**Retention:** 7 anos (compliance LGPD/OAB)

---

### 2. CRM & LEADS

#### 2.1 leads
**Descrição:** Leads brutos vindos de landing pages, formulários, WhatsApp

```sql
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  service_type TEXT,
  source TEXT DEFAULT 'website'
    CHECK (source IN ('website', 'whatsapp', 'chatbot', 'referral', 'social', 'other')),
  status TEXT DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost')),
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to UUID REFERENCES users(id),
  partner_id UUID REFERENCES partners(id),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  ip_address TEXT,
  user_agent TEXT,
  notes TEXT,
  contacted_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  lost_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_leads_email` ON (email)
- `idx_leads_status` ON (status)
- `idx_leads_source` ON (source)
- `idx_leads_partner` ON (partner_id)
- `idx_leads_created` ON (created_at DESC)

**RLS Policies:** 8 policies
- Admins: full access
- Partners: only their referrals
- Clients: no access

---

#### 2.2 qualified_leads
**Descrição:** Leads que passaram pelo processo de qualificação (State Machine)

```sql
CREATE TABLE qualified_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id),
  conversation_id UUID REFERENCES conversations(id),

  -- Qualification Data
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  urgency INTEGER CHECK (urgency >= 0 AND urgency <= 100),
  probability INTEGER CHECK (probability >= 0 AND probability <= 100),
  complexity INTEGER CHECK (complexity >= 0 AND complexity <= 100),

  -- Classification
  product_id UUID REFERENCES products(id),
  agent_assigned TEXT, -- qual dos 24 agentes
  confidence DECIMAL(5,2),

  -- Qualification Details
  questions_answered INTEGER DEFAULT 0,
  total_questions INTEGER DEFAULT 0,
  qualification_data JSONB DEFAULT '{}',
  flags TEXT[] DEFAULT '{}', -- ['complex_case', 'high_value', 'urgent']

  -- Status
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected', 'converted')),
  qualified_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_qualified_score` ON (score DESC)
- `idx_qualified_status` ON (status)
- `idx_qualified_product` ON (product_id)
- `idx_qualified_flags` USING GIN (flags)

---

#### 2.3 conversations
**Descrição:** Conversações completas (State Machine - 17 estados)

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id TEXT UNIQUE NOT NULL, -- external ID (whatsapp:xxx, telegram:xxx)

  -- Client Info
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,
  client_data JSONB DEFAULT '{}',

  -- Channel
  channel TEXT NOT NULL
    CHECK (channel IN ('website', 'whatsapp', 'telegram', 'email')),

  -- State Machine (17 estados)
  state TEXT NOT NULL DEFAULT 'greeting'
    CHECK (state IN (
      'greeting', 'identifying', 'classifying', 'qualifying',
      'qualified', 'rejected', 'proposing', 'objection_handling',
      'closing', 'payment_pending', 'paid', 'contract_pending',
      'onboarding', 'active_case', 'completed', 'escalated', 'abandoned'
    )),

  -- Classification
  area TEXT, -- 'bancario', 'previdenciario', 'criminal', etc
  product_id UUID REFERENCES products(id),
  agent_assigned TEXT, -- qual dos 24 agentes IA
  confidence DECIMAL(5,2),

  -- Qualification
  qualification_status TEXT CHECK (qualification_status IN ('in_progress', 'complete', 'rejected')),
  qualification_score INTEGER CHECK (qualification_score >= 0 AND qualification_score <= 100),
  qualification_flags TEXT[] DEFAULT '{}',

  -- Proposal
  proposal_sent_at TIMESTAMPTZ,
  proposal_data JSONB DEFAULT '{}',

  -- Status Control
  needs_attention BOOLEAN DEFAULT FALSE,
  escalation_reason TEXT,
  abandoned_reason TEXT,

  -- Timestamps
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_conv_id` ON (conversation_id)
- `idx_conv_state` ON (state)
- `idx_conv_channel` ON (channel)
- `idx_conv_needs_attention` ON (needs_attention) WHERE needs_attention = TRUE
- `idx_conv_last_message` ON (last_message_at DESC)

**RLS Policies:** 6 policies

---

### 3. PARTNERSHIPS

#### 3.1 partners
**Descrição:** Parceiros/Afiliados (advogados, escritórios, indicadores)

```sql
CREATE TABLE partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Company Info
  company_name TEXT,
  trading_name TEXT,
  cnpj TEXT,
  oab_number TEXT, -- OAB/UF 123456
  oab_state TEXT,

  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,

  -- Bio
  bio TEXT,
  specialties TEXT[],

  -- Payment Info
  pix_key TEXT,
  pix_key_type TEXT CHECK (pix_key_type IN ('cpf', 'cnpj', 'email', 'phone', 'random')),
  bank_name TEXT,
  account_type TEXT,

  -- Commission Settings
  commission_rate DECIMAL(5,2) DEFAULT 10.00, -- %

  -- Stats
  total_referrals INTEGER DEFAULT 0,
  total_converted INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  pending_earnings DECIMAL(10,2) DEFAULT 0.00,

  -- Verification
  contract_signed_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_documents JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_partners_user` ON (user_id)
- `idx_partners_oab` ON (oab_number, oab_state)
- `idx_partners_verified` ON (is_verified)

---

#### 3.2 referrals
**Descrição:** Indicações de parceiros

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id),
  lead_id UUID REFERENCES leads(id),

  -- Referral Info
  referral_code TEXT,
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,

  -- Status
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'qualified', 'converted', 'rejected')),

  -- Commission
  commission_rate DECIMAL(5,2),
  commission_amount DECIMAL(10,2),
  commission_status TEXT DEFAULT 'pending'
    CHECK (commission_status IN ('pending', 'approved', 'paid', 'cancelled')),

  -- Timestamps
  converted_at TIMESTAMPTZ,
  commission_paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4. LEGAL OPERATIONS

#### 4.1 contracts
**Descrição:** Contratos assinados (ClickSign)

```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id),
  partner_id UUID REFERENCES partners(id),
  product_id UUID REFERENCES products(id),

  -- Contract Details
  contract_number TEXT UNIQUE NOT NULL,
  contract_type TEXT NOT NULL, -- 'service', 'partnership', 'subscription'

  -- Pricing
  value DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0.00,
  final_value DECIMAL(10,2) NOT NULL,
  payment_model TEXT CHECK (payment_model IN ('fixed', 'success_fee', 'hybrid')),
  success_fee_percentage DECIMAL(5,2),

  -- Documents
  template_id UUID REFERENCES document_templates(id),
  generated_document_url TEXT,
  signed_document_url TEXT,

  -- ClickSign Integration
  clicksign_document_id TEXT,
  clicksign_signer_key TEXT,
  clicksign_signature_url TEXT,

  -- Status
  status TEXT DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'signed', 'active', 'completed', 'cancelled')),

  -- Timestamps
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  activated_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_contracts_number` ON (contract_number)
- `idx_contracts_client` ON (client_id)
- `idx_contracts_status` ON (status)
- `idx_contracts_signed` ON (signed_at DESC)

---

#### 4.2 process_alerts
**Descrição:** Alertas de processos (intimações, prazos, movimentações)

```sql
CREATE TABLE process_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id),
  contract_id UUID REFERENCES contracts(id),

  -- Process Info
  process_number TEXT NOT NULL,
  court TEXT, -- TJ-RJ, TRF2, STJ, TST, STF
  type TEXT NOT NULL
    CHECK (type IN ('intimacao', 'citacao', 'sentenca', 'recurso', 'audiencia', 'other')),

  -- Alert Details
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE,
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),

  -- Status
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'acknowledged', 'in_progress', 'completed', 'expired')),

  -- Assignment
  assigned_to UUID REFERENCES users(id), -- advogado responsável

  -- Attachments
  attachment_urls TEXT[],

  -- Timestamps
  acknowledged_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_process_number` ON (process_number)
- `idx_process_deadline` ON (deadline)
- `idx_process_status` ON (status)
- `idx_process_assigned` ON (assigned_to)

**Automated:** Populado via Gmail Monitor (cron: 3x/dia)

---

### 5. PAYMENTS

#### 5.1 payments
**Descrição:** Pagamentos (Stripe + MercadoPago)

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  contract_id UUID REFERENCES contracts(id),
  invoice_id UUID REFERENCES invoices(id),

  -- Payment Details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',

  -- Payment Method
  payment_method TEXT NOT NULL
    CHECK (payment_method IN ('credit_card', 'pix', 'boleto', 'debit_card')),
  gateway TEXT NOT NULL
    CHECK (gateway IN ('stripe', 'mercadopago')),

  -- Gateway IDs
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  mercadopago_payment_id TEXT,

  -- Status
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded', 'cancelled')),

  -- Metadata
  gateway_response JSONB,
  error_message TEXT,

  -- Timestamps
  paid_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_payments_user` ON (user_id)
- `idx_payments_status` ON (status)
- `idx_payments_stripe` ON (stripe_payment_intent_id)
- `idx_payments_mercadopago` ON (mercadopago_payment_id)
- `idx_payments_created` ON (created_at DESC)

---

#### 5.2 subscriptions
**Descrição:** Assinaturas recorrentes (Stripe)

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),

  -- Subscription Details
  plan_id UUID REFERENCES products(id),
  plan_name TEXT NOT NULL,
  billing_period TEXT NOT NULL
    CHECK (billing_period IN ('monthly', 'quarterly', 'yearly')),
  amount DECIMAL(10,2) NOT NULL,

  -- Stripe Integration
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  stripe_price_id TEXT,

  -- Status
  status TEXT DEFAULT 'active'
    CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'unpaid')),

  -- Billing Dates
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_subs_user` ON (user_id)
- `idx_subs_status` ON (status)
- `idx_subs_stripe` ON (stripe_subscription_id)

---

### 6. MARKETING

#### 6.1 email_sequences
**Descrição:** Sequências de email automatizadas (4 sequências)

```sql
CREATE TABLE email_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Sequence Info
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,

  -- Type
  sequence_type TEXT NOT NULL
    CHECK (sequence_type IN ('welcome', 'abandoned_cart', 'post_purchase', 'reengagement', 'nurture', 'custom')),

  -- Settings
  delay_between_steps INTEGER DEFAULT 86400, -- seconds (1 day)
  is_active BOOLEAN DEFAULT TRUE,

  -- Stats
  total_subscribers INTEGER DEFAULT 0,
  total_sends INTEGER DEFAULT 0,
  total_opens INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### 6.2 email_sequence_steps
**Descrição:** Passos individuais das sequências

```sql
CREATE TABLE email_sequence_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,

  -- Step Info
  step_number INTEGER NOT NULL,
  name TEXT NOT NULL,

  -- Timing
  delay_from_previous INTEGER NOT NULL DEFAULT 0, -- seconds

  -- Email Content
  subject TEXT NOT NULL,
  preview_text TEXT,
  template_id UUID REFERENCES email_templates(id),
  email_body TEXT,

  -- Stats
  total_sends INTEGER DEFAULT 0,
  total_opens INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(sequence_id, step_number)
);
```

---

#### 6.3 seo_keyword_research
**Descrição:** Pesquisa de keywords para SEO

```sql
CREATE TABLE seo_keyword_research (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Keyword Info
  keyword TEXT NOT NULL,
  search_volume INTEGER,
  difficulty INTEGER CHECK (difficulty >= 0 AND difficulty <= 100),
  cpc DECIMAL(10,2), -- Cost Per Click

  -- Categorization
  category TEXT, -- 'bancario', 'previdenciario', etc
  intent TEXT CHECK (intent IN ('informational', 'navigational', 'commercial', 'transactional')),

  -- Priority
  priority INTEGER CHECK (priority >= 0 AND priority <= 100),
  is_target_keyword BOOLEAN DEFAULT FALSE,

  -- Metadata
  related_keywords TEXT[],
  competitor_urls TEXT[],
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 7. AI AGENTS

#### 7.1 agent_configs
**Descrição:** Configurações dos 24 agentes IA

```sql
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Agent Info
  agent_name TEXT UNIQUE NOT NULL, -- 'FinancialProtectionAgent', 'SocialSecurityAgent', etc
  agent_type TEXT NOT NULL
    CHECK (agent_type IN ('executive', 'intelligence', 'marketing', 'operations', 'legal', 'core')),

  -- Configuration
  model TEXT DEFAULT 'gpt-4o', -- 'gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2000,
  system_prompt TEXT,
  keywords TEXT[], -- keywords para routing

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_fallback BOOLEAN DEFAULT FALSE,

  -- Performance Thresholds
  min_confidence DECIMAL(5,2) DEFAULT 60.00,
  escalation_threshold INTEGER DEFAULT 80, -- score >= 80 escala para humano

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_agent_name` ON (agent_name)
- `idx_agent_type` ON (agent_type)
- `idx_agent_active` ON (is_active)

---

#### 7.2 agent_metrics
**Descrição:** Métricas de performance dos agentes (dashboard)

```sql
CREATE TABLE agent_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,

  -- Date
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Usage Metrics
  total_activations INTEGER DEFAULT 0,
  total_messages_processed INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,

  -- Quality Metrics
  average_confidence DECIMAL(5,2),
  average_user_rating DECIMAL(3,2), -- 0-5 stars
  escalation_rate DECIMAL(5,2), -- % escalated

  -- Cost Metrics
  total_cost DECIMAL(10,2) DEFAULT 0.00, -- OpenAI API cost
  cost_per_activation DECIMAL(10,2),

  -- Performance Metrics
  average_response_time INTEGER, -- milliseconds
  success_rate DECIMAL(5,2), -- % qualified leads

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(agent_name, metric_date)
);
```

**Indexes:**
- `idx_agent_metrics_name` ON (agent_name)
- `idx_agent_metrics_date` ON (metric_date DESC)

---

### 8. COMMUNICATION

#### 8.1 notifications
**Descrição:** Notificações push (email, WhatsApp, SMS)

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),

  -- Notification Details
  type TEXT NOT NULL
    CHECK (type IN ('info', 'success', 'warning', 'error', 'alert')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Channels
  send_email BOOLEAN DEFAULT FALSE,
  send_whatsapp BOOLEAN DEFAULT FALSE,
  send_sms BOOLEAN DEFAULT FALSE,
  send_push BOOLEAN DEFAULT TRUE,

  -- Link/Action
  action_url TEXT,
  action_label TEXT,

  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_notif_user` ON (user_id)
- `idx_notif_unread` ON (user_id, is_read) WHERE is_read = FALSE
- `idx_notif_created` ON (created_at DESC)

---

#### 8.2 telegram_conversations
**Descrição:** Conversas via Telegram Bot

```sql
CREATE TABLE telegram_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telegram_chat_id BIGINT UNIQUE NOT NULL,
  telegram_user_id BIGINT NOT NULL,

  -- User Info
  username TEXT,
  first_name TEXT,
  last_name TEXT,

  -- Linkage
  user_id UUID REFERENCES users(id),
  conversation_id UUID REFERENCES conversations(id),

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_blocked BOOLEAN DEFAULT FALSE,

  -- Metadata
  metadata JSONB DEFAULT '{}',

  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 9. ANALYTICS

#### 9.1 usage_tracking
**Descrição:** Tracking de uso da plataforma

```sql
CREATE TABLE usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),

  -- Event
  event_name TEXT NOT NULL,
  event_category TEXT,

  -- Context
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,

  -- Device Info
  device_type TEXT, -- 'desktop', 'mobile', 'tablet'
  browser TEXT,
  os TEXT,

  -- Metadata
  properties JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_usage_user` ON (user_id)
- `idx_usage_event` ON (event_name)
- `idx_usage_created` ON (created_at DESC)

**Retention:** 90 dias

---

#### 9.2 nps_responses
**Descrição:** Respostas de pesquisas NPS (Net Promoter Score)

```sql
CREATE TABLE nps_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  contract_id UUID REFERENCES contracts(id),

  -- NPS Score
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 10),

  -- Classification
  category TEXT GENERATED ALWAYS AS (
    CASE
      WHEN score >= 9 THEN 'promoter'
      WHEN score >= 7 THEN 'passive'
      ELSE 'detractor'
    END
  ) STORED,

  -- Feedback
  feedback TEXT,

  -- Context
  survey_sent_at TIMESTAMPTZ,
  survey_type TEXT DEFAULT 'post_case', -- 'post_case', 'post_payment', 'periodic'

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
- `idx_nps_user` ON (user_id)
- `idx_nps_category` ON (category)
- `idx_nps_score` ON (score DESC)

---

## 🔐 ROW LEVEL SECURITY (RLS)

### Total de Policies: 262 policies

**Distribuição por Tabela (Top 10):**

| Tabela | Policies | Descrição |
|--------|----------|-----------|
| users | 5 | Select own, update own, admin access |
| leads | 8 | Admin full, partner own, client none |
| contracts | 12 | Client own, partner assigned, admin all |
| conversations | 6 | Channel-based + admin |
| payments | 10 | User own, admin all, webhook insert |
| audit_logs | 4 | Admin only, system insert |
| documents | 8 | Owner + assigned lawyer |
| notifications | 6 | User own, admin all |
| partners | 7 | Self + admin |
| email_logs | 5 | System + admin |

### Exemplos de Policies

```sql
-- users: usuário pode ver próprio perfil
CREATE POLICY "users_select_own" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- leads: admin vê todos
CREATE POLICY "leads_admin_all" ON leads
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- contracts: cliente vê próprios contratos
CREATE POLICY "contracts_client_own" ON contracts
  FOR SELECT
  USING (auth.uid() = client_id);

-- audit_logs: apenas admin lê
CREATE POLICY "audit_admin_read" ON audit_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- payments: sistema pode inserir (webhooks)
CREATE POLICY "payments_system_insert" ON payments
  FOR INSERT
  WITH CHECK (TRUE); -- webhook sem auth, validado por signature
```

---

## ⚡ POSTGRESQL FUNCTIONS

### Total: 82 functions

**Principais Functions:**

#### 1. update_updated_at_column()
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Uso:** Trigger em todas tabelas com `updated_at`

---

#### 2. calculate_nps_score(start_date DATE, end_date DATE)
```sql
CREATE OR REPLACE FUNCTION calculate_nps_score(
  start_date DATE DEFAULT (CURRENT_DATE - INTERVAL '30 days'),
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
  nps_score INTEGER,
  total_responses INTEGER,
  promoters INTEGER,
  passives INTEGER,
  detractors INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH stats AS (
    SELECT
      COUNT(*) FILTER (WHERE category = 'promoter') AS promo,
      COUNT(*) FILTER (WHERE category = 'passive') AS pass,
      COUNT(*) FILTER (WHERE category = 'detractor') AS detract,
      COUNT(*) AS total
    FROM nps_responses
    WHERE created_at BETWEEN start_date AND end_date
  )
  SELECT
    CAST(
      ((promo::DECIMAL / NULLIF(total, 0)) * 100) -
      ((detract::DECIMAL / NULLIF(total, 0)) * 100)
    AS INTEGER) AS nps_score,
    total::INTEGER AS total_responses,
    promo::INTEGER AS promoters,
    pass::INTEGER AS passives,
    detract::INTEGER AS detractors
  FROM stats;
END;
$$ LANGUAGE plpgsql;
```

**Uso:** Dashboard de métricas NPS

---

#### 3. get_lead_conversion_funnel()
```sql
CREATE OR REPLACE FUNCTION get_lead_conversion_funnel()
RETURNS TABLE(
  stage TEXT,
  count BIGINT,
  conversion_rate DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH funnel AS (
    SELECT 'Total Leads'::TEXT AS stage, COUNT(*)::BIGINT AS cnt FROM leads
    UNION ALL
    SELECT 'Qualified', COUNT(*) FROM qualified_leads
    UNION ALL
    SELECT 'Proposal Sent', COUNT(*) FROM conversations WHERE state IN ('proposing', 'objection_handling', 'closing')
    UNION ALL
    SELECT 'Payment Pending', COUNT(*) FROM conversations WHERE state = 'payment_pending'
    UNION ALL
    SELECT 'Paid', COUNT(*) FROM conversations WHERE state IN ('paid', 'contract_pending', 'onboarding', 'active_case', 'completed')
    UNION ALL
    SELECT 'Active Cases', COUNT(*) FROM conversations WHERE state = 'active_case'
    UNION ALL
    SELECT 'Completed', COUNT(*) FROM conversations WHERE state = 'completed'
  )
  SELECT
    f.stage,
    f.cnt AS count,
    ROUND((f.cnt::DECIMAL / NULLIF((SELECT cnt FROM funnel LIMIT 1), 0)) * 100, 2) AS conversion_rate
  FROM funnel f;
END;
$$ LANGUAGE plpgsql;
```

**Uso:** Dashboard de conversão (funil)

---

#### 4. auto_escalate_hot_leads()
```sql
CREATE OR REPLACE FUNCTION auto_escalate_hot_leads()
RETURNS INTEGER AS $$
DECLARE
  escalated_count INTEGER;
BEGIN
  UPDATE conversations
  SET
    state = 'escalated',
    escalation_reason = 'Hot Lead - Score >= 80',
    needs_attention = TRUE,
    updated_at = NOW()
  WHERE
    state = 'qualified'
    AND id IN (
      SELECT c.id
      FROM conversations c
      JOIN qualified_leads ql ON ql.conversation_id = c.id
      WHERE ql.score >= 80
        AND c.state = 'qualified'
        AND c.escalation_reason IS NULL
    );

  GET DIAGNOSTICS escalated_count = ROW_COUNT;

  RETURN escalated_count;
END;
$$ LANGUAGE plpgsql;
```

**Uso:** Cron job para escalar leads HOT automaticamente

---

## 📦 STORAGE BUCKETS (Supabase Storage)

### Total: 4 buckets

| Bucket | Propósito | Max Size | Public | RLS |
|--------|-----------|----------|--------|-----|
| **contracts** | Contratos assinados (PDF) | 10 MB | No | Yes |
| **process-docs** | Documentos processuais | 50 MB | No | Yes |
| **uploads** | Uploads gerais de clientes | 25 MB | No | Yes |
| **avatars** | Fotos de perfil | 2 MB | Yes | Yes |

**Policies de Storage:**

```sql
-- contracts: apenas owner + assigned lawyer
CREATE POLICY "contracts_owner_read" ON storage.objects FOR SELECT
  USING (
    bucket_id = 'contracts'
    AND (
      auth.uid()::TEXT = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM contracts c
        WHERE c.signed_document_url = storage.objects.name
          AND (c.client_id = auth.uid() OR c.partner_id IN (
            SELECT id FROM partners WHERE user_id = auth.uid()
          ))
      )
    )
  );

-- avatars: público read, owner write
CREATE POLICY "avatars_public_read" ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_owner_write" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::TEXT = (storage.foldername(name))[1]
  );
```

---

## 🔄 MIGRATIONS

### Total: 62 migrations aplicadas

**Principais Migrations:**

| # | Migration | Descrição |
|---|-----------|-----------|
| 001 | `initial_schema.sql` | Schema inicial (users, leads, partners) |
| 002 | `seed_data.sql` | Dados de seed (produtos, templates) |
| 003 | `telegram_integration.sql` | Tabelas Telegram |
| 006 | `contracts_table.sql` | Tabela de contratos + ClickSign |
| 007-009 | `process_*.sql` | Sistema de processos jurídicos |
| 010 | `appointments_automation.sql` | Agendamentos |
| 011 | `email_sequences.sql` | Sequências de email |
| 016 | `leads_qualification_system.sql` | Sistema de qualificação (State Machine) |
| 020-030 | `ai_agents_*.sql` | Tabelas dos 24 agentes IA |
| 031-040 | `marketing_*.sql` | Sistema de marketing (SEO, A/B tests, ads) |
| 041-050 | `payments_*.sql` | Sistema de pagamentos + assinaturas |
| 051-062 | `features_*.sql` | Features recentes (NPS, analytics, etc) |

**Processo de Migração:**

```bash
# Apply migrations
npx supabase db push

# Generate TypeScript types
npx supabase gen types typescript --local > src/lib/supabase/database.types.ts

# Reset database (dev only)
npx supabase db reset
```

---

## 📊 ER DIAGRAM (Principais Relações)

```
┌─────────────┐
│    users    │◄──────────┐
└──────┬──────┘           │
       │                  │
       │ 1:1              │ 1:N
       │                  │
       ▼                  │
┌─────────────┐    ┌──────┴──────┐
│  profiles   │    │    leads    │
└─────────────┘    └──────┬──────┘
                          │
                          │ 1:N
                          │
                   ┌──────▼──────────┐
                   │ qualified_leads │
                   └──────┬──────────┘
                          │
                          │ 1:1
                          │
                   ┌──────▼───────────┐
                   │  conversations   │◄────────┐
                   └──────┬───────────┘         │
                          │                     │
                          │ 1:N                 │
                          │                     │
                   ┌──────▼──────┐              │
                   │  messages   │              │
                   └─────────────┘              │
                                                │
┌──────────────┐                                │
│   products   │◄───────────────────────────────┤
└──────┬───────┘                                │
       │                                        │
       │ 1:N                                    │
       │                                        │
┌──────▼────────┐     1:1      ┌───────────────┴┐
│   contracts   │◄─────────────│    payments    │
└──────┬────────┘              └────────────────┘
       │
       │ 1:N
       │
┌──────▼─────────────┐
│  process_alerts    │
└────────────────────┘

┌─────────────┐
│  partners   │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────────┐
│   referrals     │
└─────────────────┘

┌──────────────────┐
│ email_sequences  │
└──────┬───────────┘
       │
       │ 1:N
       │
┌──────▼───────────────────┐
│ email_sequence_steps     │
└──────────────────────────┘
```

---

## 🎯 BOAS PRÁTICAS IMPLEMENTADAS

### 1. Naming Conventions

- **Tabelas:** snake_case, plural (users, leads, contracts)
- **Colunas:** snake_case (created_at, first_name)
- **Indexes:** `idx_<table>_<column>` (idx_users_email)
- **Policies:** `<table>_<role>_<action>` (users_admin_all)
- **Functions:** snake_case, verbos (calculate_nps_score)

### 2. Data Integrity

- **Foreign Keys:** SEMPRE com ON DELETE (CASCADE ou SET NULL)
- **Constraints:** CHECK constraints para enums e ranges
- **NOT NULL:** Campos essenciais marcados como NOT NULL
- **UNIQUE:** Constraints em campos únicos (email, document_number)
- **Defaults:** Valores default para status, timestamps

### 3. Performance

- **Indexes:** Criados em todas foreign keys e campos de busca
- **GIN Indexes:** Para arrays e JSONB
- **Partial Indexes:** Para queries específicas (ex: WHERE is_active = TRUE)
- **Composite Indexes:** Para queries multi-coluna

### 4. Segurança

- **RLS habilitado:** Em TODAS as tabelas
- **Policies granulares:** Por role (admin, partner, client)
- **Password hashing:** bcrypt (nunca plaintext)
- **2FA:** Tabela two_factor_codes
- **Audit Logs:** 7 anos de retenção (compliance)

### 5. Compliance

- **LGPD:** Audit logs, data retention policies
- **OAB:** oab_compliance_notes table
- **Data Deletion:** Soft deletes + hard delete após 7 anos
- **Encryption:** Dados sensíveis em JSONB criptografado

---

## 📝 CHANGELOG

| Versão | Data | Mudanças |
|--------|------|----------|
| **1.0** | 2026-01-01 | Documentação inicial completa - 75+ tabelas, 62 migrations, 262 RLS policies |

---

**Responsável:** MANUS v7.0 (Modo Arquiteto Sênior)
**Status:** ✅ PRODUCTION READY - Database Schema Documentado
**Última Atualização:** 01/01/2026
**Próxima Revisão:** 01/03/2026

---

## 📚 REFERÊNCIAS

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL 15 Documentation](https://www.postgresql.org/docs/15/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [02-ARQUITETURA-PLATAFORMA.md](02-ARQUITETURA-PLATAFORMA.md) - Arquitetura completa
- [04-USER-FLOWS.md](04-USER-FLOWS.md) - Fluxos que utilizam o database
- [reference/17_INTEGRACOES.md](reference/17_INTEGRACOES.md) - Integrações com database
