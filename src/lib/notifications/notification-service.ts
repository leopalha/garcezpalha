/**
 * Client Notification Service
 *
 * Sends automated notifications to clients about process updates
 *
 * Channels:
 * - Email (via Resend or SendGrid)
 * - WhatsApp (via Cloud API with OAB disclaimer)
 * - SMS (optional - via Twilio)
 *
 * OAB Compliance:
 * - All messages include disclaimer
 * - No specific legal advice
 * - Only general process update information
 */

import { createClient } from '@/lib/supabase/server'
import { whatsappCloudAPI } from '@/lib/whatsapp/cloud-api'
import { emailService } from '@/lib/email/email-service'

interface ProcessUpdateNotification {
  clientName: string
  clientEmail: string
  clientPhone?: string
  processNumber: string
  tribunal: string
  updateType: string
  updateDate: Date
  portalUrl: string
}

interface DeadlineNotification {
  clientName: string
  clientEmail: string
  clientPhone?: string
  processNumber: string
  deadlineType: string
  dueDate: Date
  daysRemaining: number
  description: string
}

class NotificationService {
  // OAB Compliance disclaimer (required by Resolution 02/2015)
  private readonly OAB_DISCLAIMER = `\n\n⚠️ Esta é uma notificação automática informativa. Não substitui consulta jurídica. Para análise detalhada, entre em contato com seu advogado.`

  /**
   * Send process update notification to client
   */
  async notifyProcessUpdate(notification: ProcessUpdateNotification): Promise<boolean> {
    try {
      console.log('[Notification] Sending process update:', notification.processNumber)

      // Send email notification
      const emailSent = await this.sendUpdateEmail(notification)

      // Send WhatsApp notification (if phone provided and opt-in)
      let whatsappSent = false
      if (notification.clientPhone) {
        whatsappSent = await this.sendUpdateWhatsApp(notification)
      }

      // Log notification in database
      await this.logNotification({
        type: 'process_update',
        process_number: notification.processNumber,
        recipient_email: notification.clientEmail,
        recipient_phone: notification.clientPhone,
        channels_used: {
          email: emailSent,
          whatsapp: whatsappSent,
        },
      })

      return emailSent || whatsappSent
    } catch (error) {
      console.error('[Notification] Error sending process update:', error)
      return false
    }
  }

  /**
   * Send deadline reminder notification
   */
  async notifyDeadline(notification: DeadlineNotification): Promise<boolean> {
    try {
      console.log('[Notification] Sending deadline reminder:', notification.processNumber)

      // Send email notification
      const emailSent = await this.sendDeadlineEmail(notification)

      // Send WhatsApp notification (if urgent and phone provided)
      let whatsappSent = false
      if (notification.clientPhone && notification.daysRemaining <= 3) {
        whatsappSent = await this.sendDeadlineWhatsApp(notification)
      }

      // Log notification
      await this.logNotification({
        type: 'deadline_reminder',
        process_number: notification.processNumber,
        recipient_email: notification.clientEmail,
        recipient_phone: notification.clientPhone,
        channels_used: {
          email: emailSent,
          whatsapp: whatsappSent,
        },
      })

      return emailSent || whatsappSent
    } catch (error) {
      console.error('[Notification] Error sending deadline reminder:', error)
      return false
    }
  }

