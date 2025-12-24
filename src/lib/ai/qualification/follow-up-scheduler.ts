/**
 * Automated Follow-up Scheduler
 * Schedules and manages automated follow-up messages for qualified leads
 */

import type { QualificationResult, LeadCategory } from './types'
import type { WhatsAppTemplate } from './whatsapp-templates'
import { getFollowUpSequence } from './whatsapp-templates'

/**
 * Follow-up status
 */
export type FollowUpStatus = 'scheduled' | 'sent' | 'delivered' | 'read' | 'replied' | 'failed' | 'cancelled'

/**
 * Follow-up message
 */
export interface FollowUpMessage {
  id: string
  leadId: string
  templateName: string
  category: string
  message: string
  scheduledFor: Date
  sentAt?: Date
  deliveredAt?: Date
  readAt?: Date
  repliedAt?: Date
  status: FollowUpStatus
  channel: 'whatsapp' | 'email' | 'sms'
  recipientPhone?: string
  recipientEmail?: string
  metadata?: Record<string, any>
}

/**
 * Follow-up schedule configuration
 */
export interface FollowUpScheduleConfig {
  leadId: string
  leadCategory: LeadCategory
  clientName: string
  clientPhone?: string
  clientEmail?: string
  productId: string
  qualificationResult: QualificationResult
  startImmediately?: boolean
  channels?: Array<'whatsapp' | 'email' | 'sms'>
}

/**
 * Follow-up scheduler
 */
export class FollowUpScheduler {
  private messages: FollowUpMessage[] = []

  /**
   * Schedule follow-up sequence for a lead
   */
  scheduleFollowUpSequence(config: FollowUpScheduleConfig): FollowUpMessage[] {
    const sequence = getFollowUpSequence(config.leadCategory)
    const now = new Date()
    const channels = config.channels || ['whatsapp']

    const scheduledMessages: FollowUpMessage[] = []

    for (const template of sequence) {
      const scheduledFor = new Date(
        now.getTime() + (template.delayMinutes || 0) * 60 * 1000
      )

      for (const channel of channels) {
        const message: FollowUpMessage = {
          id: this.generateMessageId(),
          leadId: config.leadId,
          templateName: template.name,
          category: template.category,
          message: this.renderTemplate(template, config),
          scheduledFor,
          status: 'scheduled',
          channel,
          recipientPhone: config.clientPhone,
          recipientEmail: config.clientEmail,
          metadata: {
            productId: config.productId,
            leadCategory: config.leadCategory,
            qualificationScore: config.qualificationResult.score.total,
          },
        }

        scheduledMessages.push(message)
        this.messages.push(message)
      }
    }

    // Start sending if immediate
    if (config.startImmediately) {
      this.processScheduledMessages()
    }

    return scheduledMessages
  }

  /**
   * Schedule a single follow-up message
   */
  scheduleMessage(
    leadId: string,
    message: string,
    scheduledFor: Date,
    channel: 'whatsapp' | 'email' | 'sms',
    recipient: { phone?: string; email?: string },
    metadata?: Record<string, any>
  ): FollowUpMessage {
    const followUpMessage: FollowUpMessage = {
      id: this.generateMessageId(),
      leadId,
      templateName: 'custom',
      category: 'custom',
      message,
      scheduledFor,
      status: 'scheduled',
      channel,
      recipientPhone: recipient.phone,
      recipientEmail: recipient.email,
      metadata,
    }

    this.messages.push(followUpMessage)
    return followUpMessage
  }

  /**
   * Cancel a scheduled message
   */
  cancelMessage(messageId: string): boolean {
    const message = this.messages.find(m => m.id === messageId)
    if (!message || message.status !== 'scheduled') {
      return false
    }

    message.status = 'cancelled'
    return true
  }

  /**
   * Cancel all follow-ups for a lead
   */
  cancelLeadFollowUps(leadId: string): number {
    let cancelled = 0
    for (const message of this.messages) {
      if (message.leadId === leadId && message.status === 'scheduled') {
        message.status = 'cancelled'
        cancelled++
      }
    }
    return cancelled
  }

  /**
   * Get scheduled messages for a lead
   */
  getLeadMessages(leadId: string): FollowUpMessage[] {
    return this.messages.filter(m => m.leadId === leadId)
  }

