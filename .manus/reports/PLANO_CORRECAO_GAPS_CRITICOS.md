# 🎯 PLANO DE CORREÇÃO - GAPS CRÍTICOS

**Data:** 30/12/2025
**Objetivo:** Corrigir gaps P0 identificados SEM retrabalho
**Exclusões:** WhatsApp (deixar para depois quando tudo estiver 100%)

---

## 📊 GAPS PRIORIZADOS (Excluindo WhatsApp)

| ID | Gap | Prioridade | Tempo | Complexidade |
|----|-----|-----------|-------|--------------|
| **P0-001** | Analytics Admin = 100% Mock Data | P0 | 4-6h | MÉDIA |
| **P0-002** | Marketing Agent NÃO existe | P0 | 8-12h | ALTA |
| **P0-003** | Modo Demo em Admin (mock fallback) | P0 | 1-2h | BAIXA |
| **P1-001** | Settings Admin é Placeholder | P1 | 4-6h | MÉDIA |
| **P1-002** | Documentar Schema Supabase | P1 | 2-3h | BAIXA |

**Total Estimado:** 19-29 horas de trabalho
**Estratégia:** Executar em FASES para evitar retrabalho

---

## 🔍 ANÁLISE PRÉ-EXECUÇÃO (INVESTIGAÇÃO)

### FASE 0: INVESTIGAÇÃO PROFUNDA (2-3h) - CRÍTICO PARA NÃO ERRAR

Antes de corrigir qualquer código, precisamos **ENTENDER COMPLETAMENTE**:

#### 1. Schema Supabase (PRIORIDADE MÁXIMA)

**Por quê:** Todas as correções dependem do schema correto

**Investigar:**
```bash
# 1. Procurar migrations ou schema files
find . -name "*migration*" -o -name "*schema*" -o -name "*.sql"

# 2. Verificar se há documentação de tabelas
grep -r "CREATE TABLE\|supabase" docs/ .manus/

# 3. Analisar código TypeScript para inferir schema
grep -r "interface.*Lead\|type.*Lead" src/ --include="*.ts"
grep -r "interface.*Client\|type.*Client" src/
grep -r "interface.*Invoice\|type.*Invoice" src/
```

**Criar:** `docs/SUPABASE_SCHEMA.md` com:
- Tabelas existentes
- Colunas de cada tabela
- Relacionamentos
- Indexes
- RLS policies

**Critério:** Só prosseguir quando schema estiver 100% documentado

---

#### 2. Conectividade Supabase Atual

**Verificar:**
```typescript
// Procurar por conexões Supabase
grep -r "createClient\|supabase" src/lib/
```

**Validar:**
- ✅ SUPABASE_URL está configurada?
- ✅ SUPABASE_ANON_KEY está configurada?
- ✅ Cliente está instanciado corretamente?
- ✅ Há exemplos funcionando (ex: `/api/contact`)?

**Criar:** Teste de conectividade simples antes de prosseguir

---

#### 3. Estrutura de APIs Existentes

**Mapear:**
```bash
# Listar todas as APIs que já funcionam
find src/app/api -name "route.ts" -type f

# Para cada API, verificar:
# - Usa Supabase? (grep "supabase")
# - Retorna dados reais ou mock?
# - Tem error handling?
```

**Classificar:**
- ✅ **FUNCIONANDO**: `/api/contact`, `/api/gmail/monitor`
- ⚠️ **PARCIAL**: APIs que têm código mas não testadas
- ❌ **MOCK**: APIs que retornam dados falsos

**Criar:** Documento `API_INVENTORY.md` com status real

---

## 🎯 ESTRATÉGIA DE EXECUÇÃO (SEM RETRABALHO)

### Princípio 1: **SMALL INCREMENTAL CHANGES**
- Nunca fazer mudança grande de uma vez
- Cada correção deve compilar e funcionar
- Testar antes de prosseguir

### Princípio 2: **PRESERVE EXISTING FUNCTIONALITY**
- Não quebrar o que já funciona
- Manter backwards compatibility
- Feature flags se necessário

### Princípio 3: **DOCUMENTATION FIRST**
- Documentar antes de implementar
- Schema, APIs, fluxos claros
- Depois código

---

## 📋 PLANO DE EXECUÇÃO DETALHADO

### FASE 0: INVESTIGAÇÃO (2-3h) ✅ OBRIGATÓRIA

**Objetivo:** Entender 100% do estado atual ANTES de mudar código

**Tasks:**
1. ✅ Documentar Supabase Schema completo
2. ✅ Mapear todas as APIs (funcionando vs mock vs parcial)
3. ✅ Validar conectividade Supabase
4. ✅ Criar inventory de funcionalidades reais

