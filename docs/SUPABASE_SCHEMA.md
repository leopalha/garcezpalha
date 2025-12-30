# SUPABASE SCHEMA DOCUMENTATION

**Data:** 29/12/2025
**Status:** PRODUÇÃO ATIVA
**Total Tables:** 60+
**Database:** PostgreSQL via Supabase

---

## SUMÁRIO EXECUTIVO

Este documento mapeia **TODAS as tabelas Supabase** utilizadas pela plataforma GarcezPalha. Schema completo extraído da investigação FASE 0.

**Status de Conectividade:**
- ✅ Supabase client configurado corretamente
- ✅ Env vars presente: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ Row Level Security (RLS) ativo
- ✅ Auth integration funcional

---

## CORE TABLES

### leads
**Status:** ✅ FUNCIONAL (99%)
**Uso:** Lead management principal

```typescript
{
  id: uuid (PK)
  full_name: string
  email: string
  phone: string
  company: string | null
  service_interest: string
  source: 'website' | 'whatsapp' | 'gmail' | 'referral' | 'ads'
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  qualification_status: 'pending' | 'in_progress' | 'qualified' | 'not_qualified'
  lead_score: number (0-100)
  assigned_to: uuid (FK → profiles)
  created_at: timestamp
  updated_at: timestamp
  metadata: jsonb
}
```

**APIs que usam:** `/api/admin/leads`, `/api/contact`, `/api/qualificacao/start`

---

### conversations
**Status:** ✅ FUNCIONAL (99%)
**Uso:** Chat messages entre leads/clients e AI/lawyers

```typescript
{
  id: uuid (PK)
  lead_id: uuid (FK → leads) | null
  client_id: uuid (FK → clients) | null
  messages: jsonb[] // {role, content, timestamp}
  status: 'active' | 'archived'
  last_message_at: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/chat`, `/api/chat/agent-flow`

---

### clients
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Leads convertidos em clientes

```typescript
{
  id: uuid (PK)
  lead_id: uuid (FK → leads) | null
  full_name: string
  email: string
  phone: string
  cpf: string | null
  address: jsonb | null
  status: 'active' | 'inactive'
  assigned_lawyer: uuid (FK → profiles)
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/admin/clientes`

---

### profiles
**Status:** ✅ FUNCIONAL (99%)
**Uso:** User profiles (lawyers, admins, partners)

```typescript
{
  id: uuid (PK, FK → auth.users)
  role: 'admin' | 'lawyer' | 'partner' | 'user'
  full_name: string
  email: string
  phone: string | null
  avatar_url: string | null
  oab_number: string | null
  specialties: string[]
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/auth/*`, `/api/admin/users`

---

## QUALIFICATION SYSTEM

### qualification_sessions
**Status:** ✅ FUNCIONAL (99%)
**Uso:** Sessões de qualificação automática via AI

```typescript
{
  id: uuid (PK)
  lead_id: uuid (FK → leads)
  product_id: string // Maps to qualification/agent-product-mapping.ts
  status: 'in_progress' | 'completed' | 'abandoned'
  current_question_index: number
  answers: jsonb[] // {question, answer, score}
  total_score: number (0-100)
  recommended_product: string | null
  agent_id: string // Which agent ran qualification
  started_at: timestamp
  completed_at: timestamp | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/qualificacao/start`, `/api/qualificacao/answer`, `/api/chat/agent-flow`

---

### qualified_leads
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Resultado final da qualificação

```typescript
{
  id: uuid (PK)
  lead_id: uuid (FK → leads)
  session_id: uuid (FK → qualification_sessions)
  qualification_score: number (0-100)
  recommended_product: string
  urgency_level: 'low' | 'medium' | 'high' | 'critical'
  estimated_value: number | null
  next_steps: jsonb
  assigned_to: uuid (FK → profiles) | null
  status: 'pending_contact' | 'contacted' | 'converted' | 'lost'
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/admin/leads` (filtro de qualified)

---

### follow_up_messages
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Mensagens de follow-up automático