  /**
   * Get messages due for sending
   */
  getDueMessages(): FollowUpMessage[] {
    const now = new Date()
    return this.messages.filter(
      m => m.status === 'scheduled' && m.scheduledFor <= now
    )
  }

  /**
   * Mark message as sent
   */
  markAsSent(messageId: string): void {
    const message = this.messages.find(m => m.id === messageId)
    if (message) {
      message.status = 'sent'
      message.sentAt = new Date()
    }
  }

  /**
   * Mark message as delivered
   */
  markAsDelivered(messageId: string): void {
    const message = this.messages.find(m => m.id === messageId)
    if (message) {
      message.status = 'delivered'
      message.deliveredAt = new Date()
    }
  }

  /**
   * Mark message as read
   */
  markAsRead(messageId: string): void {
    const message = this.messages.find(m => m.id === messageId)
    if (message) {
      message.status = 'read'
      message.readAt = new Date()
    }
  }

  /**
   * Mark message as replied (lead responded)
   */
  markAsReplied(messageId: string): void {
    const message = this.messages.find(m => m.id === messageId)
    if (message) {
      message.status = 'replied'
      message.repliedAt = new Date()

      // Cancel remaining follow-ups if lead replied
      if (message.leadId) {
        this.pauseLeadFollowUps(message.leadId)
      }
    }
  }

  /**
   * Mark message as failed
   */
  markAsFailed(messageId: string): void {
    const message = this.messages.find(m => m.id === messageId)
    if (message) {
      message.status = 'failed'
    }
  }

  /**
   * Pause follow-ups for a lead (when they respond)
   */
  pauseLeadFollowUps(leadId: string): number {
    let paused = 0
    for (const message of this.messages) {
      if (
        message.leadId === leadId &&
        message.status === 'scheduled' &&
        message.category === 'reminder'
      ) {
        message.status = 'cancelled'
        paused++
      }
    }
    return paused
  }

  /**
   * Process and send due messages
   */
  async processScheduledMessages(): Promise<void> {
    const dueMessages = this.getDueMessages()

    for (const message of dueMessages) {
      try {
        await this.sendMessage(message)
        this.markAsSent(message.id)
      } catch (error) {
        console.error(`Failed to send message ${message.id}:`, error)
        this.markAsFailed(message.id)
      }
    }
  }

  /**
   * Send a message via the appropriate channel
   */
  private async sendMessage(message: FollowUpMessage): Promise<void> {
    switch (message.channel) {
      case 'whatsapp':
        await this.sendWhatsAppMessage(message)
        break
      case 'email':
        await this.sendEmailMessage(message)
        break
      case 'sms':
        await this.sendSMSMessage(message)
        break
    }
  }

  /**
   * Send WhatsApp message
   */
  private async sendWhatsAppMessage(message: FollowUpMessage): Promise<void> {
    if (!message.recipientPhone) {
      throw new Error('No phone number provided for WhatsApp message')
    }

    // Import WhatsApp Cloud API service
    const { whatsappCloudAPI } = await import('@/lib/whatsapp/cloud-api')

    await whatsappCloudAPI.sendMessage(message.recipientPhone, message.message)
  }

  /**
   * Send email message
   */
  private async sendEmailMessage(message: FollowUpMessage): Promise<void> {
    if (!message.recipientEmail) {
      throw new Error('No email address provided for email message')
    }

    // Import email service
    const { sendEmail } = await import('@/lib/email/email-service')

    await sendEmail({
      to: message.recipientEmail,
      subject: `Garcez Palha - ${message.category}`,
      html: this.formatEmailHTML(message.message),
      text: message.message,
      metadata: {
        messageId: message.id,
        leadId: message.leadId,
        ...message.metadata,
      },
    })
  }

  /**
   * Send SMS message
   */
  private async sendSMSMessage(message: FollowUpMessage): Promise<void> {
    if (!message.recipientPhone) {
      throw new Error('No phone number provided for SMS message')
    }

    // Import SMS service
    const { sendSMS } = await import('@/lib/sms/sms-service')

    await sendSMS({
      to: message.recipientPhone,
      message: message.message,
      metadata: {
        messageId: message.id,
        leadId: message.leadId,
        ...message.metadata,
      },
    })
  }

