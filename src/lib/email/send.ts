import { getResend, EMAIL_FROM, isResendConfigured } from './resend-client'
import {
  leadWelcomeTemplate,
  appointmentConfirmationTemplate,
  appointmentReminderTemplate,
  notificationTemplate,
  LeadWelcomeData,
  AppointmentConfirmationData,
  AppointmentReminderData,
} from './templates'
import {
  renderWelcomeEmail,
  renderAppointmentConfirmation,
  renderPaymentReceipt,
  renderPartnerWelcome,
  renderLeadNotification,
  WelcomeEmailProps,
  AppointmentConfirmationProps,
  PaymentReceiptProps,
  PartnerWelcomeProps,
  LeadNotificationProps,
} from './templates/index'

// Email event types for logging
type EmailEventType =
  | 'welcome'
  | 'lead_welcome'
  | 'appointment_confirmation'
  | 'appointment_reminder'
  | 'payment_receipt'
  | 'partner_welcome'
  | 'lead_notification'
  | 'notification'

interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

interface EmailEvent {
  type: EmailEventType
  to: string
  timestamp: Date
  success: boolean
  emailId?: string
  error?: string
  metadata?: Record<string, unknown>
}

// Simple in-memory log for email events (in production, use a database)
const emailEventLog: EmailEvent[] = []

/**
 * Log email event for monitoring and debugging
 */
function logEmailEvent(event: EmailEvent): void {
  emailEventLog.push(event)

  const status = event.success ? 'SUCCESS' : 'FAILED'
  const message = `[EMAIL ${status}] Type: ${event.type}, To: ${event.to}, ID: ${event.emailId || 'N/A'}`

  if (event.success) {
    console.log(message)
  } else {
    console.error(`${message}, Error: ${event.error}`)
  }

  // Keep only last 1000 events in memory
  if (emailEventLog.length > 1000) {
    emailEventLog.shift()
  }
}

/**
 * Get recent email events (for admin dashboard)
 */
export function getRecentEmailEvents(limit: number = 50): EmailEvent[] {
  return emailEventLog.slice(-limit).reverse()
}

/**
 * Generic email sender with error handling and logging
 */
async function sendEmailWithLogging(
  type: EmailEventType,
  to: string | string[],
  subject: string,
  html: string,
  metadata?: Record<string, unknown>
): Promise<SendEmailResult> {
  if (!isResendConfigured()) {
    const event: EmailEvent = {
      type,
      to: Array.isArray(to) ? to.join(', ') : to,
      timestamp: new Date(),
      success: false,
      error: 'Email service not configured',
      metadata,
    }
    logEmailEvent(event)
    return { success: false, error: 'Email service not configured' }
  }

  try {
    const resend = getResend()
    const { data: result, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })

    if (error) {
      const event: EmailEvent = {
        type,
        to: Array.isArray(to) ? to.join(', ') : to,
        timestamp: new Date(),
        success: false,
        error: error.message,
        metadata,
      }
      logEmailEvent(event)
      return { success: false, error: error.message }
    }

    const event: EmailEvent = {
      type,
      to: Array.isArray(to) ? to.join(', ') : to,
      timestamp: new Date(),
      success: true,
      emailId: result?.id,
      metadata,
    }
    logEmailEvent(event)
    return { success: true, id: result?.id }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    const event: EmailEvent = {
      type,
      to: Array.isArray(to) ? to.join(', ') : to,
      timestamp: new Date(),
      success: false,
      error: errorMessage,
      metadata,
    }
    logEmailEvent(event)
    return { success: false, error: errorMessage }
  }
}

// ===== NEW REACT COMPONENT-BASED EMAIL FUNCTIONS =====

/**
 * Send welcome email for new users/leads using React component
 */
export async function sendWelcomeEmail(
  to: string,
  data: WelcomeEmailProps
): Promise<SendEmailResult> {
  const html = renderWelcomeEmail(data)
  return sendEmailWithLogging(
    'welcome',
    to,
    'Bem-vindo ao Garcez Palha',
    html,
    { name: data.name, service: data.service }
  )
}

/**
 * Send appointment confirmation email using React component
 */
export async function sendAppointmentConfirmation(
  to: string,
  data: AppointmentConfirmationProps
): Promise<SendEmailResult> {
  const html = renderAppointmentConfirmation(data)
  return sendEmailWithLogging(
    'appointment_confirmation',
    to,
    `Consulta Confirmada - ${data.appointmentDate} as ${data.appointmentTime}`,
    html,
    {
      appointmentId: data.appointmentId,
      date: data.appointmentDate,
      time: data.appointmentTime,
      service: data.serviceType,
    }
  )
}

/**
 * Send payment receipt email using React component
 */
export async function sendPaymentReceiptEmail(
  to: string,
  data: PaymentReceiptProps
): Promise<SendEmailResult> {
  const html = renderPaymentReceipt(data)
  return sendEmailWithLogging(
    'payment_receipt',
    to,
    `Recibo de Pagamento #${data.receiptNumber} - Garcez Palha`,
    html,
    {
      receiptNumber: data.receiptNumber,
      amount: data.amount,
      paymentDate: data.paymentDate,
    }
  )
}