  /**
   * Send process update via email
   */
  private async sendUpdateEmail(notification: ProcessUpdateNotification): Promise<boolean> {
    try {
      const subject = `Atualização no Processo ${notification.processNumber}`
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Garcez Palha</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Consultoria Jurídica & Pericial</p>
          </div>
          <div style="padding: 30px; background: #f7f8fa;">
            <h2 style="color: #1a365d; margin-top: 0;">📋 Atualização de Processo</h2>
            <p>Olá <strong>${notification.clientName}</strong>,</p>
            <p>Seu processo foi atualizado:</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #c9a227;">
              <p style="margin: 0 0 10px;"><strong>Processo:</strong> ${notification.processNumber}</p>
              <p style="margin: 0 0 10px;"><strong>Tribunal:</strong> ${notification.tribunal}</p>
              <p style="margin: 0 0 10px;"><strong>Tipo:</strong> ${notification.updateType}</p>
              <p style="margin: 0;"><strong>Data:</strong> ${notification.updateDate.toLocaleDateString('pt-BR')}</p>
            </div>
            <p style="text-align: center;">
              <a href="${notification.portalUrl}" style="display: inline-block; background: #c9a227; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">Ver Detalhes</a>
            </p>
            <div style="background: #fef3c7; border-radius: 6px; padding: 15px; margin-top: 20px; font-size: 14px; color: #92400e;">
              ⚠️ Esta é uma notificação automática informativa. Não substitui consulta jurídica. Para análise detalhada, entre em contato com seu advogado.
            </div>
          </div>
          <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
            <p style="margin: 5px 0 0;">📞 (21) 99535-4010 | contato@garcezpalha.com</p>
          </div>
        </div>
      `
      const text = `Olá ${notification.clientName},\n\nSeu processo foi atualizado:\n\nProcesso: ${notification.processNumber}\nTribunal: ${notification.tribunal}\nTipo: ${notification.updateType}\nData: ${notification.updateDate.toLocaleDateString('pt-BR')}\n\nVer detalhes: ${notification.portalUrl}\n\n⚠️ Esta é uma notificação automática informativa. Não substitui consulta jurídica.\n\nGarcez Palha - (21) 99535-4010`

      return await emailService.sendCustomEmail({
        to: notification.clientEmail,
        subject,
        html,
        text,
        tags: ['process-update', 'notification'],
        metadata: { processNumber: notification.processNumber },
      })
    } catch (error) {
      console.error('[Email] Error sending process update:', error)
      return false
    }
  }

  /**
   * Send process update via WhatsApp
   */
  private async sendUpdateWhatsApp(
    notification: ProcessUpdateNotification
  ): Promise<boolean> {
    if (!whatsappCloudAPI.isConfigured()) {
      return false
    }

    const message = `📋 *Atualização de Processo*

Olá ${notification.clientName},

Seu processo foi atualizado:

*Processo:* ${notification.processNumber}
*Tribunal:* ${notification.tribunal}
*Tipo:* ${notification.updateType}
*Data:* ${notification.updateDate.toLocaleDateString('pt-BR')}

🔗 Ver detalhes: ${notification.portalUrl}

${this.OAB_DISCLAIMER}

---
Garcez Palha - Consultoria Jurídica & Pericial
📞 (21) 99535-4010`

    try {
      await whatsappCloudAPI.sendMessage(
        notification.clientPhone!,
        message,
        true // Include OAB disclaimer
      )
      return true
    } catch (error) {
      console.error('[WhatsApp] Error sending update:', error)
      return false
    }
  }

  /**
   * Send deadline reminder via email
   */
  private async sendDeadlineEmail(notification: DeadlineNotification): Promise<boolean> {
    try {
      const urgencyEmoji = notification.daysRemaining <= 1 ? '🚨' : notification.daysRemaining <= 3 ? '⚠️' : '📅'
      const urgencyText = notification.daysRemaining <= 1 ? 'URGENTE' : notification.daysRemaining <= 3 ? 'ATENÇÃO' : 'LEMBRETE'
      const urgencyColor = notification.daysRemaining <= 1 ? '#dc2626' : notification.daysRemaining <= 3 ? '#d97706' : '#1a365d'

      const subject = `${urgencyEmoji} Prazo Processual: ${notification.deadlineType}`
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${urgencyColor}; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${urgencyEmoji} ${urgencyText}</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Prazo Processual</p>
          </div>
          <div style="padding: 30px; background: #f7f8fa;">
            <p>Olá <strong>${notification.clientName}</strong>,</p>
            <p>Você tem um prazo processual próximo:</p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid ${urgencyColor};">
              <p style="margin: 0 0 10px;"><strong>Processo:</strong> ${notification.processNumber}</p>
              <p style="margin: 0 0 10px;"><strong>Prazo:</strong> ${notification.deadlineType}</p>
              <p style="margin: 0 0 10px;"><strong>Vencimento:</strong> ${notification.dueDate.toLocaleDateString('pt-BR')}</p>
              <p style="margin: 0 0 10px; font-size: 18px; color: ${urgencyColor};"><strong>Dias restantes: ${notification.daysRemaining} ${notification.daysRemaining === 1 ? 'dia' : 'dias'}</strong></p>
              ${notification.description ? `<p style="margin: 10px 0 0; padding-top: 10px; border-top: 1px solid #e5e7eb;">${notification.description}</p>` : ''}
            </div>
            <div style="background: #fef3c7; border-radius: 6px; padding: 15px; margin-top: 20px; font-size: 14px; color: #92400e;">
              ⚠️ Esta é uma notificação automática informativa. Não substitui consulta jurídica. Para análise detalhada, entre em contato com seu advogado.
            </div>
          </div>
          <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
            <p style="margin: 5px 0 0;">📞 (21) 99535-4010 | contato@garcezpalha.com</p>
          </div>
        </div>
      `
      const text = `${urgencyEmoji} ${urgencyText} - Prazo Processual\n\nOlá ${notification.clientName},\n\nVocê tem um prazo processual próximo:\n\nProcesso: ${notification.processNumber}\nPrazo: ${notification.deadlineType}\nVencimento: ${notification.dueDate.toLocaleDateString('pt-BR')}\nDias restantes: ${notification.daysRemaining}\n\n${notification.description || ''}\n\n⚠️ Esta é uma notificação automática informativa. Não substitui consulta jurídica.\n\nGarcez Palha - (21) 99535-4010`

      return await emailService.sendCustomEmail({
        to: notification.clientEmail,
        subject,
        html,
        text,
        tags: ['deadline-reminder', 'notification'],
        metadata: { processNumber: notification.processNumber, daysRemaining: notification.daysRemaining },
      })
    } catch (error) {
      console.error('[Email] Error sending deadline reminder:', error)
      return false
    }
  }

