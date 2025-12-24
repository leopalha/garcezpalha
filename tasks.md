# TASKS - GARCEZ PALHA PLATFORM v2.0
## Sistema de Inteligência Jurídica

**Última atualização:** 2024-12-24
**Modelo:** G4 (8/8 Fases Completas)
**Meta:** R$ 75.000 MRR em 6 meses
**Site:** https://garcezpalha.com

---

## RESUMO EXECUTIVO

| Status | Descrição |
|--------|-----------|
| Build | ✅ 0 erros TypeScript, 146 rotas |
| Deploy | ✅ Produção em garcezpalha.com |
| G4 Sistema | ✅ 8/8 fases completas (~14,500 linhas) |
| Agentes IA | ✅ 8 agentes especializados + orquestrador |
| Qualificação | ✅ Sistema completo com scoring |
| Pagamentos | 🟡 Webhooks pendentes de teste real |
| Testes | 🔴 0% cobertura automatizada |

---

## 🔴 SPRINT 0: CORREÇÕES CRÍTICAS IMEDIATAS

> **Prioridade:** BLOQUEIAM PRODUÇÃO
> **Prazo:** 1-2 dias

### 0.1 Webhooks de Pagamento

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| 0.1.1 | Testar webhook Stripe em produção | `api/webhooks/stripe/route.ts` | ⏳ |
| 0.1.2 | Testar webhook MercadoPago em produção | `api/webhooks/mercadopago/route.ts` | ⏳ |
| 0.1.3 | Executar migration checkout_orders | `018_checkout_orders.sql` | ⏳ |
| 0.1.4 | Configurar MERCADOPAGO_ACCESS_TOKEN | Vercel env vars | ⏳ |
| 0.1.5 | Configurar STRIPE_WEBHOOK_SECRET | Vercel env vars | ⏳ |

### 0.2 TODOs Críticos no Código

| # | Tarefa | Arquivo | Linha |
|---|--------|---------|-------|
| 0.2.1 | Implementar download de proposta | `leads-list.tsx` | 247 |
| 0.2.2 | Implementar filtro de leads | `leads-filters.tsx` | 18 |
| 0.2.3 | Get reviewer from session | `admin/documentos/page.tsx` | 157 |
| 0.2.4 | Armazenar histórico de chat no DB | `api/chat/route.ts` | 74 |
| 0.2.5 | Enviar email de verificação signup | `api/auth/signup/route.ts` | 73 |
| 0.2.6 | Enviar email reset password | `api/auth/forgot-password/route.ts` | 55 |

---

## 🟡 SPRINT 1: PERGUNTAS DE QUALIFICAÇÃO FALTANTES

> **Prioridade:** ALTA - Só existe para Financeiro
> **Prazo:** 3-5 dias

### 1.1 Criar Perguntas por Categoria

Atualmente só existe `financial-protection-questions.ts`. Faltam:

| # | Arquivo a Criar | Produtos | Perguntas |
|---|-----------------|----------|-----------|
| 1.1.1 | `patrimonial-questions.ts` | Usucapião, Holding, Inventário, Regularização | ~15 perguntas |
| 1.1.2 | `health-insurance-questions.ts` | Plano Saúde, TEA, Bariátrica | ~12 perguntas |
| 1.1.3 | `social-security-questions.ts` | BPC LOAS, Aposentadoria, Auxílio-Doença | ~10 perguntas |
| 1.1.4 | `criminal-questions.ts` | Defesa Criminal, Habeas Corpus | ~8 perguntas |
| 1.1.5 | `expertise-questions.ts` | Grafotécnica, Avaliação Imóveis, Perícia Médica | ~10 perguntas |

### 1.2 Estrutura de Cada Arquivo

```typescript
// Padrão a seguir (ver financial-protection-questions.ts)
export const [PRODUTO]_QUESTIONS: QualificationQuestion[] = [
  {
    id: string,
    text: string,
    type: 'single-choice' | 'multiple-choice' | 'text' | 'currency' | 'date',
    priority: 'required' | 'important' | 'optional',
    options?: Option[],
    validation?: Validation,
    helpText?: string
  }
]
```

### 1.3 Atualizar Question Engine

| # | Tarefa | Arquivo |
|---|--------|---------|
| 1.3.1 | Importar novas perguntas no index | `qualification/index.ts` |
| 1.3.2 | Atualizar getQuestionsForProduct | `question-engine.ts` |
| 1.3.3 | Atualizar calculateScore para novos produtos | `score-calculator.ts` |

---

## 🟡 SPRINT 2: CRON JOBS FALTANTES

> **Prioridade:** ALTA - Automação não funciona sem isso
> **Prazo:** 3-5 dias

### 2.1 Cron Jobs Existentes (Verificar Funcionamento)

