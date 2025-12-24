/**
 * CEO Agent Prompts
 * Prompts for strategic orchestration and executive decisions
 */

// =============================================================================
// SYSTEM PROMPT
// =============================================================================

export const CEO_AGENT_SYSTEM_PROMPT = `Você é o CEO IA do escritório Garcez Palha Advogados, responsável por:
- Orquestração estratégica de todos os agentes
- Priorização de iniciativas e recursos
- Decisões de alto nível
- Visão holística do negócio
- Briefings executivos diários

CONTEXTO DO ESCRITÓRIO:
- Áreas: Imobiliário, Família, Empresarial, Trabalhista, Consumidor
- Mercado: Lisboa, Portugal
- Meta: €75.000 MRR em 6 meses
- Equipa: Sócios + advogados + admin + sistema IA

HIERARQUIA DE AGENTES:
1. CEO (Você) - Estratégia e coordenação
2. C-Level (CMO, COO, CFO) - Áreas funcionais
3. Especialistas (Marketing, Operações, Inteligência)
4. Agentes Jurídicos (8 especializações)

PRINCÍPIOS ESTRATÉGICOS:
1. Crescimento sustentável
2. Qualidade antes de quantidade
3. Tecnologia como diferencial
4. Cliente no centro
5. Eficiência operacional

NÍVEIS DE AUTONOMIA:
- Nível 1: Decisões automáticas (< €100 impacto)
- Nível 2: Decisões com notificação (€100-500)
- Nível 3: Decisões com aprovação (€500-2000)
- Nível 4: Escalação obrigatória (> €2000)

MÉTRICAS CHAVE:
- MRR e crescimento
- Taxa de conversão
- NPS clientes
- Eficiência operacional
- ROI marketing

Responda sempre em português de Portugal.
Forneça decisões claras e acionáveis.
Priorize com base em impacto e urgência.`

// =============================================================================
// STRATEGIC PROMPTS
// =============================================================================

export const DAILY_BRIEFING_PROMPT = `Gere briefing executivo diário.

FORMATO JSON:
{
  "date": "string",
  "executiveSummary": "string",
  "keyMetrics": {
    "mrr": { "value": number, "change": number, "status": "on_track" | "at_risk" | "behind" },
    "newLeads": { "value": number, "change": number },
    "conversions": { "value": number, "rate": number },
    "revenue": { "value": number, "change": number }
  },
  "criticalAlerts": [{
    "severity": "critical" | "high" | "medium",
    "area": "string",
    "message": "string",
    "action": "string",
    "owner": "string"
  }],
  "topPriorities": [{
    "rank": number,
    "initiative": "string",
    "status": "on_track" | "delayed" | "blocked",
    "nextAction": "string",
    "deadline": "string"
  }],
  "agentPerformance": [{
    "agent": "string",
    "tasksCompleted": number,
    "successRate": number,
    "avgResponseTime": number,
    "issues": ["string"]
  }],
  "decisionsNeeded": [{
    "id": "string",
    "type": "string",
    "description": "string",
    "options": ["string"],
    "recommendation": "string",
    "deadline": "string",
    "impact": "high" | "medium" | "low"
  }],
  "todaysFocus": [{
    "area": "string",
    "objective": "string",
    "assignedTo": "string"
  }],
  "risks": [{
    "risk": "string",
    "probability": "high" | "medium" | "low",
    "impact": "high" | "medium" | "low",
    "mitigation": "string"
  }]
}`

export const STRATEGIC_DECISION_PROMPT = `Analise e recomende decisão estratégica.

FORMATO JSON:
{
  "decisionContext": {
    "title": "string",
    "background": "string",
    "urgency": "immediate" | "this_week" | "this_month",
    "impact": "high" | "medium" | "low",
    "reversibility": "easily_reversible" | "partially_reversible" | "irreversible"
  },
  "options": [{
    "id": "string",
    "name": "string",
    "description": "string",
    "pros": ["string"],
    "cons": ["string"],
    "estimatedCost": number,
    "estimatedBenefit": number,
    "riskLevel": "high" | "medium" | "low",
    "timeToImplement": "string",
    "resourcesRequired": ["string"]
  }],
  "analysis": {
    "marketFactors": ["string"],
    "internalFactors": ["string"],
    "competitiveImplications": "string",
    "financialImplications": "string"
  },
  "recommendation": {
    "chosenOption": "string",
    "rationale": "string",
    "confidence": number,
    "conditions": ["string"],
    "fallbackPlan": "string"
  },
  "implementation": {
    "immediateSteps": ["string"],
    "timeline": "string",
    "successMetrics": ["string"],
    "reviewDate": "string"
  },
  "approvalLevel": "auto" | "notify" | "approve" | "escalate"
}`

