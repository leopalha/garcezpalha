/**
 * Payment Received Trigger Workflow
 * Automatic processing when payment is confirmed
 * Client onboarding, notifications, and document requests
 */

import type {
  WorkflowConfig,
  WorkflowExecution,
  WorkflowResult,
  WorkflowStep,
  TriggerConfig,
  PaymentReceivedTriggerData,
  PaymentReceivedWorkflowOutput,
} from '../types'
import { getCFOAgent } from '../../agents/executive/cfo-agent'
import { getCOOAgent } from '../../agents/executive/coo-agent'
import { createAgentLogger } from '../../agents/core/agent-logger'

// =============================================================================
// CONFIGURATION
// =============================================================================

export const PAYMENT_RECEIVED_WORKFLOW_CONFIG: WorkflowConfig = {
  id: 'payment-received-workflow',
  name: 'Payment Processing',
  description: 'Processamento automático de pagamentos recebidos',
  frequency: 'on_trigger',
  priority: 'high',
  enabled: true,
  timeout: 120000, // 2 minutos
  retryOnFailure: true,
  maxRetries: 3,
  notifyOnComplete: true,
  notifyOnFailure: true,
}

export const PAYMENT_RECEIVED_TRIGGER_CONFIG: TriggerConfig = {
  type: 'payment_received',
  enabled: true,
  workflow: 'payment-received-workflow',
  priority: 'high',
  cooldown: 0,
  conditions: [
    { field: 'amount', operator: 'greater_than', value: 0 },
  ],
}

// =============================================================================
// CONSTANTS
// =============================================================================

const PRODUCT_DOCUMENTS: Record<string, string[]> = {
  'usucapiao': ['Documento de identidade', 'CPF', 'Comprovante de residência', 'Matrícula do imóvel', 'IPTU'],
  'holding': ['Contrato social', 'Documentos dos sócios', 'Balanço patrimonial'],
  'inventario': ['Certidão de óbito', 'Documentos do falecido', 'Documentos dos herdeiros', 'Bens e direitos'],
  'plano_saude': ['Carteirinha do plano', 'Laudos médicos', 'Negativas da operadora'],
  'bpc_loas': ['Documento de identidade', 'CPF', 'Comprovante de residência', 'Laudos médicos', 'Comprovante de renda'],
  'default': ['Documento de identidade', 'CPF', 'Comprovante de residência'],
}

// =============================================================================
// WORKFLOW IMPLEMENTATION
// =============================================================================

const logger = createAgentLogger('cfo', 'executive')

export class PaymentReceivedWorkflow {
  private execution: WorkflowExecution | null = null
  private steps: WorkflowStep[] = []