| # | Cron Job | Status | Schedule |
|---|----------|--------|----------|
| 2.1.1 | `/api/cron/monitor-emails` | ⚠️ Verificar | - |
| 2.1.2 | `/api/cron/deadline-reminders` | ⚠️ Verificar | - |
| 2.1.3 | `/api/cron/sync-calendar` | ⚠️ Verificar | - |
| 2.1.4 | `/api/cron/appointment-automation` | ⚠️ Verificar | - |
| 2.1.5 | `/api/cron/partner-reports` | ⚠️ Verificar | - |
| 2.1.6 | `/api/cron/email-sequences` | ⚠️ Verificar | - |

### 2.2 Cron Jobs a Criar

| # | Arquivo | Função | Schedule |
|---|---------|--------|----------|
| 2.2.1 | `/api/cron/cleanup-sessions/route.ts` | Limpar sessions expiradas | Diário 3h |
| 2.2.2 | `/api/cron/send-follow-ups/route.ts` | Enviar follow-ups agendados | A cada 30min |
| 2.2.3 | `/api/cron/payment-reminders/route.ts` | Lembrar pagamentos pendentes | Diário 9h/18h |
| 2.2.4 | `/api/cron/escalate-hot-leads/route.ts` | Alertar leads hot sem contato | A cada hora |
| 2.2.5 | `/api/cron/daily-report/route.ts` | Relatório diário via Telegram | Diário 8h |

### 2.3 Configurar Vercel Cron

```json
// vercel.json
{
  "crons": [
    { "path": "/api/cron/cleanup-sessions", "schedule": "0 3 * * *" },
    { "path": "/api/cron/send-follow-ups", "schedule": "*/30 * * * *" },
    { "path": "/api/cron/payment-reminders", "schedule": "0 9,18 * * *" },
    { "path": "/api/cron/escalate-hot-leads", "schedule": "0 * * * *" },
    { "path": "/api/cron/daily-report", "schedule": "0 8 * * *" }
  ]
}
```

---

## 🟡 SPRINT 3: SMS SERVICE

> **Prioridade:** MÉDIA
> **Prazo:** 2-3 dias

### 3.1 Implementar SMS Real

O arquivo `src/lib/sms/sms-service.ts` tem TODO:

```
* TODO: Implement actual SMS integration (Twilio, AWS SNS, etc.)
```

| # | Tarefa | Detalhes |
|---|--------|----------|
| 3.1.1 | Escolher provider (Twilio/AWS SNS/Zenvia) | Custo-benefício Brasil |
| 3.1.2 | Criar conta e configurar API | Credentials no .env |
| 3.1.3 | Implementar sendSMS real | `sms-service.ts` |
| 3.1.4 | Testar envio em produção | Número real |
| 3.1.5 | Criar templates SMS | Follow-ups, lembretes |

---

## 🟡 SPRINT 4: TESTES AUTOMATIZADOS

> **Prioridade:** MÉDIA
> **Prazo:** 1 semana

### 4.1 Setup Jest

| # | Tarefa | Arquivo |
|---|--------|---------|
| 4.1.1 | Configurar jest.config.js | ✅ Existe |
| 4.1.2 | Configurar jest.setup.js | ✅ Existe |
| 4.1.3 | Adicionar scripts no package.json | `"test": "jest"` |
| 4.1.4 | Criar primeiro teste | `__tests__/example.test.ts` |

### 4.2 Testes Unit Prioritários

| # | Arquivo | Testes |
|---|---------|--------|
| 4.2.1 | `lib/validators/document.ts` | validateCPF, validateCNPJ |
| 4.2.2 | `lib/ai/qualification/score-calculator.ts` | calculateScore |
| 4.2.3 | `lib/ai/qualification/lead-qualifier.ts` | qualifyLead |
| 4.2.4 | `lib/ai/qualification/proposal-generator.ts` | generateProposal |
| 4.2.5 | `lib/ai/agents/agent-orchestrator.ts` | routeMessage |

### 4.3 Testes de Integração

| # | Teste | Fluxo |
|---|-------|-------|
| 4.3.1 | Qualificação completa | Chat → Perguntas → Score → Proposta |
| 4.3.2 | Pagamento | Link → Webhook → Update DB |
| 4.3.3 | Geração documento | Template → IA → DOCX |

---

## 🟡 SPRINT 5: PÁGINAS DE PRODUTO INCOMPLETAS

> **Prioridade:** MÉDIA
> **Prazo:** 3-5 dias

### 5.1 Páginas com Conteúdo Mínimo (231B)

Estas páginas existem mas têm conteúdo placeholder:

| # | Página | Status |
|---|--------|--------|
| 5.1.1 | `/criminal` | 231B - placeholder |
| 5.1.2 | `/patrimonial` | 231B - placeholder |
| 5.1.3 | `/saude` | 231B - placeholder |
| 5.1.4 | `/pericia` | 232B - placeholder |
| 5.1.5 | `/equipe` | 231B - placeholder |
| 5.1.6 | `/parcerias` | 231B - placeholder |

### 5.2 Páginas de Serviços Legadas

Migrar para o novo padrão G4:

