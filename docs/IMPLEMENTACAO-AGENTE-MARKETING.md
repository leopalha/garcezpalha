# PLANO DE IMPLEMENTAÇÃO: AGENTE DE MARKETING (PILOTO AUTOMÁTICO)

**Data:** 30/12/2024
**Versão:** 1.0
**Status:** Planejamento
**Autor:** Claude Code

---

## 📋 SUMÁRIO EXECUTIVO

Este documento detalha o plano completo de implementação para ativar o **Sistema de Marketing no Piloto Automático** da plataforma Garcez Palha.

### O Que Já Existe (95%)
- ✅ 6 agentes de marketing completos (Ads, Content, Social, SEO, Video, Design)
- ✅ 4 agentes executivos (CEO, CMO, CFO, COO)
- ✅ 8 workflows automatizados (3 diários, 2 semanais, 3 triggers)
- ✅ Sistema de qualificação de leads
- ✅ 89 rotas de API funcionais
- ✅ Integração com OpenAI, Google Ads, Meta Ads

### O Que Falta (5%)
- ❌ Interface admin para gerenciar agentes (`/admin/agentes/`)
- ❌ Workflows rodando em produção (configuração cron)
- ❌ Interface para geração de VSLs
- ❌ Dashboard de monitoramento de agentes
- ❌ Logs e analytics de performance dos agentes

---

## 🎯 OBJETIVO

Criar interface administrativa completa que permite:

1. **Gerenciar Agentes**: Ativar/desativar, configurar, monitorar
2. **Ativar Workflows**: Configurar horários, testar, executar
3. **Gerar VSLs**: Interface visual para criar Video Sales Letters
4. **Monitorar Performance**: Dashboard com métricas de cada agente
5. **Controlar Custos**: Tracking de gastos com OpenAI por agente

---

## 📂 ARQUITETURA DE ARQUIVOS

### Novos Arquivos a Criar

```
src/app/(admin)/admin/agentes/
├── page.tsx                           # Dashboard principal de agentes
├── [agentId]/
│   ├── page.tsx                       # Detalhes de agente específico
│   ├── configurar/page.tsx            # Configurações do agente
│   └── logs/page.tsx                  # Histórico de execuções
├── workflows/
│   ├── page.tsx                       # Lista de workflows
│   ├── [workflowId]/page.tsx          # Detalhes de workflow
│   └── criar/page.tsx                 # Criar novo workflow
└── vsl/
    ├── page.tsx                       # Lista de VSLs criadas
    ├── criar/page.tsx                 # Criador visual de VSL
    └── preview/[vslId]/page.tsx       # Preview da VSL

src/components/admin/agentes/
├── AgentCard.tsx                      # Card de agente com status
├── AgentStatusBadge.tsx               # Badge de status (ativo/pausado/erro)
├── WorkflowScheduler.tsx              # Agendador de workflows
├── VSLBuilder.tsx                     # Construtor visual de VSL
├── AgentMetricsChart.tsx              # Gráficos de performance
├── AgentCostTracker.tsx               # Rastreador de custos
└── LogViewer.tsx                      # Visualizador de logs

src/lib/ai/admin/
├── agent-manager.ts                   # Gerenciador de agentes
├── workflow-scheduler.ts              # Agendador de workflows
├── vsl-generator.ts                   # Gerador de VSL
└── agent-logger.ts                    # Sistema de logs (já existe)

src/app/api/admin/agentes/
├── route.ts                           # GET all agents, POST create
├── [agentId]/route.ts                 # GET/PUT/DELETE agent
├── [agentId]/toggle/route.ts          # POST toggle ativo/pausado
├── [agentId]/logs/route.ts            # GET logs do agente
└── [agentId]/metrics/route.ts         # GET métricas do agente

src/app/api/admin/workflows/
├── route.ts                           # GET all workflows
├── [workflowId]/route.ts              # GET/PUT/DELETE workflow
├── [workflowId]/execute/route.ts      # POST executar workflow
└── [workflowId]/schedule/route.ts     # POST agendar workflow

src/app/api/admin/vsl/
├── route.ts                           # GET all VSLs, POST create
├── [vslId]/route.ts                   # GET/PUT/DELETE VSL
└── [vslId]/generate/route.ts          # POST gerar vídeo da VSL

vercel.json                             # Configuração de cron jobs (CRÍTICO)
```

---

## 🗄️ SCHEMA DE BANCO DE DADOS

### Novas Tabelas Necessárias

