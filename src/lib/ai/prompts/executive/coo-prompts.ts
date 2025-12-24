/**
 * COO Agent Prompts
 * Prompts for operations coordination and efficiency
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const COO_AGENT_SYSTEM_PROMPT = `Você é o COO IA do escritório Garcez Palha Advogados, responsável por:
- Coordenar operações diárias do escritório
- Garantir SLAs de atendimento
- Otimizar processos e workflows
- Gestão de capacidade e recursos
- Qualidade operacional

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Equipa: Sócios + advogados associados + admin
- Sistema: Plataforma IA com agentes especializados
- Meta: 95% atendimento automático, NPS > 70

AGENTES SOB COORDENAÇÃO:
1. QA Agent - Revisão de qualidade
2. Admin Agent - Tarefas administrativas
3. Triagem Agent - Qualificação de leads
4. Production Agent - Geração de documentos

SLAs OPERACIONAIS:
- Primeiro contacto lead: < 30 segundos
- Qualificação completa: < 5 minutos
- Proposta gerada: < 15 minutos
- Documento revisado: < 2 horas
- Resposta suporte: < 1 hora

MÉTRICAS CHAVE:
- Tempo médio de resposta
- Taxa de resolução no primeiro contacto
- Backlog de tarefas
- Capacidade utilizada
- Taxa de erros
- NPS operacional

PROCESSOS CORE:
1. Lead → Triagem → Qualificação → Proposta → Contrato → Onboarding
2. Consulta → Análise → Parecer → Revisão → Entrega
3. Suporte → Classificação → Resolução → Follow-up

PRIORIDADES:
1. Cliente sempre responde em tempo
2. Qualidade nunca é comprometida
3. Escalação quando necessário
4. Melhoria contínua

Responda sempre em português de Portugal.
Foque em eficiência e qualidade.`

// =============================================================================
// OPERATIONS PROMPTS
// =============================================================================

export const OPERATIONS_DASHBOARD_PROMPT = `Gere dashboard operacional em tempo real.

FORMATO JSON:
{
  "timestamp": "string",
  "status": "healthy" | "warning" | "critical",
  "realTimeMetrics": {
    "activeLeads": number,
    "pendingTasks": number,
    "avgResponseTime": number,
    "agentsOnline": number,
    "systemLoad": number
  },
  "slaStatus": [{
    "sla": "string",
    "target": "string",
    "current": "string",
    "status": "met" | "at_risk" | "breached",
    "trend": "improving" | "stable" | "declining"
  }],
  "queues": [{
    "queue": "string",
    "items": number,
    "avgWaitTime": number,
    "oldestItem": "string",
    "assignedAgents": number
  }],
  "agentStatus": [{
    "agent": "string",
    "status": "active" | "busy" | "idle" | "offline",
    "currentTask": "string",
    "tasksCompleted": number,
    "avgTaskTime": number
  }],
  "alerts": [{
    "severity": "critical" | "warning" | "info",
    "message": "string",
    "action": "string",
    "timestamp": "string"
  }],
  "recentIssues": [{
    "issue": "string",
    "status": "open" | "resolving" | "resolved",
    "impact": "high" | "medium" | "low",
    "assignedTo": "string"
  }]
}`

export const CAPACITY_PLANNING_PROMPT = `Analise e planeie capacidade operacional.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "currentCapacity": {
    "totalHours": number,
    "utilizationRate": number,
    "bottlenecks": ["string"]
  },
  "demandForecast": [{
    "week": number,
    "expectedLeads": number,
    "expectedCases": number,
    "requiredCapacity": number
  }],
  "gapAnalysis": {
    "capacityGap": number,
    "criticalPeriods": ["string"],
    "overCapacity": ["string"]
  },
  "recommendations": [{
    "area": "string",
    "currentCapacity": number,
    "requiredCapacity": number,
    "gap": number,
    "solution": "string",
    "cost": number,
    "timeline": "string"
  }],
  "agentCapacity": [{
    "agent": "string",
    "maxTasksPerDay": number,
    "currentLoad": number,
    "availability": number,
    "canTakeMore": boolean
  }],
  "contingencyPlan": {
    "triggers": ["string"],
    "actions": ["string"],
    "backup": ["string"]
  }
}`

export const PROCESS_OPTIMIZATION_PROMPT = `Identifique oportunidades de otimização de processos.

FORMATO JSON:
{
  "analysisDate": "string",
  "processesAnalyzed": [{
    "process": "string",
    "steps": number,
    "avgDuration": "string",
    "errorRate": number,
    "bottlenecks": [{
      "step": "string",
      "issue": "string",
      "impact": "string"
    }],
    "automationLevel": number
  }],
  "inefficiencies": [{
    "area": "string",
    "issue": "string",
    "timeLost": "string",
    "costImpact": number,
    "frequency": "daily" | "weekly" | "monthly"
  }],
  "optimizations": [{
    "id": "string",
    "process": "string",
    "currentState": "string",
    "proposedState": "string",
    "benefit": {
      "timeSaved": "string",
      "costSaved": number,
      "qualityImprovement": number
    },
    "effort": "low" | "medium" | "high",
    "priority": "critical" | "high" | "medium" | "low",
    "implementation": {
      "steps": ["string"],
      "timeline": "string",
      "resources": ["string"]
    }
  }],
  "automationOpportunities": [{
    "task": "string",
    "currentlyManual": boolean,
    "canAutomate": boolean,
    "savingsPerMonth": number,
    "implementationCost": number
  }],
  "quickWins": [{
    "action": "string",
    "effort": "low",
    "impact": "high" | "medium",
    "implementBy": "string"
  }]
}`

// =============================================================================
// QUALITY PROMPTS
// =============================================================================

export const QUALITY_METRICS_PROMPT = `Analise métricas de qualidade operacional.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "overallScore": number,
  "byCategory": [{
    "category": "string",
    "score": number,
    "trend": "improving" | "stable" | "declining",
    "issues": number
  }],
  "errorAnalysis": {
    "totalErrors": number,
    "byType": [{
      "type": "string",
      "count": number,
      "severity": "critical" | "major" | "minor",
      "rootCause": "string"
    }],
    "errorRate": number,
    "trending": "up" | "stable" | "down"
  },
  "customerFeedback": {
    "nps": number,
    "satisfactionScore": number,
    "complaints": number,
    "compliments": number,
    "topIssues": ["string"],
    "topPraises": ["string"]
  },
  "slaCompliance": {
    "overall": number,
    "bySla": [{
      "sla": "string",
      "compliance": number,
      "breaches": number
    }]
  },
  "qualityActions": [{
    "action": "string",
    "targetMetric": "string",
    "expectedImprovement": number,
    "owner": "string",
    "deadline": "string"
  }]
}`

export const INCIDENT_ANALYSIS_PROMPT = `Analise incidente e proponha ações.

FORMATO JSON:
{
  "incident": {
    "id": "string",
    "type": "string",
    "severity": "critical" | "major" | "minor",
    "occurredAt": "string",
    "resolvedAt": "string",
    "duration": "string"
  },
  "impact": {
    "customersAffected": number,
    "tasksDelayed": number,
    "revenueImpact": number,
    "reputationImpact": "high" | "medium" | "low"
  },
  "rootCause": {
    "category": "process" | "system" | "human" | "external",
    "description": "string",
    "contributingFactors": ["string"]
  },
  "timeline": [{
    "time": "string",
    "event": "string",
    "action": "string"
  }],
  "resolution": {
    "immediateActions": ["string"],
    "workarounds": ["string"],
    "permanentFix": "string"
  },
  "prevention": {
    "processChanges": ["string"],
    "systemChanges": ["string"],
    "training": ["string"],
    "monitoring": ["string"]
  },
  "lessonsLearned": ["string"],
  "followUp": [{
    "action": "string",
    "owner": "string",
    "deadline": "string",
    "status": "pending" | "in_progress" | "completed"
  }]
}`

// =============================================================================
// COORDINATION PROMPTS
// =============================================================================

export const AGENT_WORKLOAD_PROMPT = `Balanceie carga de trabalho entre agentes.

FORMATO JSON:
{
  "timestamp": "string",
  "totalPendingTasks": number,
  "agents": [{
    "agent": "string",
    "status": "available" | "busy" | "overloaded",
    "currentTasks": number,
    "maxCapacity": number,
    "utilization": number,
    "avgTaskTime": number,
    "specialties": ["string"]
  }],
  "taskQueue": [{
    "taskId": "string",
    "type": "string",
    "priority": "critical" | "high" | "medium" | "low",
    "waitTime": "string",
    "requiredSkills": ["string"],
    "currentlyAssigned": "string"
  }],
  "rebalancing": [{
    "taskId": "string",
    "from": "string",
    "to": "string",
    "reason": "string"
  }],
  "newAssignments": [{
    "taskId": "string",
    "assignTo": "string",
    "reason": "string",
    "expectedCompletion": "string"
  }],
  "alerts": [{
    "type": "overload" | "underutilized" | "skill_gap" | "sla_risk",
    "agent": "string",
    "message": "string",
    "action": "string"
  }]
}`

export const ESCALATION_RULES_PROMPT = `Defina regras de escalação operacional.

FORMATO JSON:
{
  "rules": [{
    "id": "string",
    "name": "string",
    "trigger": {
      "condition": "string",
      "threshold": number,
      "timeWindow": "string"
    },
    "actions": [{
      "action": "string",
      "target": "string",
      "notification": "string"
    }],
    "priority": "critical" | "high" | "medium" | "low",
    "active": boolean
  }],
  "escalationPath": [{
    "level": number,
    "name": "string",
    "owner": "string",
    "timeToEscalate": "string",
    "canResolve": ["string"]
  }],
  "notifications": [{
    "event": "string",
    "channels": ["string"],
    "recipients": ["string"],
    "frequency": "immediate" | "hourly" | "daily"
  }],
  "overrides": [{
    "scenario": "string",
    "overrideAction": "string",
    "approvedBy": "string"
  }]
}`

// =============================================================================
// REPORTING PROMPTS
// =============================================================================

export const DAILY_OPERATIONS_REPORT_PROMPT = `Gere relatório operacional diário.

FORMATO JSON:
{
  "date": "string",
  "executiveSummary": "string",
  "metrics": {
    "leadsProcessed": number,
    "tasksCompleted": number,
    "avgResponseTime": "string",
    "slaCompliance": number,
    "errorRate": number,
    "customerSatisfaction": number
  },
  "highlights": [{
    "type": "achievement" | "issue" | "milestone",
    "description": "string"
  }],
  "issues": [{
    "issue": "string",
    "severity": "high" | "medium" | "low",
    "status": "open" | "resolving" | "resolved",
    "action": "string"
  }],
  "agentPerformance": [{
    "agent": "string",
    "tasksCompleted": number,
    "avgTime": "string",
    "quality": number,
    "status": "excellent" | "good" | "needs_attention"
  }],
  "bottlenecks": [{
    "area": "string",
    "severity": "string",
    "action": "string"
  }],
  "tomorrowFocus": ["string"]
}`

export const WEEKLY_OPERATIONS_REPORT_PROMPT = `Gere relatório operacional semanal.

FORMATO JSON:
{
  "period": { "weekNumber": number, "start": "string", "end": "string" },
  "executiveSummary": "string",
  "kpis": [{
    "kpi": "string",
    "target": number,
    "actual": number,
    "status": "exceeded" | "met" | "missed",
    "trend": "improving" | "stable" | "declining"
  }],
  "volumeMetrics": {
    "leadsReceived": number,
    "leadsQualified": number,
    "proposalsSent": number,
    "contractsSigned": number,
    "casesCompleted": number
  },
  "qualityMetrics": {
    "firstContactResolution": number,
    "errorRate": number,
    "reworkRate": number,
    "customerSatisfaction": number
  },
  "efficiencyMetrics": {
    "avgLeadToProposal": "string",
    "avgProposalToContract": "string",
    "capacityUtilization": number,
    "automationRate": number
  },
  "issues": [{
    "issue": "string",
    "impact": "string",
    "resolution": "string",
    "preventionAction": "string"
  }],
  "improvements": [{
    "area": "string",
    "improvement": "string",
    "measuredImpact": "string"
  }],
  "nextWeekPriorities": [{
    "priority": "string",
    "owner": "string",
    "expectedOutcome": "string"
  }]
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate operational health score
 */
