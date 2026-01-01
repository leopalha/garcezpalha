# PLANO DE TAREFAS - IMPLEMENTAÇÕES FALTANTES

**Data:** 30/12/2024
**Status Deploy:** ✅ Produção Online (https://garcezpalha-mp193fafi-leopalhas-projects.vercel.app)
**Branch:** production
**Base:** Análise de documentação existente

---

## 🎯 CONTEXTO

O sistema Garcez Palha está **100% funcional em produção**, mas há features documentadas que ainda usam **mock data** ou precisam ser **conectadas às APIs reais**.

**O que está funcionando:**
- ✅ P1 (18/18) - Automação completa
- ✅ P2 (3/3) - APIs reais de conversas + auto-escalate
- ✅ P3 (4/4) - Deploy e documentação
- ✅ Dashboard B2B (11 páginas criadas)
- ✅ Build passando com 0 erros

**O que precisa evoluir:**
- 🔄 Dashboard B2B usando mock data → Conectar com APIs reais
- 🔄 Onboarding wizard criado mas sem fluxo completo
- 🔄 Payment integration no checkout sem backend
- 🔄 Landing page builder visual não implementado
- 🔄 CRM básico sem pipeline Kanban

---

## 📋 TAREFAS IDENTIFICADAS (52 TAREFAS)

### 🚀 FASE 1: CONECTAR DASHBOARD B2B COM APIS REAIS (Prioridade ALTA)
**Prazo estimado:** 1-2 semanas
**Importância:** Crítico para produção funcional completa

#### P4-001: API Dashboard Stats (Real Data)
**Arquivo:** `src/app/api/app/dashboard/stats/route.ts` (criar)
**Descrição:** Substituir mock data do dashboard principal por queries reais
**Dados:**
- Total de produtos criados (query: `products WHERE tenant_id = ?`)
- Total de leads (query: `leads WHERE tenant_id = ?`)
- Taxa de conversão (query: `leads WHERE status = 'converted'`)
- Stats do Agent IA (query: `conversations` + aggregate)

**Integração:**
- Conectar com: `src/app/(app)/dashboard/page.tsx` (linha ~50-100)
- Substituir: `mockStats` por `fetch('/api/app/dashboard/stats')`

**Supabase Tables:**
- `products`
- `leads`
- `conversations`
- `agent_stats`

---

#### P4-002: API Products CRUD
**Arquivos:**
- `src/app/api/app/products/route.ts` (criar) - GET/POST
- `src/app/api/app/products/[id]/route.ts` (criar) - GET/PATCH/DELETE

**Descrição:** CRUD completo de produtos jurídicos criados pelo advogado

**Endpoints:**
- `GET /api/app/products` - Lista produtos do tenant
- `POST /api/app/products` - Cria novo produto
- `GET /api/app/products/[id]` - Detalhes do produto
- `PATCH /api/app/products/[id]` - Edita produto
- `DELETE /api/app/products/[id]` - Remove produto

**Integração:**
- Conectar com: `src/app/(app)/dashboard/produtos/page.tsx`
- Conectar com: `src/app/(app)/dashboard/produtos/novo/page.tsx` (wizard)

**Supabase Schema:**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2),
  description TEXT,
  questions JSONB, -- perguntas de qualificação
  proposal_template TEXT,
  landing_page_config JSONB,
  status TEXT DEFAULT 'draft', -- draft/published/archived
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### P4-003: API Clients Management
**Arquivo:** `src/app/api/app/clients/route.ts` (criar)
**Descrição:** Gestão de clientes do advogado com filtros avançados

**Query Parameters:**
- `status` - Filtrar por status (qualificado/converted/lost)
- `source` - Filtrar por origem (whatsapp/website/ads)
- `product` - Filtrar por produto
- `search` - Busca por nome/email
- `limit`, `offset` - Paginação

**Response:**
```typescript
{
  clients: [{
    id: string,
    name: string,
    email: string,
    phone: string,
    score: number, // 0-100
    status: string,
    source: string,
    product: string,
    conversationsCount: number,
    totalValue: number,
    lastContact: string,
    createdAt: string
  }],
  total: number,
  stats: {
    total: number,
    qualified: number,
    converted: number,
    conversionRate: number,
    totalRevenue: number
  }
}
```

**Integração:**
- Conectar com: `src/app/(app)/dashboard/clientes/page.tsx`

---

#### P4-004: API Analytics Real (Substituir Mock)
**Arquivo:** `src/app/api/app/analytics/route.ts` (criar)
**Descrição:** Métricas de analytics já criadas em P2 mas não integradas no dashboard B2B

**Reutilizar APIs já criadas:**
- ✅ `/api/admin/analytics/leads-stats` (já existe)
- ✅ `/api/admin/analytics/revenue` (já existe)
- ✅ `/api/admin/analytics/top-products` (já existe)
- ✅ `/api/admin/analytics/source-performance` (já existe)
- ✅ `/api/admin/analytics/conversion-rate` (já existe)