  /**
   * Send deadline reminder via WhatsApp
   */
  private async sendDeadlineWhatsApp(notification: DeadlineNotification): Promise<boolean> {
    if (!whatsappCloudAPI.isConfigured()) {
      return false
    }

    const urgency =
      notification.daysRemaining <= 1
        ? '🚨 *URGENTE*'
        : notification.daysRemaining <= 3
        ? '⚠️ *ATENÇÃO*'
        : '📅 *LEMBRETE*'

    const message = `${urgency} - Prazo Processual

Olá ${notification.clientName},

*Processo:* ${notification.processNumber}
*Prazo:* ${notification.deadlineType}
*Vencimento:* ${notification.dueDate.toLocaleDateString('pt-BR')}
*Dias restantes:* ${notification.daysRemaining} ${notification.daysRemaining === 1 ? 'dia' : 'dias'}

📝 ${notification.description}

${this.OAB_DISCLAIMER}

---
Garcez Palha - Consultoria Jurídica & Pericial
📞 (21) 99535-4010`

    try {
      await whatsappCloudAPI.sendMessage(
        notification.clientPhone!,
        message,
        true // Include OAB disclaimer
      )
      return true
    } catch (error) {
      console.error('[WhatsApp] Error sending deadline reminder:', error)
      return false
    }
  }

