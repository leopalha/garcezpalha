/**
 * Admin Agent
 * Responsible for administrative automation and workflow management
 */

import { EnhancedBaseAgent } from '../core/enhanced-base-agent'
import type { AgentRole, AgentContext, EnhancedAgentConfig } from '../core/agent-types'
import {
  ADMIN_AGENT_SYSTEM_PROMPT,
  LEAD_TRIAGE_PROMPT,
  LEAD_FOLLOW_UP_PROMPT,
  TASK_CREATION_PROMPT,
  TASK_PRIORITIZATION_PROMPT,
  SCHEDULING_PROMPT,
  CALENDAR_ANALYSIS_PROMPT,
  DAILY_REPORT_PROMPT,
  WEEKLY_REPORT_PROMPT,
  NOTIFICATION_GENERATION_PROMPT,
  getPriorityWeight,
  isBusinessHours,
  getNextBusinessDay,
  formatDuration,
} from '../../prompts/operations/admin-prompts'

// =============================================================================
// TYPES
// =============================================================================

export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type TaskType = 'judicial' | 'atendimento' | 'documentacao' | 'admin' | 'marketing'
export type NotificationType = 'reminder' | 'alert' | 'update' | 'action'
export type NotificationChannel = 'email' | 'whatsapp' | 'sms' | 'push'

export interface Lead {
  id: string
  name: string
  email?: string
  phone?: string
  source: string
  message: string
  createdAt: string
  status: string
  lastContactAt?: string
  interactionHistory?: Array<{ date: string; type: string; notes: string }>
}

export interface LeadTriageResult {
  qualified: boolean
  score: number
  priority: Priority
  area: string
  complexity: 'simple' | 'medium' | 'complex'
  estimatedValue: 'baixo' | 'médio' | 'alto'
  urgency: {
    hasDeadline: boolean
    deadline?: string
    reason?: string
  }
  nextSteps: string[]
  assignTo: string | null
  notes: string
}

export interface FollowUpMessage {
  channel: NotificationChannel
  message: string
  timing: string
  followUpReason: string
  alternativeMessages: string[]
}

export interface Task {
  id?: string
  title: string
  description: string
  type: TaskType
  priority: Priority
  dueDate: string
  dueTime?: string
  assignee?: string
  estimatedDuration?: number
  dependencies?: string[]
  reminders?: Array<{ beforeMinutes: number; channel: NotificationChannel }>
}

export interface TaskCreationResult {
  tasks: Task[]
  suggestions: string[]
}

export interface PrioritizedTask {
  taskId: string
  newPriority: number
  reason: string
  suggestedTime: string
}

export interface TaskPrioritizationResult {
  prioritizedTasks: PrioritizedTask[]
  alerts: Array<{
    type: 'deadline' | 'overdue' | 'conflict'
    message: string
    affectedTasks: string[]
  }>
  recommendations: string[]
}

export interface TimeSlot {
  date: string
  startTime: string
  endTime: string
  score: number
  reason: string
}

export interface SchedulingResult {
  available: boolean
  suggestedSlots: TimeSlot[]
  conflicts: Array<{
    existingEvent: string
    resolution: string
  }>
  reminders: Array<{
    when: string
    message: string
  }>
}

export interface Notification {
  type: NotificationType
  priority: Priority
  recipient: string
  channel: NotificationChannel
  title: string
  message: string
  scheduledFor: string
  actionRequired: boolean
  actionUrl?: string
}

export interface DailyReport {
  date: string
  summary: string
  leads: {
    received: number
    qualified: number
    converted: number
    topSources: string[]
  }
  tasks: {
    completed: number
    pending: number
    overdue: number
    upcomingDeadlines: Array<{ task: string; deadline: string }>
  }
  highlights: string[]
  concerns: string[]
  actionItems: Array<{ action: string; priority: string; owner: string }>
}

