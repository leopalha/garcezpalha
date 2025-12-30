// Export all email template components and their render functions
export {
  WelcomeEmail,
  renderWelcomeEmail,
  type WelcomeEmailProps,
} from './welcome-email'

export {
  AppointmentConfirmation,
  renderAppointmentConfirmation,
  type AppointmentConfirmationProps,
} from './appointment-confirmation'

export {
  PaymentReceipt,
  renderPaymentReceipt,
  type PaymentReceiptProps,
} from './payment-receipt'

export {
  PartnerWelcome,
  renderPartnerWelcome,
  type PartnerWelcomeProps,
} from './partner-welcome'

export {
  LeadNotification,
  renderLeadNotification,
  type LeadNotificationProps,
} from './lead-notification'

// New Templates (P1-014)
export { generateContractSignedEmail } from './contract-signed-template'
export { generatePaymentReminderEmail } from './payment-reminder-template'
export { generateNPSFeedbackEmail } from './nps-feedback-template'

// Email Sequences (P2-001)
export { welcomeSequenceTemplates } from './welcome-sequence'

// All sequence templates grouped by type
export const emailSequences = {
  welcome: () => import('./welcome-sequence').then((m) => m.welcomeSequenceTemplates),
  nurturing: async () => [
    {
      id: 'nurture-001',
      name: 'Lembrete Proposta',
      subject: '📋 {{firstName}}, sua proposta está esperando',
      htmlContent: `<p>Olá {{firstName}}, notamos que você recebeu uma proposta mas ainda não finalizou. Podemos ajudar com alguma dúvida?</p>`,
      textContent: `Olá {{firstName}}, sua proposta está aguardando. Tire suas dúvidas: https://garcezpalha.com/chat`,
      variables: ['firstName'],
      category: 'marketing' as const,
      tags: ['nurturing'],
    },
  ],
  postPayment: async () => [
    {
      id: 'payment-001',
      name: 'Pagamento Confirmado',
      subject: '✅ Pagamento confirmado! Próximos passos, {{firstName}}',
      htmlContent: `<h2>Pagamento Confirmado!</h2><p>Seu caso está sendo preparado. Em 24-48h você receberá o contrato para assinatura.</p>`,
      textContent: `Pagamento confirmado! Contrato chegando em 24-48h.`,
      variables: ['firstName'],
      category: 'transactional' as const,
      tags: ['payment'],
    },
  ],
  reactivation: async () => [
    {
      id: 'reactivation-001',
      name: 'Sentimos Sua Falta',
      subject: 'Sentimos sua falta, {{firstName}} 💙',
      htmlContent: `<p>Faz tempo que não falamos. Seu caso ainda está pendente? Estamos aqui para ajudar.</p>`,
      textContent: `Sentimos sua falta! Como podemos ajudar? https://garcezpalha.com/chat`,
      variables: ['firstName'],
      category: 'marketing' as const,
      tags: ['reactivation'],
    },
  ],
  nps: async () => [
    {
      id: 'nps-001',
      name: 'Pesquisa Satisfação',
      subject: '⭐ Como foi sua experiência, {{firstName}}?',
      htmlContent: `<p>De 0 a 10, quanto você recomendaria Garcez Palha? <a href="{{npsLink}}">Responder em 30 segundos</a></p>`,
      textContent: `De 0 a 10, recomendaria Garcez Palha? Responda: {{npsLink}}`,
      variables: ['firstName', 'npsLink'],
      category: 'notification' as const,
      tags: ['nps'],
    },
  ],
}
