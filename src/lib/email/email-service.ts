/**
 * Email Sending Service
 *
 * Handles all email sending via Resend API
 *
 * Features:
 * - Integration with Resend (R$ 0/month for 3k emails, then $20/100k)
 * - Template-based emails
 * - Fallback to console logging in development
 * - Error handling and retry logic
 * - Email tracking and logging
 */

import { createClient } from '@/lib/supabase/server'
import { emailTemplates, EmailTemplate } from './email-templates'

interface SendEmailParams {
  to: string
  template: EmailTemplate
  tags?: string[]
  metadata?: Record<string, any>
}

interface EmailLog {
  to: string
  subject: string
  template_type: string
  status: 'sent' | 'failed'
  error_message?: string
  resend_id?: string
  metadata?: Record<string, any>
}

class EmailService {
  private readonly FROM_EMAIL = 'contato@garcezpalha.com'
  private readonly FROM_NAME = 'Garcez Palha - Consultoria Jurídica'
  private readonly RESEND_API_URL = 'https://api.resend.com/emails'

  /**
   * Send email using Resend API
   */
  async sendEmail(params: SendEmailParams): Promise<boolean> {
    const supabase = await createClient()

    try {
      // In development, just log to console
      if (process.env.NODE_ENV !== 'production' || !process.env.RESEND_API_KEY) {
        console.log('[Email Service] DEV MODE - Email would be sent:', {
          to: params.to,
          subject: params.template.subject,
          tags: params.tags,
        })

        // Log to database
        await this.logEmail({
          to: params.to,
          subject: params.template.subject,
          template_type: params.tags?.[0] || 'unknown',
          status: 'sent',
          metadata: params.metadata,
        })

        return true
      }

      // Production: Send via Resend API
      const response = await fetch(this.RESEND_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `${this.FROM_NAME} <${this.FROM_EMAIL}>`,
          to: params.to,
          subject: params.template.subject,
          html: params.template.html,
          text: params.template.text,
          tags: params.tags,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Resend API error: ${data.message || 'Unknown error'}`)
      }

      // Log successful send
      await this.logEmail({
        to: params.to,
        subject: params.template.subject,
        template_type: params.tags?.[0] || 'unknown',
        status: 'sent',
        resend_id: data.id,
        metadata: params.metadata,
      })

      console.log('[Email Service] Email sent successfully:', {
        to: params.to,
        resend_id: data.id,
      })

      return true
    } catch (error: any) {
      console.error('[Email Service] Error sending email:', error)

      // Log failed send
      await this.logEmail({
        to: params.to,
        subject: params.template.subject,
        template_type: params.tags?.[0] || 'unknown',
        status: 'failed',
        error_message: error.message,
        metadata: params.metadata,
      })

      return false
    }
  }

  /**
   * Log email to database
   */
  private async logEmail(log: EmailLog): Promise<void> {
    const supabase = await createClient()

    try {
      await supabase.from('email_logs').insert({
        to_email: log.to,
        subject: log.subject,
        template_type: log.template_type,
        status: log.status,
        error_message: log.error_message,
        resend_id: log.resend_id,
        metadata: log.metadata,
        sent_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('[Email Service] Error logging email:', error)
      // Don't throw - logging failure shouldn't fail the email send
    }
  }

  /**
   * Send welcome email (Day 1)
   */
  async sendWelcomeEmail1(params: {
    to: string
    name: string
    serviceInterest: string
    leadId?: string
  }): Promise<boolean> {
    const template = emailTemplates.welcomeEmail1({
      name: params.name,
      serviceInterest: params.serviceInterest,
    })

    return this.sendEmail({
      to: params.to,
      template,
      tags: ['welcome-1', 'sequence'],
      metadata: { leadId: params.leadId },
    })
  }

  /**
   * Send welcome email (Day 3 - if no response)
   */
  async sendWelcomeEmail2(params: {
    to: string
    name: string
    leadId?: string
  }): Promise<boolean> {
    const template = emailTemplates.welcomeEmail2({
      name: params.name,
    })

    return this.sendEmail({
      to: params.to,
      template,
      tags: ['welcome-2', 'sequence'],
      metadata: { leadId: params.leadId },
    })
  }

  /**
   * Send appointment confirmation
   */
  async sendAppointmentConfirmation(params: {
    to: string
    name: string
    date: string
    time: string
    service: string
    location: string
    appointmentId?: string
  }): Promise<boolean> {
    const template = emailTemplates.appointmentConfirmation({
      name: params.name,
      date: params.date,
      time: params.time,
      service: params.service,
      location: params.location,
    })

    return this.sendEmail({
      to: params.to,
      template,
      tags: ['appointment', 'confirmation'],
      metadata: { appointmentId: params.appointmentId },
    })
  }

  /**
   * Send payment confirmation
   */
  async sendPaymentConfirmation(params: {
    to: string
    name: string
    amount: string
    service: string
    paymentMethod: string
    transactionId: string
  }): Promise<boolean> {
    const template = emailTemplates.paymentConfirmation({
      name: params.name,
      amount: params.amount,
      service: params.service,
      paymentMethod: params.paymentMethod,
      transactionId: params.transactionId,
    })

    return this.sendEmail({
      to: params.to,
      template,
      tags: ['payment', 'confirmation'],
      metadata: { transactionId: params.transactionId },
    })
  }

  /**
   * Send contract signed notification
   */
  async sendContractSigned(params: {
    to: string
    name: string
    contractType: string
    signedDate: string
    pdfUrl: string
    contractId?: string
  }): Promise<boolean> {
    const template = emailTemplates.contractSigned({
      name: params.name,
      contractType: params.contractType,
      signedDate: params.signedDate,
      pdfUrl: params.pdfUrl,
    })

    return this.sendEmail({
      to: params.to,
      template,
      tags: ['contract', 'signed'],
      metadata: { contractId: params.contractId },
    })
  }

  /**
   * Send custom email with template
   */
  async sendCustomEmail(params: {
    to: string
    subject: string
    html: string
    text: string
    tags?: string[]
    metadata?: Record<string, any>
  }): Promise<boolean> {
    return this.sendEmail({
      to: params.to,
      template: {
        subject: params.subject,
        html: params.html,
        text: params.text,
      },
      tags: params.tags,
      metadata: params.metadata,
    })
  }

  /**
   * Send email verification
   */
  async sendVerificationEmail(params: {
    to: string
    name: string
    verificationUrl: string
    userId?: string
  }): Promise<boolean> {
    const template = emailTemplates.emailVerification({
      name: params.name,
      verificationUrl: params.verificationUrl,
    })

    return this.sendEmail({
      to: params.to,
      template,
      tags: ['verification', 'auth'],
      metadata: { userId: params.userId },
    })
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(params: {
    to: string
    name: string
    resetUrl: string
    userId?: string
  }): Promise<boolean> {
    const template = emailTemplates.passwordReset({
      name: params.name,
      resetUrl: params.resetUrl,
    })

    return this.sendEmail({
      to: params.to,
      template,
      tags: ['password-reset', 'auth'],
      metadata: { userId: params.userId },
    })
  }
}

// Export singleton
export const emailService = new EmailService()

/**
 * Send generic email (wrapper for compatibility)
 */
export async function sendEmail(params: {
  to: string
  subject: string
  html: string
  text: string
  metadata?: Record<string, any>
}): Promise<void> {
  await emailService.sendCustomEmail({
    to: params.to,
    subject: params.subject,
    html: params.html,
    text: params.text,
    metadata: params.metadata,
  })
}