export const RESOURCE_ALLOCATION_PROMPT = `Otimize alocação de recursos.

FORMATO JSON:
{
  "period": { "start": "string", "end": "string" },
  "totalBudget": number,
  "currentAllocation": [{
    "area": "string",
    "budget": number,
    "spent": number,
    "roi": number,
    "efficiency": number
  }],
  "recommendedAllocation": [{
    "area": "string",
    "currentBudget": number,
    "recommendedBudget": number,
    "change": number,
    "changePercent": number,
    "rationale": "string",
    "expectedROI": number
  }],
  "reallocationPlan": [{
    "from": "string",
    "to": "string",
    "amount": number,
    "reason": "string",
    "expectedImpact": "string"
  }],
  "priorityRanking": [{
    "rank": number,
    "area": "string",
    "priority": "critical" | "high" | "medium" | "low",
    "justification": "string"
  }],
  "constraints": {
    "minimumByArea": [{ "area": "string", "minimum": number }],
    "maximumByArea": [{ "area": "string", "maximum": number }],
    "reserveRequired": number
  },
  "risks": [{
    "scenario": "string",
    "adjustmentNeeded": "string"
  }]
}`

export const PRIORITY_MATRIX_PROMPT = `Crie matriz de priorização de iniciativas.

FORMATO JSON:
{
  "evaluationDate": "string",
  "initiatives": [{
    "id": "string",
    "name": "string",
    "description": "string",
    "owner": "string",
    "scores": {
      "impact": number,
      "effort": number,
      "urgency": number,
      "strategicFit": number,
      "risk": number
    },
    "weightedScore": number,
    "quadrant": "do_first" | "schedule" | "delegate" | "eliminate",
    "timeline": "string",
    "dependencies": ["string"],
    "blockers": ["string"]
  }],
  "priorityOrder": [{
    "rank": number,
    "initiativeId": "string",
    "rationale": "string"
  }],
  "resourceMapping": [{
    "initiativeId": "string",
    "requiredResources": ["string"],
    "availableResources": ["string"],
    "gap": ["string"]
  }],
  "recommendations": {
    "startImmediately": ["string"],
    "scheduleForNextWeek": ["string"],
    "delegateToTeam": ["string"],
    "deprioritize": ["string"]
  }
}`

// =============================================================================
// COORDINATION PROMPTS
// =============================================================================

export const AGENT_COORDINATION_PROMPT = `Coordene atividades entre agentes.

FORMATO JSON:
{
  "coordinationPlan": {
    "objective": "string",
    "timeframe": "string",
    "involvedAgents": ["string"]
  },
  "taskAssignments": [{
    "taskId": "string",
    "task": "string",
    "assignedAgent": "string",
    "priority": "critical" | "high" | "medium" | "low",
    "deadline": "string",
    "dependencies": [{
      "taskId": "string",
      "type": "blocks" | "depends_on" | "related"
    }],
    "expectedOutput": "string",
    "successCriteria": ["string"]
  }],
  "handoffs": [{
    "fromAgent": "string",
    "toAgent": "string",
    "trigger": "string",
    "data": ["string"],
    "validation": "string"
  }],
  "milestones": [{
    "name": "string",
    "date": "string",
    "criteria": ["string"],
    "responsibleAgents": ["string"]
  }],
  "escalationRules": [{
    "condition": "string",
    "action": "string",
    "notify": ["string"]
  }],
  "monitoringPlan": {
    "checkpoints": ["string"],
    "kpis": [{
      "metric": "string",
      "target": number,
      "threshold": number
    }],
    "reportingFrequency": "string"
  }
}`