export function calculateOperationalHealth(metrics: {
  slaCompliance: number
  errorRate: number
  capacityUtilization: number
  customerSatisfaction: number
}): { score: number; status: 'excellent' | 'good' | 'fair' | 'critical' } {
  let score = 0

  // SLA Compliance (max 30 points)
  score += (metrics.slaCompliance / 100) * 30

  // Error Rate (max 25 points, inverted)
  score += Math.max(0, 25 - (metrics.errorRate * 250))

  // Capacity Utilization (max 20 points, optimal is 70-85%)
  const utilization = metrics.capacityUtilization
  if (utilization >= 0.7 && utilization <= 0.85) score += 20
  else if (utilization >= 0.6 && utilization <= 0.9) score += 15
  else if (utilization >= 0.5 && utilization <= 0.95) score += 10
  else score += 5

  // Customer Satisfaction (max 25 points)
  score += (metrics.customerSatisfaction / 100) * 25

  const status =
    score >= 85 ? 'excellent' :
    score >= 70 ? 'good' :
    score >= 50 ? 'fair' :
    'critical'

  return { score: Math.round(score), status }
}

/**
 * Get SLA definitions
 */
export function getSLADefinitions(): Array<{
  name: string
  target: string
  critical: boolean
}> {
  return [
    { name: 'Primeiro Contacto Lead', target: '< 30 segundos', critical: true },
    { name: 'Qualificação Completa', target: '< 5 minutos', critical: true },
    { name: 'Proposta Gerada', target: '< 15 minutos', critical: false },
    { name: 'Documento Revisado', target: '< 2 horas', critical: false },
    { name: 'Resposta Suporte', target: '< 1 hora', critical: true },
    { name: 'Escalação Resolvida', target: '< 4 horas', critical: true },
  ]
}

/**
 * Get escalation levels
 */
export function getEscalationLevels(): Array<{
  level: number
  name: string
  timeToEscalate: string
}> {
  return [
    { level: 1, name: 'Agent Especializado', timeToEscalate: '15 minutos' },
    { level: 2, name: 'COO IA', timeToEscalate: '30 minutos' },
    { level: 3, name: 'CEO IA', timeToEscalate: '1 hora' },
    { level: 4, name: 'Equipa Humana', timeToEscalate: '2 horas' },
  ]
}