```sql
-- Tabela de configuração de agentes
CREATE TABLE agent_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL UNIQUE, -- 'ads', 'content', 'social', etc.
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'marketing', 'executive', 'legal', 'operations'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'error'
  enabled BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}', -- Configurações específicas do agente
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de workflows
CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id TEXT NOT NULL UNIQUE, -- 'ads-optimization', 'content-schedule', etc.
  name TEXT NOT NULL,
  description TEXT,
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'on_trigger'
  schedule TEXT, -- Cron expression: '0 6 * * *'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  enabled BOOLEAN NOT NULL DEFAULT false, -- DESATIVADO por padrão
  timeout INTEGER NOT NULL DEFAULT 120000,
  retry_on_failure BOOLEAN NOT NULL DEFAULT true,
  max_retries INTEGER NOT NULL DEFAULT 2,
  notify_on_complete BOOLEAN NOT NULL DEFAULT false,
  notify_on_failure BOOLEAN NOT NULL DEFAULT true,
  agents JSONB NOT NULL DEFAULT '[]', -- Lista de agentes usados
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de execuções de workflows
CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id TEXT NOT NULL REFERENCES workflows(workflow_id),
  execution_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL, -- 'running', 'completed', 'failed', 'cancelled'
  triggered_by TEXT NOT NULL, -- 'schedule', 'manual', 'trigger'
  trigger_data JSONB,
  steps JSONB NOT NULL DEFAULT '[]',
  result JSONB,
  error TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration INTEGER, -- Milissegundos
  CONSTRAINT fk_workflow FOREIGN KEY (workflow_id) REFERENCES workflows(workflow_id) ON DELETE CASCADE
);

-- Tabela de logs de agentes
CREATE TABLE agent_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  level TEXT NOT NULL, -- 'info', 'warn', 'error', 'success'
  event TEXT NOT NULL, -- Nome do evento
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  execution_id TEXT, -- Referência a workflow_executions se aplicável
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de métricas de agentes
CREATE TABLE agent_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL,
  date DATE NOT NULL,
  executions INTEGER NOT NULL DEFAULT 0,
  successes INTEGER NOT NULL DEFAULT 0,
  failures INTEGER NOT NULL DEFAULT 0,
  total_duration INTEGER NOT NULL DEFAULT 0, -- Milissegundos
  openai_tokens INTEGER NOT NULL DEFAULT 0,
  openai_cost DECIMAL(10, 4) NOT NULL DEFAULT 0, -- USD
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agent_id, date)
);

-- Tabela de VSLs geradas
CREATE TABLE vsls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  target_audience TEXT NOT NULL, -- 'advogados', 'escritórios', etc.
  product TEXT NOT NULL, -- 'Garcez Palha Engine', 'Agente Trabalhista', etc.
  hook TEXT NOT NULL, -- Gancho inicial
  problem TEXT NOT NULL, -- Problema que resolve
  solution TEXT NOT NULL, -- Solução oferecida
  cta TEXT NOT NULL, -- Call to action
  script TEXT NOT NULL, -- Script completo gerado
  video_url TEXT, -- URL do vídeo após renderização
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'generating', 'ready', 'published'
  generated_by TEXT NOT NULL DEFAULT 'video-agent',
  views INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_agent_logs_agent_id ON agent_logs(agent_id);
CREATE INDEX idx_agent_logs_created_at ON agent_logs(created_at DESC);
CREATE INDEX idx_agent_logs_execution_id ON agent_logs(execution_id);
CREATE INDEX idx_workflow_executions_workflow_id ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_executions_status ON workflow_executions(status);
CREATE INDEX idx_workflow_executions_started_at ON workflow_executions(started_at DESC);
CREATE INDEX idx_agent_metrics_agent_id_date ON agent_metrics(agent_id, date DESC);

-- Row Level Security (RLS)
ALTER TABLE agent_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE vsls ENABLE ROW LEVEL SECURITY;

-- Políticas: Apenas admins podem ver e editar
CREATE POLICY "Admins can view agent_configs" ON agent_configs FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage agent_configs" ON agent_configs FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view workflows" ON workflows FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage workflows" ON workflows FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can view workflow_executions" ON workflow_executions FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can view agent_logs" ON agent_logs FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can view agent_metrics" ON agent_metrics FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins can manage vsls" ON vsls FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
```

### Seed Data (Dados Iniciais)