**Outputs:**
- `docs/SUPABASE_SCHEMA.md`
- `docs/API_INVENTORY.md`
- `docs/CONNECTIVITY_TEST.md`

**Não prosseguir sem completar esta fase!**

---

### FASE 1: CORRIGIR MOCK DATA (2-3h)

**Ordem:** P0-003 → Mais fácil, menos risco

**Objetivo:** Remover mock data fallbacks confusos

#### 1.1 Admin Leads Page

**Arquivo:** `src/app/(admin)/admin/leads/page.tsx`

**Problema Atual:**
```typescript
// Linha ~52: mockLeads usado quando DB falha
const mockLeads: Lead[] = [...]
```

**Correção:**
```typescript
// OPÇÃO 1: Mostrar erro claro
if (error) {
  return <ErrorState message="Erro ao carregar leads. Verifique conexão com banco de dados." />
}

// OPÇÃO 2: Mostrar estado vazio
if (!leads || leads.length === 0) {
  return <EmptyState message="Nenhum lead encontrado" />
}

// REMOVER completamente mockLeads
```

**Validação:**
- ✅ Build compila
- ✅ Página mostra erro OU vazio (não mock)
- ✅ Se DB está OK, mostra dados reais

---

#### 1.2 Admin Clients Page

**Similar ao Leads:**
- Remover mockClients
- Mostrar erro ou empty state
- Nunca enganar usuário

---

#### 1.3 Admin Dashboard

**Arquivo:** `src/app/(admin)/admin/page.tsx`

**Verificar:**
- Quais widgets usam mock?
- Quais widgets usam dados reais (`/api/admin/leads/stats`)?

**Correção:**
- Widgets com dados reais: manter
- Widgets com mock: mostrar "Dados não disponíveis" OU implementar API real

---

### FASE 2: IMPLEMENTAR ANALYTICS REAL (4-6h)

**Ordem:** P0-001 → Alto impacto, risco médio

**Objetivo:** Substituir mock data por queries Supabase reais

#### 2.1 Análise do Código Atual

**Arquivo:** `src/app/(admin)/admin/analytics/page.tsx`

**Função crítica:**
```typescript
// Linhas 79-109: fetchAnalyticsData retorna mock
const fetchAnalyticsData = async () => {
  return {
    totalLeads: 1247,  // FAKE
    conversionRate: 24.5,  // FAKE
    // ... tudo fake
  }
}
```

**Identificar métricas necessárias:**
1. Total de leads
2. Taxa de conversão
3. Revenue total
4. Leads por fonte
5. Conversões por mês
6. Top produtos

---

#### 2.2 Criar APIs de Analytics

**Estrutura:**
```
src/app/api/analytics/
├── leads-stats/route.ts       # Total, por status, por fonte
├── conversion-rate/route.ts   # Taxa de conversão
├── revenue/route.ts           # Revenue total e por período
├── leads-by-source/route.ts   # Breakdown por fonte
├── monthly-conversions/route.ts
└── top-products/route.ts
```

**Implementação de cada API:**

**Exemplo: `leads-stats/route.ts`**
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Query real do Supabase
  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, status, source, created_at')

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Calcular stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    converted: leads.filter(l => l.status === 'converted').length,
    lost: leads.filter(l => l.status === 'lost').length,
    bySource: {
      website: leads.filter(l => l.source === 'website').length,
      gmail: leads.filter(l => l.source === 'gmail').length,
      chatbot: leads.filter(l => l.source === 'chatbot').length,
      referral: leads.filter(l => l.source === 'referral').length,
    }
  }

  return Response.json(stats)
}
```

**Validação:**
- ✅ Testar API diretamente: `curl http://localhost:3000/api/analytics/leads-stats`
- ✅ Verificar response tem dados reais
- ✅ Error handling robusto

---

#### 2.3 Atualizar Frontend Analytics

**Substituir fetchAnalyticsData:**
```typescript
const fetchAnalyticsData = async () => {
  try {
    const [leadsStats, conversionRate, revenue] = await Promise.all([
      fetch('/api/analytics/leads-stats').then(r => r.json()),
      fetch('/api/analytics/conversion-rate').then(r => r.json()),
      fetch('/api/analytics/revenue').then(r => r.json()),
    ])

    return {
      totalLeads: leadsStats.total,
      conversionRate: conversionRate.rate,
      totalRevenue: revenue.total,
      // ... mapear todos os campos
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    // Mostrar erro ao usuário, NÃO retornar mock
    throw error
  }
}
```