**Tarefa:** Apenas integrar com `src/app/(app)/dashboard/analytics/page.tsx`

**Código:**
```typescript
// ANTES (mock):
const mockData = { leads: 245, conversao: 18.2, ... }

// DEPOIS (real):
const stats = await fetch('/api/admin/analytics/leads-stats?days=30')
const revenue = await fetch('/api/admin/analytics/revenue?months=12')
```

---

#### P4-005: API User Settings
**Arquivo:** `src/app/api/app/settings/route.ts` (criar)
**Descrição:** Salvar configurações do usuário (notificações, integrations, perfil)

**Endpoints:**
- `GET /api/app/settings` - Buscar settings atuais
- `PATCH /api/app/settings` - Atualizar settings

**Dados:**
```typescript
{
  profile: {
    name: string,
    email: string,
    phone: string,
    avatar: string,
    bio: string,
    oab: string,
    specialization: string
  },
  notifications: {
    emailNewLeads: boolean,
    emailConversations: boolean,
    emailPayments: boolean,
    whatsappNotifications: boolean,
    desktopNotifications: boolean,
    weeklyReport: boolean
  },
  integrations: {
    googleCalendarConnected: boolean,
    gmailConnected: boolean,
    whatsappConnected: boolean,
    stripeConnected: boolean
  },
  security: {
    twoFactorEnabled: boolean,
    lastPasswordChange: string
  }
}
```

**Integração:**
- Conectar com: `src/app/(app)/dashboard/configuracoes/page.tsx`

---

### 🎓 FASE 2: SISTEMA DE ONBOARDING COMPLETO (Prioridade MÉDIA)
**Prazo estimado:** 1 semana

#### P4-006: Onboarding Wizard Multi-Step
**Arquivo:** `src/app/(app)/onboarding/page.tsx` (criar)
**Descrição:** Wizard guiado de 6 steps para novos advogados

**Steps:**
1. **Boas-vindas** - Vídeo explicativo + benefícios
2. **Escolha de Nicho** - 8 especializações (criminal, trabalhista, civil, etc)
3. **Configuração do Agent** - Nome, tom de voz, especialização
4. **Primeiro Produto** - Wizard simplificado (apenas: nome, categoria, preço)
5. **White-Label Básico** - Logo, cores primárias
6. **Tour Interativo** - Walkthrough das features principais

**Progresso:** Salvar no `localStorage` + backend (`tenant_onboarding_progress`)

**Integração:**
- Redirect após signup (`/cadastro` → `/onboarding`)
- Após completar → redirect to `/dashboard`

---

#### P4-007: Tutorial Interativo (Product Tour)
**Biblioteca:** `react-joyride` ou `intro.js`
**Descrição:** Tooltips interativos mostrando features

**Tours:**
1. **Dashboard Tour** - KPIs, produtos, conversas
2. **Criar Produto Tour** - Wizard de criação
3. **Conversas Tour** - Como gerenciar leads
4. **Analytics Tour** - Interpretar métricas

**Trigger:** Botão "?" no header ou auto-start no primeiro login

---

### 💳 FASE 3: PAYMENT INTEGRATION REAL (Prioridade ALTA)
**Prazo estimado:** 3-4 dias

#### P4-008: Stripe/MercadoPago Subscriptions
**Arquivos:**
- `src/app/api/stripe/create-subscription/route.ts` (criar)
- `src/app/api/stripe/portal/route.ts` (criar)
- `src/app/api/stripe/webhook/route.ts` (já existe, verificar)

**Descrição:** Integração completa de pagamentos recorrentes

**Fluxo:**
1. User clica em "Assinar Plano" no `/checkout`
2. Backend cria `Stripe Checkout Session` ou `MercadoPago Preference`
3. Redirect para página de pagamento
4. Webhook recebe confirmação
5. Automatic provisioning (criar `tenant`, `user`, `agent`)
6. Email de boas-vindas
7. Redirect para `/onboarding`

**Webhooks:**
- `customer.subscription.created` - Provisionar conta
- `customer.subscription.updated` - Upgrade/downgrade
- `customer.subscription.deleted` - Cancelamento (soft delete)
- `invoice.payment_succeeded` - Renovação mensal
- `invoice.payment_failed` - Email cobrança

**Supabase Tables:**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id),
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL, -- starter/pro/enterprise
  status TEXT NOT NULL, -- active/canceled/past_due
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### P4-009: Customer Portal Integration
**Descrição:** Portal do cliente para gerenciar assinatura

**Features:**
- Ver plano atual e próximo billing
- Upgrade/downgrade de plano
- Atualizar método de pagamento
- Cancelar assinatura
- Baixar faturas (PDFs)

**Implementação:**
- Stripe: `stripe.billingPortal.sessions.create()`
- MercadoPago: API custom

**Integração:**
- Conectar com: `src/app/(app)/dashboard/assinatura/page.tsx`
- Botão "Gerenciar Assinatura" → redirect to portal

---

#### P4-010: Automatic Provisioning System
**Arquivo:** `src/lib/subscriptions/provisioner.ts` (criar)
**Descrição:** Criar automaticamente tenant + user após pagamento confirmado

