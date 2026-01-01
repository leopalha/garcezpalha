# 16 - MÉTRICAS E KPIs
## Garcez Palha - Inteligência Jurídica

---

## 1. VISÃO GERAL

### 1.1 Filosofia de Métricas

```
PRINCÍPIO FUNDAMENTAL:
"O que não é medido não pode ser melhorado."

OBJETIVOS:
├── Visibilidade total da operação
├── Identificação rápida de problemas
├── Tomada de decisão baseada em dados
├── Otimização contínua de processos
└── Previsibilidade de resultados
```

### 1.2 Estrutura de Métricas

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PIRÂMIDE DE MÉTRICAS                           │
└─────────────────────────────────────────────────────────────────────┘

                        ┌─────────────┐
                        │   NORTH     │
                        │   STAR      │  Receita Recorrente (MRR)
                        └──────┬──────┘
                               │
                   ┌───────────┴───────────┐
                   │      RESULTADOS       │
                   │                       │  Clientes, Faturamento
                   └───────────┬───────────┘
                               │
           ┌───────────────────┼───────────────────┐
           │              CONVERSÃO                │
           │                                       │  Taxa de fechamento
           └───────────────────┬───────────────────┘
                               │
    ┌──────────────────────────┼──────────────────────────┐
    │                      AQUISIÇÃO                       │
    │                                                      │  Leads, CPL
    └──────────────────────────┬──────────────────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────┐
│                        OPERAÇÃO                             │
│                                                             │  Tempo, Custo
└─────────────────────────────────────────────────────────────┘
```

---

## 2. KPIs ESTRATÉGICOS (C-Level)

### 2.1 North Star Metric

```
NORTH STAR: RECEITA RECORRENTE MENSAL (MRR)

Fórmula: Σ (Contratos ativos × Ticket médio)

META POR FASE:
├── Mês 3: R$ 30.000
├── Mês 6: R$ 75.000
├── Mês 12: R$ 180.000
└── Mês 24: R$ 400.000

COMPONENTES:
├── Novos contratos (entrada)
├── Upsell/Cross-sell (expansão)
├── Renovações (retenção)
└── Cancelamentos (churn)
```

### 2.2 KPIs de Resultado

```
┌─────────────────────────────────────────────────────────────────────┐
│                        KPIs ESTRATÉGICOS                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  FINANCEIROS                                                        │
│  ├── MRR (Receita Recorrente)           Meta: R$ 75k (M6)          │
│  ├── ARR (Receita Anual)                Meta: R$ 900k (M12)        │
│  ├── Ticket Médio                       Meta: R$ 2.500             │
│  ├── Margem Bruta                       Meta: > 75%                │
│  └── LTV (Lifetime Value)               Meta: R$ 5.000             │
│                                                                     │
│  CRESCIMENTO                                                        │
│  ├── MoM Growth (Mês a Mês)             Meta: > 15%                │
│  ├── Novos Clientes/Mês                 Meta: 30-40                │
│  ├── Taxa de Retenção                   Meta: > 85%                │
│  └── NPS (Net Promoter Score)           Meta: > 70                 │
│                                                                     │
│  EFICIÊNCIA                                                        │
│  ├── CAC (Custo Aquisição)              Meta: < R$ 150             │
│  ├── LTV/CAC                            Meta: > 3:1                │
│  ├── Payback Period                     Meta: < 2 meses            │
│  └── ROI de Marketing                   Meta: > 300%               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. KPIs DE MARKETING

### 3.1 Aquisição

```
MÉTRICAS DE TRÁFEGO:
├── Visitantes únicos/mês
│   └── Meta: 10.000 (M6), 30.000 (M12)
│
├── Origem do tráfego
│   ├── Google Ads: 40%
│   ├── Orgânico (SEO): 30%
│   ├── Direct: 15%
│   └── Referral: 15%
│
├── Bounce Rate
│   └── Meta: < 50%
│
└── Tempo na página
    └── Meta: > 2 minutos

MÉTRICAS DE LEAD:
├── Leads gerados/mês
│   └── Meta: 400 (M6), 1.000 (M12)
│
├── CPL (Custo por Lead)
│   ├── Google Ads: R$ 25-40
│   ├── SEO: R$ 5-10
│   └── Média: R$ 20
│
├── Taxa de conversão visitante→lead
│   └── Meta: > 4%
│
└── Leads qualificados (MQL)
    └── Meta: 60% dos leads
```

