/**
 * Automated Actions Dispatcher
 * Triggers automated actions based on conversation state changes
 *
 * Actions:
 * - Save qualified leads to database
 * - Send notifications to admin for high-score leads
 * - Generate and send proposals
 * - Create payment links
 * - Send contracts via ClickSign
 * - Send onboarding emails
 */

import { ConversationData } from './types'
import { sendLeadNotification, sendEmail } from '@/lib/email/resend-client'

/**
 * Dispatch automated actions based on conversation state
 */
export class AutomatedActionsDispatcher {
  /**
   * Main dispatch method - called after every state transition
   */
  async dispatch(data: ConversationData): Promise<void> {
    const currentState = data.status.state

    try {
      // Execute actions based on current state
      switch (currentState) {
        case 'qualified':
          await this.handleQualified(data)
          break

        case 'rejected':
          await this.handleRejected(data)
          break

        case 'proposing':
          await this.handleProposing(data)
          break

        case 'payment_pending':
          await this.handlePaymentPending(data)
          break

        case 'paid':
          await this.handlePaid(data)
          break

        case 'onboarding':
          await this.handleOnboarding(data)
          break

        case 'escalated':
          await this.handleEscalated(data)
          break

        default:
          // No automated actions for other states
          break
      }
    } catch (error) {
      console.error('[AutomatedActions] Error dispatching actions:', error)
      // Don't throw - automated actions should not block conversation flow
    }
  }

  /**
   * Handle qualified state - notify admin for high-score leads
   */
  private async handleQualified(data: ConversationData): Promise<void> {
    if (!data.qualification || data.qualification.status !== 'complete') {
      console.warn('[AutomatedActions] No complete qualification data in qualified state')
      return
    }

    // Check if notification was already sent (idempotency)
    if (data.metadata?.notificationSent) {
      console.log('[AutomatedActions] Notification already sent, skipping')
      return
    }

    const { qualification } = data

    // Log qualified lead
    console.log('[AutomatedActions] Lead qualified:', {
      conversationId: data.conversation_id,
      clientName: data.client.name || 'Unknown',
      score: qualification.score,
      questionsAnswered: qualification.questions_answered,
    })

    // Send notification to admin if high-score lead (>= 80)
    if (qualification.score >= 80) {
      try {
        await sendLeadNotification({
          leadName: data.client.name || 'Cliente não identificado',
          leadEmail: data.client.email || 'Não fornecido',
          leadPhone: data.client.phone || 'Não fornecido',
          productName: data.classification.product || data.classification.area,
          score: qualification.score,
        })

        console.log('[AutomatedActions] Admin notification sent')

        // Mark notification as sent
        data.metadata = {
          ...data.metadata,
          notificationSent: true,
          notifiedAt: new Date().toISOString(),
        }
      } catch (error) {
        console.error('[AutomatedActions] Failed to send notification:', error)
      }
    }

    // TODO: Create lead in database when full qualification result is available
    // For now, leads are created manually through admin dashboard
  }

  /**
   * Handle rejected state - log for analytics
   */
  private async handleRejected(data: ConversationData): Promise<void> {
    if (!data.qualification) {
      return
    }

    console.log('[AutomatedActions] Lead rejected:', {
      score: data.qualification.score,
      flags: data.qualification.flags,
      conversationId: data.conversation_id,
    })

    // TODO: Save rejected lead for future nurturing/remarketing
  }