**Processo:**
```typescript
async function provisionTenant(subscriptionData) {
  // 1. Criar tenant
  const tenant = await supabase.from('tenants').insert({
    name: subscriptionData.customerName,
    email: subscriptionData.customerEmail,
    plan: subscriptionData.plan,
    status: 'active'
  })

  // 2. Criar user admin
  const user = await supabase.auth.admin.createUser({
    email: subscriptionData.customerEmail,
    password: generateRandomPassword(),
    email_confirm: true
  })

  // 3. Criar Agent IA default
  const agent = await supabase.from('agents').insert({
    tenant_id: tenant.id,
    name: 'Assistente Jurídico',
    specialization: 'general',
    status: 'active'
  })

  // 4. Enviar email de boas-vindas
  await sendEmail({
    to: subscriptionData.customerEmail,
    subject: 'Bem-vindo à Garcez Palha',
    template: 'welcome-template',
    data: {
      name: subscriptionData.customerName,
      loginUrl: `${process.env.NEXTAUTH_URL}/login`,
      tempPassword: tempPassword,
      plan: subscriptionData.plan
    }
  })

  // 5. Criar subscription record
  await supabase.from('subscriptions').insert({
    tenant_id: tenant.id,
    stripe_subscription_id: subscriptionData.id,
    plan: subscriptionData.plan,
    status: 'active'
  })
}
```

---

### 🎨 FASE 4: LANDING PAGE BUILDER VISUAL (Prioridade MÉDIA-BAIXA)
**Prazo estimado:** 2-3 semanas

#### P4-011: Visual Editor (Drag-and-Drop)
**Biblioteca:** `grapesjs` ou `craft.js` ou `builder.io`
**Descrição:** Editor WYSIWYG para criar landing pages

**Features:**
- Drag-and-drop de componentes
- Pre-built blocks (hero, benefits, pricing, testimonials, FAQ, CTA)
- Customização de cores, fontes, imagens
- Preview desktop/tablet/mobile
- Undo/redo
- Save drafts

**Componentes Disponíveis:**
- Hero section (headline + subheadline + CTA + imagem)
- Benefits grid (3-6 items)
- Pricing table (1-3 planos)
- Social proof (depoimentos)
- FAQ accordion
- Footer

---

#### P4-012: Templates Pré-Construídos
**Descrição:** 10+ templates prontos de landing pages jurídicas

**Templates:**
1. **Direito Criminal** - Defesa criminal
2. **Direito Trabalhista** - Reclamatória
3. **Direito Civil** - Contratos e ações cíveis
4. **Divórcio Consensual** - Processos de família
5. **Inventário** - Sucessões
6. **Danos Morais** - Indenizações
7. **Recuperação Judicial** - Empresarial
8. **INSS** - Benefícios previdenciários
9. **Habeas Corpus** - Liberdade provisória
10. **Perícia** - Serviços periciais

**Estrutura:**
```typescript
interface LandingPageTemplate {
  id: string
  name: string
  category: string
  preview: string // screenshot URL
  sections: {
    hero: { headline, subheadline, cta, image }
    benefits: Array<{ title, description, icon }>
    pricing: { plans: Array<{ name, price, features }> }
    testimonials: Array<{ name, text, avatar }>
    faq: Array<{ question, answer }>
  }
}
```

---

#### P4-013: Deploy Automático de Landing Pages
**Descrição:** Cada landing page criada recebe URL única

**URL Pattern:**
- `https://garcezpalha.com.br/p/[produto-slug]`
- Ou domínio custom: `https://[tenant-slug].garcezpalha.com.br/[produto-slug]`

**Implementação:**
- Next.js Dynamic Routes: `src/app/p/[slug]/page.tsx`
- Query Supabase: `products WHERE slug = ?`
- Renderizar componentes dinamicamente baseado em `landing_page_config`

**SEO:**
- Meta tags dinâmicos (title, description, og:image)
- Structured data (JSON-LD)
- Sitemap automático

---

#### P4-014: Analytics por Landing Page
**Descrição:** Métricas específicas de cada landing

**Métricas:**
- Page views
- Unique visitors
- Bounce rate
- Average time on page
- Scroll depth
- CTA clicks
- Form submissions
- Conversion rate (leads gerados)

**Integração:**
- Google Analytics 4
- Facebook Pixel (opcional)
- Internal tracking (tabela `landing_page_stats`)

---

### 📊 FASE 5: CRM COMPLETO COM PIPELINE (Prioridade MÉDIA)
**Prazo estimado:** 2 semanas

#### P4-015: Pipeline Kanban Board
**Biblioteca:** `@hello-pangea/dnd` (fork do react-beautiful-dnd)
**Descrição:** Visualização de pipeline de vendas estilo Kanban