```typescript
{
  id: uuid (PK)
  lead_id: uuid (FK → leads)
  qualified_lead_id: uuid (FK → qualified_leads) | null
  message_type: 'whatsapp' | 'email' | 'sms'
  content: text
  scheduled_for: timestamp
  sent_at: timestamp | null
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled'
  error_message: text | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/whatsapp/send`, `/api/email/send`

---

### follow_up_tasks
**Status:** ✅ FUNCIONAL (90%)
**Uso:** Tarefas de follow-up manual para advogados

```typescript
{
  id: uuid (PK)
  lead_id: uuid (FK → leads)
  qualified_lead_id: uuid (FK → qualified_leads) | null
  assigned_to: uuid (FK → profiles)
  task_type: 'call' | 'email' | 'meeting' | 'document_review'
  description: text
  due_date: timestamp
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  completed_at: timestamp | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/admin/tasks`

---

## SALES & PAYMENTS

### proposals
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Propostas comerciais geradas

```typescript
{
  id: uuid (PK)
  client_id: uuid (FK → clients)
  lead_id: uuid (FK → leads) | null
  product_id: string
  total_value: number
  discount: number | null
  final_value: number
  payment_terms: jsonb // {installments, method, etc}
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  valid_until: timestamp
  accepted_at: timestamp | null
  created_by: uuid (FK → profiles)
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/proposals/create`, `/api/proposals/[id]`

---

### payment_links
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Links de pagamento Stripe/MercadoPago

```typescript
{
  id: uuid (PK)
  proposal_id: uuid (FK → proposals)
  client_id: uuid (FK → clients)
  provider: 'stripe' | 'mercadopago'
  provider_link_id: string
  url: string
  amount: number
  status: 'active' | 'paid' | 'expired' | 'cancelled'
  expires_at: timestamp
  paid_at: timestamp | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/checkout/create-link`, `/api/webhooks/stripe`, `/api/webhooks/mercadopago`

---

### checkout_orders
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Orders criados durante checkout flow

```typescript
{
  id: uuid (PK)
  client_id: uuid (FK → clients)
  lead_id: uuid (FK → leads) | null
  product_id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  payment_method: 'pix' | 'credit_card' | 'bank_transfer'
  payment_link_id: uuid (FK → payment_links) | null
  metadata: jsonb
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/checkout/create`, `/api/checkout/confirm`

---

### payments
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Registro de pagamentos processados

```typescript
{
  id: uuid (PK)
  order_id: uuid (FK → checkout_orders)
  provider: 'stripe' | 'mercadopago'
  provider_payment_id: string
  amount: number
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  payment_method: string
  paid_at: timestamp | null
  refunded_at: timestamp | null
  metadata: jsonb
  created_at: timestamp
}
```

**APIs que usam:** `/api/webhooks/stripe`, `/api/webhooks/mercadopago`

---

## DOCUMENT GENERATION

### generated_documents
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Documentos gerados via AI

```typescript
{
  id: uuid (PK)
  client_id: uuid (FK → clients)
  case_id: uuid (FK → legal_cases) | null
  template_id: uuid (FK → document_templates) | null
  document_type: string // 'petition', 'contract', 'memorandum', etc
  title: string
  content: text // HTML or Markdown
  format: 'html' | 'markdown' | 'pdf'
  file_url: string | null // Supabase Storage URL
  status: 'draft' | 'review' | 'approved' | 'sent'
  generated_by: 'ai' | 'manual'
  reviewed_by: uuid (FK → profiles) | null
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/documents/generate`, `/api/documents/[id]`

---

### document_templates
**Status:** ✅ FUNCIONAL (90%)
**Uso:** Templates para geração de documentos

```typescript
{
  id: uuid (PK)
  name: string
  document_type: string
  practice_area: string
  template_content: text // Markdown with {{variables}}
  variables: string[] // ['client_name', 'case_number', etc]
  status: 'active' | 'inactive'
  created_by: uuid (FK → profiles)
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/documents/templates`

---

### document_revisions
**Status:** ✅ FUNCIONAL (85%)
**Uso:** Histórico de revisões de documentos

