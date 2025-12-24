/**
 * COO Agent
 * Responsible for operations coordination and efficiency
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  COO_AGENT_SYSTEM_PROMPT,
  OPERATIONS_DASHBOARD_PROMPT,
  CAPACITY_PLANNING_PROMPT,
  PROCESS_OPTIMIZATION_PROMPT,
  QUALITY_METRICS_PROMPT,
  INCIDENT_ANALYSIS_PROMPT,
  AGENT_WORKLOAD_PROMPT,
  ESCALATION_RULES_PROMPT,
  DAILY_OPERATIONS_REPORT_PROMPT,
  WEEKLY_OPERATIONS_REPORT_PROMPT,
  calculateOperationalHealth,
  getSLADefinitions,
  getEscalationLevels,
} from '../../prompts/executive/coo-prompts'

// =============================================================================
// TYPES
// =============================================================================

export interface OperationsDashboard {
  timestamp: string
  status: 'healthy' | 'warning' | 'critical'
  realTimeMetrics: {
    activeLeads: number
    pendingTasks: number
    avgResponseTime: number
    agentsOnline: number
    systemLoad: number
  }
  slaStatus: Array<{
    sla: string
    target: string
    current: string
    status: 'met' | 'at_risk' | 'breached'
    trend: 'improving' | 'stable' | 'declining'
  }>
  queues: Array<{
    queue: string
    items: number
    avgWaitTime: number
    oldestItem: string
    assignedAgents: number
  }>
  agentStatus: Array<{
    agent: string
    status: 'active' | 'busy' | 'idle' | 'offline'
    currentTask: string
    tasksCompleted: number
    avgTaskTime: number
  }>
  alerts: Array<{
    severity: 'critical' | 'warning' | 'info'
    message: string
    action: string
    timestamp: string
  }>
}

export interface CapacityPlanning {
  period: { start: string; end: string }
  currentCapacity: {
    totalHours: number
    utilizationRate: number
    bottlenecks: string[]
  }
  demandForecast: Array<{
    week: number
    expectedLeads: number
    expectedCases: number
    requiredCapacity: number
  }>
  gapAnalysis: {
    capacityGap: number
    criticalPeriods: string[]
    overCapacity: string[]
  }
  recommendations: Array<{
    area: string
    currentCapacity: number
    requiredCapacity: number
    gap: number
    solution: string
    cost: number
    timeline: string
  }>
  agentCapacity: Array<{
    agent: string
    maxTasksPerDay: number
    currentLoad: number
    availability: number
    canTakeMore: boolean
  }>
}

export interface ProcessOptimization {
  analysisDate: string
  processesAnalyzed: Array<{
    process: string
    steps: number
    avgDuration: string
    errorRate: number
    bottlenecks: Array<{
      step: string
      issue: string
      impact: string
    }>
    automationLevel: number
  }>
  inefficiencies: Array<{
    area: string
    issue: string
    timeLost: string
    costImpact: number
    frequency: 'daily' | 'weekly' | 'monthly'
  }>
  optimizations: Array<{
    id: string
    process: string
    currentState: string
    proposedState: string
    benefit: {
      timeSaved: string
      costSaved: number
      qualityImprovement: number
    }
    effort: 'low' | 'medium' | 'high'
    priority: 'critical' | 'high' | 'medium' | 'low'
  }>
  quickWins: Array<{
    action: string
    effort: 'low'
    impact: 'high' | 'medium'
    implementBy: string
  }>
}

export interface QualityMetrics {
  period: { start: string; end: string }
  overallScore: number
  byCategory: Array<{
    category: string
    score: number
    trend: 'improving' | 'stable' | 'declining'
    issues: number
  }>
  errorAnalysis: {
    totalErrors: number
    byType: Array<{
      type: string
      count: number
      severity: 'critical' | 'major' | 'minor'
      rootCause: string
    }>
    errorRate: number
    trending: 'up' | 'stable' | 'down'
  }
  customerFeedback: {
    nps: number
    satisfactionScore: number
    complaints: number
    compliments: number
    topIssues: string[]
    topPraises: string[]
  }
  slaCompliance: {
    overall: number
    bySla: Array<{
      sla: string
      compliance: number
      breaches: number
    }>
  }
}

export interface IncidentAnalysis {
  incident: {
    id: string
    type: string
    severity: 'critical' | 'major' | 'minor'
    occurredAt: string
    resolvedAt: string
    duration: string
  }
  impact: {
    customersAffected: number
    tasksDelayed: number
    revenueImpact: number
    reputationImpact: 'high' | 'medium' | 'low'
  }
  rootCause: {
    category: 'process' | 'system' | 'human' | 'external'
    description: string
    contributingFactors: string[]
  }
  resolution: {
    immediateActions: string[]
    workarounds: string[]
    permanentFix: string
  }
  prevention: {
    processChanges: string[]
    systemChanges: string[]
    training: string[]
    monitoring: string[]
  }
  lessonsLearned: string[]
}

export interface AgentWorkload {
  timestamp: string
  totalPendingTasks: number
  agents: Array<{
    agent: string
    status: 'available' | 'busy' | 'overloaded'
    currentTasks: number
    maxCapacity: number
    utilization: number
    avgTaskTime: number
    specialties: string[]
  }>
  taskQueue: Array<{
    taskId: string
    type: string
    priority: 'critical' | 'high' | 'medium' | 'low'
    waitTime: string
    requiredSkills: string[]
    currentlyAssigned: string
  }>
  rebalancing: Array<{
    taskId: string
    from: string
    to: string
    reason: string
  }>
  newAssignments: Array<{
    taskId: string
    assignTo: string
    reason: string
    expectedCompletion: string
  }>
}

export interface DailyOperationsReport {
  date: string
  executiveSummary: string
  metrics: {
    leadsProcessed: number
    tasksCompleted: number
    avgResponseTime: string
    slaCompliance: number
    errorRate: number
    customerSatisfaction: number
  }
  highlights: Array<{
    type: 'achievement' | 'issue' | 'milestone'
    description: string
  }>
  issues: Array<{
    issue: string
    severity: 'high' | 'medium' | 'low'
    status: 'open' | 'resolving' | 'resolved'
    action: string
  }>
  agentPerformance: Array<{
    agent: string
    tasksCompleted: number
    avgTime: string
    quality: number
    status: 'excellent' | 'good' | 'needs_attention'
  }>
  tomorrowFocus: string[]
}

export interface WeeklyOperationsReport {
  period: { weekNumber: number; start: string; end: string }
  executiveSummary: string
  kpis: Array<{
    kpi: string
    target: number
    actual: number
    status: 'exceeded' | 'met' | 'missed'
    trend: 'improving' | 'stable' | 'declining'
  }>
  volumeMetrics: {
    leadsReceived: number
    leadsQualified: number
    proposalsSent: number
    contractsSigned: number
    casesCompleted: number
  }
  qualityMetrics: {
    firstContactResolution: number
    errorRate: number
    reworkRate: number
    customerSatisfaction: number
  }
  improvements: Array<{
    area: string
    improvement: string
    measuredImpact: string
  }>
  nextWeekPriorities: Array<{
    priority: string
    owner: string
    expectedOutcome: string
  }>
}

// =============================================================================
// COO AGENT CLASS
// =============================================================================

export class COOAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(COO_AGENT_SYSTEM_PROMPT, 'coo', {
      timeout: 120000,
      ...config,
    })
  }

  get name(): string {
    return 'COO Agent'
  }

  get role(): AgentRole {
    return 'coo'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'operação', 'operation', 'processo', 'process', 'produção', 'production',
      'sla', 'capacidade', 'capacity', 'qualidade', 'quality', 'eficiência',
      'workflow', 'tarefa', 'task', 'fila', 'queue', 'escalação',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // REAL-TIME MONITORING
  // ===========================================================================

  /**
   * Generate real-time operations dashboard
   */
  async generateOperationsDashboard(
    metrics: {
      activeLeads: number
      pendingTasks: number
      avgResponseTime: number
      agentsOnline: number
    },
    agentStatuses: Array<{
      agent: string
      status: 'active' | 'busy' | 'idle' | 'offline'
      currentTask?: string
      tasksCompleted: number
    }>,
    queueData?: Array<{
      queue: string
      items: number
      avgWaitTime: number
    }>,
    context?: AgentContext
  ): Promise<OperationsDashboard> {
    const slaDefinitions = getSLADefinitions()

    const prompt = `
${OPERATIONS_DASHBOARD_PROMPT}

TIMESTAMP: ${new Date().toISOString()}

MÉTRICAS EM TEMPO REAL:
- Leads ativos: ${metrics.activeLeads}
- Tarefas pendentes: ${metrics.pendingTasks}
- Tempo médio resposta: ${metrics.avgResponseTime}s
- Agentes online: ${metrics.agentsOnline}

STATUS DOS AGENTES:
${agentStatuses.map(a => `- ${a.agent}: ${a.status}${a.currentTask ? ` (${a.currentTask})` : ''}, ${a.tasksCompleted} tarefas`).join('\n')}

${queueData ? `
FILAS:
${queueData.map(q => `- ${q.queue}: ${q.items} itens, tempo médio espera ${q.avgWaitTime}s`).join('\n')}
` : ''}

SLAs DEFINIDOS:
${slaDefinitions.map(s => `- ${s.name}: ${s.target}${s.critical ? ' (CRÍTICO)' : ''}`).join('\n')}

Gere o dashboard operacional no formato JSON especificado.
`

    const response = await this.processStructured<OperationsDashboard>(prompt, context)
    return response
  }

  /**
   * Plan capacity for upcoming period
   */
  async planCapacity(
    period: { start: string; end: string },
    currentCapacity: {
      totalHours: number
      utilizationRate: number
    },
    demandForecast: Array<{
      week: number
      expectedLeads: number
      expectedCases: number
    }>,
    agentCapacities: Array<{
      agent: string
      maxTasksPerDay: number
      currentLoad: number
    }>,
    context?: AgentContext
  ): Promise<CapacityPlanning> {
    const prompt = `
${CAPACITY_PLANNING_PROMPT}

PERÍODO: ${period.start} a ${period.end}

CAPACIDADE ATUAL:
- Horas totais disponíveis: ${currentCapacity.totalHours}
- Taxa de utilização: ${(currentCapacity.utilizationRate * 100).toFixed(1)}%

PREVISÃO DE DEMANDA:
${demandForecast.map(d => `- Semana ${d.week}: ${d.expectedLeads} leads, ${d.expectedCases} casos`).join('\n')}

CAPACIDADE POR AGENTE:
${agentCapacities.map(a => `- ${a.agent}: ${a.maxTasksPerDay} max/dia, carga atual ${a.currentLoad}`).join('\n')}

Analise e planeie a capacidade no formato JSON especificado.
`

    const response = await this.processStructured<CapacityPlanning>(prompt, context)
    return response
  }

  // ===========================================================================
  // OPTIMIZATION
  // ===========================================================================

  /**
   * Identify process optimization opportunities
   */
  async analyzeProcessOptimization(
    processes: Array<{
      name: string
      steps: number
      avgDuration: string
      errorRate: number
      automationLevel: number
    }>,
    context?: AgentContext
  ): Promise<ProcessOptimization> {
    const prompt = `
${PROCESS_OPTIMIZATION_PROMPT}

DATA: ${new Date().toISOString().split('T')[0]}

PROCESSOS ANALISADOS:
${processes.map(p => `
- ${p.name}:
  Etapas: ${p.steps}
  Duração média: ${p.avgDuration}
  Taxa de erro: ${(p.errorRate * 100).toFixed(2)}%
  Nível de automação: ${(p.automationLevel * 100).toFixed(0)}%
`).join('\n')}

Identifique oportunidades de otimização no formato JSON especificado.
`

    const response = await this.processStructured<ProcessOptimization>(prompt, context)
    return response
  }

  /**
   * Balance workload across agents
   */
  async balanceAgentWorkload(
    agents: Array<{
      agent: string
      status: 'available' | 'busy' | 'overloaded'
      currentTasks: number
      maxCapacity: number
      specialties: string[]
    }>,
    taskQueue: Array<{
      taskId: string
      type: string
      priority: 'critical' | 'high' | 'medium' | 'low'
      requiredSkills: string[]
    }>,
    context?: AgentContext
  ): Promise<AgentWorkload> {
    const prompt = `
${AGENT_WORKLOAD_PROMPT}

TIMESTAMP: ${new Date().toISOString()}

AGENTES:
${agents.map(a => `
- ${a.agent}:
  Status: ${a.status}
  Tarefas atuais: ${a.currentTasks}/${a.maxCapacity}
  Especialidades: ${a.specialties.join(', ')}
`).join('\n')}

FILA DE TAREFAS:
${taskQueue.map(t => `- ${t.taskId}: ${t.type} (${t.priority}), skills: ${t.requiredSkills.join(', ')}`).join('\n')}

Balanceie a carga de trabalho no formato JSON especificado.
`

    const response = await this.processStructured<AgentWorkload>(prompt, context)
    return response
  }

  // ===========================================================================
  // QUALITY
  // ===========================================================================

  /**
   * Analyze quality metrics
   */
  async analyzeQualityMetrics(
    period: { start: string; end: string },
    metrics: {
      overallScore: number
      errorRate: number
      nps: number
      slaCompliance: number
    },
    errors: Array<{
      type: string
      count: number
      severity: 'critical' | 'major' | 'minor'
    }>,
    customerFeedback?: {
      complaints: number
      compliments: number
    },
    context?: AgentContext
  ): Promise<QualityMetrics> {
    const prompt = `
${QUALITY_METRICS_PROMPT}

PERÍODO: ${period.start} a ${period.end}

MÉTRICAS GERAIS:
- Score geral: ${metrics.overallScore}/100
- Taxa de erro: ${(metrics.errorRate * 100).toFixed(2)}%
- NPS: ${metrics.nps}
- Compliance SLA: ${(metrics.slaCompliance * 100).toFixed(1)}%

ERROS POR TIPO:
${errors.map(e => `- ${e.type}: ${e.count} (${e.severity})`).join('\n')}

${customerFeedback ? `
FEEDBACK CLIENTES:
- Reclamações: ${customerFeedback.complaints}
- Elogios: ${customerFeedback.compliments}
` : ''}

Analise as métricas de qualidade no formato JSON especificado.
`

    const response = await this.processStructured<QualityMetrics>(prompt, context)
    return response
  }

  /**
   * Analyze incident and propose actions
   */
  async analyzeIncident(
    incidentType: string,
    severity: 'critical' | 'major' | 'minor',
    description: string,
    timeline: Array<{ time: string; event: string }>,
    impact?: {
      customersAffected?: number
      tasksDelayed?: number
      revenueImpact?: number
    },
    context?: AgentContext
  ): Promise<IncidentAnalysis> {
    const prompt = `
${INCIDENT_ANALYSIS_PROMPT}

INCIDENTE:
- Tipo: ${incidentType}
- Severidade: ${severity}
- Descrição: ${description}

TIMELINE:
${timeline.map(t => `- ${t.time}: ${t.event}`).join('\n')}

${impact ? `
IMPACTO:
${impact.customersAffected ? `- Clientes afetados: ${impact.customersAffected}` : ''}
${impact.tasksDelayed ? `- Tarefas atrasadas: ${impact.tasksDelayed}` : ''}
${impact.revenueImpact ? `- Impacto receita: €${impact.revenueImpact}` : ''}
` : ''}

Analise o incidente e proponha ações no formato JSON especificado.
`

    const response = await this.processStructured<IncidentAnalysis>(prompt, context)
    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate daily operations report
   */
  async generateDailyReport(
    date: string,
    metrics: {
      leadsProcessed: number
      tasksCompleted: number
      avgResponseTime: string
      slaCompliance: number
      errorRate: number
    },
    agentPerformance: Array<{
      agent: string
      tasksCompleted: number
      avgTime: string
      quality: number
    }>,
    issues?: Array<{
      issue: string
      severity: 'high' | 'medium' | 'low'
      status: 'open' | 'resolving' | 'resolved'
    }>,
    context?: AgentContext
  ): Promise<DailyOperationsReport> {
    const prompt = `
${DAILY_OPERATIONS_REPORT_PROMPT}

DATA: ${date}

MÉTRICAS DO DIA:
- Leads processados: ${metrics.leadsProcessed}
- Tarefas completadas: ${metrics.tasksCompleted}
- Tempo médio resposta: ${metrics.avgResponseTime}
- Compliance SLA: ${(metrics.slaCompliance * 100).toFixed(1)}%
- Taxa de erro: ${(metrics.errorRate * 100).toFixed(2)}%

PERFORMANCE AGENTES:
${agentPerformance.map(a => `- ${a.agent}: ${a.tasksCompleted} tarefas, ${a.avgTime} média, ${(a.quality * 100).toFixed(0)}% qualidade`).join('\n')}

${issues ? `
ISSUES:
${issues.map(i => `- [${i.severity.toUpperCase()}] ${i.issue} (${i.status})`).join('\n')}
` : ''}

Gere o relatório operacional diário no formato JSON especificado.
`

    const response = await this.processStructured<DailyOperationsReport>(prompt, context)
    return response
  }

  /**
   * Generate weekly operations report
   */
  async generateWeeklyReport(
    weekNumber: number,
    weekStart: string,
    weekEnd: string,
    volumeMetrics: {
      leadsReceived: number
      leadsQualified: number
      proposalsSent: number
      contractsSigned: number
      casesCompleted: number
    },
    qualityMetrics: {
      firstContactResolution: number
      errorRate: number
      customerSatisfaction: number
    },
    kpis: Array<{
      kpi: string
      target: number
      actual: number
    }>,
    context?: AgentContext
  ): Promise<WeeklyOperationsReport> {
    const prompt = `
${WEEKLY_OPERATIONS_REPORT_PROMPT}

SEMANA: ${weekNumber} (${weekStart} a ${weekEnd})

VOLUME:
- Leads recebidos: ${volumeMetrics.leadsReceived}
- Leads qualificados: ${volumeMetrics.leadsQualified}
- Propostas enviadas: ${volumeMetrics.proposalsSent}
- Contratos assinados: ${volumeMetrics.contractsSigned}
- Casos concluídos: ${volumeMetrics.casesCompleted}

QUALIDADE:
- Resolução primeiro contacto: ${(qualityMetrics.firstContactResolution * 100).toFixed(1)}%
- Taxa de erro: ${(qualityMetrics.errorRate * 100).toFixed(2)}%
- Satisfação cliente: ${(qualityMetrics.customerSatisfaction * 100).toFixed(1)}%

KPIs:
${kpis.map(k => `- ${k.kpi}: ${k.actual}/${k.target} (${((k.actual / k.target) * 100).toFixed(0)}%)`).join('\n')}

Gere o relatório operacional semanal no formato JSON especificado.
`

    const response = await this.processStructured<WeeklyOperationsReport>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  calculateOperationalHealth(metrics: {
    slaCompliance: number
    errorRate: number
    capacityUtilization: number
    customerSatisfaction: number
  }) {
    return calculateOperationalHealth(metrics)
  }

  getSLADefinitions() {
    return getSLADefinitions()
  }

  getEscalationLevels() {
    return getEscalationLevels()
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

export function createCOOAgent(config?: Partial<EnhancedAgentConfig>): COOAgent {
  return new COOAgent(config)
}

let cooAgentInstance: COOAgent | null = null

export function getCOOAgent(): COOAgent {
  if (!cooAgentInstance) {
    cooAgentInstance = createCOOAgent()
  }
  return cooAgentInstance
}

// =============================================================================
// EXPORTS
// =============================================================================

export { calculateOperationalHealth, getSLADefinitions, getEscalationLevels }