**Colunas (customizáveis):**
1. **Novo Lead** - Leads não contatados
2. **Contato Inicial** - Primeiro contato feito
3. **Qualificado** - Lead passou por qualificação
4. **Proposta Enviada** - Aguardando resposta
5. **Negociação** - Em negociação de valores/condições
6. **Fechado (Ganho)** - Cliente convertido
7. **Fechado (Perdido)** - Lead perdido

**Features:**
- Drag-and-drop entre colunas
- Cards com: nome, score, valor estimado, dias no pipeline
- Filtros por produto, origem, responsável
- Bulk actions (mover múltiplos cards)
- Timeline de movimentações

**Arquivo:** `src/app/(app)/dashboard/pipeline/page.tsx` (criar)

---

#### P4-016: Atividades e Tarefas
**Descrição:** Registro de atividades e follow-ups

**Tipos de Atividade:**
- Ligação telefônica
- Email enviado
- WhatsApp
- Reunião agendada
- Nota/comentário
- Documento enviado
- Proposta criada
- Contrato assinado

**Features:**
- Criar atividade manual
- Atividades automáticas (agent registra conversas)
- Tarefas pendentes com due date
- Reminders (notificações)
- Timeline completo por lead/cliente

**Supabase Schema:**
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL, -- call/email/whatsapp/meeting/note
  subject TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending', -- pending/completed/canceled
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### P4-017: Email Integration
**Descrição:** Sincronizar emails Gmail com CRM

**Features (já parcialmente implementado em P1-011):**
- Buscar emails relacionados ao lead (por email address)
- Exibir thread completo no CRM
- Enviar email direto do CRM (via Gmail API)
- Marcar emails como atividade automática
- Attachments download

**Integração:**
- Reutilizar: `src/lib/gmail/` (já existe)
- Adicionar UI: Timeline de emails no lead detail page

---

#### P4-018: WhatsApp Integration UI
**Descrição:** Interface para enviar/receber mensagens WhatsApp

**Features:**
- Inbox de conversas WhatsApp (já existe backend)
- Enviar mensagens direto do CRM
- Templates de mensagens (quick replies)
- Upload de mídia (imagens, PDFs, áudios)
- Status de entrega (sent/delivered/read)

**Backend (já existe):**
- ✅ `/api/whatsapp-cloud/webhook` (receber mensagens)
- ✅ `/api/whatsapp-cloud/send` (enviar mensagens)

**Tarefa:** Criar UI frontend integrada ao CRM

---

#### P4-019: Histórico Completo de Interações
**Arquivo:** `src/app/(app)/dashboard/clientes/[id]/page.tsx` (criar)
**Descrição:** Página de detalhes do cliente com histórico completo

**Seções:**
1. **Header** - Nome, score, status, tags
2. **Info Card** - Email, telefone, empresa, origem
3. **Timeline** - Todas atividades cronológicas
4. **Conversas IA** - Histórico de conversas com agent
5. **Propostas** - Propostas enviadas/aceitas
6. **Documentos** - Uploads e contratos
7. **Pagamentos** - Faturas e histórico
8. **Notas** - Anotações privadas do advogado

**Funcionalidades:**
- Adicionar nota rápida
- Agendar follow-up
- Enviar email/WhatsApp
- Gerar proposta
- Upload de documento

---

#### P4-020: Notes & Attachments
**Descrição:** Sistema de notas privadas e anexos

**Features:**
- Criar nota privada (não visível para cliente)
- Nota pública (visível no portal do cliente)
- Upload de anexos (contratos, documentos, prints)
- Rich text editor (bold, italic, lists, links)
- Menções (@usuario)
- Tags para organização

**Supabase Schema:**
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY,
  lead_id UUID REFERENCES leads(id),
  tenant_id UUID REFERENCES tenants(id),
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT TRUE,
  attachments JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 📧 FASE 6: MARKETING AUTOMATION (Prioridade MÉDIA-BAIXA)
**Prazo estimado:** 2-3 semanas

#### P4-021: Email Sequences Builder
**Descrição:** Criar sequências de emails automatizadas por produto

**Features:**
- Criar sequência (nome, trigger, emails)
- Email editor (subject, body, variáveis)
- Delay entre emails (1 hora, 1 dia, 3 dias, 1 semana)
- Conditions (se abriu email anterior, se clicou link, se score > X)
- A/B testing (2 versões de subject/content)

**Triggers:**
- Lead criado
- Lead qualificado (score > X)
- Lead em estado X por Y dias
- Lead não respondeu proposta
- Cliente não pagou

**Exemplo de Sequência:**
```typescript
{
  name: "Nurturing - Direito Criminal",
  trigger: { type: 'lead_created', product: 'defesa-criminal' },
  emails: [
    { delay: 0, subject: 'Obrigado pelo interesse', template: 'email1' },
    { delay: '1 day', subject: 'Como podemos ajudar?', template: 'email2' },
    { delay: '3 days', subject: 'Casos de sucesso', template: 'email3', condition: 'email2_not_opened' },
    { delay: '1 week', subject: 'Última chance - 20% desconto', template: 'email4' }
  ]
}
```

---

#### P4-022: Triggers Automáticos
**Descrição:** Sistema de automações baseado em eventos