```typescript
{
  id: uuid (PK)
  document_id: uuid (FK → generated_documents)
  revision_number: number
  content: text
  changed_by: uuid (FK → profiles)
  change_summary: text | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/documents/[id]/revisions`

---

## CASE MANAGEMENT

### legal_cases
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Processos jurídicos ativos

```typescript
{
  id: uuid (PK)
  client_id: uuid (FK → clients)
  case_number: string // Número do processo (CNJ)
  case_type: string // 'civil', 'criminal', 'family', 'corporate', etc
  practice_area: string
  court: string
  judge: string | null
  status: 'active' | 'pending' | 'archived' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to: uuid (FK → profiles)
  value: number | null
  opened_at: date
  closed_at: date | null
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/cases`, `/api/cases/[id]`

---

### processes
**Status:** ✅ FUNCIONAL (90%)
**Uso:** Andamentos processuais

```typescript
{
  id: uuid (PK)
  case_id: uuid (FK → legal_cases)
  process_type: string // 'hearing', 'filing', 'decision', etc
  description: text
  date: date
  notes: text | null
  created_by: uuid (FK → profiles)
  created_at: timestamp
}
```

**APIs que usam:** `/api/cases/[id]/processes`

---

### deadlines
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Master table de deadlines/prazos

```typescript
{
  id: uuid (PK)
  title: string
  description: text | null
  due_date: timestamp
  type: 'legal' | 'administrative' | 'client' | 'internal'
  status: 'pending' | 'completed' | 'overdue' | 'cancelled'
  assigned_to: uuid (FK → profiles)
  created_by: uuid (FK → profiles)
  completed_at: timestamp | null
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/deadlines`, `/api/cron/sync-calendar`

---

### case_deadlines
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Prazos específicos de processos

```typescript
{
  id: uuid (PK)
  case_id: uuid (FK → legal_cases)
  deadline_id: uuid (FK → deadlines)
  calendar_event_id: string | null // Google Calendar event ID
  synced_at: timestamp | null
}
```

**APIs que usam:** `/api/cases/[id]/deadlines`, `/api/cron/sync-calendar`

---

## MARKETING & CONTENT

### scheduled_posts
**Status:** ⚠️ PARCIAL (50%)
**Uso:** Agendamento de posts marketing

```typescript
{
  id: uuid (PK)
  content: text
  platform: 'instagram' | 'facebook' | 'linkedin' | 'twitter'
  scheduled_for: timestamp
  status: 'scheduled' | 'published' | 'failed' | 'cancelled'
  published_at: timestamp | null
  media_urls: string[]
  hashtags: string[]
  created_by: uuid (FK → profiles)
  created_at: timestamp
}
```

**APIs que usam:** `/api/marketing/schedule-post` (⚠️ NEEDS TESTING)

---

### content_campaigns
**Status:** ⚠️ PARCIAL (40%)
**Uso:** Campanhas de marketing planejadas

```typescript
{
  id: uuid (PK)
  name: string
  description: text
  start_date: date
  end_date: date
  status: 'draft' | 'active' | 'paused' | 'completed'
  target_audience: jsonb
  budget: number | null
  created_by: uuid (FK → profiles)
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/marketing/campaigns` (⚠️ NEEDS TESTING)

---

## AGENT SYSTEM

### agent_metrics
**Status:** ✅ FUNCIONAL (90%)
**Uso:** Métricas de performance dos AI agents

```typescript
{
  id: uuid (PK)
  agent_id: string // 'qualification-agent', 'document-agent', etc
  metric_type: 'qualification' | 'document_generation' | 'lead_scoring' | 'chat'
  value: jsonb // {score, duration, success_rate, etc}
  lead_id: uuid (FK → leads) | null
  session_id: uuid (FK → qualification_sessions) | null
  timestamp: timestamp
  created_at: timestamp
}
```

**APIs que usam:** `/api/admin/analytics/agents`

---

### agent_alerts
**Status:** ✅ FUNCIONAL (85%)
**Uso:** Alertas gerados por agents