### 3.2 Métricas por Canal

```
GOOGLE ADS:
├── Impressões/mês: 500.000
├── Cliques/mês: 15.000
├── CTR (Click-through rate): 3%
├── CPC (Custo por clique): R$ 2,50
├── Conversões/mês: 300
├── Taxa de conversão: 2%
├── CPA (Custo por aquisição): R$ 125
└── ROAS (Return on Ad Spend): 400%

SEO/ORGÂNICO:
├── Posições Top 3: 50 keywords
├── Posições Top 10: 200 keywords
├── Tráfego orgânico: 5.000/mês
├── CTR médio SERP: 5%
├── Leads orgânicos: 200/mês
└── Custo efetivo: R$ 5/lead

WHATSAPP:
├── Conversas iniciadas: 600/mês
├── Taxa resposta: 95%
├── Conversão chat→lead: 70%
├── Leads qualificados: 300/mês
└── Tempo médio conversa: 8 min
```

---

## 4. KPIs DE VENDAS/CONVERSÃO

### 4.1 Funil de Conversão

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FUNIL DE CONVERSÃO                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  VISITANTES                                                         │
│  └── 10.000/mês ─────────────────────────────────────── 100%       │
│                                                                     │
│  LEADS (conversão)                                                  │
│  └── 400/mês ──────────────────────── 4% ──────────────── ↓        │
│                                                                     │
│  LEADS QUALIFICADOS (MQL)                                          │
│  └── 240/mês ──────────────────────── 60% ─────────────── ↓        │
│                                                                     │
│  PROPOSTAS ENVIADAS                                                │
│  └── 180/mês ──────────────────────── 75% ─────────────── ↓        │
│                                                                     │
│  CONTRATOS ASSINADOS                                               │
│  └── 36/mês ───────────────────────── 20% ─────────────── ↓        │
│                                                                     │
│  CONVERSÃO TOTAL: 0,36% (visitante → cliente)                      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 Métricas de Conversão

```
QUALIFICAÇÃO:
├── Taxa de qualificação: 60%
├── Tempo médio qualificação: 15 min
├── Motivos desqualificação:
│   ├── Fora do escopo: 40%
│   ├── Sem urgência: 30%
│   ├── Sem capacidade financeira: 20%
│   └── Outros: 10%
└── Score médio leads qualificados: 75/100

PROPOSTAS:
├── Taxa envio proposta: 75%
├── Tempo médio resposta: 4h
├── Taxa abertura proposta: 90%
├── Taxa aceitação: 20-25%
└── Ticket médio proposta: R$ 3.000

FECHAMENTO:
├── Taxa fechamento: 20%
├── Tempo médio (lead→cliente): 3 dias
├── Taxa pagamento 1ª tentativa: 85%
├── Taxa assinatura contrato: 95%
└── Conversão por produto:
    ├── Desbloqueio: 35%
    ├── Golpe PIX: 30%
    ├── Plano Saúde: 25%
    └── Usucapião: 15%
```

---

## 5. KPIs OPERACIONAIS

### 5.1 Produção Jurídica

```
GERAÇÃO DE DOCUMENTOS:
├── Documentos gerados/dia: 20
├── Tempo médio geração: 30 segundos
├── Taxa de aprovação 1ª revisão: 85%
├── Tempo médio revisão: 10 minutos
├── Retrabalho: < 15%
└── Custo IA/documento: R$ 0,50

PROTOCOLO:
├── Tempo médio (aprovação→protocolo): 24h
├── Taxa protocolo sem erros: 98%
├── Processos protocolados/semana: 35
└── Backlog máximo: 48h

ACOMPANHAMENTO:
├── Processos monitorados: 100%
├── Movimentações capturadas: 100%
├── Tempo resposta (movimentação): < 2h
├── Prazos cumpridos: 100%
└── Satisfação cliente (acompanhamento): > 4.5/5
```

### 5.2 Atendimento

```
WHATSAPP/CHAT:
├── Tempo primeira resposta: < 1 min (IA)
├── Tempo resposta humana: < 15 min
├── Taxa resolução IA: 70%
├── Escalonamento para humano: 30%
├── CSAT (satisfação): > 4.5/5
└── Conversas/dia: 50

SLA DE ATENDIMENTO:
├── Urgências: 1h
├── Dúvidas gerais: 4h
├── Documentos: 24h
├── Relatórios: 48h
└── Compliance: 95%
```

---