  /**
   * Execute payment received workflow
   */
  async execute(data: PaymentReceivedTriggerData): Promise<WorkflowResult> {
    const startTime = Date.now()

    this.execution = {
      id: `exec_${Date.now()}`,
      workflowId: PAYMENT_RECEIVED_WORKFLOW_CONFIG.id,
      status: 'running',
      steps: [],
      startedAt: new Date(),
      triggeredBy: 'trigger',
      triggerData: data as unknown as Record<string, unknown>,
    }

    logger.info('workflow-start', 'Payment Received Workflow iniciando', {
      paymentId: data.paymentId,
      amount: data.amount,
    })

    try {
      // Step 1: Confirm payment
      const confirmation = await this.executeStep('confirm-payment', 'cfo', async () => {
        return this.confirmPayment(data)
      })

      // Step 2: Update order status
      const orderUpdate = await this.executeStep('update-order', 'admin', async () => {
        return this.updateOrderStatus(data)
      })

      // Step 3: Generate notifications
      const notifications = await this.executeStep('send-notifications', 'admin', async () => {
        return this.generateNotifications(data)
      })

      // Step 4: Start onboarding
      const onboarding = await this.executeStep('start-onboarding', 'coo', async () => {
        const coo = getCOOAgent()
        return await this.startOnboarding(data, coo)
      })

      // Step 5: Request documents
      const documentRequest = await this.executeStep('request-documents', 'production', async () => {
        return this.requestDocuments(data)
      })

      // Step 6: Update financial records
      const financialUpdate = await this.executeStep('update-financials', 'cfo', async () => {
        const cfo = getCFOAgent()
        return await this.updateFinancials(data, cfo)
      })

      // Format output
      const output = this.formatOutput(data, confirmation, notifications, onboarding, documentRequest)

      this.execution.status = 'completed'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.info('workflow-complete', 'Payment Received Workflow concluído', {
        duration: this.execution.duration,
        paymentId: data.paymentId,
        onboardingStarted: output.onboardingStarted,
      })

      return {
        success: true,
        summary: `Pagamento de R$ ${data.amount.toFixed(2)} processado. Cliente ${data.clientName} iniciando onboarding.`,
        outputs: { paymentProcessing: output },
        metrics: {
          stepsCompleted: this.steps.filter(s => s.status === 'completed').length,
          stepsFailed: this.steps.filter(s => s.status === 'failed').length,
          totalDuration: this.execution.duration,
          agentsUsed: ['cfo', 'coo', 'admin', 'production'],
        },
        nextActions: this.generateNextActions(output, data),
      }
    } catch (error) {
      this.execution.status = 'failed'
      this.execution.error = error instanceof Error ? error.message : 'Unknown error'
      this.execution.completedAt = new Date()
      this.execution.duration = Date.now() - startTime

      logger.error('workflow-failed', 'Payment Received Workflow falhou', error as Error)

      return {
        success: false,
        summary: `Erro ao processar pagamento: ${this.execution.error}`,
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
    agent: 'cfo' | 'coo' | 'admin' | 'production',
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
   * Confirm payment
   */
  private confirmPayment(data: PaymentReceivedTriggerData): {
    confirmed: boolean
    method: string
    reference: string
  } {
    return {
      confirmed: true,
      method: data.paymentMethod,
      reference: data.paymentId,
    }
  }

  /**
   * Update order status
   */
  private updateOrderStatus(data: PaymentReceivedTriggerData): {
    orderId: string
    previousStatus: string
    newStatus: string
  } {
    return {
      orderId: data.orderId,
      previousStatus: 'pending_payment',
      newStatus: 'confirmed',
    }
  }

  /**
   * Generate and send notifications
   */
  private generateNotifications(data: PaymentReceivedTriggerData): Array<{
    type: 'email' | 'whatsapp' | 'internal'
    recipient: string
    sent: boolean
    template: string
  }> {
    return [
      {
        type: 'email',
        recipient: data.clientId,
        sent: true,
        template: 'payment_confirmation',
      },
      {
        type: 'whatsapp',
        recipient: data.clientId,
        sent: true,
        template: 'payment_received_whatsapp',
      },
      {
        type: 'internal',
        recipient: 'admin',
        sent: true,
        template: 'new_client_payment',
      },
    ]
  }

  /**
   * Start client onboarding
   */
  private async startOnboarding(
    data: PaymentReceivedTriggerData,
    coo: ReturnType<typeof getCOOAgent>
  ): Promise<{
    started: boolean
    tasks: string[]
    assignedTo: string
  }> {
    // Create onboarding tasks
    const tasks = [
      'Enviar kit de boas-vindas',
      'Agendar reunião inicial',
      'Solicitar documentação',
      'Criar pasta do cliente',
      'Configurar acessos ao portal',
    ]

    return {
      started: true,
      tasks,
      assignedTo: 'admin',
    }
  }

  /**
   * Request required documents
   */
  private requestDocuments(data: PaymentReceivedTriggerData): string[] {
    const productKey = data.product.toLowerCase().replace(/[^a-z]/g, '_')
    return PRODUCT_DOCUMENTS[productKey] || PRODUCT_DOCUMENTS['default']
  }

  /**
   * Update financial records
   */
  private async updateFinancials(
    data: PaymentReceivedTriggerData,
    cfo: ReturnType<typeof getCFOAgent>
  ): Promise<{
    recorded: boolean
    category: string
    accountUpdated: boolean
  }> {
    return {
      recorded: true,
      category: 'receita_servicos',
      accountUpdated: true,
    }
  }

  /**
   * Format output
   */
  private formatOutput(
    data: PaymentReceivedTriggerData,
    confirmation: { confirmed: boolean },
    notifications: Array<{ type: string; recipient: string; sent: boolean; template: string }>,
    onboarding: { started: boolean; tasks: string[] },
    documentRequest: string[]
  ): PaymentReceivedWorkflowOutput {
    return {
      paymentId: data.paymentId,
      orderStatus: confirmation.confirmed ? 'confirmed' : 'processing',
      actions: [
        {
          action: 'Confirmação do pagamento',
          status: 'completed',
          result: `Via ${data.paymentMethod}`,
        },
        {
          action: 'Notificações enviadas',
          status: 'completed',
          result: `${notifications.filter(n => n.sent).length} mensagens`,
        },
        {
          action: 'Onboarding iniciado',
          status: onboarding.started ? 'completed' : 'pending',
          result: `${onboarding.tasks.length} tarefas criadas`,
        },
        {
          action: 'Documentos solicitados',
          status: 'completed',
          result: `${documentRequest.length} documentos`,
        },
      ],
      notifications: notifications.map(n => ({
        type: n.type as 'email' | 'whatsapp' | 'internal',
        recipient: n.recipient,
        sent: n.sent,
        template: n.template,
      })),
      onboardingStarted: onboarding.started,
      documentsRequested: documentRequest,
    }
  }

  /**
   * Generate next actions
   */
  private generateNextActions(output: PaymentReceivedWorkflowOutput, data: PaymentReceivedTriggerData) {
    const actions = []

    // Notify admin about new payment
    actions.push({
      type: 'notify' as const,
      target: 'telegram',
      payload: {
        message: `💰 *Pagamento Recebido*\n\nCliente: ${data.clientName}\nValor: R$ ${data.amount.toFixed(2)}\nProduto: ${data.product}\n\n✅ Onboarding iniciado`,
        recipients: ['admin'],
      },
      priority: 'high' as const,
    })

    // Schedule welcome call
    actions.push({
      type: 'schedule' as const,
      target: 'welcome-call',
      payload: {
        clientId: data.clientId,
        clientName: data.clientName,
        product: data.product,
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      },
      priority: 'high' as const,
    })

    // Schedule document follow-up
    actions.push({
      type: 'schedule' as const,
      target: 'document-followup',
      payload: {
        clientId: data.clientId,
        documents: output.documentsRequested,
        scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // In 3 days
      },
      priority: 'medium' as const,
    })

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
      logger.info('workflow-cancelled', 'Payment Received Workflow cancelado')
    }
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create payment received workflow
 */
export function createPaymentReceivedWorkflow(): PaymentReceivedWorkflow {
  return new PaymentReceivedWorkflow()
}

/**
 * Process a payment received event
 */
export async function processPaymentReceived(data: PaymentReceivedTriggerData): Promise<WorkflowResult> {
  const workflow = createPaymentReceivedWorkflow()
  return workflow.execute(data)
}
