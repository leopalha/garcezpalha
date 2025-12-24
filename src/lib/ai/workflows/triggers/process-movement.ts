/**
 * Process Movement Trigger Workflow
 * Automatic processing of legal process movements
 * Classification, analysis, and task generation
 */

import type {
  WorkflowConfig,
  WorkflowExecution,
  WorkflowResult,
  WorkflowStep,
  TriggerConfig,
  ProcessMovementTriggerData,
  ProcessMovementWorkflowOutput,
} from '../types'
import { getCOOAgent } from '../../agents/executive/coo-agent'
import { createQAAgent } from '../../agents/operations/qa-agent'
import { createAgentLogger } from '../../agents/core/agent-logger'

// =============================================================================
// CONFIGURATION
// =============================================================================

export const PROCESS_MOVEMENT_WORKFLOW_CONFIG: WorkflowConfig = {
  id: 'process-movement-workflow',
  name: 'Process Movement',
  description: 'Processamento automático de movimentações processuais',
  frequency: 'on_trigger',
  priority: 'high',
  enabled: true,
  timeout: 180000, // 3 minutos
  retryOnFailure: true,
  maxRetries: 2,
  notifyOnComplete: false,
  notifyOnFailure: true,
}

export const PROCESS_MOVEMENT_TRIGGER_CONFIG: TriggerConfig = {
  type: 'process_movement',
  enabled: true,
  workflow: 'process-movement-workflow',
  priority: 'high',
  cooldown: 60000, // 1 minute cooldown per process
  conditions: [
    { field: 'processNumber', operator: 'contains', value: '-' },
  ],
}

// =============================================================================
// CONSTANTS
// =============================================================================

const URGENT_MOVEMENT_KEYWORDS = [
  'sentença',
  'acórdão',
  'intimação',
  'citação',
  'prazo fatal',
  'audiência',
  'despacho',
  'decisão',
  'tutela',
  'liminar',
  'embargo',
  'recurso',
  'baixa',
  'arquivamento',
]

const CRITICAL_MOVEMENT_KEYWORDS = [
  'sentença procedente',
  'sentença improcedente',
  'trânsito em julgado',
  'execução',
  'penhora',
  'leilão',
  'arresto',
  'bloqueio',
]

const ROUTINE_MOVEMENT_KEYWORDS = [
  'juntada',
  'certidão',
  'vista',
  'concluso',
  'remessa',
  'redistribuição',
  'expedição',
]

// =============================================================================
// WORKFLOW IMPLEMENTATION
// =============================================================================

const logger = createAgentLogger('qa', 'operations')

export class ProcessMovementWorkflow {
  private execution: WorkflowExecution | null = null
  private steps: WorkflowStep[] = []