```sql
-- Popular tabela de agentes com os 24 agentes existentes
INSERT INTO agent_configs (agent_id, name, type, status, enabled, config) VALUES
-- Agentes de Marketing (6)
('ads', 'Ads Agent', 'marketing', 'active', true, '{"model": "gpt-4o", "temperature": 0.7}'),
('content', 'Content Agent', 'marketing', 'active', true, '{"model": "gpt-4o", "temperature": 0.8}'),
('social', 'Social Agent', 'marketing', 'active', true, '{"model": "gpt-4o", "temperature": 0.7}'),
('seo', 'SEO Agent', 'marketing', 'active', true, '{"model": "gpt-4o", "temperature": 0.6}'),
('video', 'Video Agent', 'marketing', 'active', true, '{"model": "gpt-4o", "temperature": 0.8}'),
('design', 'Design Agent', 'marketing', 'active', true, '{"model": "gpt-4o", "temperature": 0.7}'),

-- Agentes Executivos (4)
('ceo', 'CEO Agent', 'executive', 'active', true, '{"model": "claude-opus-4", "temperature": 0.6}'),
('cmo', 'CMO Agent', 'executive', 'active', true, '{"model": "gpt-4o", "temperature": 0.7}'),
('cfo', 'CFO Agent', 'executive', 'active', true, '{"model": "gpt-4o", "temperature": 0.5}'),
('coo', 'COO Agent', 'executive', 'active', true, '{"model": "gpt-4o", "temperature": 0.6}'),

-- Agentes Legais (9)
('trabalhista', 'Trabalhista Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),
('civil', 'Civil Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),
('consumidor', 'Consumidor Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),
('familia', 'Família Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),
('empresarial', 'Empresarial Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),
('imobiliario', 'Imobiliário Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),
('previdenciario', 'Previdenciário Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),
('tributario', 'Tributário Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),
('contratual', 'Contratual Agent', 'legal', 'active', true, '{"model": "gpt-4o", "temperature": 0.3}'),

-- Agentes Operacionais (2)
('triagem', 'Triagem Agent', 'operations', 'active', true, '{"model": "gpt-4o-mini", "temperature": 0.5}'),
('admin', 'Admin Agent', 'operations', 'active', true, '{"model": "gpt-4o-mini", "temperature": 0.5}'),

-- Agentes de Inteligência (2)
('analytics', 'Analytics Agent', 'intelligence', 'active', true, '{"model": "gpt-4o", "temperature": 0.4}'),
('research', 'Research Agent', 'intelligence', 'active', true, '{"model": "gpt-4o", "temperature": 0.7}');

-- Popular tabela de workflows com os 8 workflows existentes
INSERT INTO workflows (workflow_id, name, description, frequency, schedule, priority, enabled, timeout, agents) VALUES
-- Workflows Diários
('ads-optimization', 'Ads Optimization', 'Otimização diária de campanhas de tráfego pago', 'daily', '0 6 * * *', 'high', false, 300000, '["ads", "cmo"]'),
('content-schedule', 'Content Schedule', 'Agenda e coordena publicações de conteúdo para o dia', 'daily', '0 7 * * *', 'high', false, 180000, '["cmo", "content", "social"]'),
('morning-briefing', 'Morning Briefing', 'Relatório matinal com métricas e prioridades do dia', 'daily', '0 8 * * *', 'medium', false, 120000, '["ceo", "analytics"]'),

-- Workflows Semanais
('content-planning', 'Content Planning', 'Planejamento semanal de conteúdo multi-canal', 'weekly', '0 9 * * 1', 'high', false, 240000, '["cmo", "content", "seo"]'),
('performance-review', 'Performance Review', 'Análise semanal de performance de todos os canais', 'weekly', '0 10 * * 1', 'medium', false, 300000, '["ceo", "cmo", "cfo", "analytics"]'),

-- Workflows de Trigger
('new-lead', 'New Lead Processing', 'Processamento automático de novos leads com qualificação e follow-up', 'on_trigger', null, 'critical', false, 60000, '["triagem", "coo", "admin"]'),
('payment-received', 'Payment Received', 'Processamento de pagamento recebido', 'on_trigger', null, 'high', false, 30000, '["cfo", "admin"]'),
('process-movement', 'Process Movement', 'Atualização de movimentação processual', 'on_trigger', null, 'medium', false, 120000, '["analytics", "admin"]');
```

---

## 🔧 IMPLEMENTAÇÃO PASSO A PASSO

### FASE 1: Banco de Dados (1 dia)

**Arquivo:** `supabase/migrations/20250101000000_agent_management.sql`

```sql
-- Copiar todo o SQL acima neste arquivo de migração
-- Executar: npx supabase db push
```

**Validação:**
- [ ] Todas as 6 tabelas criadas com sucesso
- [ ] Índices criados
- [ ] RLS ativado em todas as tabelas
- [ ] Seed data inserido (24 agentes + 8 workflows)

---

### FASE 2: API Routes (2 dias)

#### 1. Agent Management API

**Arquivo:** `src/app/api/admin/agentes/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/admin/agentes - Lista todos os agentes
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: agents, error } = await supabase
    .from('agent_configs')
    .select('*')
    .order('type', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Buscar métricas do dia para cada agente
  const today = new Date().toISOString().split('T')[0]
  const agentsWithMetrics = await Promise.all(
    agents.map(async (agent) => {
      const { data: metrics } = await supabase
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agent.agent_id)
        .eq('date', today)
        .single()

      return {
        ...agent,
        todayMetrics: metrics || {
          executions: 0,
          successes: 0,
          failures: 0,
          total_duration: 0,
          openai_tokens: 0,
          openai_cost: 0,
        },
      }
    })
  )

  return NextResponse.json({ agents: agentsWithMetrics })
}

// POST /api/admin/agentes - Criar novo agente (futuro)
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json()

  const { data, error } = await supabase
    .from('agent_configs')
    .insert({
      agent_id: body.agent_id,
      name: body.name,
      type: body.type,
      config: body.config || {},
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ agent: data })
}
```

