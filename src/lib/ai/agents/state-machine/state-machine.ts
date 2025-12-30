/**
 * Agent State Machine
 * Core state machine that orchestrates agent behavior across 17 states
 */

import {
  StateType,
  ConversationData,
  StateBehavior,
  StateTransition,
  TRANSITIONS,
  ESCALATION_RULES,
} from './types'
import { StateBehaviorRegistry } from './behaviors'
import { AutomatedActionsDispatcher } from './automated-actions'
import { createClient } from '@/lib/supabase/client'

export class AgentStateMachine {
  private behaviors: StateBehaviorRegistry
  private actionsDispatcher: AutomatedActionsDispatcher
  private supabase = createClient()

  constructor() {
    this.behaviors = new StateBehaviorRegistry()
    this.actionsDispatcher = new AutomatedActionsDispatcher()
  }

  /**
   * Process a user message and return AI response with state transition
   */
  async processMessage(
    conversationId: string,
    message: string
  ): Promise<{
    response: string
    data: ConversationData
  }> {
    // Load conversation data
    let data = await this.loadConversation(conversationId)

    if (!data) {
      // New conversation - start in greeting state
      data = await this.createNewConversation(conversationId, message)
    }

    // Check for escalation rules
    const shouldEscalate = this.checkEscalation(data)
    if (shouldEscalate && data.status.state !== 'escalated') {
      return await this.escalate(data, shouldEscalate.reason)
    }

    // Get behavior for current state
    const behavior = this.behaviors.getBehavior(data.status.state)
    if (!behavior) {
      throw new Error(`No behavior defined for state: ${data.status.state}`)
    }

    // Handle message with current state's behavior
    const result = await behavior.handleMessage(message, data)

    // Update conversation data
    data = result.data
    data.last_message_at = new Date()

    // Transition to new state if specified
    if (result.nextState) {
      data = await this.transitionTo(data, result.nextState)
    }

    // Save updated conversation
    await this.saveConversation(data)

    // Trigger automated actions (save leads, send notifications)
    await this.actionsDispatcher.dispatch(data)

    return {
      response: result.response,
      data,
    }
  }

  /**
   * Transition to a new state
   */
  private async transitionTo(
    data: ConversationData,
    newState: StateType
  ): Promise<ConversationData> {
    const currentState = data.status.state

    // Validate transition
    if (!this.canTransition(currentState, newState)) {
      console.warn(
        `[StateMachine] Invalid transition from ${currentState} to ${newState}`
      )
      return data
    }

    console.log(
      `[StateMachine] Transitioning: ${currentState} → ${newState}`
    )

    // Call onExit for current state
    const currentBehavior = this.behaviors.getBehavior(currentState)
    if (currentBehavior?.onExit) {
      data = await currentBehavior.onExit(data)
    }

    // Update state
    data.status = {
      ...data.status,
      state: newState,
      updated_at: new Date(),
    }

    // Call onEnter for new state
    const newBehavior = this.behaviors.getBehavior(newState)
    if (newBehavior?.onEnter) {
      data = await newBehavior.onEnter(data)
    }

    return data
  }

  /**
   * Check if transition is valid
   */
  private canTransition(from: StateType, to: StateType): boolean {
    const allowedTransitions = TRANSITIONS[from]
    return allowedTransitions.includes(to)
  }

  /**
   * Check if conversation should be escalated
   */
  private checkEscalation(
    data: ConversationData
  ): { reason: string; priority: string } | null {
    for (const rule of ESCALATION_RULES) {
      if (rule.condition(data)) {
        return {
          reason: rule.reason,
          priority: rule.priority,
        }
      }
    }
    return null
  }

  /**
   * Escalate conversation to human
   */
  private async escalate(
    data: ConversationData,
    reason: string
  ): Promise<{
    response: string
    data: ConversationData
  }> {
    console.log(`[StateMachine] Escalating: ${reason}`)

    data.status = {
      state: 'escalated',
      updated_at: new Date(),
      escalation_reason: reason,
    }

    await this.saveConversation(data)

    // Notify admin (could send email, WhatsApp, etc.)
    await this.notifyHumanAgent(data, reason)

    return {
      response: `Sua solicitação foi encaminhada para um de nossos especialistas.

Em breve, você receberá um contato personalizado para melhor atendê-lo.

**Motivo:** ${reason}

Agradecemos sua paciência! 🙏`,
      data,
    }
  }

  /**
   * Notify human agent about escalation
   */
  private async notifyHumanAgent(
    data: ConversationData,
    reason: string
  ): Promise<void> {
    // TODO: Implement notification logic
    // - Send email to admin
    // - Create notification in admin dashboard
    // - Send WhatsApp message to responsible lawyer
    console.log(`[StateMachine] Notification sent for escalation: ${reason}`)
  }

  /**
   * Load conversation from database
   */
  private async loadConversation(
    conversationId: string
  ): Promise<ConversationData | null> {
    const { data, error } = await this.supabase
      .from('conversations')
      .select('*')
      .eq('conversation_id', conversationId)
      .single()

    if (error || !data) {
      return null
    }

    return data as ConversationData
  }

  /**
   * Create new conversation
   */
  private async createNewConversation(
    conversationId: string,
    firstMessage: string
  ): Promise<ConversationData> {
    // Detect channel from conversationId format
    let channel: 'website' | 'whatsapp' | 'telegram' | 'email' = 'website'
    if (conversationId.includes('whatsapp:')) channel = 'whatsapp'
    if (conversationId.includes('telegram:')) channel = 'telegram'
    if (conversationId.includes('@')) channel = 'email'

    const data: ConversationData = {
      conversation_id: conversationId,
      channel,
      client: {},
      classification: {
        area: '',
        agent_assigned: '',
        confidence: 0,
      },
      qualification: {
        status: 'in_progress',
        questions_answered: 0,
        total_questions: 0,
        score: 0,
        flags: [],
      },
      proposal: {},
      status: {
        state: 'greeting',
        updated_at: new Date(),
      },
      created_at: new Date(),
      last_message_at: new Date(),
    }

    await this.saveConversation(data)
    return data
  }

  /**
   * Save conversation to database
   */
  private async saveConversation(data: ConversationData): Promise<void> {
    const { error } = await this.supabase
      .from('conversations')
      .upsert(data, {
        onConflict: 'conversation_id',
      })

    if (error) {
      console.error('[StateMachine] Error saving conversation:', error)
      throw error
    }
  }

  /**
   * Get current state of a conversation
   */
  async getState(conversationId: string): Promise<StateType | null> {
    const data = await this.loadConversation(conversationId)
    return data?.status.state || null
  }

  /**
   * Manually transition a conversation (for admin/human intervention)
   */
  async manualTransition(
    conversationId: string,
    newState: StateType,
    reason?: string
  ): Promise<ConversationData> {
    const data = await this.loadConversation(conversationId)
    if (!data) {
      throw new Error('Conversation not found')
    }

    const updatedData = await this.transitionTo(data, newState)
    if (reason) {
      updatedData.metadata = {
        ...updatedData.metadata,
        manual_transition_reason: reason,
      }
    }

    await this.saveConversation(updatedData)
    return updatedData
  }
}