**Triggers Disponíveis:**
- Lead criado
- Lead atualizado (mudança de status)
- Lead score alterado (>= 80, >= 60, < 40)
- Lead idle (sem atividade por X dias)
- Proposta enviada
- Proposta aceita/rejeitada
- Pagamento recebido
- Pagamento atrasado
- Documento assinado
- Appointment agendado/cancelado

**Actions:**
- Enviar email
- Enviar WhatsApp
- Criar tarefa para advogado
- Mudar status do lead
- Adicionar tag
- Notificar no Telegram
- Webhook custom

**Arquivo:** `src/lib/automation/trigger-engine.ts` (criar)

---

#### P4-023: Templates de Email Customizáveis
**Descrição:** Editor de templates de email com variáveis dinâmicas

**Features:**
- Rich text editor (TinyMCE ou Quill)
- Variáveis disponíveis: `{{nome}}`, `{{produto}}`, `{{preco}}`, `{{link_proposta}}`
- Preview com dados de exemplo
- Salvar templates reutilizáveis
- Categorias (boas-vindas, follow-up, proposta, cobrança, NPS)

**Integração:**
- Conectar com: Sequences builder
- Conectar com: Email manual do CRM

---

#### P4-024: A/B Testing de Emails
**Descrição:** Testar 2 versões de email para otimizar taxa de abertura/clique

**Teste:**
- Subject line A vs B
- Content A vs B
- CTA A vs B

**Métricas:**
- Open rate (% abertos)
- Click rate (% clicados)
- Reply rate (% respostas)
- Conversion rate (% que viraram clientes)

**Definição de vencedor:**
- Automático após X envios (ex: 100 emails)
- Manual (advogado escolhe)

**Implementação:**
- Tabela `email_tests` (test_id, variant_a, variant_b, winner)
- Random split 50/50
- Dashboard de resultados

---

#### P4-025: Relatórios de Performance
**Descrição:** Analytics de email marketing

**Métricas:**
- Total de emails enviados
- Taxa de entrega (delivered / sent)
- Taxa de abertura (opened / delivered)
- Taxa de clique (clicked / opened)
- Taxa de conversão (converted / sent)
- Taxa de descadastro (unsubscribed)
- Melhores horários de envio
- Melhores subject lines

**Gráficos:**
- Funnel de conversão (enviado → aberto → clicado → convertido)
- Time series de envios
- Heatmap de horários (dia da semana x hora do dia)
- Top performing emails

---

### 🤖 FASE 7: MULTI-AGENT SYSTEM (Prioridade BAIXA - Futuro)
**Prazo estimado:** 3-4 semanas

#### P4-026: Agent Orchestrator
**Descrição:** Coordenador de múltiplos agentes especializados

**Conceito:**
- Cada advogado pode ter múltiplos agents especializados
- 1 Agent Master que roteia conversas para agents especializados
- Agents compartilham conhecimento (RAG vector database)

**Exemplo:**
```
User: "Sofri um acidente de trabalho"
→ Master Agent analisa intent
→ Roteia para Agent de Direito Trabalhista
→ Agent Trabalhista faz qualificação específica
→ Se precisar de perícia → Chama Agent de Perícias
```

**Arquitetura:**
- Agent Master (gatekeeper)
- 8 Agents especializados (criminal, trabalhista, civil, etc)
- Shared Memory (Redis + Supabase)
- Context switching automático

---

#### P4-027: RAG System (Retrieval-Augmented Generation)
**Descrição:** Base de conhecimento vetorizada para agentes

**Features:**
- Upload de documentos jurídicos (leis, jurisprudências, casos)
- Vetorização com OpenAI Embeddings
- Armazenamento em Supabase pgvector
- Retrieval de contexto relevante durante conversas
- Agent consulta RAG antes de responder

**Pipeline:**
1. Upload documento PDF
2. Extract text (pdf-parse)
3. Chunking (512 tokens)
4. Generate embeddings (text-embedding-3-small)
5. Store vectors (Supabase pgvector)
6. Query: `SELECT * FROM documents ORDER BY embedding <-> query_embedding LIMIT 5`

**Use Case:**
- Agent responde com base em jurisprudência específica
- Agent cita artigos de lei corretamente
- Agent usa casos de sucesso do escritório

---

#### P4-028: Agent Analytics & Improvement
**Descrição:** Métricas de performance dos agents e loop de melhoria

**Métricas:**
- Satisfaction score (média de ratings)
- First contact resolution (% resolvido no primeiro contato)
- Average response time
- Handoff rate (% escalado para humano)
- Conversion rate (% de leads que viraram clientes)
- Top intents detectados
- Most common questions

**Loop de Melhoria:**
- Identificar conversas com baixo rating
- Análise de falhas (GPT-4 analisa o que deu errado)
- Sugestões de melhoria de prompt
- Re-training automático (fine-tuning)

---

### 📱 FASE 8: MOBILE APP (Prioridade BAIXA - Futuro)
**Prazo estimado:** 2-3 meses