export interface WeeklyReport {
  period: { start: string; end: string }
  summary: string
  kpis: Record<string, { current: number; previous: number; change: number }>
  trends: Array<{ metric: string; direction: 'up' | 'down' | 'stable'; insight: string }>
  topPerformers: Array<{ area: string; achievement: string }>
  areasOfConcern: Array<{ area: string; issue: string; recommendation: string }>
  nextWeekFocus: string[]
}

// =============================================================================
// ADMIN AGENT CLASS
// =============================================================================

export class AdminAgent extends EnhancedBaseAgent {
  constructor(config?: Partial<EnhancedAgentConfig>) {
    super(ADMIN_AGENT_SYSTEM_PROMPT, 'admin', {
      timeout: 60000,
      ...config,
    })
  }

  get name(): string {
    return 'Admin Agent'
  }

  get role(): AgentRole {
    return 'admin'
  }

  isRelevant(input: string): boolean {
    const keywords = [
      'lead', 'tarefa', 'task', 'agenda', 'schedule', 'agendar',
      'relatório', 'report', 'notificação', 'lembrete', 'reminder',
      'prioridade', 'priority', 'follow-up', 'triagem', 'administrativo',
    ]
    const lowerInput = input.toLowerCase()
    return keywords.some(keyword => lowerInput.includes(keyword))
  }

  // ===========================================================================
  // LEAD MANAGEMENT
  // ===========================================================================

  /**
   * Triage a new lead
   */
  async triageLead(lead: Lead, context?: AgentContext): Promise<LeadTriageResult> {
    const prompt = `
${LEAD_TRIAGE_PROMPT}

LEAD PARA TRIAGEM:
- Nome: ${lead.name}
- Email: ${lead.email || 'Não informado'}
- Telefone: ${lead.phone || 'Não informado'}
- Fonte: ${lead.source}
- Data: ${lead.createdAt}
- Mensagem: "${lead.message}"

Realize a triagem e forneça resultado no formato JSON especificado.
`

    const response = await this.processStructured<LeadTriageResult>(prompt, context)
    return response
  }

  /**
   * Generate follow-up message for lead
   */
  async generateFollowUp(lead: Lead, context?: AgentContext): Promise<FollowUpMessage> {
    const interactionsSummary = lead.interactionHistory
      ?.map(i => `- ${i.date}: ${i.type} - ${i.notes}`)
      .join('\n') || 'Nenhuma interação anterior'

    const prompt = `
${LEAD_FOLLOW_UP_PROMPT}

LEAD:
- Nome: ${lead.name}
- Status: ${lead.status}
- Último contato: ${lead.lastContactAt || 'Nunca'}
- Fonte original: ${lead.source}

HISTÓRICO:
${interactionsSummary}

MENSAGEM ORIGINAL:
"${lead.message}"

Gere mensagem de follow-up no formato JSON especificado.
`

    const response = await this.processStructured<FollowUpMessage>(prompt, context)
    return response
  }

  /**
   * Batch triage multiple leads
   */
  async batchTriageLeads(leads: Lead[]): Promise<Map<string, LeadTriageResult>> {
    const results = new Map<string, LeadTriageResult>()

    for (const lead of leads) {
      const result = await this.triageLead(lead)
      results.set(lead.id, result)
    }

    // Sort by priority and score
    const sorted = Array.from(results.entries()).sort(([, a], [, b]) => {
      const priorityDiff = getPriorityWeight(b.priority) - getPriorityWeight(a.priority)
      if (priorityDiff !== 0) return priorityDiff
      return b.score - a.score
    })

    return new Map(sorted)
  }

  // ===========================================================================
  // TASK MANAGEMENT
  // ===========================================================================

  /**
   * Create tasks from context
   */
  async createTasks(
    contextDescription: string,
    relatedEntity?: { type: string; id: string; name: string },
    context?: AgentContext
  ): Promise<TaskCreationResult> {
    const entityInfo = relatedEntity
      ? `\nENTIDADE RELACIONADA:\n- Tipo: ${relatedEntity.type}\n- ID: ${relatedEntity.id}\n- Nome: ${relatedEntity.name}`
      : ''

    const prompt = `
${TASK_CREATION_PROMPT}

CONTEXTO:
${contextDescription}
${entityInfo}

DATA ATUAL: ${new Date().toISOString().split('T')[0]}

Crie as tarefas necessárias no formato JSON especificado.
`

    const response = await this.processStructured<TaskCreationResult>(prompt, context)
    return response
  }

