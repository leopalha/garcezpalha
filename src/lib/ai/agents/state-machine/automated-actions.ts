/**
 * Automated Actions Dispatcher
 * Triggers automated actions based on state changes and conditions
 */

import { ConversationData, AutomatedAction } from './types'
import { createClient } from '@/lib/supabase/client'

export class AutomatedActionsDispatcher {
  private actions: AutomatedAction[]
  private supabase = createClient()

  constructor() {
    this.actions = this.initializeActions()
  }

  /**
   * Dispatch automated actions for a conversation
   */
  async dispatch(data: ConversationData): Promise<void> {
    const applicableActions = this.actions.filter(action =>
      action.condition(data)
    )

    // Sort by priority
    const sortedActions = this.sortByPriority(applicableActions)

    // Execute actions
    for (const action of sortedActions) {
      try {
        await action.action(data)
      } catch (error) {
        console.error('[AutomatedActions] Error executing action:', error)
      }
    }
  }

  private sortByPriority(actions: AutomatedAction[]): AutomatedAction[] {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return actions.sort((a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority]
    )
  }

  /**
   * Initialize all automated actions
   */
  private initializeActions(): AutomatedAction[] {
    return [
      // ACTION 1: Send payment confirmation email
      {
        trigger: 'state_change',
        condition: (data) => data.status.state === 'paid',
        priority: 'high',
        action: async (data) => {
          console.log('[AutomatedAction] Sending payment confirmation email')
          // TODO: Implement email sending
          await this.sendPaymentConfirmationEmail(data)
        },
      },

      // ACTION 2: Generate and send contract
      {
        trigger: 'state_change',
        condition: (data) => data.status.state === 'contract_pending',
        priority: 'high',
        action: async (data) => {
          console.log('[AutomatedAction] Generating and sending contract')
          await this.generateAndSendContract(data)
        },
      },

      // ACTION 3: Notify admin of high-value proposal
      {
        trigger: 'state_change',
        condition: (data) =>
          data.status.state === 'proposing' &&
          (data.proposal.value || 0) > 500000,
        priority: 'high',
        action: async (data) => {
          console.log('[AutomatedAction] Notifying admin of high-value proposal')
          await this.notifyAdminHighValue(data)
        },
      },

      // ACTION 4: Send follow-up after qualification
      {
        trigger: 'state_change',
        condition: (data) => data.status.state === 'qualified',
        priority: 'medium',
        action: async (data) => {
          console.log('[AutomatedAction] Scheduling follow-up messages')
          await this.scheduleFollowUps(data)
        },
      },

      // ACTION 5: Create lead record in database
      {
        trigger: 'state_change',
        condition: (data) => data.status.state === 'qualified',
        priority: 'high',
        action: async (data) => {
          console.log('[AutomatedAction] Creating lead record')
          await this.createLeadRecord(data)
        },
      },

      // ACTION 6: Send welcome message on onboarding
      {
        trigger: 'state_change',
        condition: (data) => data.status.state === 'onboarding',
        priority: 'medium',
        action: async (data) => {
          console.log('[AutomatedAction] Sending welcome package')
          await this.sendWelcomePackage(data)
        },
      },

      // ACTION 7: Notify lawyer of new active case
      {
        trigger: 'state_change',
        condition: (data) => data.status.state === 'active_case',
        priority: 'high',
        action: async (data) => {
          console.log('[AutomatedAction] Notifying assigned lawyer')
          await this.notifyAssignedLawyer(data)
        },
      },

      // ACTION 8: Send reminder for abandoned carts
      {
        trigger: 'time_based',
        condition: (data) => {
          if (data.status.state !== 'payment_pending') return false
          const timeSinceUpdate = Date.now() - new Date(data.status.updated_at).getTime()
          return timeSinceUpdate > 2 * 60 * 60 * 1000 // 2 hours
        },
        priority: 'medium',
        action: async (data) => {
          console.log('[AutomatedAction] Sending abandoned cart reminder')
          await this.sendAbandonedCartReminder(data)
        },
      },

      // ACTION 9: Request document upload after payment
      {
        trigger: 'state_change',
        condition: (data) => data.status.state === 'contract_pending',
        priority: 'medium',
        action: async (data) => {
          console.log('[AutomatedAction] Requesting document upload')
          await this.requestDocumentUpload(data)
        },
      },
    ]
  }

  // ============================================================================
  // ACTION IMPLEMENTATIONS
  // ============================================================================

  private async sendPaymentConfirmationEmail(data: ConversationData): Promise<void> {
    // TODO: Integrate with Resend
    const emailData = {
      to: data.client.email || data.email,
      subject: 'Pagamento Confirmado - Garcez Palha',
      html: `
        <h1>Pagamento Confirmado! 🎉</h1>
        <p>Olá ${data.client.name || 'Cliente'},</p>
        <p>Seu pagamento foi confirmado com sucesso.</p>
        <p>Próximos passos:</p>
        <ul>
          <li>Assinar contrato digital (enviado por email)</li>
          <li>Aguardar atribuição de advogado</li>
          <li>Acessar portal do cliente</li>
        </ul>
      `,
    }
    console.log('[Email] Would send:', emailData)
  }

  private async generateAndSendContract(data: ConversationData): Promise<void> {
    // TODO: Integrate with ClickSign API
    console.log('[Contract] Would generate contract for:', data.conversation_id)
  }

  private async notifyAdminHighValue(data: ConversationData): Promise<void> {
    // TODO: Send notification to admin dashboard + email
    console.log('[Notification] High-value proposal:', data.proposal.value)
  }

  private async scheduleFollowUps(data: ConversationData): Promise<void> {
    // TODO: Integrate with follow-up scheduling system
    console.log('[FollowUp] Scheduling messages for:', data.conversation_id)
  }

  private async createLeadRecord(data: ConversationData): Promise<void> {
    const leadData = {
      conversation_id: data.conversation_id,
      name: data.client.name,
      email: data.client.email || data.email,
      phone: data.client.phone || data.phone_number,
      source: data.channel,
      status: data.qualification.status === 'complete' ? 'qualified' : 'in_progress',
      score: data.qualification.score,
      area: data.classification.area,
      assigned_agent: data.classification.agent_assigned,
      created_at: data.created_at,
    }

    const { error } = await this.supabase
      .from('leads')
      .upsert(leadData, { onConflict: 'conversation_id' })

    if (error) {
      console.error('[AutomatedAction] Error creating lead:', error)
    }
  }

  private async sendWelcomePackage(data: ConversationData): Promise<void> {
    // TODO: Send welcome email with portal access, etc.
    console.log('[Welcome] Sending package to:', data.client.email)
  }

  private async notifyAssignedLawyer(data: ConversationData): Promise<void> {
    // TODO: Notify lawyer via email/WhatsApp
    console.log('[Lawyer] Notifying about new case:', data.conversation_id)
  }

  private async sendAbandonedCartReminder(data: ConversationData): Promise<void> {
    // TODO: Send reminder via WhatsApp or email
    console.log('[Reminder] Abandoned cart for:', data.conversation_id)
  }

  private async requestDocumentUpload(data: ConversationData): Promise<void> {
    // TODO: Send email with document upload instructions
    console.log('[Documents] Requesting upload from:', data.client.email)
  }
}