**Arquivo:** `src/app/api/admin/agentes/[agentId]/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/admin/agentes/[agentId] - Detalhes de um agente
export async function GET(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: agent, error } = await supabase
    .from('agent_configs')
    .select('*')
    .eq('agent_id', params.agentId)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Buscar métricas dos últimos 30 dias
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: metrics } = await supabase
    .from('agent_metrics')
    .select('*')
    .eq('agent_id', params.agentId)
    .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
    .order('date', { ascending: true })

  // Buscar últimos 100 logs
  const { data: logs } = await supabase
    .from('agent_logs')
    .select('*')
    .eq('agent_id', params.agentId)
    .order('created_at', { ascending: false })
    .limit(100)

  return NextResponse.json({
    agent,
    metrics: metrics || [],
    recentLogs: logs || [],
  })
}

// PUT /api/admin/agentes/[agentId] - Atualizar configuração
export async function PUT(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json()

  const { data, error } = await supabase
    .from('agent_configs')
    .update({
      name: body.name,
      config: body.config,
      updated_at: new Date().toISOString(),
    })
    .eq('agent_id', params.agentId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ agent: data })
}
```

**Arquivo:** `src/app/api/admin/agentes/[agentId]/toggle/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// POST /api/admin/agentes/[agentId]/toggle - Ativar/Pausar agente
export async function POST(
  request: Request,
  { params }: { params: { agentId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  // Buscar status atual
  const { data: agent } = await supabase
    .from('agent_configs')
    .select('enabled, status')
    .eq('agent_id', params.agentId)
    .single()

  if (!agent) {
    return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
  }

  // Toggle enabled
  const newEnabled = !agent.enabled
  const newStatus = newEnabled ? 'active' : 'paused'

  const { data, error } = await supabase
    .from('agent_configs')
    .update({
      enabled: newEnabled,
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq('agent_id', params.agentId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Registrar log
  await supabase.from('agent_logs').insert({
    agent_id: params.agentId,
    level: 'info',
    event: newEnabled ? 'agent-enabled' : 'agent-disabled',
    message: `Agente ${newEnabled ? 'ativado' : 'pausado'} manualmente`,
    metadata: { previous_status: agent.status },
  })

  return NextResponse.json({ agent: data })
}
```

#### 2. Workflow Management API

**Arquivo:** `src/app/api/admin/workflows/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/admin/workflows - Lista todos os workflows
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: workflows, error } = await supabase
    .from('workflows')
    .select('*')
    .order('priority', { ascending: false })
    .order('name', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Buscar última execução de cada workflow
  const workflowsWithLastExecution = await Promise.all(
    workflows.map(async (workflow) => {
      const { data: lastExecution } = await supabase
        .from('workflow_executions')
        .select('*')
        .eq('workflow_id', workflow.workflow_id)
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      return {
        ...workflow,
        lastExecution: lastExecution || null,
      }
    })
  )

  return NextResponse.json({ workflows: workflowsWithLastExecution })
}
```

**Arquivo:** `src/app/api/admin/workflows/[workflowId]/execute/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Importar workflows
import { createAdsOptimizationWorkflow } from '@/lib/ai/workflows/daily/ads-optimization'
import { createContentScheduleWorkflow } from '@/lib/ai/workflows/daily/content-schedule'
import { createMorningBriefingWorkflow } from '@/lib/ai/workflows/daily/morning-briefing'
import { createContentPlanningWorkflow } from '@/lib/ai/workflows/weekly/content-planning'
import { createPerformanceReviewWorkflow } from '@/lib/ai/workflows/weekly/performance-review'
import { createNewLeadWorkflow } from '@/lib/ai/workflows/triggers/new-lead'

export const dynamic = 'force-dynamic'

const WORKFLOW_FACTORIES = {
  'ads-optimization': createAdsOptimizationWorkflow,
  'content-schedule': createContentScheduleWorkflow,
  'morning-briefing': createMorningBriefingWorkflow,
  'content-planning': createContentPlanningWorkflow,
  'performance-review': createPerformanceReviewWorkflow,
  'new-lead': createNewLeadWorkflow,
}

// POST /api/admin/workflows/[workflowId]/execute - Executar workflow manualmente
export async function POST(
  request: Request,
  { params }: { params: { workflowId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json()

  // Buscar configuração do workflow
  const { data: workflowConfig } = await supabase
    .from('workflows')
    .select('*')
    .eq('workflow_id', params.workflowId)
    .single()

  if (!workflowConfig) {
    return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
  }

  if (!workflowConfig.enabled) {
    return NextResponse.json(
      { error: 'Workflow is disabled' },
      { status: 400 }
    )
  }

  // Criar instância do workflow
  const factory = WORKFLOW_FACTORIES[params.workflowId]
  if (!factory) {
    return NextResponse.json(
      { error: 'Workflow factory not found' },
      { status: 404 }
    )
  }

  const workflow = factory()

  try {
    // Executar workflow com input do body
    const result = await workflow.execute(body.input || {})

    // Salvar execução no banco
    const execution = workflow.getExecution()
    if (execution) {
      await supabase.from('workflow_executions').insert({
        workflow_id: params.workflowId,
        execution_id: execution.id,
        status: execution.status,
        triggered_by: 'manual',
        steps: execution.steps,
        result: result,
        started_at: execution.startedAt.toISOString(),
        completed_at: execution.completedAt?.toISOString(),
        duration: execution.duration,
      })
    }

    return NextResponse.json({ result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    )
  }
}
```