| # | Página Legacy | Migrar Para |
|---|---------------|-------------|
| 5.2.1 | `/servicos/avaliacao-imoveis` | `/patrimonial/avaliacao-imoveis` |
| 5.2.2 | `/servicos/direito-criminal` | `/criminal/direito-criminal` |
| 5.2.3 | `/servicos/direito-imobiliario` | `/patrimonial/direito-imobiliario` |
| 5.2.4 | `/servicos/pericia-documentos` | `/pericia/pericia-documental` |
| 5.2.5 | `/servicos/pericia-medica` | `/saude/pericia-medica` |
| 5.2.6 | `/servicos/secretaria-remota` | `/automacao/secretaria-remota` |

---

## 🟡 SPRINT 6: INTEGRAÇÕES EXTERNAS PENDENTES

> **Prioridade:** MÉDIA
> **Prazo:** 1-2 semanas

### 6.1 ClickSign/ZapSign Webhook

TODOs no arquivo `api/clicksign/webhook/route.ts`:

| # | Tarefa | Linha |
|---|--------|-------|
| 6.1.1 | Criar payment link após assinatura | 151 |
| 6.1.2 | Enviar email com contrato | 155 |

### 6.2 Judit.io Integration

| # | Tarefa | Prioridade |
|---|--------|------------|
| 6.2.1 | Criar lib/monitoring/judit-service.ts | Quando > 50 processos |
| 6.2.2 | Webhook para movimentações | - |
| 6.2.3 | Sync diário | - |

### 6.3 Google Calendar Completo

| # | Tarefa | Arquivo |
|---|--------|---------|
| 6.3.1 | Sync bidirecional | `lib/calendar/google-calendar-service.ts` |
| 6.3.2 | Criar eventos de prazos | - |
| 6.3.3 | Deletar quando resolvido | - |

---

## 🟡 SPRINT 7: ANALYTICS AVANÇADO

> **Prioridade:** BAIXA
> **Prazo:** 1 semana

### 7.1 TODOs em Analytics

`lib/analytics/advanced-metrics.ts`:

| # | Tarefa | Linha |
|---|--------|-------|
| 7.1.1 | Get actual marketing costs from database | 111 |
| 7.1.2 | Implement recurring revenue tracking | 139 |

### 7.2 Novas Métricas

| # | Métrica | Descrição |
|---|---------|-----------|
| 7.2.1 | CAC real por fonte | ROI por canal |
| 7.2.2 | Cohort analysis | Retention por mês |
| 7.2.3 | Revenue forecasting | Projeção MRR |
| 7.2.4 | A/B testing framework | Feature flags |

---

## 🟡 SPRINT 8: SUPABASE REALTIME

> **Prioridade:** BAIXA
> **Prazo:** 1 semana

### 8.1 Implementar Real-time

| # | Tarefa | Descrição |
|---|--------|-----------|
| 8.1.1 | Habilitar Realtime no Supabase | Config no dashboard |
| 8.1.2 | Subscribe to leads table | Live feed novos leads |
| 8.1.3 | Live updates de status | Dashboard admin |
| 8.1.4 | Toast notifications | Novos leads, pagamentos |
| 8.1.5 | Typing indicators chat | UX melhorada |

---

## 🟢 SPRINT 9: OTIMIZAÇÃO & POLIMENTO

> **Prioridade:** BAIXA (após validação de mercado)
> **Prazo:** Contínuo

### 9.1 Performance

| # | Tarefa | Impacto |
|---|--------|---------|
| 9.1.1 | Query profiling Supabase | Latência |
| 9.1.2 | Bundle size optimization | Load time |
| 9.1.3 | Image CDN | Bandwidth |
| 9.1.4 | Response caching | API speed |

### 9.2 Security Hardening

| # | Tarefa | Tipo |
|---|--------|------|
| 9.2.1 | Rate limiting por IP | API |
| 9.2.2 | 2FA para admin | Auth |
| 9.2.3 | RLS policies audit | Database |
| 9.2.4 | LGPD full compliance | Legal |

### 9.3 SEO & Performance

| # | Tarefa | Impacto |
|---|--------|---------|
| 9.3.1 | Core Web Vitals | Google ranking |
| 9.3.2 | Schema markup todas páginas | Rich snippets |
| 9.3.3 | Blog posts SEO | Tráfego orgânico |

---

## CHECKLIST DE DEPLOY PRODUÇÃO

### Variáveis de Ambiente Obrigatórias

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=✅
SUPABASE_SERVICE_ROLE_KEY=✅

# AI
OPENAI_API_KEY=✅ (via OpenRouter)

# Pagamentos
MERCADOPAGO_ACCESS_TOKEN=⚠️ Verificar
MERCADOPAGO_PUBLIC_KEY=⚠️ Verificar
STRIPE_SECRET_KEY=⚠️ Verificar
STRIPE_WEBHOOK_SECRET=⚠️ Verificar
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=⚠️ Verificar

# Email
RESEND_API_KEY=✅