  /**
   * Execute process movement workflow
   */
  async execute(data: ProcessMovementTriggerData): Promise<WorkflowResult> {
    const startTime = Date.now()

    this.execution = {
      id: `exec_${Date.now()}`,
      workflowId: PROCESS_MOVEMENT_WORKFLOW_CONFIG.id,
      status: 'running',
      steps: [],
      startedAt: new Date(),
      triggeredBy: 'trigger',
      triggerData: data as unknown as Record<string, unknown>,
    }

    logger.info('workflow-start', 'Process Movement Workflow iniciando', {
      processId: data.processId,
      movementType: data.movementType,
    })

    try {
      // Step 1: Classify movement
      const classification = await this.executeStep('classify-movement', 'qa', async () => {
        return this.classifyMovement(data)
      })

      // Step 2: Analyze impact
      const analysis = await this.executeStep('analyze-impact', 'qa', async () => {
        const qa = createQAAgent()
        return await this.analyzeMovement(data, qa)
      })

      // Step 3: Generate recommended actions
      const recommendations = await this.executeStep('generate-recommendations', 'coo', async () => {
        const coo = getCOOAgent()
        return await this.generateRecommendations(data, classification, coo)
      })

      // Step 4: Create tasks
      const tasks = await this.executeStep('create-tasks', 'admin', async () => {
        return this.createTasks(data, classification, recommendations)
      })

      // Step 5: Notify client if needed
      const clientNotification = await this.executeStep('notify-client', 'admin', async () => {
        return this.notifyClient(data, classification)
      })

      // Format output
      const output = this.formatOutput(data, classification, analysis, recommendations, tasks, clientNotification)

      this.execution.status = 'completed'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.info('workflow-complete', 'Process Movement Workflow concluído', {
        duration: this.execution.duration,
        processId: data.processId,
        classification: classification.type,
      })

      return {
        success: true,
        summary: `Movimentação ${classification.type.toUpperCase()} processada. ${tasks.length} tarefa(s) criada(s).`,
        outputs: { movementProcessing: output },
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: ['qa', 'coo', 'admin'],
        },
        nextActions: this.generateNextActions(output, data),
      }
    } catch (error) {
      this.execution.status = 'failed'
      this.execution.error = error instanceof Error ? error.message : 'Unknown error'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.error('workflow-failed', 'Process Movement Workflow falhou', error as Error)

      return {
        success: false,
        summary: `Erro ao processar movimentação: ${this.execution.error}`,
        outputs: {},
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: this.steps.map(s => s.agent),
        },
      }
    }
  }

  /**
   * Execute a workflow step
   */
  private async executeStep<T>(
    stepId: string,
    agent: 'qa' | 'coo' | 'admin',
    action: () => Promise<T>
  ): Promise<T> {
    const step: WorkflowStep = {
      id: stepId,
      name: stepId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      agent,
      action: stepId,
      status: 'running',
      startedAt: new Date(),
    }

    this.steps.push(step)

    try {
      const result = await action()
      step.status = 'completed'
      step.completedAt = new Date()
      step.result = result
      return result
    } catch (error) {
      step.status = 'failed'
      step.completedAt = new Date()
      step.error = error instanceof Error ? error.message : 'Unknown error'
      throw error
    }
  }

  /**
   * Classify movement by urgency
   */
  private classifyMovement(data: ProcessMovementTriggerData): {
    type: 'routine' | 'important' | 'urgent' | 'critical'
    requiresAction: boolean
    deadline?: string
    keywords: string[]
  } {
    const lowerDescription = data.description.toLowerCase()
    const lowerType = data.movementType.toLowerCase()
    const combinedText = `${lowerDescription} ${lowerType}`

    const matchedKeywords: string[] = []

    // Check for critical keywords
    for (const keyword of CRITICAL_MOVEMENT_KEYWORDS) {
      if (combinedText.includes(keyword)) {
        matchedKeywords.push(keyword)
      }
    }

    if (matchedKeywords.length > 0) {
      return {
        type: 'critical',
        requiresAction: true,
        deadline: this.calculateDeadline(data, 1), // 1 day
        keywords: matchedKeywords,
      }
    }

    // Check for urgent keywords
    for (const keyword of URGENT_MOVEMENT_KEYWORDS) {
      if (combinedText.includes(keyword)) {
        matchedKeywords.push(keyword)
      }
    }

    if (matchedKeywords.length > 0) {
      const hasDeadline = data.deadline !== undefined
      return {
        type: 'urgent',
        requiresAction: true,
        deadline: hasDeadline
          ? data.deadline?.toISOString()
          : this.calculateDeadline(data, 5), // 5 days default
        keywords: matchedKeywords,
      }
    }

    // Check for routine keywords
    for (const keyword of ROUTINE_MOVEMENT_KEYWORDS) {
      if (combinedText.includes(keyword)) {
        matchedKeywords.push(keyword)
      }
    }

    if (matchedKeywords.length > 0) {
      return {
        type: 'routine',
        requiresAction: false,
        keywords: matchedKeywords,
      }
    }

    // Default to important
    return {
      type: 'important',
      requiresAction: true,
      deadline: this.calculateDeadline(data, 10),
      keywords: [],
    }
  }

  /**
   * Calculate deadline from movement date
   */
  private calculateDeadline(data: ProcessMovementTriggerData, days: number): string {
    const deadline = new Date(data.movementDate)
    deadline.setDate(deadline.getDate() + days)
    return deadline.toISOString()
  }

  /**
   * Analyze movement impact
   */
  private async analyzeMovement(
    data: ProcessMovementTriggerData,
    qa: ReturnType<typeof createQAAgent>
  ): Promise<string> {
    // In production, this would use the QA agent for deeper analysis
    const analysis = []

    if (data.description.toLowerCase().includes('sentença')) {
      analysis.push('Decisão judicial requer análise para identificar resultado e próximos passos.')
    }

    if (data.description.toLowerCase().includes('intimação')) {
      analysis.push('Intimação para manifestação - verificar prazo processual aplicável.')
    }

    if (data.description.toLowerCase().includes('audiência')) {
      analysis.push('Audiência agendada - preparar cliente e documentação necessária.')
    }

    if (data.description.toLowerCase().includes('prazo')) {
      analysis.push('Atenção ao prazo processual - verificar contagem e possíveis prorrogações.')
    }

    if (analysis.length === 0) {
      analysis.push('Movimentação registrada. Aguardar desenvolvimentos.')
    }

    return analysis.join(' ')
  }

  /**
   * Generate recommended actions
   */
  private async generateRecommendations(
    data: ProcessMovementTriggerData,
    classification: { type: string; requiresAction: boolean },
    coo: ReturnType<typeof getCOOAgent>
  ): Promise<Array<{
    action: string
    priority: 'low' | 'medium' | 'high' | 'critical'
    deadline?: string
    assignedTo?: 'qa' | 'admin' | 'coo'
  }>> {
    const recommendations = []

    if (classification.type === 'critical') {
      recommendations.push({
        action: 'Analisar decisão judicial imediatamente',
        priority: 'critical' as const,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'qa' as const,
      })
      recommendations.push({
        action: 'Entrar em contato com cliente sobre resultado',
        priority: 'critical' as const,
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'admin' as const,
      })
    }

    if (classification.type === 'urgent') {
      recommendations.push({
        action: 'Revisar movimentação e identificar ações necessárias',
        priority: 'high' as const,
        deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: 'qa' as const,
      })
    }

    if (data.deadline) {
      recommendations.push({
        action: 'Cumprir prazo processual',
        priority: 'high' as const,
        deadline: data.deadline.toISOString(),
        assignedTo: 'qa' as const,
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        action: 'Arquivar movimentação para acompanhamento',
        priority: 'low' as const,
        assignedTo: 'admin' as const,
      })
    }

    return recommendations
  }

  /**
   * Create tasks from recommendations
   */
  private createTasks(
    data: ProcessMovementTriggerData,
    classification: { type: string },
    recommendations: Array<{ action: string; priority: string; deadline?: string }>
  ): Array<{ id: string; title: string; dueDate: string }> {
    return recommendations.slice(0, 3).map((rec, index) => ({
      id: `task_${data.processId}_${index}`,
      title: rec.action,
      dueDate: rec.deadline || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }))
  }

  /**
   * Notify client about movement
   */
  private notifyClient(
    data: ProcessMovementTriggerData,
    classification: { type: string; requiresAction: boolean }
  ): { sent: boolean; channel: 'email' | 'whatsapp'; summary: string } | null {
    // Only notify for important+ movements
    if (classification.type === 'routine') {
      return null
    }

    const summary = this.generateClientSummary(data, classification)

    return {
      sent: true,
      channel: classification.type === 'critical' ? 'whatsapp' : 'email',
      summary,
    }
  }

  /**
   * Generate client-friendly summary
   */
  private generateClientSummary(
    data: ProcessMovementTriggerData,
    classification: { type: string }
  ): string {
    if (classification.type === 'critical') {
      return `Houve uma movimentação importante no seu processo ${data.processNumber}. Nossa equipe está analisando e entrará em contato em breve com os detalhes.`
    }

    if (classification.type === 'urgent') {
      return `Seu processo ${data.processNumber} teve uma nova movimentação. Estamos acompanhando e tomaremos as providências necessárias.`
    }

    return `Informamos que houve uma atualização no seu processo ${data.processNumber}. Continuamos acompanhando o andamento.`
  }

  /**
   * Format output
   */
  private formatOutput(
    data: ProcessMovementTriggerData,
    classification: { type: 'routine' | 'important' | 'urgent' | 'critical'; requiresAction: boolean; deadline?: string },
    analysis: string,
    recommendations: Array<{ action: string; priority: 'low' | 'medium' | 'high' | 'critical'; deadline?: string; assignedTo?: 'qa' | 'admin' | 'coo' }>,
    tasks: Array<{ id: string; title: string; dueDate: string }>,
    clientNotification: { sent: boolean; channel: 'email' | 'whatsapp'; summary: string } | null
  ): ProcessMovementWorkflowOutput {
    return {
      processId: data.processId,
      classification: {
        type: classification.type,
        requiresAction: classification.requiresAction,
        deadline: classification.deadline,
      },
      analysis,
      recommendedActions: recommendations,
      clientNotification: clientNotification || undefined,
      tasksCreated: tasks,
    }
  }

  /**
   * Generate next actions
   */
  private generateNextActions(output: ProcessMovementWorkflowOutput, data: ProcessMovementTriggerData) {
    const actions = []

    // Notify for critical/urgent movements
    if (output.classification.type === 'critical' || output.classification.type === 'urgent') {
      const icon = output.classification.type === 'critical' ? '🚨' : '⚠️'
      actions.push({
        type: 'notify' as const,
        target: 'telegram',
        payload: {
          message: `${icon} *Movimentação ${output.classification.type.toUpperCase()}*\n\nProcesso: ${data.processNumber}\nCliente: ${data.clientName}\nTipo: ${data.movementType}\n\n${output.analysis}`,
          urgent: output.classification.type === 'critical',
        },
        priority: output.classification.type === 'critical' ? 'critical' as const : 'high' as const,
      })
    }

    // Schedule deadline reminders
    if (output.classification.deadline) {
      actions.push({
        type: 'schedule' as const,
        target: 'deadline-reminder',
        payload: {
          processId: data.processId,
          deadline: output.classification.deadline,
          reminderDays: [3, 1, 0], // 3 days, 1 day, and day of
        },
        priority: 'high' as const,
      })
    }

    return actions
  }

  /**
   * Get current status
   */
  getStatus() {
    return this.execution?.status || 'pending'
  }

  /**
   * Get execution details
   */
  getExecution() {
    return this.execution
  }

  /**
   * Cancel workflow
   */
  async cancel() {
    if (this.execution && this.execution.status === 'running') {
      this.execution.status = 'cancelled'
      this.execution.completedAt = new Date()
      logger.info('workflow-cancelled', 'Process Movement Workflow cancelado')
    }
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create process movement workflow
 */
export function createProcessMovementWorkflow(): ProcessMovementWorkflow {
  return new ProcessMovementWorkflow()
}

/**
 * Process a process movement event
 */
export async function processProcessMovement(data: ProcessMovementTriggerData): Promise<WorkflowResult> {
  const workflow = createProcessMovementWorkflow()
  return workflow.execute(data)
}