#### P4-029: React Native App
**Stack:** React Native + Expo
**Descrição:** App mobile para advogados gerenciarem leads on-the-go

**Features:**
- Dashboard mobile
- Push notifications (novo lead, mensagem, pagamento)
- Conversas (inbox WhatsApp + chat interno)
- Responder leads rapidamente
- Upload de fotos de documentos (câmera)
- Offline mode (sync quando voltar online)

**Screens:**
- Home (dashboard KPIs)
- Leads (lista + detalhes)
- Conversas (chat interface)
- Notifications
- Perfil/Settings

---

#### P4-030: Push Notifications Nativas
**Serviço:** Firebase Cloud Messaging (FCM)
**Descrição:** Notificações push para eventos importantes

**Eventos:**
- Novo lead qualificado (score >= 80)
- Lead esperando handoff
- Nova mensagem de lead
- Pagamento recebido
- Documento assinado
- Appointment em 1 hora

**Implementação:**
- Backend: Send via FCM API
- Mobile: Receber e exibir notificação
- Action: Deep link para tela específica

---

#### P4-031: Offline Mode
**Descrição:** App funciona sem internet (modo offline)

**Features:**
- Cache de leads (últimos 50)
- Cache de conversas
- Criar notas offline
- Queue de ações (sync quando conectar)
- Indicador de status (online/offline/syncing)

**Sync Strategy:**
- Background sync (a cada 5 min se online)
- Manual pull-to-refresh
- Conflict resolution (last-write-wins)

---

#### P4-032: Camera Integration
**Descrição:** Usar câmera para upload rápido de documentos

**Features:**
- Tirar foto de documento
- Auto crop (detectar bordas)
- OCR (extrair texto do documento)
- Converter para PDF
- Upload direto para lead/cliente

**Bibliotecas:**
- `react-native-vision-camera`
- `react-native-document-scanner`
- Tesseract OCR

---

### 🔧 FASE 9: ADVANCED FEATURES (Prioridade BAIXA)
**Prazo estimado:** Variável

#### P4-033: Multi-Tenancy Completo
**Descrição:** Isolamento completo entre tenants (advogados)

**Features:**
- Cada tenant tem banco isolado (schema isolation)
- Custom domain por tenant (`cliente.garcezpalha.com.br`)
- White-label completo (logo, cores, domínio)
- Data isolation (RLS policies)
- Separate billing por tenant

**Supabase RLS:**
```sql
-- Todos dados filtrados por tenant_id
CREATE POLICY "Tenant isolation"
ON leads
FOR ALL
USING (tenant_id = current_tenant_id());
```

---

#### P4-034: API Pública para Integrações
**Descrição:** Documentar e expor API REST para integrações externas

**Endpoints:**
- `POST /api/v1/leads` - Criar lead via API
- `GET /api/v1/leads` - Listar leads
- `POST /api/v1/webhooks/subscribe` - Registrar webhook
- `GET /api/v1/products` - Listar produtos

**Autenticação:**
- API Keys por tenant
- Rate limiting (1000 req/hora)
- Webhooks para eventos (lead.created, lead.updated, payment.succeeded)

**Documentação:**
- Swagger/OpenAPI spec
- Postman collection
- Code examples (curl, JS, Python, PHP)

---

#### P4-035: Zapier Integration
**Descrição:** Integração com Zapier para conectar 6000+ apps

**Triggers:**
- New Lead Created
- Lead Qualified
- Payment Received
- Document Signed

**Actions:**
- Create Lead
- Update Lead
- Send Message

**Implementação:**
- Criar app no Zapier Developer Platform
- Expor endpoints REST
- Webhooks para triggers

---

#### P4-036: Advanced Analytics & BI
**Descrição:** Dashboard executivo com analytics avançados

**Features:**
- Cohort analysis (retenção de clientes por coorte)
- Funnel analysis (onde leads estão caindo no funil)
- Predictive analytics (ML para prever churn)
- LTV (Lifetime Value) prediction
- CAC (Customer Acquisition Cost) por canal
- Payback period analysis

**Visualizações:**
- Gráficos interativos (Recharts ou Chart.js)
- Filtros avançados (date range, segmentos)
- Export para Excel/PDF
- Scheduled reports (email diário/semanal)

---

#### P4-037: Voice Calls Integration
**Descrição:** Integração com sistema de telefonia (VoIP)

**Provider:** Twilio Voice ou Plivo
**Features:**
- Click-to-call do CRM
- Gravar chamadas automaticamente
- Transcrever chamadas (speech-to-text)
- Registrar como atividade
- Analytics de chamadas (duração, outcome)

**Uso:**
- Advogado clica "Ligar" no lead
- Sistema faz chamada via Twilio
- Áudio gravado e salvo
- Transcrição automática com Whisper

---

#### P4-038: Video Calls (Teleconferência)
**Descrição:** Consultas por vídeo integradas

**Provider:** Daily.co ou Whereby
**Features:**
- Agendar vídeo call
- Link único por consulta
- Gravação automática (se autorizado)
- Compartilhamento de tela
- Chat durante call
- Notas pós-call