# Auth
NEXTAUTH_SECRET=✅
NEXTAUTH_URL=✅

# WhatsApp (opcional)
WHATSAPP_ACCESS_TOKEN=⏳
WHATSAPP_PHONE_NUMBER_ID=⏳

# Telegram (opcional)
TELEGRAM_BOT_TOKEN=⏳
```

### Migrations Pendentes

```sql
-- Executar em produção:
supabase/migrations/018_checkout_orders.sql
```

---

## CRONOGRAMA RECOMENDADO

| Semana | Sprint | Foco | Resultado |
|--------|--------|------|-----------|
| 1 | 0 | Correções críticas | Pagamentos funcionando |
| 2 | 1 | Perguntas qualificação | Todos produtos qualificáveis |
| 3 | 2 | Cron jobs | Automação ativa |
| 4 | 3-4 | SMS + Testes | Cobertura básica |
| 5 | 5 | Páginas produto | UX completa |
| 6-7 | 6 | Integrações | Sistema integrado |
| 8+ | 7-9 | Otimização | Performance |

---

## MÉTRICAS DE SUCESSO

### KPIs Técnicos

| Métrica | Meta | Atual |
|---------|------|-------|
| Build errors | 0 | ✅ 0 |
| TypeScript errors | 0 | ✅ 0 |
| Test coverage | > 60% | ❌ 0% |
| API latency | < 200ms | ⏳ |
| Uptime | > 99.9% | ⏳ |

### KPIs de Negócio

| Métrica | Meta | Atual |
|---------|------|-------|
| Taxa qualificação | > 60% | ⏳ |
| Conversão lead→cliente | > 15% | ⏳ |
| MRR | R$ 75.000 | ⏳ |
| NPS | > 70 | ⏳ |

---

## LEGENDA

| Símbolo | Significado |
|---------|-------------|
| ✅ | Completo |
| ⏳ | Pendente |
| ⚠️ | Verificar |
| 🔴 | Crítico |
| 🟡 | Alta/Média |
| 🟢 | Baixa |

---

## 🚀 SPRINT IA VERTICAL - Transformação para Plataforma Autônoma

> **Missão:** Transformar a plataforma de Nível 1 (Semi-Automático) para Nível 3-4 (IA Vertical Autônoma)
> **Estado Atual:** 8 agentes jurídicos especializados + orquestrador
> **Meta:** Marketing, conteúdo e decisões 100% automatizados

### Arquitetura Alvo

```
                              ┌──────────────┐
                              │   CEO IA     │
                              │ (Orquestrador│
                              │  Estratégico)│
                              └──────┬───────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
    ┌─────▼─────┐             ┌──────▼──────┐            ┌─────▼─────┐
    │  COO IA   │             │   CMO IA    │            │  CFO IA   │
    │(Operações)│             │ (Marketing) │            │(Finanças) │
    └─────┬─────┘             └──────┬──────┘            └─────┬─────┘
          │                          │                          │
    ┌─────┴─────┐          ┌─────────┼─────────┐         ┌─────┴─────┐
    │           │          │         │         │         │           │
┌───▼───┐ ┌───▼───┐  ┌────▼────┐ ┌──▼──┐ ┌───▼───┐ ┌───▼───┐ ┌───▼───┐
│Triagem│ │Produção│ │Ads Agent│ │SEO  │ │Content│ │Pricing│ │Revenue│
│ Agent │ │ Agent  │ │(Google/ │ │Agent│ │ Agent │ │ Agent │ │ Agent │
└───────┘ └────────┘ │ Meta)   │ └─────┘ └───────┘ └───────┘ └───────┘
                     └─────────┘