  /**
   * Log notification in database for audit trail
   */
  private async logNotification(data: {
    type: string
    process_number: string
    recipient_email: string
    recipient_phone?: string
    channels_used: Record<string, boolean>
  }): Promise<void> {
    const supabase = await createClient()

    try {
      await supabase.from('notification_logs').insert({
        notification_type: data.type,
        process_number: data.process_number,
        recipient_email: data.recipient_email,
        recipient_phone: data.recipient_phone,
        channels_used: data.channels_used,
        sent_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('[Notification] Error logging notification:', error)
    }
  }

  /**
   * Check and send deadline reminders (called by cron job)
   */
  async sendDeadlineReminders(): Promise<{
    success: boolean
    remindersSent: number
  }> {
    const supabase = await createClient()

    try {
      console.log('[Notification] Checking for upcoming deadlines...')

      // Get deadlines that need reminders
      // 1. Deadlines in the next 7 days
      // 2. Deadlines in the next 3 days
      // 3. Deadlines in the next 1 day
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)

      // Query deadlines with client info via lead or user relations
      const { data: deadlines, error } = await supabase
        .from('process_deadlines')
        .select(
          `
          *,
          alert:process_alerts(
            process_number,
            tribunal,
            lead_id,
            client_user_id,
            lead:leads(name, email, phone),
            client:users!process_alerts_client_user_id_fkey(name, email, phone)
          )
        `
        )
        .eq('status', 'pending')
        .lte('due_date', sevenDaysFromNow.toISOString())
        .eq('reminder_sent', false)

      if (error) throw error

      if (!deadlines || deadlines.length === 0) {
        console.log('[Notification] No deadlines need reminders')
        return { success: true, remindersSent: 0 }
      }

      let remindersSent = 0

      for (const deadline of deadlines) {
        // Calculate days remaining
        const dueDate = new Date(deadline.due_date)
        const today = new Date()
        const daysRemaining = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        )

        // Only send reminder if 7, 3, or 1 day(s) remaining
        if (![7, 3, 1].includes(daysRemaining)) continue

        // Get client info from alert relations (client > lead > fallback to admin)
        const alert = deadline.alert as any
        const clientInfo = alert?.client || alert?.lead || null

        const notification: DeadlineNotification = {
          clientName: clientInfo?.name || 'Cliente',
          clientEmail: clientInfo?.email || 'admin@garcezpalha.com',
          clientPhone: clientInfo?.phone,
          processNumber: alert?.process_number || 'Desconhecido',
          deadlineType: deadline.deadline_type,
          dueDate,
          daysRemaining,
          description: deadline.description || '',
        }

        const sent = await this.notifyDeadline(notification)

        if (sent) {
          // Mark reminder as sent
          await supabase
            .from('process_deadlines')
            .update({ reminder_sent: true })
            .eq('id', deadline.id)

          remindersSent++
        }
      }

      console.log(`[Notification] Sent ${remindersSent} deadline reminders`)

      return {
        success: true,
        remindersSent,
      }
    } catch (error) {
      console.error('[Notification] Error sending deadline reminders:', error)
      return {
        success: false,
        remindersSent: 0,
      }
    }
  }
}

// Export singleton
export const notificationService = new NotificationService()

/**
 * USAGE EXAMPLES:
 *
 * 1. Notify client about process update:
 *    await notificationService.notifyProcessUpdate({
 *      clientName: 'Maria Silva',
 *      clientEmail: 'maria@email.com',
 *      clientPhone: '+5521999991234',
 *      processNumber: '0123456-78.2023.8.19.0001',
 *      tribunal: 'TJ-RJ',
 *      updateType: 'Sentença',
 *      updateDate: new Date(),
 *      portalUrl: 'https://...'
 *    })
 *
 * 2. Send deadline reminders (cron job):
 *    await notificationService.sendDeadlineReminders()
 *
 * 3. Manual deadline notification:
 *    await notificationService.notifyDeadline({
 *      clientName: 'João Carlos',
 *      clientEmail: 'joao@email.com',
 *      processNumber: '...',
 *      deadlineType: 'Apresentar Contrarrazões',
 *      dueDate: new Date('2025-12-01'),
 *      daysRemaining: 3,
 *      description: 'Prazo para contrarrazões...'
 *    })
 */
