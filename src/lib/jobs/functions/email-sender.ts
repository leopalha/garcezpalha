/**
 * Inngest Function: Send Emails
 * Handles all email sending with templates
 */

import { inngest } from '../inngest-client'
import { logger } from '@/lib/logger'
import { Resend } from 'resend'

// Lazy-loaded Resend client to avoid build-time initialization errors
let resendClient: Resend | null = null
function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

// Email templates
const templates = {
  'payment-confirmation': (variables: any) => ({
    subject: 'Pagamento Confirmado - Garcez Palha Advogados',
    html: `
      <h1>Pagamento Confirmado!</h1>
      <p>Olá,</p>
      <p>Seu pagamento de <strong>R$ ${variables.amount}</strong> foi confirmado com sucesso.</p>
      <p>Produto: ${variables.productId}</p>
      <p>Método: ${variables.paymentMethod || 'Stripe'}</p>
      <p>Em breve você receberá mais informações sobre os próximos passos.</p>
      <p>Atenciosamente,<br>Equipe Garcez Palha</p>
    `,
  }),
  'welcome': (variables: any) => ({
    subject: 'Bem-vindo à Garcez Palha Advogados',
    html: `
      <h1>Bem-vindo, ${variables.name}!</h1>
      <p>É um prazer ter você conosco.</p>
      <p>Acesse sua conta: <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Acessar Dashboard</a></p>
    `,
  }),
  'case-assigned': (variables: any) => ({
    subject: 'Novo Caso Atribuído',
    html: `
      <h1>Novo Caso Atribuído</h1>
      <p>Olá ${variables.lawyerName},</p>
      <p>Um novo caso foi atribuído a você:</p>
      <ul>
        <li>Cliente: ${variables.clientName}</li>
        <li>Tipo: ${variables.caseType}</li>
        <li>Status: ${variables.status}</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/processos/${variables.caseId}">Ver Detalhes</a></p>
    `,
  }),
  'deadline-reminder': (variables: any) => ({
    subject: `Lembrete de Prazo - ${variables.type}`,
    html: `
      <h1>Lembrete de Prazo</h1>
      <p>Olá ${variables.lawyerName},</p>
      <p>Você tem um prazo se aproximando:</p>
      <ul>
        <li>Tipo: ${variables.type}</li>
        <li>Data: ${variables.dueDate}</li>
        <li>Caso: ${variables.caseNumber}</li>
      </ul>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/prazos">Ver Prazos</a></p>
    `,
  }),
}

export const emailSenderHandler = inngest.createFunction(
  {
    id: 'email-sender',
    name: 'Send Email',
    retries: 3,
  },
  { event: 'email/send' },
  async ({ event, step }) => {
    const { to, subject, template, variables } = event.data

    logger.info('Sending email', { to, template })

    const result = await step.run('send-email', async () => {
      try {
        // Get template
        const templateFn = templates[template as keyof typeof templates]
        if (!templateFn) {
          throw new Error(`Template not found: ${template}`)
        }

        const emailContent = templateFn(variables)

        // Send via Resend
        const resend = getResend()
        const { data, error } = await resend.emails.send({
          from: 'Garcez Palha <noreply@garcezpalha.com.br>',
          to,
          subject: subject || emailContent.subject,
          html: emailContent.html,
        })

        if (error) {
          logger.error('Failed to send email', { to, error })
          throw error
        }

        logger.info('Email sent successfully', { to, emailId: data?.id })
        return { success: true, emailId: data?.id }
      } catch (error) {
        logger.error('Email sending error', { to, error })
        throw error
      }
    })

    return result
  }
)