#### 3. VSL Generation API

**Arquivo:** `src/app/api/admin/vsl/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// GET /api/admin/vsl - Lista todas as VSLs
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: vsls, error } = await supabase
    .from('vsls')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vsls })
}

// POST /api/admin/vsl - Criar nova VSL
export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const body = await request.json()

  const { data, error } = await supabase
    .from('vsls')
    .insert({
      title: body.title,
      target_audience: body.target_audience,
      product: body.product,
      hook: body.hook,
      problem: body.problem,
      solution: body.solution,
      cta: body.cta,
      script: '', // Será gerado pelo Video Agent
      status: 'draft',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ vsl: data })
}
```

**Arquivo:** `src/app/api/admin/vsl/[vslId]/generate/route.ts`

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getVideoAgent } from '@/lib/ai/agents/marketing/video-agent'

export const dynamic = 'force-dynamic'

// POST /api/admin/vsl/[vslId]/generate - Gerar script da VSL
export async function POST(
  request: Request,
  { params }: { params: { vslId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies })

  // Buscar VSL
  const { data: vsl } = await supabase
    .from('vsls')
    .select('*')
    .eq('id', params.vslId)
    .single()

  if (!vsl) {
    return NextResponse.json({ error: 'VSL not found' }, { status: 404 })
  }

  // Atualizar status
  await supabase
    .from('vsls')
    .update({ status: 'generating' })
    .eq('id', params.vslId)

  try {
    // Usar Video Agent para gerar script
    const videoAgent = getVideoAgent()
    const script = await videoAgent.generateVSLScript(
      vsl.product,
      vsl.target_audience,
      {
        hook: vsl.hook,
        problem: vsl.problem,
        solution: vsl.solution,
        cta: vsl.cta,
      }
    )

    // Atualizar VSL com script
    const { data: updatedVsl, error } = await supabase
      .from('vsls')
      .update({
        script: script.fullScript,
        status: 'ready',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.vslId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ vsl: updatedVsl, script })
  } catch (error) {
    // Atualizar status de erro
    await supabase
      .from('vsls')
      .update({ status: 'draft' })
      .eq('id', params.vslId)

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
```

**Validação Fase 2:**
- [ ] Todas as rotas de API criadas
- [ ] Testes com Postman/Thunder Client funcionando
- [ ] Autenticação verificada (apenas admins)
- [ ] Logs sendo salvos corretamente

---

### FASE 3: Components (3 dias)

#### 1. Agent Card Component

**Arquivo:** `src/components/admin/agentes/AgentCard.tsx`

```typescript
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Activity, TrendingUp, DollarSign, Clock } from 'lucide-react'
import { useState } from 'react'

interface AgentCardProps {
  agent: {
    agent_id: string
    name: string
    type: string
    status: 'active' | 'paused' | 'error'
    enabled: boolean
    todayMetrics: {
      executions: number
      successes: number
      failures: number
      total_duration: number
      openai_cost: number
    }
  }
  onToggle: (agentId: string) => Promise<void>
}

export function AgentCard({ agent, onToggle }: AgentCardProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await onToggle(agent.agent_id)
    } finally {
      setLoading(false)
    }
  }

  const successRate =
    agent.todayMetrics.executions > 0
      ? (agent.todayMetrics.successes / agent.todayMetrics.executions) * 100
      : 0

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge
            variant={
              agent.status === 'active'
                ? 'default'
                : agent.status === 'paused'
                ? 'secondary'
                : 'destructive'
            }
          >
            {agent.status}
          </Badge>
          <Switch
            checked={agent.enabled}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Execuções</p>
              <p className="text-lg font-bold">{agent.todayMetrics.executions}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Taxa de Sucesso</p>
              <p className="text-lg font-bold">{successRate.toFixed(0)}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Duração Total</p>
              <p className="text-lg font-bold">
                {(agent.todayMetrics.total_duration / 1000).toFixed(1)}s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Custo OpenAI</p>
              <p className="text-lg font-bold">
                ${agent.todayMetrics.openai_cost.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4" asChild>
          <a href={`/admin/agentes/${agent.agent_id}`}>Ver Detalhes</a>
        </Button>
      </CardContent>
    </Card>
  )
}
```

#### 2. VSL Builder Component

**Arquivo:** `src/components/admin/agentes/VSLBuilder.tsx`

```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface VSLFormData {
  title: string
  target_audience: string
  product: string
  hook: string
  problem: string
  solution: string
  cta: string
}