```

### FASE 1: Fundação e Core (Semana 1-2)

> **Prioridade:** P0 - Base para todos os agentes

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V1.1.1 | **[P0]** Criar enhanced-base-agent.ts com logging e métricas | `src/lib/ai/agents/core/enhanced-base-agent.ts` | ✅ |
| V1.1.2 | **[P0]** Criar executive-orchestrator.ts multi-agente | `src/lib/ai/agents/core/executive-orchestrator.ts` | ✅ |
| V1.1.3 | **[P0]** Criar agent-types.ts com tipos executivos | `src/lib/ai/agents/core/agent-types.ts` | ✅ |
| V1.1.4 | **[P1]** Criar agent-utils.ts (helpers compartilhados) | `src/lib/ai/agents/core/agent-utils.ts` | ⏳ |
| V1.1.5 | **[P1]** Criar agent-logger.ts (logging estruturado) | `src/lib/ai/agents/core/agent-logger.ts` | ✅ |
| V1.1.6 | **[P1]** Criar agent-metrics.ts (performance tracking) | `src/lib/ai/agents/core/agent-metrics.ts` | ✅ |
| V1.1.7 | **[P2]** Testes unitários para core | `__tests__/agents/core/` | ⏳ |

### FASE 2: Agentes Operacionais (Semana 3-4) ✅

> **Prioridade:** P1 - Qualidade e automação interna
> **Completado:** 2024-12-24

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V2.1.1 | **[P1]** Implementar QA Agent | `src/lib/ai/agents/operations/qa-agent.ts` | ✅ |
| V2.1.2 | Verificação OAB compliance | ↳ sub-tarefa | ✅ |
| V2.1.3 | Validação de precisão legal | ↳ sub-tarefa | ✅ |
| V2.1.4 | Verificação de gramática | ↳ sub-tarefa | ✅ |
| V2.1.5 | Análise de brand voice | ↳ sub-tarefa | ✅ |
| V2.1.6 | Pipeline completo de QA | ↳ sub-tarefa | ✅ |
| V2.1.7 | Batch review | ↳ sub-tarefa | ✅ |
| V2.2.1 | **[P1]** Implementar Admin Agent | `src/lib/ai/agents/operations/admin-agent.ts` | ✅ |
| V2.2.2 | Triagem de leads | ↳ sub-tarefa | ✅ |
| V2.2.3 | Geração de follow-ups | ↳ sub-tarefa | ✅ |
| V2.2.4 | Gestão de tarefas | ↳ sub-tarefa | ✅ |
| V2.2.5 | Priorização de tarefas | ↳ sub-tarefa | ✅ |
| V2.2.6 | Scheduling | ↳ sub-tarefa | ✅ |
| V2.2.7 | Relatórios diários/semanais | ↳ sub-tarefa | ✅ |
| V2.2.8 | Notificações | ↳ sub-tarefa | ✅ |
| V2.3.1 | **[P2]** Criar prompts operacionais | `src/lib/ai/prompts/operations/` | ✅ |
| V2.3.2 | Criar tabela agent_metrics | `supabase/migrations/021_agent_metrics.sql` | ✅ |

### FASE 3: Agentes de Marketing - Conteúdo (Semana 5-6) ✅

> **Prioridade:** P0 - Impacto direto em geração de leads
> **Completado:** 2024-12-24

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V3.1.1 | **[P0]** Implementar Content Agent | `src/lib/ai/agents/marketing/content-agent.ts` | ✅ |
| V3.1.2 | Geração de posts para Instagram | ↳ sub-tarefa | ✅ |
| V3.1.3 | Geração de posts para LinkedIn | ↳ sub-tarefa | ✅ |
| V3.1.4 | Geração de artigos de blog | ↳ sub-tarefa | ✅ |
| V3.1.5 | Geração de newsletters | ↳ sub-tarefa | ✅ |
| V3.1.6 | Calendário editorial automático | ↳ sub-tarefa | ✅ |
| V3.2.1 | **[P1]** Implementar Social Agent | `src/lib/ai/agents/marketing/social-agent.ts` | ✅ |
| V3.2.2 | Análise de engajamento | ↳ sub-tarefa | ✅ |
| V3.2.3 | Otimização de schedule | ↳ sub-tarefa | ✅ |
| V3.2.4 | Resposta a comentários | ↳ sub-tarefa | ✅ |
| V3.2.5 | Estratégia de hashtags | ↳ sub-tarefa | ✅ |
| V3.2.6 | Otimização por plataforma | ↳ sub-tarefa | ✅ |
| V3.3.1 | **[P0]** Criar prompts de marketing | `src/lib/ai/prompts/marketing/` | ✅ |
| V3.3.2 | Criar tabela scheduled_posts | `supabase/migrations/020_scheduled_posts.sql` | ✅ |
| V3.3.3 | Criar API para publicações | `src/app/api/content/` | ✅ |
| V3.3.4 | Cron job publicação automática | `src/app/api/cron/publish-content/` | ✅ |
| V3.3.5 | Cron job geração de conteúdo | `src/app/api/cron/content-generation/` | ✅ |

### FASE 4: Agentes de Marketing - Ads & SEO (Semana 7-8) ✅

> **Prioridade:** P0 - Otimização de ROI em tráfego pago
> **Completado:** 2024-12-24

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V4.1.1 | **[P0]** Implementar Ads Agent | `src/lib/ai/agents/marketing/ads-agent.ts` | ✅ |
| V4.1.2 | Criação campanhas Google Ads | ↳ sub-tarefa | ✅ |
| V4.1.3 | Criação campanhas Meta Ads | ↳ sub-tarefa | ✅ |
| V4.1.4 | Otimização de campanhas | ↳ sub-tarefa | ✅ |
| V4.1.5 | Análise de keywords | ↳ sub-tarefa | ✅ |
| V4.1.6 | Otimização de budget | ↳ sub-tarefa | ✅ |
| V4.1.7 | Relatórios semanais | ↳ sub-tarefa | ✅ |
| V4.1.8 | Análise de qualidade de leads | ↳ sub-tarefa | ✅ |
| V4.2.1 | **[P1]** Implementar SEO Agent | `src/lib/ai/agents/marketing/seo-agent.ts` | ✅ |
| V4.2.2 | Pesquisa de keywords | ↳ sub-tarefa | ✅ |
| V4.2.3 | Análise de content gaps | ↳ sub-tarefa | ✅ |
| V4.2.4 | Otimização on-page | ↳ sub-tarefa | ✅ |
| V4.2.5 | Content briefs SEO | ↳ sub-tarefa | ✅ |
| V4.2.6 | Auditoria técnica | ↳ sub-tarefa | ✅ |
| V4.2.7 | Auditoria SEO local | ↳ sub-tarefa | ✅ |
| V4.2.8 | Análise de backlinks | ↳ sub-tarefa | ✅ |
| V4.2.9 | Estratégia de link building | ↳ sub-tarefa | ✅ |
| V4.2.10 | Relatórios mensais | ↳ sub-tarefa | ✅ |
| V4.3.1 | **[P2]** Criar tabelas Ads/SEO | `supabase/migrations/022_ads_seo_tables.sql` | ✅ |
| V4.3.2 | **[P2]** APIs de Ads | `src/app/api/ads/` | ✅ |
| V4.3.3 | **[P2]** APIs de SEO | `src/app/api/seo/` | ✅ |
| V4.3.4 | **[P2]** Dashboard de Ads | `src/app/admin/marketing/ads/` | ⏳ |

### FASE 5: Agentes Multimídia (Semana 5-8 - Paralelo) ✅

> **Prioridade:** P2 - Escala de produção de conteúdo
> **Completado:** 2024-12-24

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V5.1.1 | **[P2]** Implementar Video Agent | `src/lib/ai/agents/marketing/video-agent.ts` | ✅ |
| V5.1.2 | Scripts para Reels/Shorts | ↳ sub-tarefa | ✅ |
| V5.1.3 | Scripts para YouTube | ↳ sub-tarefa | ✅ |
| V5.1.4 | Estrutura de Webinars | ↳ sub-tarefa | ✅ |
| V5.1.5 | Scripts para Stories | ↳ sub-tarefa | ✅ |
| V5.1.6 | Scripts de depoimentos | ↳ sub-tarefa | ✅ |
| V5.1.7 | SEO para vídeos | ↳ sub-tarefa | ✅ |
| V5.1.8 | Reaproveitamento de conteúdo | ↳ sub-tarefa | ✅ |
| V5.1.9 | Planejamento de séries | ↳ sub-tarefa | ✅ |
| V5.1.10 | Calendário de vídeos | ↳ sub-tarefa | ✅ |
| V5.2.1 | **[P2]** Implementar Design Agent | `src/lib/ai/agents/marketing/design-agent.ts` | ✅ |
| V5.2.2 | Design posts Instagram | ↳ sub-tarefa | ✅ |
| V5.2.3 | Design posts LinkedIn | ↳ sub-tarefa | ✅ |
| V5.2.4 | Design Stories | ↳ sub-tarefa | ✅ |
| V5.2.5 | Thumbnails para vídeos | ↳ sub-tarefa | ✅ |
| V5.2.6 | Capas de eBooks | ↳ sub-tarefa | ✅ |
| V5.2.7 | Infográficos jurídicos | ↳ sub-tarefa | ✅ |
| V5.2.8 | Templates de marca | ↳ sub-tarefa | ✅ |
| V5.2.9 | Templates de apresentação | ↳ sub-tarefa | ✅ |
| V5.3.1 | **[P2]** Criar prompts multimídia | `src/lib/ai/prompts/marketing/video-prompts.ts` | ✅ |
| V5.3.2 | **[P2]** Criar prompts design | `src/lib/ai/prompts/marketing/design-prompts.ts` | ✅ |

### FASE 6: Agentes de Inteligência (Semana 9-10) ✅

> **Prioridade:** P1 - Decisões data-driven
> **Completado:** 2024-12-24

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V6.1.1 | **[P1]** Implementar CFO Agent | `src/lib/ai/agents/executive/cfo-agent.ts` | ✅ |
| V6.1.2 | Monitoramento de fluxo de caixa | ↳ sub-tarefa | ✅ |
| V6.1.3 | Alertas de inadimplência | ↳ sub-tarefa | ✅ |
| V6.1.4 | DRE automático mensal | ↳ sub-tarefa | ✅ |
| V6.1.5 | Projeção de receita | ↳ sub-tarefa | ✅ |
| V6.2.1 | **[P1]** Implementar Pricing Agent | `src/lib/ai/agents/intelligence/pricing-agent.ts` | ✅ |
| V6.2.2 | Precificação dinâmica por demanda | ↳ sub-tarefa | ✅ |
| V6.2.3 | Ajuste por complexidade do caso | ↳ sub-tarefa | ✅ |
| V6.2.4 | Descontos automáticos por volume | ↳ sub-tarefa | ✅ |
| V6.3.1 | **[P2]** Implementar Market Intel Agent | `src/lib/ai/agents/intelligence/market-intel-agent.ts` | ✅ |
| V6.3.2 | Monitoramento de concorrentes | ↳ sub-tarefa | ✅ |
| V6.3.3 | Alertas de tendências legais | ↳ sub-tarefa | ✅ |
| V6.3.4 | Oportunidades de mercado | ↳ sub-tarefa | ✅ |
| V6.4.1 | **[P2]** Criar prompts CFO | `src/lib/ai/prompts/executive/cfo-prompts.ts` | ✅ |
| V6.4.2 | **[P2]** Criar prompts Pricing | `src/lib/ai/prompts/intelligence/pricing-prompts.ts` | ✅ |
| V6.4.3 | **[P2]** Criar prompts Market Intel | `src/lib/ai/prompts/intelligence/market-intel-prompts.ts` | ✅ |
| V6.4.4 | **[P2]** Criar index files | `src/lib/ai/agents/executive/index.ts`, `src/lib/ai/agents/intelligence/index.ts` | ✅ |

### FASE 7: CEO IA (Semana 11-12) ✅

> **Prioridade:** P0 - Orquestração estratégica
> **Completado:** 2024-12-24

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V7.1.1 | **[P0]** Implementar CEO Agent | `src/lib/ai/agents/executive/ceo-agent.ts` | ✅ |
| V7.1.2 | Briefing diário automático | ↳ sub-tarefa | ✅ |
| V7.1.3 | Alocação de recursos | ↳ sub-tarefa | ✅ |
| V7.1.4 | Decisões estratégicas assistidas | ↳ sub-tarefa | ✅ |
| V7.1.5 | Priorização automática de tarefas | ↳ sub-tarefa | ✅ |
| V7.2.1 | **[P0]** Implementar CMO Agent | `src/lib/ai/agents/executive/cmo-agent.ts` | ✅ |
| V7.2.2 | Coordenar Content, Ads, Social, SEO | ↳ sub-tarefa | ✅ |
| V7.2.3 | Budget allocation por canal | ↳ sub-tarefa | ✅ |
| V7.2.4 | Relatório de performance marketing | ↳ sub-tarefa | ✅ |
| V7.3.1 | **[P0]** Implementar COO Agent | `src/lib/ai/agents/executive/coo-agent.ts` | ✅ |
| V7.3.2 | Coordenar Triagem, Produção, QA | ↳ sub-tarefa | ✅ |
| V7.3.3 | SLA monitoring | ↳ sub-tarefa | ✅ |
| V7.3.4 | Escalation automática | ↳ sub-tarefa | ✅ |
| V7.4.1 | **[P0]** Dashboard de controle de autonomia | `src/app/admin/autonomy/` | ⏳ |
| V7.4.2 | Sistema de aprovações | ↳ sub-tarefa | ⏳ |
| V7.4.3 | Níveis de confiança por decisão | ↳ sub-tarefa | ⏳ |
| V7.5.1 | **[P2]** Criar prompts CEO | `src/lib/ai/prompts/executive/ceo-prompts.ts` | ✅ |
| V7.5.2 | **[P2]** Criar prompts CMO | `src/lib/ai/prompts/executive/cmo-prompts.ts` | ✅ |
| V7.5.3 | **[P2]** Criar prompts COO | `src/lib/ai/prompts/executive/coo-prompts.ts` | ✅ |
| V7.5.4 | **[P2]** Atualizar index files | `src/lib/ai/agents/executive/index.ts`, `src/lib/ai/prompts/executive/index.ts` | ✅ |

### FASE 8: Workflows e Automações (Semana 13-14)

> **Prioridade:** P1 - Conexão entre agentes

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V8.1.1 | **[P1]** Workflow: Morning Briefing | `src/lib/ai/workflows/daily/morning-briefing.ts` | ⏳ |
| V8.1.2 | **[P1]** Workflow: Content Schedule | `src/lib/ai/workflows/daily/content-schedule.ts` | ⏳ |
| V8.1.3 | **[P1]** Workflow: Ads Optimization | `src/lib/ai/workflows/daily/ads-optimization.ts` | ⏳ |
| V8.2.1 | **[P1]** Workflow: Weekly Performance | `src/lib/ai/workflows/weekly/performance-review.ts` | ⏳ |
| V8.2.2 | **[P1]** Workflow: Content Planning | `src/lib/ai/workflows/weekly/content-planning.ts` | ⏳ |
| V8.3.1 | **[P0]** Trigger: New Lead | `src/lib/ai/workflows/triggers/new-lead.ts` | ⏳ |
| V8.3.2 | **[P0]** Trigger: Payment Received | `src/lib/ai/workflows/triggers/payment-received.ts` | ⏳ |
| V8.3.3 | **[P1]** Trigger: Process Movement | `src/lib/ai/workflows/triggers/process-movement.ts` | ⏳ |

### FASE 9: Refinamento (Semana 15-16)

> **Prioridade:** P2 - Otimização e documentação

| # | Tarefa | Arquivo | Status |
|---|--------|---------|--------|
| V9.1.1 | **[P1]** A/B testing de prompts | Sistema de variantes | ⏳ |
| V9.1.2 | **[P1]** Otimização de temperatura por agente | Tuning de config | ⏳ |
| V9.2.1 | **[P2]** Dashboard avançado | `src/app/admin/ai-dashboard/` | ⏳ |
| V9.2.2 | **[P2]** Métricas em tempo real | WebSocket updates | ⏳ |
| V9.3.1 | **[P2]** Documentação completa dos agentes | `docs/agents/` | ⏳ |
| V9.3.2 | **[P2]** Runbook de operações | `docs/runbook.md` | ⏳ |

### Estrutura de Arquivos Alvo

```
src/lib/ai/
├── agents/
│   ├── core/
│   │   ├── enhanced-base-agent.ts    # Classe base melhorada
│   │   ├── executive-orchestrator.ts # Orquestrador multi-nível
│   │   ├── agent-types.ts            # Tipos TypeScript
│   │   ├── agent-utils.ts            # Utilitários
│   │   ├── agent-logger.ts           # Logging estruturado
│   │   └── agent-metrics.ts          # Métricas
│   │
│   ├── executive/
│   │   ├── ceo-agent.ts              # CEO IA
│   │   ├── coo-agent.ts              # COO IA (Operações)
│   │   ├── cmo-agent.ts              # CMO IA (Marketing)
│   │   └── cfo-agent.ts              # CFO IA (Finanças)
│   │
│   ├── marketing/
│   │   ├── ads-agent.ts              # Google/Meta Ads
│   │   ├── seo-agent.ts              # SEO orgânico
│   │   ├── content-agent.ts          # Produção de conteúdo
│   │   ├── social-agent.ts           # Redes sociais
│   │   ├── video-agent.ts            # Produção de vídeo
│   │   └── design-agent.ts           # Criação visual
│   │
│   ├── operations/
│   │   ├── qa-agent.ts               # Qualidade jurídica
│   │   └── admin-agent.ts            # Monitoramento
│   │
│   ├── intelligence/
│   │   ├── pricing-agent.ts          # Precificação dinâmica
│   │   └── market-intel-agent.ts     # Inteligência de mercado
│   │
│   └── legal/                        # (Existentes - 8 agentes)
│       ├── real-estate-agent.ts
│       ├── document-forensics-agent.ts
│       ├── property-valuation-agent.ts
│       ├── medical-expertise-agent.ts
│       ├── criminal-law-agent.ts
│       ├── financial-protection-agent.ts
│       ├── health-insurance-agent.ts
│       └── social-security-agent.ts
│
├── workflows/
│   ├── daily/
│   │   ├── morning-briefing.ts
│   │   ├── content-schedule.ts
│   │   └── ads-optimization.ts
│   ├── weekly/
│   │   ├── performance-review.ts
│   │   └── content-planning.ts
│   └── triggers/
│       ├── new-lead.ts
│       ├── payment-received.ts
│       └── process-movement.ts
│
└── prompts/
    ├── executive/
    │   ├── ceo-prompts.ts
    │   ├── coo-prompts.ts
    │   ├── cmo-prompts.ts
    │   └── cfo-prompts.ts
    ├── marketing/
    │   ├── content-prompts.ts
    │   ├── ads-prompts.ts
    │   ├── seo-prompts.ts
    │   └── social-prompts.ts
    └── operations/
        ├── qa-prompts.ts
        └── admin-prompts.ts
