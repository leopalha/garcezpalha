import { Resend } from 'resend'

let resendInstance: Resend | null = null

export function getResend(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

export const EMAIL_FROM = process.env.EMAIL_FROM || 'Garcez Palha <contato@garcezpalha.com>'

// Helper function to send email
export async function sendEmail(options: {
  from?: string
  to: string | string[]
  subject: string
  html: string
  text?: string
}) {
  const resend = getResend()

  return await resend.emails.send({
    from: options.from || EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  })
}

// Send welcome email
export async function sendWelcomeEmail(to: string, name: string) {
  return await sendEmail({
    to,
    subject: 'Bem-vindo ao Garcez Palha Advogados',
    html: `
      <h1>Olá ${name}!</h1>
      <p>Seja bem-vindo ao Garcez Palha Advogados.</p>
      <p>Estamos aqui para ajudá-lo com todas as suas necessidades jurídicas.</p>
      <p>Atenciosamente,<br>Leonardo Palha<br>OAB/RJ 219.390</p>
    `
  })
}

// Send lead notification
export async function sendLeadNotification(data: {
  leadName: string
  leadEmail: string
  leadPhone: string
  productName: string
  score: number
}) {
  return await sendEmail({
    to: 'leonardo.palha@gmail.com',
    subject: `🎯 Novo Lead Qualificado: ${data.leadName} (Score: ${data.score})`,
    html: `
      <h2>Novo Lead Qualificado!</h2>
      <p><strong>Nome:</strong> ${data.leadName}</p>
      <p><strong>Email:</strong> ${data.leadEmail}</p>
      <p><strong>Telefone:</strong> ${data.leadPhone}</p>
      <p><strong>Produto:</strong> ${data.productName}</p>
      <p><strong>Score:</strong> ${data.score}/100</p>
    `
  })
}

// Send appointment confirmation
export async function sendAppointmentConfirmation(data: {
  to: string
  userName: string
  appointmentDate: string
  appointmentTime: string
  serviceType: string
}) {
  return await sendEmail({
    to: data.to,
    subject: 'Confirmação de Agendamento - Garcez Palha Advogados',
    html: `
      <h2>Agendamento Confirmado!</h2>
      <p>Olá ${data.userName},</p>
      <p>Seu agendamento foi confirmado:</p>
      <ul>
        <li><strong>Serviço:</strong> ${data.serviceType}</li>
        <li><strong>Data:</strong> ${data.appointmentDate}</li>
        <li><strong>Horário:</strong> ${data.appointmentTime}</li>
      </ul>
      <p>Atenciosamente,<br>Leonardo Palha<br>OAB/RJ 219.390</p>
    `
  })
}