**Validação:**
- ✅ Página carrega dados reais
- ✅ Erros são mostrados claramente
- ✅ Loading states funcionam
- ✅ Build compila

---

### FASE 3: CRIAR MARKETING AGENT (8-12h)

**Ordem:** P0-002 → Mais complexo, maior impacto

**Objetivo:** Implementar agent que cria leads automaticamente

#### 3.1 Definir Comportamento do Marketing Agent

**O que ele deve fazer:**
1. **Monitorar comportamento do usuário** (page views, tempo, interações)
2. **Identificar padrões de interesse** (visitou 3+ páginas de um produto)
3. **Criar lead automaticamente** quando threshold atingido
4. **Score inicial baseado em engagement**

**NÃO fazer:**
- ❌ Não criar lead duplicado (verificar email/session)
- ❌ Não criar spam de leads
- ❌ Não criar sem consentimento mínimo

---

#### 3.2 Arquitetura do Marketing Agent

**Estrutura:**
```
src/lib/ai/agents/marketing/
├── marketing-lead-agent.ts       # Agent principal
├── user-tracker.ts               # Tracking de comportamento
├── lead-scorer.ts                # Scoring de engagement
└── lead-creator.ts               # Criação no Supabase
```

**Fluxo:**
```
1. User visita site
   ↓
2. user-tracker.ts registra eventos (page views, clicks, tempo)
   ↓
3. lead-scorer.ts calcula score de interesse (0-100)
   ↓
4. Se score >= 60 E user deixou email OU preencheu form
   ↓
5. marketing-lead-agent.ts decide se cria lead
   ↓
6. lead-creator.ts insere no Supabase
   ↓
7. Notifica admin via email
```

---

#### 3.3 Implementação: User Tracker

**Arquivo:** `src/lib/ai/agents/marketing/user-tracker.ts`

```typescript
export interface UserEvent {
  sessionId: string
  timestamp: Date
  eventType: 'page_view' | 'click' | 'form_start' | 'form_submit'
  pagePath: string
  productCategory?: string
  duration?: number  // tempo na página (ms)
}

export class UserTracker {
  private events: Map<string, UserEvent[]> = new Map()

  trackEvent(event: UserEvent) {
    const sessionEvents = this.events.get(event.sessionId) || []
    sessionEvents.push(event)
    this.events.set(event.sessionId, sessionEvents)
  }

  getSessionEvents(sessionId: string): UserEvent[] {
    return this.events.get(sessionId) || []
  }

  calculateEngagement(sessionId: string): {
    pagesViewed: number
    totalTime: number
    productsInterested: string[]
    formInteractions: number
  } {
    const events = this.getSessionEvents(sessionId)

    return {
      pagesViewed: events.filter(e => e.eventType === 'page_view').length,
      totalTime: events.reduce((sum, e) => sum + (e.duration || 0), 0),
      productsInterested: [...new Set(
        events
          .filter(e => e.productCategory)
          .map(e => e.productCategory!)
      )],
      formInteractions: events.filter(e =>
        e.eventType === 'form_start' || e.eventType === 'form_submit'
      ).length
    }
  }
}
```

---

#### 3.4 Implementação: Lead Scorer

**Arquivo:** `src/lib/ai/agents/marketing/lead-scorer.ts`

```typescript
import { UserTracker } from './user-tracker'

export interface LeadScore {
  score: number  // 0-100
  confidence: 'low' | 'medium' | 'high'
  reasons: string[]
  recommendedAction: 'ignore' | 'nurture' | 'create_lead'
}

export class LeadScorer {
  private tracker: UserTracker

  constructor(tracker: UserTracker) {
    this.tracker = tracker
  }

  calculateScore(sessionId: string): LeadScore {
    const engagement = this.tracker.calculateEngagement(sessionId)

    let score = 0
    const reasons: string[] = []

    // Pages viewed (max 30 pts)
    if (engagement.pagesViewed >= 5) {
      score += 30
      reasons.push('Visitou 5+ páginas')
    } else if (engagement.pagesViewed >= 3) {
      score += 20
      reasons.push('Visitou 3+ páginas')
    } else if (engagement.pagesViewed >= 1) {
      score += 10
    }

    // Time spent (max 25 pts)
    const minutesSpent = engagement.totalTime / 60000
    if (minutesSpent >= 10) {
      score += 25
      reasons.push('Gastou 10+ minutos no site')
    } else if (minutesSpent >= 5) {
      score += 15
      reasons.push('Gastou 5+ minutos no site')
    } else if (minutesSpent >= 2) {
      score += 10
    }

    // Product interest (max 25 pts)
    if (engagement.productsInterested.length >= 3) {
      score += 25
      reasons.push('Interessado em 3+ produtos')
    } else if (engagement.productsInterested.length >= 2) {
      score += 15
      reasons.push('Interessado em 2+ produtos')
    } else if (engagement.productsInterested.length >= 1) {
      score += 10
    }

    // Form interactions (max 20 pts)
    if (engagement.formInteractions >= 1) {
      score += 20
      reasons.push('Interagiu com formulário')
    }

    // Determine confidence and action
    let confidence: 'low' | 'medium' | 'high'
    let recommendedAction: 'ignore' | 'nurture' | 'create_lead'

    if (score >= 70) {
      confidence = 'high'
      recommendedAction = 'create_lead'
    } else if (score >= 40) {
      confidence = 'medium'
      recommendedAction = 'nurture'
    } else {
      confidence = 'low'
      recommendedAction = 'ignore'
    }

    return { score, confidence, reasons, recommendedAction }
  }
}
```