  /**
   * Prioritize existing tasks
   */
  async prioritizeTasks(tasks: Task[], context?: AgentContext): Promise<TaskPrioritizationResult> {
    const taskList = tasks
      .map((t, i) => `
[Tarefa ${i + 1}]
- ID: ${t.id || `temp_${i}`}
- Título: ${t.title}
- Tipo: ${t.type}
- Prioridade atual: ${t.priority}
- Prazo: ${t.dueDate} ${t.dueTime || ''}
- Duração estimada: ${t.estimatedDuration ? formatDuration(t.estimatedDuration) : 'N/A'}
- Dependências: ${t.dependencies?.join(', ') || 'Nenhuma'}
`)
      .join('\n')

    const prompt = `
${TASK_PRIORITIZATION_PROMPT}

TAREFAS PARA PRIORIZAR:
${taskList}

DATA/HORA ATUAL: ${new Date().toISOString()}

Repriorize as tarefas no formato JSON especificado.
`

    const response = await this.processStructured<TaskPrioritizationResult>(prompt, context)
    return response
  }

  // ===========================================================================
  // SCHEDULING
  // ===========================================================================

  /**
   * Find available time slots
   */
  async findAvailableSlots(
    duration: number,
    preferredDate?: string,
    existingEvents?: Array<{ title: string; start: string; end: string }>,
    context?: AgentContext
  ): Promise<SchedulingResult> {
    const eventsInfo = existingEvents
      ?.map(e => `- ${e.title}: ${e.start} - ${e.end}`)
      .join('\n') || 'Nenhum evento agendado'

    const prompt = `
${SCHEDULING_PROMPT}

REQUISITOS:
- Duração necessária: ${formatDuration(duration)}
- Data preferencial: ${preferredDate || 'Qualquer dia útil próximo'}

AGENDA ATUAL:
${eventsInfo}

DATA/HORA ATUAL: ${new Date().toISOString()}
HORÁRIO COMERCIAL: Sim

Encontre horários disponíveis no formato JSON especificado.
`

    const response = await this.processStructured<SchedulingResult>(prompt, context)
    return response
  }

  /**
   * Analyze calendar utilization
   */
  async analyzeCalendar(
    events: Array<{ title: string; start: string; end: string; type: string }>,
    period: { start: string; end: string },
    context?: AgentContext
  ): Promise<{
    utilization: { percentage: number; byType: Record<string, number> }
    patterns: Array<{ pattern: string; frequency: string; recommendation: string }>
    opportunities: Array<{ type: string; description: string; expectedImpact: string }>
    alerts: string[]
  }> {
    const eventsInfo = events
      .map(e => `- ${e.type}: ${e.title} (${e.start} - ${e.end})`)
      .join('\n')

    const prompt = `
${CALENDAR_ANALYSIS_PROMPT}

PERÍODO: ${period.start} a ${period.end}

EVENTOS:
${eventsInfo}

Analise a agenda no formato JSON especificado.
`

    const response = await this.processStructured<{
      utilization: { percentage: number; byType: Record<string, number> }
      patterns: Array<{ pattern: string; frequency: string; recommendation: string }>
      opportunities: Array<{ type: string; description: string; expectedImpact: string }>
      alerts: string[]
    }>(prompt, context)

    return response
  }

  // ===========================================================================
  // REPORTING
  // ===========================================================================

  /**
   * Generate daily report
   */
  async generateDailyReport(
    data: {
      leads: { received: number; qualified: number; converted: number; sources: Record<string, number> }
      tasks: { completed: number; pending: number; overdue: number; deadlines: Array<{ task: string; deadline: string }> }
      events: Array<{ title: string; outcome?: string }>
    },
    context?: AgentContext
  ): Promise<DailyReport> {
    const topSources = Object.entries(data.leads.sources)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([source]) => source)

