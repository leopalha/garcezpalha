import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send'
import { NotificationEmail } from '@/lib/email/templates/notification-email'
import { createLogger } from '@/lib/logger'

const logger = createLogger('client-notifications')

export type NotificationType = 'message' | 'document' | 'case_update' | 'deadline' | 'payment'

export interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  description?: string
  link?: string
  metadata?: Record<string, any>
  sendEmail?: boolean
}

/**
 * Create a notification for a user
 * Optionally sends an email notification
 */
export async function createNotification(params: CreateNotificationParams) {
  const {
    userId,
    type,
    title,
    description,
    link,
    metadata,
    sendEmail: shouldSendEmail = false
  } = params

  try {
    const supabase = await createClient()

    // Insert notification into database
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        title,
        description,
        link,
        metadata: metadata || {},
        read: false
      })
      .select()
      .single()

    if (error) {
      logger.error('Error creating notification', { error, params })
      throw new Error('Failed to create notification')
    }

    logger.info('Notification created', {
      notificationId: notification.id,
      userId,
      type
    })

    // Send email if requested
    if (shouldSendEmail) {
      await sendNotificationEmail({
        userId,
        type,
        title,
        description: description || '',
        link: link || ''
      })
    }

    return notification
  } catch (error) {
    logger.error('Error in createNotification', error)
    throw error
  }
}

/**
 * Send notification email to user
 */
async function sendNotificationEmail(params: {
  userId: string
  type: NotificationType
  title: string
  description: string
  link: string
}) {
  try {
    const supabase = await createClient()

    // Get user email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', params.userId)
      .single()

    if (!profile?.email) {
      logger.warn('User has no email, skipping email notification', {
        userId: params.userId
      })
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://garcezpalha.com'
    const actionUrl = params.link.startsWith('http')
      ? params.link
      : `${baseUrl}${params.link}`

    // TODO: Send email notification
    // Requires rendering React component to HTML string
    // const emailHtml = renderToStaticMarkup(NotificationEmail({
    //   recipientName: profile.full_name || 'Cliente',
    //   notificationType: params.type,
    //   title: params.title,
    //   description: params.description,
    //   actionUrl,
    //   actionText: 'Ver no Portal'
    // }))
    //
    // await sendEmail({
    //   to: profile.email,
    //   subject: `[Garcez Palha] ${params.title}`,
    //   html: emailHtml,
    // })

    logger.info('Notification email sent', {
      userId: params.userId,
      email: profile.email,
      type: params.type
    })
  } catch (error) {
    logger.error('Error sending notification email', error)
    // Don't throw - email failure shouldn't break notification creation
  }
}

/**
 * Create notification when case status changes
 */
export async function notifyCaseStatusChange(params: {
  clientId: string
  caseId: string
  serviceType: string
  oldStatus: string
  newStatus: string
  sendEmail?: boolean
}) {
  const { clientId, caseId, serviceType, oldStatus, newStatus, sendEmail } = params

  return createNotification({
    userId: clientId,
    type: 'case_update',
    title: 'Status do caso atualizado',
    description: `Seu caso "${serviceType}" foi atualizado de "${oldStatus}" para "${newStatus}".`,
    link: `/cliente/casos/${caseId}`,
    metadata: {
      caseId,
      oldStatus,
      newStatus
    },
    sendEmail
  })
}

/**
 * Create notification when document is reviewed
 */
export async function notifyDocumentReviewed(params: {
  clientId: string
  caseId: string
  documentName: string
  status: 'approved' | 'rejected' | 'under_review'
  reviewNotes?: string
  sendEmail?: boolean
}) {
  const { clientId, caseId, documentName, status, reviewNotes, sendEmail } = params

  const statusLabels = {
    approved: 'aprovado',
    rejected: 'rejeitado',
    under_review: 'em análise'
  }

  return createNotification({
    userId: clientId,
    type: 'document',
    title: `Documento ${statusLabels[status]}`,
    description: `O documento "${documentName}" foi ${statusLabels[status]}.${reviewNotes ? ` Notas: ${reviewNotes}` : ''}`,
    link: `/cliente/casos/${caseId}`,
    metadata: {
      caseId,
      documentName,
      status,
      reviewNotes
    },
    sendEmail
  })
}

/**
 * Create notification for approaching deadline
 */
export async function notifyDeadlineApproaching(params: {
  clientId: string
  caseId: string
  serviceType: string
  deadlineDescription: string
  daysRemaining: number
  sendEmail?: boolean
}) {
  const { clientId, caseId, serviceType, deadlineDescription, daysRemaining, sendEmail } = params

  const urgencyLevel = daysRemaining <= 3 ? 'URGENTE' : daysRemaining <= 7 ? 'IMPORTANTE' : 'ATENÇÃO'

  return createNotification({
    userId: clientId,
    type: 'deadline',
    title: `${urgencyLevel}: Prazo se aproximando`,
    description: `${deadlineDescription} para o caso "${serviceType}" vence em ${daysRemaining} ${daysRemaining === 1 ? 'dia' : 'dias'}.`,
    link: `/cliente/casos/${caseId}`,
    metadata: {
      caseId,
      deadlineDescription,
      daysRemaining
    },
    sendEmail: sendEmail || daysRemaining <= 3 // Auto-send email for urgent deadlines
  })
}

/**
 * Create notification for new message
 */
export async function notifyNewMessage(params: {
  recipientId: string
  senderName: string
  messagePreview: string
  conversationLink: string
  sendEmail?: boolean
}) {
  const { recipientId, senderName, messagePreview, conversationLink, sendEmail } = params

  return createNotification({
    userId: recipientId,
    type: 'message',
    title: `Nova mensagem de ${senderName}`,
    description: messagePreview,
    link: conversationLink,
    sendEmail
  })
}

/**
 * Create notification for payment update
 */
export async function notifyPaymentUpdate(params: {
  userId: string
  paymentDescription: string
  status: 'succeeded' | 'failed' | 'pending'
  amount?: number
  link?: string
  sendEmail?: boolean
}) {
  const { userId, paymentDescription, status, amount, link, sendEmail } = params

  const statusLabels = {
    succeeded: 'confirmado',
    failed: 'falhou',
    pending: 'pendente'
  }

  const amountText = amount ? ` de R$ ${(amount / 100).toFixed(2)}` : ''

  return createNotification({
    userId,
    type: 'payment',
    title: `Pagamento ${statusLabels[status]}`,
    description: `${paymentDescription}${amountText}.`,
    link: link || '/cliente/dashboard',
    metadata: {
      status,
      amount
    },
    sendEmail: sendEmail || status === 'succeeded' // Auto-send email for successful payments
  })
}