**Integração:**
- Criar sala de vídeo via API
- Enviar link para cliente (email/WhatsApp)
- Embed player no dashboard
- Recording storage (Supabase Storage)

---

#### P4-039: Document E-Signature (ClickSign Completo)
**Descrição:** Integração completa com ClickSign para assinaturas

**Features (já parcial):**
- Criar documento para assinatura
- Enviar para múltiplos signatários
- Rastrear status (pending/signed/rejected)
- Webhook de conclusão
- Download documento assinado

**Melhorias:**
- UI para criar documento direto no CRM
- Templates de contrato editáveis
- Campos dinâmicos (preencher via form)
- Assinatura em lote

---

#### P4-040: Legal Templates Marketplace
**Descrição:** Marketplace de templates jurídicos compartilhados

**Features:**
- Advogados criam templates
- Podem vender/compartilhar
- Outros advogados compram/clonam
- Categorias (criminal, trabalhista, civil, etc)
- Ratings e reviews
- Revenue share (70% autor, 30% plataforma)

**Monetização:**
- Templates pagos (R$49-R$299)
- Templates gratuitos (para marketing)
- Subscription bundles

---

#### P4-041: AI Document Review
**Descrição:** IA analisa contratos e documentos enviados por clientes

**Features:**
- Upload de contrato PDF
- GPT-4 Vision + PDF parsing
- Análise de cláusulas abusivas
- Riscos identificados
- Sugestões de melhoria
- Gerar parecer automático

**Modelo:**
- Fine-tuned GPT-4 com contratos jurídicos
- Prompt engineering para análise detalhada
- Output estruturado (JSON → UI bonita)

---

#### P4-042: Legal Research Assistant
**Descrição:** Pesquisa jurisprudencial automatizada

**Features:**
- Buscar jurisprudências (STF, STJ, TRFs, TJs)
- Pesquisar leis e decretos
- Resumir acórdãos
- Encontrar precedentes similares
- Gerar relatório de pesquisa

**Integração:**
- API de tribunais (onde disponível)
- Web scraping (onde não há API)
- Vector search para similaridade

---

#### P4-043: Appointment Scheduling (Calendly-like)
**Descrição:** Sistema de agendamento público estilo Calendly

**Features (já parcial em P1-008):**
- Página pública `/agendar/[advogado-slug]`
- Cliente escolhe data/hora disponível
- Sincroniza com Google Calendar
- Confirmação automática (email + WhatsApp)
- Reminders (1 dia antes, 1 hora antes)
- Reagendar/Cancelar
- Integration com Meet/Zoom

**Melhorias:**
- Múltiplos tipos de consulta (inicial/acompanhamento/urgência)
- Durações variáveis (30min/1h/2h)
- Buffer time entre consultas
- Limitar horários por dia da semana

---

#### P4-044: Client Portal (Área do Cliente)
**Descrição:** Portal para clientes acompanharem seus processos

**Features:**
- Login do cliente
- Dashboard pessoal
- Status do caso
- Documentos compartilhados
- Mensagens com advogado
- Próximos passos
- Faturas e pagamentos
- Agendar consultas

**Acesso:**
- Email de boas-vindas com link de primeiro acesso
- Criar senha
- 2FA opcional

---

#### P4-045: Telegram Bot Integration
**Descrição:** Bot de Telegram para notificações e quick actions

**Features:**
- Receber notificações via Telegram
- Comandos: `/leads` (listar pendentes), `/stats` (métricas do dia)
- Responder lead via Telegram
- Aprovar/rejeitar propostas
- Quick actions (marcar como qualificado, agendar follow-up)

**Setup:**
- BotFather para criar bot
- Webhook `/api/telegram/webhook`
- Commands handler

---

#### P4-046: Smart Contracts (Blockchain)
**Descrição:** Contratos imutáveis na blockchain

**Conceito:**
- Contrato assinado → Hash gravado na blockchain
- Prova de autenticidade e timestamp
- Impossível adulterar
- Auditável publicamente

**Blockchain:** Polygon (low fees) ou Ethereum
**Uso:** Contratos high-value ou que precisam de prova judicial

---

#### P4-047: Compliance & Audit Logs
**Descrição:** Rastreabilidade completa de ações (LGPD compliance)

**Features:**
- Log de todas ações (quem, o quê, quando)
- Audit trail para dados sensíveis
- LGPD compliance (direito ao esquecimento)
- Exportar logs para análise
- Retention policy (guardar por X anos)

**Eventos Logged:**
- User login/logout
- Lead created/updated/deleted
- Document accessed
- Email sent
- Payment processed
- Settings changed

---

#### P4-048: AI Training Dashboard
**Descrição:** Interface para melhorar o Agent com feedback humano

**Features:**
- Lista de conversas com baixo rating
- Marcar respostas como boas/ruins
- Sugerir resposta melhorada
- Re-train model com feedback (RLHF)
- A/B test prompts diferentes