---

#### 3.5 Implementação: Marketing Lead Agent

**Arquivo:** `src/lib/ai/agents/marketing/marketing-lead-agent.ts`

```typescript
import { UserTracker } from './user-tracker'
import { LeadScorer } from './lead-scorer'
import { createClient } from '@/lib/supabase/client'

export interface LeadCreationResult {
  success: boolean
  leadId?: string
  reason?: string
}

export class MarketingLeadAgent {
  private tracker: UserTracker
  private scorer: LeadScorer

  constructor() {
    this.tracker = new UserTracker()
    this.scorer = new LeadScorer(this.tracker)
  }

  async evaluateAndCreateLead(
    sessionId: string,
    userEmail?: string,
    userName?: string
  ): Promise<LeadCreationResult> {
    // Calculate engagement score
    const scoreResult = this.scorer.calculateScore(sessionId)

    // Only create lead if recommended
    if (scoreResult.recommendedAction !== 'create_lead') {
      return {
        success: false,
        reason: `Score too low (${scoreResult.score}/100). Recommendation: ${scoreResult.recommendedAction}`
      }
    }

    // Need at least email to create lead
    if (!userEmail) {
      return {
        success: false,
        reason: 'Email required to create lead'
      }
    }

    // Check for duplicate
    const supabase = createClient()
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', userEmail)
      .single()

    if (existingLead) {
      return {
        success: false,
        reason: 'Lead already exists for this email'
      }
    }

    // Get engagement details
    const engagement = this.tracker.calculateEngagement(sessionId)

    // Create lead
    const { data: newLead, error } = await supabase
      .from('leads')
      .insert({
        email: userEmail,
        full_name: userName || 'Lead Automático',
        source: 'marketing_agent',
        status: 'new',
        score: scoreResult.score,
        service_interest: engagement.productsInterested[0] || 'Geral',
        notes: `Lead criado automaticamente pelo Marketing Agent.\n\nScore: ${scoreResult.score}/100\nConfiança: ${scoreResult.confidence}\nRazões: ${scoreResult.reasons.join(', ')}\n\nEngagement:\n- ${engagement.pagesViewed} páginas visitadas\n- ${Math.round(engagement.totalTime / 60000)} minutos gastos\n- Produtos de interesse: ${engagement.productsInterested.join(', ')}`,
        metadata: {
          session_id: sessionId,
          engagement: engagement,
          score_details: scoreResult
        }
      })
      .select()
      .single()

    if (error) {
      return {
        success: false,
        reason: `Database error: ${error.message}`
      }
    }

    // Send notification email to admin
    await this.notifyAdmin(newLead)

    return {
      success: true,
      leadId: newLead.id
    }
  }

  private async notifyAdmin(lead: any) {
    // TODO: Implementar notificação via Resend
    // Similar ao gmail-monitor
  }
}
```

---

#### 3.6 Criar API Endpoint

**Arquivo:** `src/app/api/marketing/evaluate-lead/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { MarketingLeadAgent } from '@/lib/ai/agents/marketing/marketing-lead-agent'

const agent = new MarketingLeadAgent()

export async function POST(request: NextRequest) {
  try {
    const { sessionId, email, name } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId required' },
        { status: 400 }
      )
    }

    const result = await agent.evaluateAndCreateLead(sessionId, email, name)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error evaluating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

#### 3.7 Integrar no Frontend

**Adicionar tracking script:**

**Arquivo:** `src/components/analytics/user-tracker-script.tsx`

```typescript
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function UserTrackerScript() {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view
    const sessionId = getOrCreateSessionId()
    const startTime = Date.now()

    trackEvent({
      sessionId,
      eventType: 'page_view',
      pagePath: pathname,
      productCategory: extractProductCategory(pathname)
    })

    // Track duration on unmount
    return () => {
      const duration = Date.now() - startTime
      if (duration > 5000) {  // Só track se ficou 5+ segundos
        trackEvent({
          sessionId,
          eventType: 'page_view',
          pagePath: pathname,
          duration
        })
      }
    }
  }, [pathname])

  return null
}