## 6. KPIs FINANCEIROS DETALHADOS

### 6.1 Receita

```
COMPOSIÇÃO DA RECEITA:
├── Proteção Financeira: 45%
│   ├── Desbloqueio: R$ 2.000-4.000
│   ├── Golpe PIX: R$ 2.500-5.000
│   └── Negativação: R$ 1.500-3.000
│
├── Proteção Patrimonial: 30%
│   ├── Usucapião: R$ 5.000-15.000
│   ├── Inventário: R$ 4.000-12.000
│   └── Regularização: R$ 3.000-8.000
│
├── Proteção Saúde: 20%
│   ├── Plano Saúde: R$ 2.000-5.000
│   ├── BPC/LOAS: R$ 1.500-3.500
│   └── INSS: R$ 2.000-4.000
│
└── Perícias: 5%
    ├── Grafotécnica: R$ 3.000-8.000
    └── Avaliação: R$ 2.000-6.000

MÉTRICAS DE RECEITA:
├── MRR: R$ 75.000 (meta M6)
├── Ticket médio: R$ 2.500
├── Receita recorrente vs única: 20/80
├── Crescimento MoM: 15%
└── Sazonalidade: +20% Jan, -10% Jul
```

### 6.2 Custos e Margem

```
ESTRUTURA DE CUSTOS:
├── Custos Variáveis (por contrato)
│   ├── Google Ads (CAC): R$ 100
│   ├── IA (produção): R$ 5
│   ├── Assinatura digital: R$ 3
│   ├── Taxas pagamento: 3%
│   └── Total variável: ~R$ 180
│
├── Custos Fixos (mensais)
│   ├── Ferramentas SaaS: R$ 2.000
│   ├── Judit.io: R$ 500
│   ├── Infraestrutura: R$ 300
│   ├── Marketing (mínimo): R$ 3.000
│   └── Total fixo: R$ 5.800
│
└── Margem
    ├── Margem bruta: 75%
    ├── Margem operacional: 60%
    └── Margem líquida: 50%

PONTO DE EQUILÍBRIO:
├── Custos fixos: R$ 5.800
├── Margem contribuição: R$ 1.875 (75% × R$ 2.500)
├── Break-even: 4 contratos/mês
└── Meta operação: 30+ contratos/mês
```

---

## 7. KPIs DE QUALIDADE

### 7.1 Satisfação do Cliente

```
NPS (NET PROMOTER SCORE):
├── Meta: > 70
├── Promotores (9-10): > 75%
├── Neutros (7-8): < 20%
├── Detratores (0-6): < 5%
└── Coleta: após conclusão do caso

CSAT (CUSTOMER SATISFACTION):
├── Atendimento inicial: > 4.5/5
├── Qualidade documentos: > 4.7/5
├── Acompanhamento processo: > 4.5/5
├── Resultado final: > 4.3/5
└── Média geral: > 4.5/5

CES (CUSTOMER EFFORT SCORE):
├── Facilidade contratação: > 4.5/5
├── Clareza comunicação: > 4.5/5
├── Simplicidade processo: > 4.5/5
└── Meta: "Extremamente fácil"
```

### 7.2 Qualidade Jurídica

```
TAXA DE SUCESSO:
├── Processos favoráveis: 78%
├── Parcialmente favoráveis: 12%
├── Desfavoráveis: 10%
└── Meta: > 80% favoráveis

POR ÁREA:
├── Desbloqueio: 90% sucesso
├── Golpe PIX: 75% sucesso
├── Plano Saúde: 85% sucesso
├── Usucapião: 95% sucesso
└── BPC/LOAS: 70% sucesso

QUALIDADE DOCUMENTAL:
├── Petições sem erro: 98%
├── Citações corretas: 95%
├── Formatação padrão: 99%
└── Retrabalho: < 15%
```

---

## 8. DASHBOARDS