    const prompt = `
${DAILY_REPORT_PROMPT}

DATA: ${new Date().toISOString().split('T')[0]}

LEADS:
- Recebidos: ${data.leads.received}
- Qualificados: ${data.leads.qualified}
- Convertidos: ${data.leads.converted}
- Top fontes: ${topSources.join(', ')}

TAREFAS:
- Concluídas: ${data.tasks.completed}
- Pendentes: ${data.tasks.pending}
- Atrasadas: ${data.tasks.overdue}
- Prazos próximos: ${data.tasks.deadlines.map(d => `${d.task} (${d.deadline})`).join(', ')}

EVENTOS DO DIA:
${data.events.map(e => `- ${e.title}: ${e.outcome || 'N/A'}`).join('\n')}

Gere o relatório diário no formato JSON especificado.
`

    const response = await this.processStructured<DailyReport>(prompt, context)
    return response
  }

  /**
   * Generate weekly report
   */
  async generateWeeklyReport(
    currentWeek: {
      leads: number
      conversions: number
      tasks: number
      content: number
    },
    previousWeek: {
      leads: number
      conversions: number
      tasks: number
      content: number
    },
    context?: AgentContext
  ): Promise<WeeklyReport> {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)

    const prompt = `
${WEEKLY_REPORT_PROMPT}

PERÍODO: ${startDate.toISOString().split('T')[0]} a ${endDate.toISOString().split('T')[0]}

MÉTRICAS SEMANA ATUAL:
- Leads gerados: ${currentWeek.leads}
- Conversões: ${currentWeek.conversions}
- Tarefas concluídas: ${currentWeek.tasks}
- Conteúdo publicado: ${currentWeek.content}

MÉTRICAS SEMANA ANTERIOR:
- Leads gerados: ${previousWeek.leads}
- Conversões: ${previousWeek.conversions}
- Tarefas concluídas: ${previousWeek.tasks}
- Conteúdo publicado: ${previousWeek.content}

Gere o relatório semanal no formato JSON especificado.
`

    const response = await this.processStructured<WeeklyReport>(prompt, context)
    return response
  }

  // ===========================================================================
  // NOTIFICATIONS
  // ===========================================================================

  /**
   * Generate notifications for context
   */
  async generateNotifications(
    events: Array<{
      type: 'deadline' | 'meeting' | 'followup' | 'alert'
      entity: string
      details: string
      dueAt: string
      recipient: string
    }>,
    context?: AgentContext
  ): Promise<{ notifications: Notification[] }> {
    const eventsList = events
      .map(e => `- ${e.type.toUpperCase()}: ${e.entity} - ${e.details} (${e.dueAt}) para ${e.recipient}`)
      .join('\n')

    const prompt = `
${NOTIFICATION_GENERATION_PROMPT}

EVENTOS QUE REQUEREM NOTIFICAÇÃO:
${eventsList}

DATA/HORA ATUAL: ${new Date().toISOString()}
EM HORÁRIO COMERCIAL: ${isBusinessHours() ? 'Sim' : 'Não'}

Gere as notificações apropriadas no formato JSON especificado.
`

    const response = await this.processStructured<{ notifications: Notification[] }>(prompt, context)
    return response
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  /**
   * Check if currently in business hours
   */
  isInBusinessHours(): boolean {
    return isBusinessHours()
  }

  /**
   * Get next business day
   */
  getNextBusinessDay(): Date {
    return getNextBusinessDay()
  }

  /**
   * Get priority weight for sorting
   */
  getPriorityWeight(priority: Priority): number {
    return getPriorityWeight(priority)
  }

  /**
   * Format duration
   */
  formatDuration(minutes: number): string {
    return formatDuration(minutes)
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create a new Admin Agent instance
 */
export function createAdminAgent(config?: Partial<EnhancedAgentConfig>): AdminAgent {
  return new AdminAgent(config)
}

// =============================================================================
// EXPORTS
// =============================================================================

export { getPriorityWeight, isBusinessHours, getNextBusinessDay, formatDuration }