function getOrCreateSessionId(): string {
  let sessionId = sessionStorage.getItem('session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('session_id', sessionId)
  }
  return sessionId
}

function extractProductCategory(pathname: string): string | undefined {
  // Ex: /previdenciario/aposentadoria → "previdenciario"
  const match = pathname.match(/\/(previdenciario|patrimonial|criminal|aeronautico|pericia)/)
  return match?.[1]
}

function trackEvent(event: any) {
  // Send to analytics API
  fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  }).catch(console.error)
}
```

**Adicionar no layout:**
```typescript
// src/app/layout.tsx
import { UserTrackerScript } from '@/components/analytics/user-tracker-script'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <UserTrackerScript />
        {children}
      </body>
    </html>
  )
}
```

---

### FASE 4: SETTINGS ADMIN (4-6h)

**Ordem:** P1-001 → Necessário para configurar sistema

**Objetivo:** Implementar salvar/carregar configurações

#### 4.1 Schema Supabase

**Criar tabela `settings`:**
```sql
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT,  -- 'integrations', 'notifications', 'general'
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_category ON settings(category);
```

---

#### 4.2 API CRUD

**Arquivos:**
```
src/app/api/settings/
├── route.ts               # GET all, POST create
├── [key]/route.ts         # GET one, PUT update, DELETE
```

**Implementação exemplo:**
```typescript
// src/app/api/settings/route.ts
export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('category', { ascending: true })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: Request) {
  const { key, value, category } = await request.json()
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from('settings')
    .insert({ key, value, category })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
```

---

#### 4.3 Atualizar Frontend Settings

**Substituir placeholder por funcionalidade real:**

```typescript
const saveSettings = async (category: string, values: any) => {
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: `${category}_config`,
        value: values,
        category
      })
    })

    toast.success('Configurações salvas com sucesso!')
  } catch (error) {
    toast.error('Erro ao salvar configurações')
  }
}
```

---

## ✅ VALIDAÇÃO E TESTES

### Checklist por Fase

**FASE 0:**
- [ ] Schema Supabase 100% documentado
- [ ] Conectividade testada e OK
- [ ] API inventory completo

**FASE 1:**
- [ ] Mock data removido de Leads
- [ ] Mock data removido de Clients
- [ ] Erros mostrados claramente
- [ ] Build compila

**FASE 2:**
- [ ] 6 APIs de analytics criadas
- [ ] Cada API testada individualmente
- [ ] Frontend carrega dados reais
- [ ] Loading e error states funcionam

**FASE 3:**
- [ ] User tracker funcionando
- [ ] Lead scorer calculando corretamente
- [ ] Marketing agent criando leads
- [ ] Deduplicação funcionando
- [ ] Notificação admin OK

**FASE 4:**
- [ ] Settings salvando no DB
- [ ] Settings carregando do DB
- [ ] CRUD completo funciona

---

## 🚀 ORDEM DE EXECUÇÃO FINAL

1. **FASE 0: INVESTIGAÇÃO** (2-3h) - NÃO PULAR!
2. **FASE 1: MOCK DATA** (2-3h) - Quick win
3. **FASE 2: ANALYTICS** (4-6h) - Alto valor
4. **FASE 3: MARKETING AGENT** (8-12h) - Mais complexo
5. **FASE 4: SETTINGS** (4-6h) - Necessário

**Total: 20-30h** de trabalho focado e sem retrabalho

---

## 📊 MÉTRICAS DE SUCESSO

Ao final, o sistema deve ter:
- ✅ **Zero mock data** no admin
- ✅ **Analytics com dados reais** do Supabase
- ✅ **Marketing Agent funcionando** e criando leads
- ✅ **Settings persistidos** no banco
- ✅ **Build compilando** sem erros
- ✅ **Testes passando** (criar testes básicos)

---

**Este plano foi criado para MINIMIZAR RETRABALHO através de:**
1. Investigação profunda antes de mudar código
2. Mudanças incrementais e testáveis
3. Preservação de funcionalidades existentes
4. Documentação clara de cada passo

**Pronto para executar?**