### 8.1 Dashboard Executivo

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DASHBOARD EXECUTIVO - DEZ/2024                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   MRR        │  │  CLIENTES    │  │   NPS        │              │
│  │  R$ 45.000   │  │     32       │  │    72        │              │
│  │   ▲ +18%     │  │   ▲ +12      │  │   ▲ +5       │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   TICKET     │  │    CAC       │  │  LTV/CAC     │              │
│  │  R$ 2.400    │  │   R$ 120     │  │    3.2x      │              │
│  │   ▼ -4%      │  │   ▼ -8%      │  │   ▲ +0.3     │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  FUNIL DO MÊS                                                       │
│  ┌─────────────────────────────────────────────────────┐           │
│  │ Visitantes │ Leads │ Qualif │ Proposta │ Cliente   │           │
│  │   8.500    │  380  │  228   │   171    │    32     │           │
│  │   100%     │ 4.5%  │  60%   │   75%    │   19%     │           │
│  └─────────────────────────────────────────────────────┘           │
│                                                                     │
│  RECEITA POR PRODUTO          PRAZOS/PROCESSOS                     │
│  ├── Financeiro: 48%          ├── Ativos: 47                       │
│  ├── Patrimonial: 28%         ├── Prazos hoje: 3                   │
│  ├── Saúde: 20%               ├── Sucesso: 78%                     │
│  └── Perícias: 4%             └── Satisfação: 4.6/5                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 8.2 Dashboard Operacional

```
┌─────────────────────────────────────────────────────────────────────┐
│                   DASHBOARD OPERACIONAL - HOJE                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ATENDIMENTO                    PRODUÇÃO                           │
│  ├── Conversas ativas: 12       ├── Docs gerados: 8                │
│  ├── Aguardando: 3              ├── Aguardando revisão: 5          │
│  ├── Tempo médio: 4min          ├── Protocolados: 6                │
│  └── CSAT: 4.7/5                └── Tempo médio: 25s               │
│                                                                     │
│  LEADS HOJE                     PAGAMENTOS                         │
│  ├── Novos: 18                  ├── Recebidos: 4 (R$ 9.800)        │
│  ├── Qualificados: 11           ├── Pendentes: 6 (R$ 15.200)       │
│  ├── Propostas: 8               ├── Vencidos: 1                    │
│  └── Fechados: 2                └── Taxa sucesso: 87%              │
│                                                                     │
│  ALERTAS                                                           │
│  🔴 Prazo vencendo: Processo 0001234-56 (2h)                       │
│  🟡 Lead sem resposta há 4h: Maria Silva                           │
│  🟢 Sentença favorável: Processo 0007890-12                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 9. RELATÓRIOS AUTOMATIZADOS

### 9.1 Tipos de Relatórios

```
RELATÓRIO DIÁRIO (automático 8h):
├── Resumo do dia anterior
├── Leads e conversões
├── Prazos do dia
├── Alertas pendentes
└── Enviado: Email + Telegram

RELATÓRIO SEMANAL (segunda 9h):
├── Performance da semana
├── Comparativo com semana anterior
├── Funil completo
├── Top oportunidades
└── Enviado: Email

RELATÓRIO MENSAL (dia 1, 10h):
├── Fechamento do mês
├── Todas as métricas
├── Análise de tendências
├── Projeção próximo mês
└── Enviado: Email + PDF

RELATÓRIO TRIMESTRAL:
├── Análise estratégica
├── OKRs e metas
├── Ajustes necessários
└── Planejamento próximo trimestre
```

### 9.2 Implementação

```typescript
// src/lib/reports/automated-reports.ts

interface ReportConfig {
  type: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  channels: ('email' | 'telegram' | 'slack')[];
}

export async function generateDailyReport(): Promise<DailyReport> {
  const yesterday = getYesterday();
  
  return {
    date: yesterday,
    
    summary: {
      leads: await countLeads(yesterday),
      qualified: await countQualified(yesterday),
      proposals: await countProposals(yesterday),
      closed: await countClosed(yesterday),
      revenue: await sumRevenue(yesterday)
    },
    
    operations: {
      documentsGenerated: await countDocuments(yesterday),
      protocoled: await countProtocoled(yesterday),
      movements: await countMovements(yesterday)
    },
    
    alerts: await getActiveAlerts(),
    
    comparison: await compareWithPrevious(yesterday)
  };
}

// Cron job para envio
// 0 8 * * * (diário às 8h)
export async function sendDailyReport(): Promise<void> {
  const report = await generateDailyReport();
  const html = await renderReportTemplate('daily', report);
  
  // Email
  await sendEmail({
    to: ['leonardo@garcezpalha.com'],
    subject: `📊 Relatório Diário - ${report.date}`,
    html
  });
  
  // Telegram (resumo)
  await sendTelegram({
    chatId: process.env.TELEGRAM_ADMIN_CHAT,
    message: formatTelegramReport(report)
  });
}
```

---

## 10. METAS E OKRs

### 10.1 OKRs Trimestrais

```
Q1 2025 (Jan-Mar):