**Processo:**
1. Coletar conversas com rating < 3 estrelas
2. Humano revisa e marca problemas
3. Cria resposta ideal
4. Sistema aprende (fine-tune ou prompt update)

---

#### P4-049: Referral Program
**Descrição:** Programa de indicação para advogados

**Features:**
- Cada advogado tem link único (`/ref/CODIGO`)
- Indica amigo advogado
- Amigo assina → Indicador ganha 30 dias grátis ou R$100 crédito
- Dashboard de indicações
- Leaderboard (gamification)

**Tracking:**
- Cookie/localStorage com ref code
- Atribuição de conversão
- Payout automático

---

#### P4-050: White-Label Custom Domain
**Descrição:** Domínio totalmente customizado por advogado

**Exemplo:**
- Advogado compra `seuescritorio.com.br`
- Aponta DNS para Vercel
- Vercel SSL automático
- Plataforma roda em `seuescritorio.com.br`

**Setup:**
- UI para adicionar domínio custom
- Verificação DNS (TXT record)
- SSL automático (Vercel/Let's Encrypt)
- Fallback para subdomínio (`advogado.garcezpalha.com.br`)

---

#### P4-051: Multi-Language Support (i18n)
**Descrição:** Suporte a múltiplos idiomas

**Idiomas:**
- Português (pt-BR) - default
- Inglês (en-US)
- Espanhol (es-ES)

**Implementação:**
- next-intl ou react-i18next
- Arquivos de tradução (JSON)
- Auto-detect locale do browser
- Seletor de idioma no header

---

#### P4-052: Performance Monitoring & APM
**Descrição:** Monitoramento de performance em produção

**Ferramentas:**
- Sentry (error tracking) - já mencionado em P3
- Vercel Analytics (já ativo)
- New Relic ou DataDog (APM)
- LogRocket (session replay)

**Métricas:**
- API response time
- Database query performance
- Frontend page load time
- Core Web Vitals (LCP, FID, CLS)
- Error rates
- User flow analysis

---

## 📊 RESUMO POR PRIORIDADE

### 🔴 ALTA (Produção Funcional)
- P4-001 a P4-005: Dashboard B2B com APIs reais (5 tarefas)
- P4-008 a P4-010: Payment Integration (3 tarefas)
- **Total: 8 tarefas** | **Prazo: 2-3 semanas**

### 🟡 MÉDIA (Features Importantes)
- P4-006 a P4-007: Onboarding (2 tarefas)
- P4-015 a P4-020: CRM Completo (6 tarefas)
- P4-021 a P4-025: Marketing Automation (5 tarefas)
- **Total: 13 tarefas** | **Prazo: 5-7 semanas**

### 🟢 MÉDIA-BAIXA (Nice to Have)
- P4-011 a P4-014: Landing Page Builder (4 tarefas)
- **Total: 4 tarefas** | **Prazo: 2-3 semanas**

### 🔵 BAIXA (Futuro/Escalabilidade)
- P4-026 a P4-028: Multi-Agent System (3 tarefas)
- P4-029 a P4-032: Mobile App (4 tarefas)
- P4-033 a P4-052: Advanced Features (20 tarefas)
- **Total: 27 tarefas** | **Prazo: 3-6 meses**

---

## 🎯 ROADMAP RECOMENDADO

### Sprint 1-2 (2 semanas): Dashboard B2B Real
- P4-001, P4-002, P4-003, P4-004, P4-005

### Sprint 3 (1 semana): Payment Integration
- P4-008, P4-009, P4-010

### Sprint 4 (1 semana): Onboarding
- P4-006, P4-007

### Sprint 5-6 (2 semanas): CRM Pipeline
- P4-015, P4-016, P4-017, P4-018, P4-019, P4-020

### Sprint 7-8 (2 semanas): Marketing Automation
- P4-021, P4-022, P4-023, P4-024, P4-025

### Sprint 9-11 (3 semanas): Landing Page Builder
- P4-011, P4-012, P4-013, P4-014

### Q1 2025: Advanced Features
- Selecionar 5-10 features de maior impacto da lista BAIXA prioridade

---

## ✅ CONCLUSÃO

**Total de tarefas identificadas:** 52 tarefas
**Já implementado e funcionando:** P1 (18) + P2 (3) + P3 (4) + Dashboard UI (11 páginas) = **36 itens completos**
**Faltando implementar:** 52 tarefas novas

**Próximo passo imediato:**
Começar por **Sprint 1-2** (Dashboard B2B com APIs reais) para ter uma plataforma 100% funcional em produção.

Todas as tarefas acima foram extraídas da análise de:
- SESSAO_B2B_DASHBOARD_COMPLETE.md (seção "PRÓXIMAS FASES")
- FASE2_ANALYTICS_REAL.md (APIs criadas mas não integradas)
- FASE3_MARKETING_AGENT.md (sistema criado mas sem UI completa)
- Conhecimento geral de features SaaS B2B

---

**Status:** ✅ Plano completo criado
**Data:** 30/12/2024
**Autor:** MANUS v7.0 Automated Planning