  /**
   * Handle proposal generated - send proposal to client
   */
  private async handleProposing(data: ConversationData): Promise<void> {
    if (!data.proposal) {
      console.warn('[AutomatedActions] No proposal data in proposing state')
      return
    }

    // Check if proposal email was already sent (idempotency)
    if (data.metadata?.proposalSent) {
      console.log('[AutomatedActions] Proposal already sent, skipping')
      return
    }

    console.log('[AutomatedActions] Sending proposal:', {
      package: data.proposal.package,
      value: data.proposal.value,
      conversationId: data.conversation_id,
    })

    try {
      const clientEmail = data.client.email
      const clientName = data.client.name || 'Cliente'
      const productName = data.classification?.product || data.classification?.area || 'Serviço Jurídico'
      const value = data.proposal.value || 0

      if (!clientEmail) {
        console.warn('[AutomatedActions] No client email, cannot send proposal')
        return
      }

      // Send proposal email
      await sendEmail({
        to: clientEmail,
        subject: `Proposta Comercial - ${productName}`,
        html: this.generateProposalEmail(clientName, productName, value, data.proposal),
      })

      console.log('[AutomatedActions] Proposal email sent to:', clientEmail)

      // Mark as sent
      data.metadata = {
        ...data.metadata,
        proposalSent: true,
        proposalSentAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error('[AutomatedActions] Failed to send proposal email:', error)
    }
  }

  /**
   * Handle payment pending - send payment link
   */
  private async handlePaymentPending(data: ConversationData): Promise<void> {
    if (!data.proposal?.payment_link) {
      console.warn('[AutomatedActions] No payment link in payment_pending state')
      return
    }

    // Check if payment link email was already sent (idempotency)
    if (data.metadata?.paymentLinkSent) {
      console.log('[AutomatedActions] Payment link already sent, skipping')
      return
    }

    console.log('[AutomatedActions] Sending payment link:', {
      url: data.proposal.payment_link,
      conversationId: data.conversation_id,
    })

    try {
      const clientEmail = data.client.email
      const clientName = data.client.name || 'Cliente'
      const productName = data.classification?.product || data.classification?.area || 'Serviço Jurídico'
      const value = data.proposal.value || 0
      const paymentLink = data.proposal.payment_link

      if (!clientEmail) {
        console.warn('[AutomatedActions] No client email, cannot send payment link')
        return
      }

      // Send payment link email
      await sendEmail({
        to: clientEmail,
        subject: `Link de Pagamento - ${productName}`,
        html: this.generatePaymentLinkEmail(clientName, productName, value, paymentLink),
      })

      console.log('[AutomatedActions] Payment link sent to:', clientEmail)

      // Mark as sent
      data.metadata = {
        ...data.metadata,
        paymentLinkSent: true,
        paymentLinkSentAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error('[AutomatedActions] Failed to send payment link email:', error)
    }
  }

  /**
   * Handle paid - confirm payment received
   */
  private async handlePaid(data: ConversationData): Promise<void> {
    // Check if confirmation was already sent (idempotency)
    if (data.metadata?.paymentConfirmationSent) {
      console.log('[AutomatedActions] Payment confirmation already sent, skipping')
      return
    }

    console.log('[AutomatedActions] Payment confirmed:', {
      conversationId: data.conversation_id,
      paymentProvider: (data.proposal as any)?.payment_provider,
    })

    try {
      const clientEmail = data.client.email
      const clientName = data.client.name || 'Cliente'
      const productName = data.classification?.product || data.classification?.area || 'Serviço Jurídico'

      if (!clientEmail) {
        console.warn('[AutomatedActions] No client email, cannot send payment confirmation')
        return
      }

      // Send payment confirmation email
      await sendEmail({
        to: clientEmail,
        subject: 'Pagamento Confirmado - Garcez Palha Advogados',
        html: this.generatePaymentConfirmationEmail(clientName, productName),
      })

      console.log('[AutomatedActions] Payment confirmation sent to:', clientEmail)

      // Mark as sent
      data.metadata = {
        ...data.metadata,
        paymentConfirmationSent: true,
        paymentConfirmationSentAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error('[AutomatedActions] Failed to send payment confirmation:', error)
    }
  }

  /**
   * Handle onboarding - send welcome email and setup access
   */
  private async handleOnboarding(data: ConversationData): Promise<void> {
    // Check if onboarding email was already sent (idempotency)
    if (data.metadata?.onboardingEmailSent) {
      console.log('[AutomatedActions] Onboarding email already sent, skipping')
      return
    }

    console.log('[AutomatedActions] Starting onboarding for:', {
      conversationId: data.conversation_id,
      clientName: data.client.name,
    })

    try {
      const clientEmail = data.client.email
      const clientName = data.client.name || 'Cliente'
      const productName = data.classification?.product || data.classification?.area || 'Serviço Jurídico'

      if (!clientEmail) {
        console.warn('[AutomatedActions] No client email, cannot send onboarding')
        return
      }

      // Send welcome/onboarding email
      await sendEmail({
        to: clientEmail,
        subject: 'Bem-vindo(a) à Garcez Palha Advogados!',
        html: this.generateOnboardingEmail(clientName, productName, data),
      })

      console.log('[AutomatedActions] Onboarding email sent to:', clientEmail)

      // Mark as sent
      data.metadata = {
        ...data.metadata,
        onboardingEmailSent: true,
        onboardingEmailSentAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error('[AutomatedActions] Failed to send onboarding email:', error)
    }
  }

  /**
   * Handle escalated - notify human agent for manual intervention
   */
  private async handleEscalated(data: ConversationData): Promise<void> {
    console.log('[AutomatedActions] Conversation escalated:', {
      reason: data.status.escalation_reason,
      conversationId: data.conversation_id,
    })

    // Check if notification was already sent (idempotency)
    if (data.metadata?.escalationNotificationSent) {
      console.log('[AutomatedActions] Escalation notification already sent, skipping')
      return
    }

    try {
      const lead = (data as any).lead
      const leadName = lead?.full_name || 'Lead sem nome'
      const leadEmail = lead?.email || 'Email não fornecido'
      const leadPhone = lead?.phone || 'Telefone não fornecido'
      const productName = data.classification?.product || data.classification?.area || 'Produto não identificado'
      const escalationReason = data.status.escalation_reason || 'Motivo não especificado'

      // Send email notification to admin (using same function but with high urgency)
      await sendLeadNotification({
        leadName,
        leadEmail,
        leadPhone,
        productName,
        score: data.qualification?.score || 0,
      })

      console.log('[AutomatedActions] Escalation notification sent to admin')
      console.log(`[AutomatedActions] Escalation reason: ${escalationReason}`)
      console.log(`[AutomatedActions] View at: /admin/conversas?state=escalated`)

      // Mark notification as sent
      data.metadata = {
        ...data.metadata,
        escalationNotificationSent: true,
        escalationNotifiedAt: new Date().toISOString(),
      }

      // TODO: Send Slack notification for real-time alert
      // TODO: Send WhatsApp notification if configured
      // TODO: Create task in CRM for human follow-up
    } catch (error) {
      console.error('[AutomatedActions] Failed to send escalation notification:', error)
    }
  }

  /**
   * Generate proposal email HTML
   */
  private generateProposalEmail(
    clientName: string,
    productName: string,
    value: number,
    proposal: any
  ): string {
    const formattedValue = (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .highlight { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0; }
    .price { font-size: 32px; color: #28a745; font-weight: bold; text-align: center; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Proposta Comercial</h1>
    </div>
    <div class="content">
      <p>Prezado(a) <strong>${clientName}</strong>,</p>

      <p>É com grande satisfação que apresentamos nossa proposta personalizada para:</p>

      <div class="highlight">
        <h2>${productName}</h2>
      </div>

      <div class="price">
        ${formattedValue}
      </div>

      <p>Esta proposta inclui:</p>
      <ul>
        <li>✓ Análise completa do seu caso</li>
        <li>✓ Elaboração de toda petição inicial e documentos processuais</li>
        <li>✓ Acompanhamento processual completo</li>
        <li>✓ Comunicação regular sobre andamento</li>
        <li>✓ Atendimento prioritário via WhatsApp, e-mail e telefone</li>
      </ul>

      <p><strong>Garcez Palha Advocacia</strong> - 364 anos de tradição em Direito. Mais de 85% de êxito em nossas ações.</p>

      <p>Estamos à disposição para esclarecer qualquer dúvida.</p>

      <p>Atenciosamente,<br>
      <strong>Leonardo Palha</strong><br>
      OAB/RJ 219.390</p>
    </div>
    <div class="footer">
      <p>Garcez Palha Advogados<br>
      contato@garcezpalha.com.br<br>
      As informações têm caráter orientativo e não substituem consulta jurídica formal.</p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Generate payment link email HTML
   */
  private generatePaymentLinkEmail(
    clientName: string,
    productName: string,
    value: number,
    paymentLink: string
  ): string {
    const formattedValue = (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .price { font-size: 32px; color: #28a745; font-weight: bold; text-align: center; margin: 20px 0; }
    .button { display: inline-block; padding: 15px 30px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Link de Pagamento</h1>
    </div>
    <div class="content">
      <p>Olá <strong>${clientName}</strong>,</p>

      <p>Seu link de pagamento está pronto!</p>

      <p><strong>Serviço:</strong> ${productName}</p>

      <div class="price">
        ${formattedValue}
      </div>

      <p style="text-align: center;">
        <a href="${paymentLink}" class="button">Pagar Agora</a>
      </p>

      <p>✅ Pagamento 100% seguro<br>
      ✅ Atendimento imediato após confirmação<br>
      ✅ Suporte completo durante todo o processo</p>

      <p>Após a confirmação do pagamento, você receberá o contrato para assinatura digital.</p>

      <p>Qualquer dúvida, estamos à disposição!</p>

      <p>Atenciosamente,<br>
      <strong>Leonardo Palha</strong><br>
      OAB/RJ 219.390</p>
    </div>
    <div class="footer">
      <p>Garcez Palha Advogados<br>
      contato@garcezpalha.com.br</p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Generate payment confirmation email HTML
   */
  private generatePaymentConfirmationEmail(
    clientName: string,
    productName: string
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .checkmark { font-size: 64px; color: #28a745; text-align: center; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Pagamento Confirmado!</h1>
    </div>
    <div class="content">
      <div class="checkmark">✓</div>

      <p>Olá <strong>${clientName}</strong>,</p>

      <p>Seu pagamento foi confirmado com sucesso!</p>

      <p><strong>Serviço contratado:</strong> ${productName}</p>

      <h3>Próximos passos:</h3>
      <ol>
        <li>Em breve você receberá o contrato para assinatura digital via ClickSign</li>
        <li>Após assinar o contrato, você terá acesso à área do cliente</li>
        <li>Nossa equipe entrará em contato para agendar a primeira consulta</li>
      </ol>

      <p>Estamos muito felizes em tê-lo(a) como cliente!</p>

      <p>Atenciosamente,<br>
      <strong>Leonardo Palha</strong><br>
      OAB/RJ 219.390</p>
    </div>
    <div class="footer">
      <p>Garcez Palha Advogados<br>
      contato@garcezpalha.com.br</p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Generate onboarding/welcome email HTML
   */
  private generateOnboardingEmail(
    clientName: string,
    productName: string,
    data: ConversationData
  ): string {
    const contractUrl = (data.proposal as any)?.clicksign_sign_url || '#'

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #0066cc; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px 20px; }
    .welcome { font-size: 48px; text-align: center; margin: 20px 0; }
    .button { display: inline-block; padding: 15px 30px; background-color: #0066cc; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
    .highlight { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bem-vindo(a)!</h1>
    </div>
    <div class="content">
      <div class="welcome">👋</div>

      <p>Olá <strong>${clientName}</strong>,</p>

      <p>É com grande satisfação que recebemos você como cliente da <strong>Garcez Palha Advocacia</strong>!</p>

      <p>Você contratou: <strong>${productName}</strong></p>

      <div class="highlight">
        <h3>📋 Seu contrato está pronto!</h3>
        <p>Para iniciarmos o atendimento, precisamos que você assine o contrato digitalmente:</p>
        <p style="text-align: center;">
          <a href="${contractUrl}" class="button">Assinar Contrato</a>
        </p>
      </div>

      <h3>O que acontece agora?</h3>
      <ol>
        <li><strong>Assinatura do Contrato:</strong> Clique no botão acima para assinar digitalmente via ClickSign</li>
        <li><strong>Análise do Caso:</strong> Nossa equipe iniciará a análise completa da sua documentação</li>
        <li><strong>Primeira Consulta:</strong> Entraremos em contato para agendar sua consulta inicial</li>
        <li><strong>Acompanhamento:</strong> Você receberá atualizações regulares sobre o andamento do seu caso</li>
      </ol>

      <h3>Canais de Atendimento:</h3>
      <ul>
        <li>📧 E-mail: contato@garcezpalha.com.br</li>
        <li>💬 WhatsApp: (21) 99999-9999</li>
        <li>🌐 Área do Cliente: garcezpalha.com.br/area-cliente</li>
      </ul>

      <p>Estamos muito felizes em poder ajudá-lo(a)!</p>

      <p>Atenciosamente,<br>
      <strong>Leonardo Palha</strong><br>
      OAB/RJ 219.390<br>
      Garcez Palha Advocacia</p>
    </div>
    <div class="footer">
      <p>Garcez Palha Advogados - 364 anos de tradição em Direito<br>
      contato@garcezpalha.com.br<br>
      As informações têm caráter orientativo e não substituem consulta jurídica formal.</p>
    </div>
  </div>
</body>
</html>
    `
  }
}
