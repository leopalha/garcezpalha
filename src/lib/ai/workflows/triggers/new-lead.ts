/**
 * New Lead Trigger Workflow
 * Automatic processing of new leads
 * Qualification, assignment, and follow-up scheduling
 */

import type {
  WorkflowConfig,
  WorkflowExecution,
  WorkflowResult,
  WorkflowStep,
  TriggerConfig,
  NewLeadTriggerData,
  NewLeadWorkflowOutput,
} from '../types'
import { getCEOAgent } from '../../agents/executive/ceo-agent'
import { getCOOAgent } from '../../agents/executive/coo-agent'
import { createAgentLogger } from '../../agents/core/agent-logger'

// =============================================================================
// CONFIGURATION
// =============================================================================

export const NEW_LEAD_WORKFLOW_CONFIG: WorkflowConfig = {
  id: 'new-lead-workflow',
  name: 'New Lead Processing',
  description: 'Processamento automático de novos leads com qualificação e follow-up',
  frequency: 'on_trigger',
  priority: 'critical',
  enabled: true,
  timeout: 60000, // 1 minuto
  retryOnFailure: true,
  maxRetries: 3,
  notifyOnComplete: true,
  notifyOnFailure: true,
}

export const NEW_LEAD_TRIGGER_CONFIG: TriggerConfig = {
  type: 'new_lead',
  enabled: true,
  workflow: 'new-lead-workflow',
  priority: 'critical',
  cooldown: 0, // No cooldown - process immediately
  conditions: [
    { field: 'email', operator: 'contains', value: '@' },
  ],
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SCORE_THRESHOLDS = {
  hot: 80,
  warm: 50,
  cold: 0,
}

const RESPONSE_TIME_TARGETS = {
  hot: 5, // 5 minutos
  warm: 30, // 30 minutos
  cold: 120, // 2 horas
}

// =============================================================================
// WORKFLOW IMPLEMENTATION
// =============================================================================

const logger = createAgentLogger('triagem', 'operations')

export class NewLeadWorkflow {
  private execution: WorkflowExecution | null = null
  private steps: WorkflowStep[] = []

  /**
   * Execute new lead workflow
   */
  async execute(data: NewLeadTriggerData): Promise<WorkflowResult> {
    const startTime = Date.now()

    this.execution = {
      id: `exec_${Date.now()}`,
      workflowId: NEW_LEAD_WORKFLOW_CONFIG.id,
      status: 'running',
      steps: [],
      startedAt: new Date(),
      triggeredBy: 'trigger',
      triggerData: data as unknown as Record<string, unknown>,
    }

    logger.info('workflow-start', 'New Lead Workflow iniciando', {
      leadId: data.leadId,
      source: data.source,
    })

    try {
      // Step 1: Qualify lead
      const qualification = await this.executeStep('qualify-lead', 'triagem', async () => {
        return this.qualifyLead(data)
      })

      // Step 2: Determine priority and assignment
      const assignment = await this.executeStep('assign-lead', 'coo', async () => {
        const coo = getCOOAgent()
        return await coo.balanceAgentWorkload({
          newTask: {
            type: 'lead',
            priority: qualification.priority,
            estimatedTime: 30,
          },
        })
      })

      // Step 3: Generate initial response
      const initialResponse = await this.executeStep('generate-response', 'triagem', async () => {
        return this.generateInitialResponse(data, qualification)
      })

      // Step 4: Schedule follow-up
      const followUp = await this.executeStep('schedule-followup', 'admin', async () => {
        return this.scheduleFollowUp(data, qualification)
      })

      // Step 5: Update CRM (simulated)
      const crmUpdate = await this.executeStep('update-crm', 'admin', async () => {
        return this.updateCRM(data, qualification, assignment)
      })

      // Format output
      const output = this.formatOutput(data, qualification, assignment, followUp, initialResponse)

      this.execution.status = 'completed'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.info('workflow-complete', 'New Lead Workflow concluído', {
        duration: this.execution.duration,
        leadId: data.leadId,
        tier: qualification.tier,
      })

      return {
        success: true,
        summary: `Lead ${data.name} qualificado como ${qualification.tier.toUpperCase()} (${qualification.score} pontos)`,
        outputs: { leadProcessing: output },
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: ['triagem', 'coo', 'admin'],
        },
        nextActions: this.generateNextActions(output),
      }
    } catch (error) {
      this.execution.status = 'failed'
      this.execution.error = error instanceof Error ? error.message : 'Unknown error'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.error('workflow-failed', 'New Lead Workflow falhou', error as Error)

      return {
        success: false,
        summary: `Erro ao processar lead: ${this.execution.error}`,
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
    agent: 'triagem' | 'coo' | 'admin' | 'ceo',
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
   * Qualify lead based on data
   */
  private qualifyLead(data: NewLeadTriggerData): {
    score: number
    tier: 'hot' | 'warm' | 'cold'
    priority: 'low' | 'medium' | 'high' | 'critical'
    factors: string[]
  } {
    let score = data.score || 50
    const factors: string[] = []

    // Adjust score based on source
    if (data.source === 'referral') {
      score += 20
      factors.push('Indicação (+20)')
    } else if (data.source === 'google_ads') {
      score += 15
      factors.push('Google Ads (+15)')
    } else if (data.source === 'organic') {
      score += 10
      factors.push('Busca orgânica (+10)')
    }

    // Adjust for product intent
    if (data.product) {
      score += 15
      factors.push('Produto específico (+15)')
    }

    // Adjust for contact info completeness
    if (data.phone) {
      score += 10
      factors.push('Telefone informado (+10)')
    }

    // Adjust for message content
    if (data.message && data.message.length > 100) {
      score += 10
      factors.push('Mensagem detalhada (+10)')
    }

    // Determine tier
    let tier: 'hot' | 'warm' | 'cold'
    let priority: 'low' | 'medium' | 'high' | 'critical'

    if (score >= SCORE_THRESHOLDS.hot) {
      tier = 'hot'
      priority = 'critical'
    } else if (score >= SCORE_THRESHOLDS.warm) {
      tier = 'warm'
      priority = 'high'
    } else {
      tier = 'cold'
      priority = 'medium'
    }

    return { score: Math.min(score, 100), tier, priority, factors }
  }

  /**
   * Generate initial response message
   */
  private generateInitialResponse(
    data: NewLeadTriggerData,
    qualification: { tier: 'hot' | 'warm' | 'cold' }
  ): { message: string; channel: 'email' | 'whatsapp'; template: string } {
    const firstName = data.name.split(' ')[0]

    let template: string
    let message: string

    if (qualification.tier === 'hot') {
      template = 'hot_lead_immediate'
      message = `Olá ${firstName}! Recebemos sua mensagem e um de nossos especialistas entrará em contato nos próximos 5 minutos. Enquanto isso, você pode me contar mais sobre seu caso?`
    } else if (qualification.tier === 'warm') {
      template = 'warm_lead_priority'
      message = `Olá ${firstName}! Obrigado por entrar em contato com o escritório Garcez Palha. Um de nossos advogados analisará seu caso e retornará em até 30 minutos.`
    } else {
      template = 'cold_lead_standard'
      message = `Olá ${firstName}! Agradecemos seu contato. Nossa equipe está analisando sua solicitação e retornará em breve com mais informações sobre como podemos ajudar.`
    }

    return {
      message,
      channel: data.phone ? 'whatsapp' : 'email',
      template,
    }
  }

  /**
   * Schedule follow-up based on qualification
   */
  private scheduleFollowUp(
    data: NewLeadTriggerData,
    qualification: { tier: 'hot' | 'warm' | 'cold' }
  ): { type: 'email' | 'whatsapp' | 'call'; scheduledFor: string; template: string } {
    const now = new Date()
    const targetMinutes = RESPONSE_TIME_TARGETS[qualification.tier]
    const scheduledFor = new Date(now.getTime() + targetMinutes * 60 * 1000)

    let type: 'email' | 'whatsapp' | 'call'
    let template: string

    if (qualification.tier === 'hot') {
      type = data.phone ? 'call' : 'email'
      template = 'urgent_follow_up'
    } else if (qualification.tier === 'warm') {
      type = data.phone ? 'whatsapp' : 'email'
      template = 'priority_follow_up'
    } else {
      type = 'email'
      template = 'standard_follow_up'
    }

    return {
      type,
      scheduledFor: scheduledFor.toISOString(),
      template,
    }
  }

  /**
   * Update CRM with lead data
   */
  private updateCRM(
    data: NewLeadTriggerData,
    qualification: { score: number; tier: string },
    assignment: Record<string, unknown>
  ): { updated: boolean; fields: string[] } {
    // In production, this would update Supabase or external CRM
    return {
      updated: true,
      fields: ['score', 'tier', 'assigned_to', 'status', 'last_contact'],
    }
  }

  /**
   * Format output
   */
  private formatOutput(
    data: NewLeadTriggerData,
    qualification: { score: number; tier: 'hot' | 'warm' | 'cold'; priority: 'low' | 'medium' | 'high' | 'critical' },
    assignment: Record<string, unknown>,
    followUp: { type: 'email' | 'whatsapp' | 'call'; scheduledFor: string; template: string },
    initialResponse: { message: string; channel: 'email' | 'whatsapp'; template: string }
  ): NewLeadWorkflowOutput {
    return {
      leadId: data.leadId,
      qualification: {
        score: qualification.score,
        tier: qualification.tier,
        priority: qualification.priority,
      },
      assignedTo: (assignment.assignedAgent as 'triagem' | 'admin') || 'triagem',
      actions: [
        {
          action: 'Qualificação do lead',
          status: 'completed',
          result: `Score: ${qualification.score}, Tier: ${qualification.tier}`,
        },
        {
          action: 'Envio de resposta inicial',
          status: 'completed',
          result: `Via ${initialResponse.channel}`,
        },
        {
          action: 'Agendamento de follow-up',
          status: 'scheduled',
          scheduledFor: followUp.scheduledFor,
        },
      ],
      followUpScheduled: followUp,
      proposalGenerated: qualification.tier === 'hot',
    }
  }

  /**
   * Generate next actions
   */
  private generateNextActions(output: NewLeadWorkflowOutput) {
    const actions = []

    // Notify for hot leads
    if (output.qualification.tier === 'hot') {
      actions.push({
        type: 'notify' as const,
        target: 'telegram',
        payload: {
          message: `🔥 *LEAD HOT*\nScore: ${output.qualification.score}\nFollow-up em 5 min`,
          urgent: true,
        },
        priority: 'critical' as const,
      })
    }

    // Schedule follow-up execution
    if (output.followUpScheduled) {
      actions.push({
        type: 'schedule' as const,
        target: 'execute-follow-up',
        payload: {
          leadId: output.leadId,
          type: output.followUpScheduled.type,
          scheduledFor: output.followUpScheduled.scheduledFor,
        },
        priority: output.qualification.priority,
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
      logger.info('workflow-cancelled', 'New Lead Workflow cancelado')
    }
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create new lead workflow
 */
export function createNewLeadWorkflow(): NewLeadWorkflow {
  return new NewLeadWorkflow()
}

/**
 * Process a new lead
 */
export async function processNewLead(data: NewLeadTriggerData): Promise<WorkflowResult> {
  const workflow = createNewLeadWorkflow()
  return workflow.execute(data)
}