```typescript
{
  id: uuid (PK)
  agent_id: string
  alert_type: 'low_confidence' | 'escalation_needed' | 'error' | 'anomaly'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: text
  context: jsonb
  lead_id: uuid (FK → leads) | null
  resolved: boolean
  resolved_by: uuid (FK → profiles) | null
  resolved_at: timestamp | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/admin/alerts`

---

### agent_decisions
**Status:** ✅ FUNCIONAL (80%)
**Uso:** Log de decisões tomadas por AI agents

```typescript
{
  id: uuid (PK)
  agent_id: string
  decision_type: string // 'product_recommendation', 'urgency_level', 'qualification_score'
  input_data: jsonb
  output_data: jsonb
  confidence_score: number (0-1)
  lead_id: uuid (FK → leads) | null
  session_id: uuid (FK → qualification_sessions) | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/admin/analytics/agents`

---

## PARTNER SYSTEM

### partners
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Parceiros/afiliados

```typescript
{
  id: uuid (PK)
  profile_id: uuid (FK → profiles)
  company_name: string
  business_type: string
  commission_rate: number // Percentage
  status: 'active' | 'inactive' | 'pending_approval'
  total_referrals: number
  total_commission: number
  payment_details: jsonb // Bank account, PIX, etc
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/partners/register`, `/api/admin/partners`

---

### referrals
**Status:** ✅ FUNCIONAL (90%)
**Uso:** Indicações de parceiros

```typescript
{
  id: uuid (PK)
  partner_id: uuid (FK → partners)
  lead_id: uuid (FK → leads)
  client_id: uuid (FK → clients) | null
  status: 'pending' | 'qualified' | 'converted' | 'lost'
  conversion_value: number | null
  converted_at: timestamp | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/contact` (tracking source), `/api/admin/partners/referrals`

---

### partner_commissions
**Status:** ✅ FUNCIONAL (85%)
**Uso:** Comissões devidas aos parceiros

```typescript
{
  id: uuid (PK)
  partner_id: uuid (FK → partners)
  referral_id: uuid (FK → referrals)
  payment_id: uuid (FK → payments)
  commission_amount: number
  status: 'pending' | 'approved' | 'paid' | 'cancelled'
  paid_at: timestamp | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/admin/partners/commissions`

---

## NOTIFICATIONS & SETTINGS

### notifications
**Status:** ✅ FUNCIONAL (90%)
**Uso:** Notificações in-app

```typescript
{
  id: uuid (PK)
  user_id: uuid (FK → profiles)
  type: 'lead' | 'deadline' | 'payment' | 'system' | 'agent_alert'
  title: string
  message: text
  action_url: string | null
  read: boolean
  read_at: timestamp | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/notifications`, `/api/notifications/mark-read`

---

### settings
**Status:** ❌ NÃO IMPLEMENTADO (0%)
**Uso:** Configurações globais do sistema

```typescript
{
  id: uuid (PK)
  key: string (UNIQUE)
  value: jsonb
  category: 'general' | 'ai' | 'integrations' | 'payments' | 'notifications'
  description: text | null
  updated_by: uuid (FK → profiles)
  updated_at: timestamp
  created_at: timestamp
}
```

**APIs que usam:** `/api/admin/settings` (❌ NÃO EXISTE)

---

## EMAIL & COMMUNICATION

### email_sequences
**Status:** ⚠️ PARCIAL (60%)
**Uso:** Sequências de email automáticas

```typescript
{
  id: uuid (PK)
  name: string
  trigger: 'lead_created' | 'qualified' | 'proposal_sent' | 'payment_received'
  emails: jsonb[] // [{subject, body, delay_hours}]
  status: 'active' | 'inactive'
  created_by: uuid (FK → profiles)
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/email/sequences` (⚠️ NEEDS RESEND_API_KEY)

---

### sent_emails
**Status:** ⚠️ PARCIAL (70%)
**Uso:** Log de emails enviados

```typescript
{
  id: uuid (PK)
  lead_id: uuid (FK → leads) | null
  client_id: uuid (FK → clients) | null
  sequence_id: uuid (FK → email_sequences) | null
  email_to: string
  subject: string
  body: text
  provider: 'resend' | 'smtp'
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced'
  sent_at: timestamp | null
  opened_at: timestamp | null
  clicked_at: timestamp | null
  created_at: timestamp
}
```