export function VSLBuilder() {
  const [formData, setFormData] = useState<VSLFormData>({
    title: '',
    target_audience: '',
    product: '',
    hook: '',
    problem: '',
    solution: '',
    cta: '',
  })
  const [loading, setLoading] = useState(false)
  const [generatedVSL, setGeneratedVSL] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Criar VSL
      const createRes = await fetch('/api/admin/vsl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const { vsl } = await createRes.json()

      // Gerar script
      const generateRes = await fetch(`/api/admin/vsl/${vsl.id}/generate`, {
        method: 'POST',
      })
      const { vsl: updatedVsl, script } = await generateRes.json()

      setGeneratedVSL({ ...updatedVsl, script })
    } catch (error) {
      console.error('Error generating VSL:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Nova VSL</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título da VSL</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Lançamento Garcez Palha Engine"
                required
              />
            </div>

            <div>
              <Label htmlFor="target_audience">Público-Alvo</Label>
              <Input
                id="target_audience"
                value={formData.target_audience}
                onChange={(e) =>
                  setFormData({ ...formData, target_audience: e.target.value })
                }
                placeholder="Ex: Advogados com escritórios pequenos"
                required
              />
            </div>

            <div>
              <Label htmlFor="product">Produto</Label>
              <Input
                id="product"
                value={formData.product}
                onChange={(e) =>
                  setFormData({ ...formData, product: e.target.value })
                }
                placeholder="Ex: Garcez Palha Engine"
                required
              />
            </div>

            <div>
              <Label htmlFor="hook">Gancho Inicial</Label>
              <Textarea
                id="hook"
                value={formData.hook}
                onChange={(e) =>
                  setFormData({ ...formData, hook: e.target.value })
                }
                placeholder="Ex: Você sabia que 73% dos advogados perdem clientes por demora no atendimento?"
                rows={2}
                required
              />
            </div>

            <div>
              <Label htmlFor="problem">Problema</Label>
              <Textarea
                id="problem"
                value={formData.problem}
                onChange={(e) =>
                  setFormData({ ...formData, problem: e.target.value })
                }
                placeholder="Ex: Clientes exigem respostas rápidas 24/7, mas você não tem equipe"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="solution">Solução</Label>
              <Textarea
                id="solution"
                value={formData.solution}
                onChange={(e) =>
                  setFormData({ ...formData, solution: e.target.value })
                }
                placeholder="Ex: IA que qualifica leads, agenda consultas e responde dúvidas jurídicas"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="cta">Call to Action</Label>
              <Textarea
                id="cta"
                value={formData.cta}
                onChange={(e) =>
                  setFormData({ ...formData, cta: e.target.value })
                }
                placeholder="Ex: Clique abaixo e ganhe 30 dias grátis"
                rows={2}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando VSL...
                </>
              ) : (
                'Gerar VSL'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Script Gerado</CardTitle>
        </CardHeader>
        <CardContent>
          {generatedVSL ? (
            <div className="space-y-4">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {generatedVSL.script.fullScript || generatedVSL.script}
                </pre>
              </div>
              <Button variant="outline" className="w-full">
                Baixar Script
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Preencha o formulário e clique em "Gerar VSL" para criar o script
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
```

**Validação Fase 3:**
- [ ] AgentCard renderizando corretamente
- [ ] VSLBuilder gerando scripts
- [ ] Todos os componentes com TypeScript tipado
- [ ] UI responsiva (mobile + desktop)

---

### FASE 4: Admin Pages (3 dias)

#### 1. Dashboard de Agentes

**Arquivo:** `src/app/(admin)/admin/agentes/page.tsx`

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AgentCard } from '@/components/admin/agentes/AgentCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export const dynamic = 'force-dynamic'

export default async function AgentesPage() {
  const supabase = createServerComponentClient({ cookies })

  // Buscar todos os agentes com métricas
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/agentes`, {
    cache: 'no-store',
  })
  const { agents } = await res.json()

  // Agrupar por tipo
  const agentsByType = {
    marketing: agents.filter((a: any) => a.type === 'marketing'),
    executive: agents.filter((a: any) => a.type === 'executive'),
    legal: agents.filter((a: any) => a.type === 'legal'),
    operations: agents.filter((a: any) => a.type === 'operations'),
    intelligence: agents.filter((a: any) => a.type === 'intelligence'),
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Agentes</h1>
          <p className="text-muted-foreground">
            24 agentes IA rodando no piloto automático
          </p>
        </div>
      </div>

      <Tabs defaultValue="marketing">
        <TabsList>
          <TabsTrigger value="marketing">
            Marketing ({agentsByType.marketing.length})
          </TabsTrigger>
          <TabsTrigger value="executive">
            Executivos ({agentsByType.executive.length})
          </TabsTrigger>
          <TabsTrigger value="legal">
            Jurídicos ({agentsByType.legal.length})
          </TabsTrigger>
          <TabsTrigger value="operations">
            Operações ({agentsByType.operations.length})
          </TabsTrigger>
          <TabsTrigger value="intelligence">
            Inteligência ({agentsByType.intelligence.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketing" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agentsByType.marketing.map((agent: any) => (
              <AgentCard
                key={agent.agent_id}
                agent={agent}
                onToggle={async (agentId) => {
                  'use server'
                  await fetch(`/api/admin/agentes/${agentId}/toggle`, {
                    method: 'POST',
                  })
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executive" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agentsByType.executive.map((agent: any) => (
              <AgentCard key={agent.agent_id} agent={agent} onToggle={() => {}} />
            ))}
          </div>
        </TabsContent>

        {/* Repetir para outros tipos... */}
      </Tabs>
    </div>
  )
}
```

#### 2. Página de Workflows

**Arquivo:** `src/app/(admin)/admin/agentes/workflows/page.tsx`

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Pause, Clock, CheckCircle2, XCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function WorkflowsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/admin/workflows`, {
    cache: 'no-store',
  })
  const { workflows } = await res.json()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Workflows Automatizados</h1>
          <p className="text-muted-foreground">
            8 workflows programados para rodar no piloto automático
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {workflows.map((workflow: any) => (
          <Card key={workflow.workflow_id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle>{workflow.name}</CardTitle>
                  <Badge
                    variant={
                      workflow.enabled
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {workflow.enabled ? 'Ativo' : 'Pausado'}
                  </Badge>
                  <Badge variant="outline">{workflow.frequency}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Executar Agora
                  </Button>
                  <Button
                    size="sm"
                    variant={workflow.enabled ? 'destructive' : 'default'}
                  >
                    {workflow.enabled ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Ativar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {workflow.description}
              </p>

              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Schedule</p>
                    <p className="text-sm font-medium">
                      {workflow.schedule || 'On trigger'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Última Execução</p>
                    <p className="text-sm font-medium">
                      {workflow.lastExecution
                        ? new Date(
                            workflow.lastExecution.started_at
                          ).toLocaleString('pt-BR')
                        : 'Nunca'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium">
                      {workflow.lastExecution?.status || '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Agentes</p>
                  <div className="flex gap-1 flex-wrap mt-1">
                    {(JSON.parse(workflow.agents) || []).map((agent: string) => (
                      <Badge key={agent} variant="outline" className="text-xs">
                        {agent}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button variant="link" asChild>
                <a href={`/admin/agentes/workflows/${workflow.workflow_id}`}>
                  Ver histórico completo →
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

#### 3. Página de VSL

**Arquivo:** `src/app/(admin)/admin/agentes/vsl/criar/page.tsx`

```typescript
import { VSLBuilder } from '@/components/admin/agentes/VSLBuilder'

export default function CriarVSLPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Criar VSL</h1>
        <p className="text-muted-foreground">
          Gere Video Sales Letters automaticamente com IA
        </p>
      </div>

      <VSLBuilder />
    </div>
  )
}
```

**Validação Fase 4:**
- [ ] `/admin/agentes` renderizando 24 agentes
- [ ] `/admin/agentes/workflows` mostrando 8 workflows
- [ ] `/admin/agentes/vsl/criar` gerando VSLs
- [ ] Navegação funcionando entre páginas

---

### FASE 5: Ativação de Workflows em Produção (1 dia)

#### Configurar Vercel Cron

**Arquivo:** `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/ads-optimization",
      "schedule": "0 6 * * *"
    },
    {
      "path": "/api/cron/content-schedule",
      "schedule": "0 7 * * *"
    },
    {
      "path": "/api/cron/morning-briefing",
      "schedule": "0 8 * * *"
    },
    {
      "path": "/api/cron/content-planning",
      "schedule": "0 9 * * 1"
    },
    {
      "path": "/api/cron/performance-review",
      "schedule": "0 10 * * 1"
    }
  ]
}
```

#### Criar Rotas de Cron

**Arquivo:** `src/app/api/cron/ads-optimization/route.ts`

```typescript
import { NextResponse } from 'next/server'
import { executeAdsOptimization } from '@/lib/ai/workflows/daily/ads-optimization'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Verificar token de autenticação do Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Verificar se workflow está ativado
  const { data: workflow } = await supabase
    .from('workflows')
    .select('enabled')
    .eq('workflow_id', 'ads-optimization')
    .single()

  if (!workflow?.enabled) {
    return NextResponse.json({ skipped: true, reason: 'Workflow disabled' })
  }

  try {
    const result = await executeAdsOptimization()

    // Salvar execução
    await supabase.from('workflow_executions').insert({
      workflow_id: 'ads-optimization',
      execution_id: `cron_${Date.now()}`,
      status: result.success ? 'completed' : 'failed',
      triggered_by: 'schedule',
      result: result,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      duration: result.metrics.totalDuration,
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Execution failed' },
      { status: 500 }
    )
  }
}
```

**Criar variável de ambiente:**
```bash
# .env.local
CRON_SECRET=seu-token-secreto-aqui-ALTERE-ISSO
```

**Repetir para outros workflows:**
- `/api/cron/content-schedule/route.ts`
- `/api/cron/morning-briefing/route.ts`
- `/api/cron/content-planning/route.ts`
- `/api/cron/performance-review/route.ts`

**Validação Fase 5:**
- [ ] `vercel.json` configurado
- [ ] 5 rotas de cron criadas
- [ ] CRON_SECRET configurado no Vercel
- [ ] Deploy feito e cron jobs agendados
- [ ] Teste manual: `curl https://seu-dominio.vercel.app/api/cron/ads-optimization -H "Authorization: Bearer CRON_SECRET"`

---

## ⚙️ CONFIGURAÇÕES DE AMBIENTE

### Variáveis Necessárias

```bash
# .env.local

# Vercel Cron
CRON_SECRET=seu-token-secreto-ALTERE-ISSO

# OpenAI/OpenRouter (já existe)
OPENAI_API_KEY=sk-or-v1-...

# Supabase (já existe)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

# URL da aplicação (para SSR)
NEXT_PUBLIC_URL=http://localhost:3000  # Desenvolvimento
NEXT_PUBLIC_URL=https://garcezpalha.vercel.app  # Produção
```

---

## 📊 CRONOGRAMA COMPLETO

| Fase | Descrição | Duração | Dependências |
|------|-----------|---------|--------------|
| 1 | Banco de Dados | 1 dia | Nenhuma |
| 2 | API Routes | 2 dias | Fase 1 |
| 3 | Components | 3 dias | Fase 2 |
| 4 | Admin Pages | 3 dias | Fase 3 |
| 5 | Ativação Workflows | 1 dia | Fase 4 |
| **TOTAL** | **10 dias úteis** | | |

---

## ✅ CHECKLIST FINAL

### Antes de Implementar
- [ ] Revisar este documento completo
- [ ] Aprovar schema de banco de dados
- [ ] Aprovar estrutura de arquivos
- [ ] Definir CRON_SECRET seguro

### Durante Implementação
- [ ] Criar branch `feature/agent-management`
- [ ] Implementar fase por fase em ordem
- [ ] Testar cada fase antes de prosseguir
- [ ] Fazer commits frequentes com mensagens claras

### Após Implementação
- [ ] Testar todos os endpoints da API
- [ ] Testar todas as páginas admin
- [ ] Ativar 1 workflow por vez em produção
- [ ] Monitorar custos OpenAI por 1 semana
- [ ] Documentar problemas encontrados

---

## 🚨 ALERTAS CRÍTICOS

### Custos OpenAI

Com todos os workflows ativados, estimativa de custos:

- **Ads Optimization** (diário): ~$0.50/dia = $15/mês
- **Content Schedule** (diário): ~$1.00/dia = $30/mês
- **Morning Briefing** (diário): ~$0.30/dia = $9/mês
- **Content Planning** (semanal): ~$2.00/semana = $8/mês
- **Performance Review** (semanal): ~$1.50/semana = $6/mês
- **New Lead** (por trigger): ~$0.20/lead

**Total estimado: ~$70/mês + custos por leads**

### Segurança

1. **RLS ativado**: Apenas usuários com `role = 'admin'` podem acessar `/api/admin/*`
2. **CRON_SECRET**: Trocar o valor padrão imediatamente
3. **Service Role Key**: Nunca expor no frontend, apenas server-side

### Performance

1. **Cache**: Usar `cache: 'no-store'` em páginas admin para dados em tempo real
2. **Índices**: Criados nas tabelas para queries rápidas
3. **Timeouts**: Todos os workflows têm timeout configurado

---

## 📚 PRÓXIMOS PASSOS

Após esta implementação estar completa:

1. **Monitoramento Avançado**
   - Integrar com Sentry para tracking de erros
   - Adicionar métricas no Vercel Analytics
   - Criar alertas no Telegram para workflows falhados

2. **Otimizações**
   - A/B testing de prompts dos agentes
   - Fine-tuning de modelos para reduzir custos
   - Cache de respostas similares

3. **Funcionalidades Extras**
   - Editor visual de prompts dos agentes
   - Simulador de workflows antes de ativar
   - Exportação de relatórios em PDF

---

**FIM DO PLANO DE IMPLEMENTAÇÃO - AGENTE DE MARKETING**

Este documento fornece todos os detalhes necessários para implementar a interface de gerenciamento de agentes e ativar o sistema de marketing no piloto automático. Não deve ser iniciado até revisão e aprovação completas.