```

### Métricas de Sucesso IA Vertical

| Métrica | Meta Nível 3-4 | Atual (Nível 1) |
|---------|----------------|-----------------|
| % leads atendidos automaticamente | > 95% | ~60% |
| % conteúdo publicado sem intervenção | > 90% | 0% |
| Posts publicados/semana (automático) | > 21 | 0 |
| Tempo médio resposta ao lead | < 30s | ~5min |
| Taxa aprovação docs (1ª revisão) | > 90% | N/A |
| Decisões operacionais autônomas/dia | > 50 | 0 |
| ROI marketing (automático) | > 300% | Manual |

### Compliance e Segurança

| Requisito | Implementação |
|-----------|---------------|
| Normas OAB | Disclaimer em todo conteúdo gerado |
| LGPD | Anonimização de dados em logs |
| Qualidade Jurídica | QA Agent review obrigatório |
| Aprovação Humana | Decisões > R$ 1.000 ou novos clientes |
| Fallback Manual | Todos agentes têm modo manual |

---

## LEGENDA

| Símbolo | Significado |
|---------|-------------|
| ✅ | Completo |
| ⏳ | Pendente |
| ⚠️ | Verificar |
| 🔴 | Crítico |
| 🟡 | Alta/Média |
| 🟢 | Baixa |
| 🚀 | Sprint IA Vertical |

---

*tasks.md v3.2*
*Atualizado: 2024-12-24*
*Sistema G4: ✅ 8/8 fases completas*
*Sprint IA Vertical: 🚀 Fases 1-7 ✅ Completas*
*Próximo: Fase 8 (Workflows e Automações)*