/**
 * Send partner welcome email using React component
 */
export async function sendPartnerWelcomeEmail(
  to: string,
  data: PartnerWelcomeProps
): Promise<SendEmailResult> {
  const html = renderPartnerWelcome(data)
  return sendEmailWithLogging(
    'partner_welcome',
    to,
    'Bem-vindo ao Programa de Parceiros - Garcez Palha',
    html,
    {
      partnerCode: data.partnerCode,
      commissionRate: data.commissionRate,
    }
  )
}

/**
 * Send internal lead notification email using React component
 */
export async function sendLeadNotificationEmail(
  to: string | string[],
  data: LeadNotificationProps
): Promise<SendEmailResult> {
  const html = renderLeadNotification(data)
  const priorityPrefix = data.priority === 'urgent' ? '[URGENTE] ' : data.priority === 'high' ? '[ALTA PRIORIDADE] ' : ''
  return sendEmailWithLogging(
    'lead_notification',
    to,
    `${priorityPrefix}Novo Lead: ${data.leadName} - ${data.leadService}`,
    html,
    {
      leadId: data.leadId,
      leadName: data.leadName,
      leadService: data.leadService,
      priority: data.priority,
    }
  )
}

// ===== LEGACY EMAIL FUNCTIONS (for backward compatibility) =====

/**
 * Send lead welcome email (legacy)
 * @deprecated Use sendWelcomeEmail instead
 */
export async function sendLeadWelcomeEmail(
  to: string,
  data: LeadWelcomeData
): Promise<SendEmailResult> {
  const html = leadWelcomeTemplate(data)
  return sendEmailWithLogging(
    'lead_welcome',
    to,
    'Recebemos sua mensagem - Garcez Palha',
    html,
    { name: data.name, service: data.service }
  )
}

/**
 * Send appointment confirmation email (legacy)
 * @deprecated Use sendAppointmentConfirmation instead
 */
export async function sendAppointmentConfirmationEmail(
  to: string,
  data: AppointmentConfirmationData
): Promise<SendEmailResult> {
  const html = appointmentConfirmationTemplate(data)
  return sendEmailWithLogging(
    'appointment_confirmation',
    to,
    `Consulta Confirmada - ${data.date} as ${data.time}`,
    html,
    {
      date: data.date,
      time: data.time,
      type: data.type,
    }
  )
}

/**
 * Send appointment reminder email (24h before)
 */
export async function sendAppointmentReminderEmail(
  to: string,
  data: AppointmentReminderData
): Promise<SendEmailResult> {
  const html = appointmentReminderTemplate(data)
  return sendEmailWithLogging(
    'appointment_reminder',
    to,
    `Lembrete: Consulta Amanha as ${data.time}`,
    html,
    {
      date: data.date,
      time: data.time,
      type: data.type,
    }
  )
}

/**
 * Send generic notification email
 */
export async function sendNotificationEmail(
  to: string,
  subject: string,
  message: string
): Promise<SendEmailResult> {
  const html = notificationTemplate(subject, message)
  return sendEmailWithLogging(
    'notification',
    to,
    `${subject} - Garcez Palha`,
    html,
    { subject }
  )
}

// ===== BATCH EMAIL FUNCTIONS =====

/**
 * Send email to multiple recipients (useful for internal notifications)
 */
export async function sendBatchEmail(
  recipients: string[],
  subject: string,
  html: string
): Promise<{ success: number; failed: number; results: SendEmailResult[] }> {
  const results: SendEmailResult[] = []
  let success = 0
  let failed = 0

  for (const to of recipients) {
    const result = await sendEmailWithLogging('notification', to, subject, html)
    results.push(result)
    if (result.success) {
      success++
    } else {
      failed++
    }
  }

  return { success, failed, results }
}

/**
 * Send lead notification to all admin emails
 */
export async function notifyAdminsOfNewLead(
  data: LeadNotificationProps,
  adminEmails: string[] = []
): Promise<SendEmailResult> {
  const defaultAdminEmails = process.env.ADMIN_NOTIFICATION_EMAILS?.split(',') || ['admin@garcezpalha.com.br']
  const recipients = adminEmails.length > 0 ? adminEmails : defaultAdminEmails

  return sendLeadNotificationEmail(recipients, data)
}

/**
 * Generic function to send any email with HTML content
 * Wraps sendEmailWithLogging with 'notification' type
 */
export async function sendEmail(params: {
  to: string | string[]
  subject: string
  html: string
}): Promise<SendEmailResult> {
  return sendEmailWithLogging(
    'notification',
    params.to,
    params.subject,
    params.html
  )
}

// Export types for external use
export type {
  SendEmailResult,
  EmailEvent,
  EmailEventType,
  WelcomeEmailProps,
  AppointmentConfirmationProps,
  PaymentReceiptProps,
  PartnerWelcomeProps,
  LeadNotificationProps,
  LeadWelcomeData,
  AppointmentConfirmationData,
  AppointmentReminderData,
}