export const ESCALATION_HANDLING_PROMPT = `Processe escalação e determine ação.

FORMATO JSON:
{
  "escalation": {
    "id": "string",
    "type": "customer_issue" | "operational_failure" | "decision_required" | "resource_constraint" | "compliance",
    "source": "string",
    "severity": "critical" | "high" | "medium" | "low",
    "receivedAt": "string"
  },
  "context": {
    "summary": "string",
    "history": ["string"],
    "stakeholders": ["string"],
    "currentStatus": "string"
  },
  "analysis": {
    "rootCause": "string",
    "impact": {
      "financial": number,
      "reputational": "high" | "medium" | "low",
      "operational": "high" | "medium" | "low"
    },
    "timeToResolve": "string",
    "resourcesNeeded": ["string"]
  },
  "resolution": {
    "decision": "string",
    "rationale": "string",
    "immediateActions": [{
      "action": "string",
      "owner": "string",
      "deadline": "string"
    }],
    "followUpActions": [{
      "action": "string",
      "owner": "string",
      "deadline": "string"
    }],
    "communicationPlan": {
      "internal": "string",
      "external": "string"
    }
  },
  "prevention": {
    "processChanges": ["string"],
    "additionalMonitoring": ["string"],
    "trainingNeeded": ["string"]
  },
  "approvalRequired": boolean,
  "escalateToHuman": boolean,
  "humanEscalationReason": "string"
}`

// =============================================================================
// REPORTING PROMPTS
// =============================================================================

export const WEEKLY_EXECUTIVE_REPORT_PROMPT = `Gere relatório executivo semanal.

FORMATO JSON:
{
  "period": { "weekNumber": number, "start": "string", "end": "string" },
  "executiveSummary": "string",
  "keyHighlights": [{
    "type": "achievement" | "concern" | "opportunity",
    "description": "string",
    "impact": "string"
  }],
  "financialPerformance": {
    "revenue": { "actual": number, "target": number, "variance": number },
    "mrr": { "current": number, "growth": number, "target": number },
    "expenses": { "actual": number, "budget": number, "variance": number },
    "cashPosition": number,
    "runway": number
  },
  "operationalPerformance": {
    "leadsGenerated": number,
    "conversions": number,
    "casesCompleted": number,
    "avgResponseTime": number,
    "customerSatisfaction": number
  },
  "marketingPerformance": {
    "contentPublished": number,
    "engagement": number,
    "websiteTraffic": number,
    "adSpend": number,
    "adROI": number
  },
  "agentPerformance": [{
    "category": "string",
    "tasksCompleted": number,
    "successRate": number,
    "autonomyLevel": number,
    "issuesResolved": number
  }],
  "strategicProgress": [{
    "initiative": "string",
    "progress": number,
    "status": "on_track" | "delayed" | "at_risk" | "completed",
    "nextMilestone": "string"
  }],
  "issuesAndRisks": [{
    "issue": "string",
    "severity": "high" | "medium" | "low",
    "status": "open" | "in_progress" | "resolved",
    "action": "string"
  }],
  "nextWeekPriorities": [{
    "priority": "string",
    "owner": "string",
    "expectedOutcome": "string"
  }],
  "decisionsRequired": [{
    "decision": "string",
    "deadline": "string",
    "options": ["string"]
  }]
}`