OBJETIVO 1: Estabelecer operação
├── KR1: 20 contratos/mês até março
├── KR2: MRR de R$ 40.000
├── KR3: NPS > 65
└── KR4: Taxa conversão > 15%

OBJETIVO 2: Otimizar aquisição
├── KR1: CPL < R$ 30
├── KR2: 300 leads/mês
├── KR3: 50 keywords top 10
└── KR4: ROAS > 300%

OBJETIVO 3: Automatizar produção
├── KR1: 80% docs gerados por IA
├── KR2: Tempo revisão < 15min
├── KR3: Retrabalho < 20%
└── KR4: 100% processos monitorados
```

### 10.2 Metas Anuais 2025

```
┌─────────────────────────────────────────────────────────────────────┐
│                        METAS 2025                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  RECEITA                                                           │
│  ├── MRR Dez/2025: R$ 200.000                                      │
│  ├── Faturamento anual: R$ 1.500.000                               │
│  └── Crescimento: 400% YoY                                         │
│                                                                     │
│  CLIENTES                                                          │
│  ├── Base ativa: 150 clientes                                      │
│  ├── Novos/mês (média): 50                                         │
│  └── Churn: < 10%                                                  │
│                                                                     │
│  OPERAÇÃO                                                          │
│  ├── Processos ativos: 300                                         │
│  ├── Taxa sucesso: > 80%                                           │
│  └── NPS: > 75                                                     │
│                                                                     │
│  MARKETING                                                         │
│  ├── Tráfego: 50.000/mês                                           │
│  ├── Leads: 2.000/mês                                              │
│  └── CAC: < R$ 100                                                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 11. FERRAMENTAS DE ANALYTICS

### 11.1 Stack de Métricas

```
COLETA:
├── Google Analytics 4 (site)
├── Google Ads (campanhas)
├── Hotjar (comportamento)
├── Supabase (dados internos)
└── APIs (WhatsApp, pagamentos)

PROCESSAMENTO:
├── Supabase (queries SQL)
├── n8n (automação)
└── Scripts TypeScript

VISUALIZAÇÃO:
├── Dashboard interno (React)
├── Google Data Studio
├── Notion (relatórios)
└── Telegram (alertas)

ALERTAS:
├── n8n (workflows)
├── Telegram Bot
└── Email (críticos)
```

### 11.2 Implementação do Dashboard

```typescript
// src/lib/analytics/dashboard.ts

export async function getDashboardData(
  period: 'today' | 'week' | 'month'
): Promise<DashboardData> {
  const dateRange = getDateRange(period);
  
  const [
    leads,
    conversions,
    revenue,
    operations,
    satisfaction
  ] = await Promise.all([
    getLeadMetrics(dateRange),
    getConversionMetrics(dateRange),
    getRevenueMetrics(dateRange),
    getOperationalMetrics(dateRange),
    getSatisfactionMetrics(dateRange)
  ]);

  return {
    period,
    leads,
    conversions,
    revenue,
    operations,
    satisfaction,
    trends: calculateTrends(period),
    alerts: await getActiveAlerts()
  };
}

// API endpoint
// GET /api/dashboard?period=week
export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get('period') || 'today';
  const data = await getDashboardData(period as any);
  return NextResponse.json(data);
}
```

---

## 12. CHECKLIST DE IMPLEMENTAÇÃO

```
FASE 1: INFRAESTRUTURA
[ ] Configurar Google Analytics 4
[ ] Implementar tracking de eventos
[ ] Configurar conversões Google Ads
[ ] Criar tabelas de métricas no Supabase

FASE 2: COLETA DE DADOS
[ ] Implementar captura de leads
[ ] Rastrear funil de conversão
[ ] Monitorar pagamentos
[ ] Registrar operações

FASE 3: DASHBOARDS
[ ] Dashboard executivo
[ ] Dashboard operacional
[ ] Dashboard de marketing
[ ] Mobile-friendly

FASE 4: AUTOMAÇÃO
[ ] Relatório diário automático
[ ] Relatório semanal
[ ] Alertas em tempo real
[ ] Exportação de dados

FASE 5: OTIMIZAÇÃO
[ ] Testes A/B
[ ] Análise de cohort
[ ] Previsão de métricas
[ ] Ajuste contínuo de metas
```

---

*Documento: 16-METRICAS-KPIS.md*
*Versão: 1.0*