  /**
   * Format message as HTML for email
   */
  private formatEmailHTML(text: string): string {
    // Convert markdown-style formatting to HTML
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/\n/g, '<br>') // Line breaks

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${html}
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          Garcez Palha Advocacia<br>
          364 anos de tradição em Direito
        </p>
      </div>
    `
  }

  /**
   * Render template with dynamic data
   */
  private renderTemplate(
    template: WhatsAppTemplate,
    config: FollowUpScheduleConfig
  ): string {
    // Templates with dynamic content are generated by whatsapp-templates.ts
    // This is a placeholder for custom template rendering
    return template.message
      .replace('{{clientName}}', config.clientName)
      .replace('{{productName}}', config.productId)
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get follow-up statistics for a lead
   */
  getLeadStats(leadId: string): {
    total: number
    scheduled: number
    sent: number
    delivered: number
    read: number
    replied: number
    failed: number
    cancelled: number
  } {
    const messages = this.getLeadMessages(leadId)

    return {
      total: messages.length,
      scheduled: messages.filter(m => m.status === 'scheduled').length,
      sent: messages.filter(m => m.status === 'sent').length,
      delivered: messages.filter(m => m.status === 'delivered').length,
      read: messages.filter(m => m.status === 'read').length,
      replied: messages.filter(m => m.status === 'replied').length,
      failed: messages.filter(m => m.status === 'failed').length,
      cancelled: messages.filter(m => m.status === 'cancelled').length,
    }
  }

  /**
   * Export scheduler state for persistence
   */
  exportState() {
    return {
      messages: this.messages,
    }
  }

  /**
   * Import scheduler state from persistence
   */
  static importState(state: { messages: FollowUpMessage[] }): FollowUpScheduler {
    const scheduler = new FollowUpScheduler()
    scheduler.messages = state.messages.map(m => ({
      ...m,
      scheduledFor: new Date(m.scheduledFor),
      sentAt: m.sentAt ? new Date(m.sentAt) : undefined,
      deliveredAt: m.deliveredAt ? new Date(m.deliveredAt) : undefined,
      readAt: m.readAt ? new Date(m.readAt) : undefined,
      repliedAt: m.repliedAt ? new Date(m.repliedAt) : undefined,
    }))
    return scheduler
  }
}

/**
 * Global scheduler instance
 */
let globalScheduler: FollowUpScheduler | null = null

/**
 * Get or create global scheduler
 */
export function getFollowUpScheduler(): FollowUpScheduler {
  if (!globalScheduler) {
    globalScheduler = new FollowUpScheduler()
  }
  return globalScheduler
}

/**
 * Schedule follow-up for a qualification result
 */
export function scheduleQualificationFollowUp(
  result: QualificationResult,
  clientInfo: {
    name: string
    phone?: string
    email?: string
  },
  options?: {
    startImmediately?: boolean
    channels?: Array<'whatsapp' | 'email' | 'sms'>
  }
): FollowUpMessage[] {
  const scheduler = getFollowUpScheduler()

  return scheduler.scheduleFollowUpSequence({
    leadId: result.leadId,
    leadCategory: result.score.category,
    clientName: clientInfo.name,
    clientPhone: clientInfo.phone,
    clientEmail: clientInfo.email,
    productId: result.productId,
    qualificationResult: result,
    startImmediately: options?.startImmediately ?? true,
    channels: options?.channels ?? ['whatsapp'],
  })
}

/**
 * Background job to process scheduled messages
 * Should be run every minute via cron or similar
 */
export async function processScheduledFollowUps(): Promise<void> {
  const scheduler = getFollowUpScheduler()
  await scheduler.processScheduledMessages()
}

/**
 * Cancel all follow-ups when lead converts
 */
export function handleLeadConversion(leadId: string): void {
  const scheduler = getFollowUpScheduler()
  scheduler.cancelLeadFollowUps(leadId)
}

/**
 * Pause follow-ups when lead responds
 */
export function handleLeadResponse(leadId: string): void {
  const scheduler = getFollowUpScheduler()
  scheduler.pauseLeadFollowUps(leadId)
}