export const MONTHLY_STRATEGIC_REVIEW_PROMPT = `Gere revisão estratégica mensal.

FORMATO JSON:
{
  "period": { "month": "string", "year": number },
  "executiveSummary": "string",
  "strategicGoalsProgress": [{
    "goal": "string",
    "target": number,
    "actual": number,
    "progress": number,
    "status": "exceeded" | "on_track" | "behind" | "at_risk",
    "actions": ["string"]
  }],
  "financialReview": {
    "monthlyRevenue": number,
    "mrr": number,
    "mrrGrowth": number,
    "grossMargin": number,
    "netMargin": number,
    "cashFlow": number,
    "runway": number,
    "vsLastMonth": {
      "revenue": number,
      "mrr": number,
      "margin": number
    },
    "vsTarget": {
      "revenue": number,
      "mrr": number
    }
  },
  "marketPosition": {
    "marketShare": number,
    "competitorMoves": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "operationalReview": {
    "efficiency": number,
    "quality": number,
    "capacity": number,
    "bottlenecks": ["string"],
    "improvements": ["string"]
  },
  "teamAndCulture": {
    "headcount": number,
    "agentCount": number,
    "autonomyLevel": number,
    "humanInterventions": number,
    "trainingNeeds": ["string"]
  },
  "strategicRecommendations": [{
    "area": "string",
    "recommendation": "string",
    "rationale": "string",
    "investment": number,
    "expectedROI": number,
    "timeline": "string"
  }],
  "nextMonthFocus": [{
    "priority": number,
    "focus": "string",
    "objectives": ["string"],
    "resources": ["string"]
  }],
  "risksAndMitigation": [{
    "risk": "string",
    "probability": "high" | "medium" | "low",
    "impact": "high" | "medium" | "low",
    "mitigation": "string",
    "owner": "string"
  }]
}`

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get decision approval level based on impact
 */
export function getApprovalLevel(
  financialImpact: number,
  riskLevel: 'high' | 'medium' | 'low',
  reversibility: 'easily_reversible' | 'partially_reversible' | 'irreversible'
): 'auto' | 'notify' | 'approve' | 'escalate' {
  // Financial thresholds (in EUR)
  if (financialImpact > 2000 || reversibility === 'irreversible') {
    return 'escalate'
  }
  if (financialImpact > 500 || riskLevel === 'high') {
    return 'approve'
  }
  if (financialImpact > 100 || riskLevel === 'medium') {
    return 'notify'
  }
  return 'auto'
}

/**
 * Calculate priority score
 */
export function calculatePriorityScore(
  impact: number,
  effort: number,
  urgency: number,
  strategicFit: number
): { score: number; quadrant: string } {
  // ICE-like scoring with strategic fit
  const score = (impact * 0.35 + urgency * 0.25 + strategicFit * 0.25 - effort * 0.15) * 10

  // Determine quadrant based on impact vs effort
  const quadrant =
    impact >= 7 && effort <= 5 ? 'do_first' :
    impact >= 7 && effort > 5 ? 'schedule' :
    impact < 7 && effort <= 5 ? 'delegate' :
    'eliminate'

  return { score: Math.round(score * 10) / 10, quadrant }
}

/**
 * Get strategic KPIs
 */
export function getStrategicKPIs(): Array<{
  metric: string
  category: string
  target: number
  frequency: string
}> {
  return [
    { metric: 'MRR', category: 'financial', target: 75000, frequency: 'monthly' },
    { metric: 'MRR Growth Rate', category: 'financial', target: 15, frequency: 'monthly' },
    { metric: 'Net Margin', category: 'financial', target: 25, frequency: 'monthly' },
    { metric: 'Lead Conversion Rate', category: 'sales', target: 15, frequency: 'weekly' },
    { metric: 'Customer NPS', category: 'customer', target: 70, frequency: 'quarterly' },
    { metric: 'Agent Autonomy Rate', category: 'operations', target: 90, frequency: 'daily' },
    { metric: 'Content Published', category: 'marketing', target: 21, frequency: 'weekly' },
    { metric: 'Ad ROAS', category: 'marketing', target: 300, frequency: 'weekly' },
  ]
}

/**
 * Determine escalation severity
 */
export function determineEscalationSeverity(
  financialImpact: number,
  customersAffected: number,
  timeToResolve: number // hours
): 'critical' | 'high' | 'medium' | 'low' {
  if (financialImpact > 5000 || customersAffected > 10 || timeToResolve > 48) {
    return 'critical'
  }
  if (financialImpact > 1000 || customersAffected > 5 || timeToResolve > 24) {
    return 'high'
  }
  if (financialImpact > 100 || customersAffected > 1 || timeToResolve > 8) {
    return 'medium'
  }
  return 'low'
}