**APIs que usam:** `/api/email/send` (⚠️ NEEDS CONFIG)

---

## ACTIVITY LOGS

### activity_logs
**Status:** ✅ FUNCIONAL (95%)
**Uso:** Log de atividades de usuários

```typescript
{
  id: uuid (PK)
  user_id: uuid (FK → profiles)
  action: string // 'lead_created', 'document_generated', etc
  entity_type: string // 'lead', 'client', 'document', etc
  entity_id: uuid
  metadata: jsonb
  ip_address: string | null
  user_agent: string | null
  created_at: timestamp
}
```

**APIs que usam:** Middleware de auditoria automática

---

### audit_logs
**Status:** ✅ FUNCIONAL (90%)
**Uso:** Auditoria de mudanças críticas

```typescript
{
  id: uuid (PK)
  user_id: uuid (FK → profiles)
  table_name: string
  record_id: uuid
  action: 'INSERT' | 'UPDATE' | 'DELETE'
  old_values: jsonb | null
  new_values: jsonb
  created_at: timestamp
}
```

**APIs que usam:** Database triggers (PostgreSQL)

---

### ai_analysis_logs
**Status:** ✅ FUNCIONAL (85%)
**Uso:** Log de análises da IA

```typescript
{
  id: uuid (PK)
  agent_id: string
  analysis_type: string
  input_data: jsonb
  output_data: jsonb
  model_used: string // 'gpt-4', 'gpt-3.5-turbo', etc
  tokens_used: number
  cost: number
  duration_ms: number
  lead_id: uuid (FK → leads) | null
  created_at: timestamp
}
```

**APIs que usam:** AI wrapper functions

---

## WHATSAPP INTEGRATION

### whatsapp_conversations
**Status:** ⚠️ PARCIAL (40%)
**Uso:** Conversas WhatsApp

```typescript
{
  id: uuid (PK)
  lead_id: uuid (FK → leads)
  phone_number: string
  messages: jsonb[] // {from, to, text, timestamp, media_url}
  status: 'active' | 'archived'
  last_message_at: timestamp
  created_at: timestamp
  updated_at: timestamp
}
```

**APIs que usam:** `/api/whatsapp/webhook` (⚠️ NEEDS TWILIO CONFIG)

---

### whatsapp_templates
**Status:** ⚠️ PARCIAL (30%)
**Uso:** Templates aprovados WhatsApp

```typescript
{
  id: uuid (PK)
  name: string
  template_id: string // Twilio template ID
  content: text
  variables: string[]
  status: 'approved' | 'pending' | 'rejected'
  created_at: timestamp
}
```

**APIs que usam:** `/api/whatsapp/send` (⚠️ NEEDS CONFIG)

---

## SUMÁRIO DE STATUS

| Categoria | Total Tables | ✅ Funcional | ⚠️ Parcial | ❌ Não Implementado |
|-----------|--------------|-------------|-----------|---------------------|
| Core | 4 | 4 | 0 | 0 |
| Qualification | 4 | 4 | 0 | 0 |
| Sales | 4 | 4 | 0 | 0 |
| Documents | 3 | 2 | 1 | 0 |
| Cases | 4 | 4 | 0 | 0 |
| Marketing | 2 | 0 | 2 | 0 |
| Agents | 3 | 3 | 0 | 0 |
| Partners | 3 | 3 | 0 | 0 |
| Notifications | 2 | 1 | 0 | 1 |
| Email | 2 | 0 | 2 | 0 |
| Logs | 3 | 3 | 0 | 0 |
| WhatsApp | 2 | 0 | 2 | 0 |
| **TOTAL** | **36+** | **28** | **7** | **1** |

**Taxa de Implementação Real:** 77.8% (28/36)
**Com Parciais:** 97.2% (35/36)

---

**Próximo:** Ver `API_INVENTORY.md` para detalhes de endpoints
