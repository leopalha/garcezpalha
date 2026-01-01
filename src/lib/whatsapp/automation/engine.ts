/**
 * WhatsApp Automation Engine
 * Motor de automação para WhatsApp Business API
 */

import type { WhatsAppMessage, WhatsAppAutomationFlow, WhatsAppFlowStep } from './types'

export class WhatsAppAutomationEngine {
  private apiUrl: string
  private apiToken: string
  private phoneNumberId: string

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0'
    this.apiToken = process.env.WHATSAPP_ACCESS_TOKEN || ''
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || ''
  }

  /**
   * Envia uma mensagem via WhatsApp Business API
   */
  async sendMessage(message: WhatsAppMessage): Promise<{ messageId: string }> {
    if (!this.apiToken || !this.phoneNumberId) {
      console.warn('[WhatsApp] API not configured, skipping message')
      return { messageId: 'mock_' + Date.now() }
    }

    const url = `${this.apiUrl}/${this.phoneNumberId}/messages`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          ...message,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`WhatsApp API error: ${JSON.stringify(error)}`)
      }

      const data = await response.json()
      console.log('[WhatsApp] Message sent:', data.messages[0].id)

      return { messageId: data.messages[0].id }
    } catch (error) {
      console.error('[WhatsApp] Failed to send message:', error)
      throw error
    }
  }

  /**
   * Envia template de boas-vindas
   */
  async sendWelcomeMessage(to: string, firstName: string): Promise<void> {
    const message: WhatsAppMessage = {
      to,
      type: 'template',
      template: {
        name: 'welcome_garcez_palha',
        language: { code: 'pt_BR' },
        components: [
          {
            type: 'BODY',
            text: `Olá ${firstName}! Bem-vindo à Garcez Palha. Nossa equipe está analisando seu caso e retornará em breve.`,
          },
        ],
      },
    }

    await this.sendMessage(message)
  }

  /**
   * Envia lembrete de proposta
   */
  async sendProposalReminder(to: string, firstName: string, proposalLink: string): Promise<void> {
    const message: WhatsAppMessage = {
      to,
      type: 'template',
      template: {
        name: 'proposal_reminder',
        language: { code: 'pt_BR' },
        components: [
          {
            type: 'BODY',
            text: `Olá ${firstName}, sua proposta está aguardando. Clique no link para revisar: ${proposalLink}`,
          },
          {
            type: 'BUTTONS',
            buttons: [
              { type: 'URL', text: 'Ver Proposta', url: proposalLink },
              { type: 'QUICK_REPLY', text: 'Tenho dúvidas' },
            ],
          },
        ],
      },
    }

    await this.sendMessage(message)
  }

  /**
   * Envia confirmação de pagamento
   */
  async sendPaymentConfirmation(
    to: string,
    firstName: string,
    amount: number,
    caseNumber: string
  ): Promise<void> {
    const message: WhatsAppMessage = {
      to,
      type: 'text',
      text: {
        body: `✅ Pagamento confirmado!\n\nOlá ${firstName},\n\nRecebemos seu pagamento de R$ ${(amount / 100).toFixed(2)}.\n\nSeu caso #${caseNumber} está ativo.\n\nEm breve você receberá o contrato para assinatura.`,
      },
    }

    await this.sendMessage(message)
  }

  /**
   * Envia atualização de caso
   */
  async sendCaseUpdate(
    to: string,
    firstName: string,
    caseNumber: string,
    update: string
  ): Promise<void> {
    const message: WhatsAppMessage = {
      to,
      type: 'text',
      text: {
        body: `📋 Atualização do Caso #${caseNumber}\n\nOlá ${firstName},\n\n${update}\n\nAcompanhe em tempo real: https://garcezpalha.com/dashboard/cases/${caseNumber}`,
      },
    }

    await this.sendMessage(message)
  }

  /**
   * Envia atualização de movimentação processual
   */
  async sendProcessUpdate(
    to: string,
    firstName: string,
    numeroProcesso: string,
    movimento: string
  ): Promise<void> {
    const formattedProcesso = this.formatProcessNumber(numeroProcesso)

    const message: WhatsAppMessage = {
      to,
      type: 'text',
      text: {
        body: `⚖️ Nova Movimentação Processual\n\nOlá ${firstName},\n\nProcesso: ${formattedProcesso}\n\n${movimento}\n\nAcompanhe em: https://garcezpalha.com/dashboard/processos/${numeroProcesso}`,
      },
    }

    await this.sendMessage(message)
  }

  /**
   * Envia alerta de prazo fatal
   */
  async sendPrazoFatalAlert(
    to: string,
    firstName: string,
    numeroProcesso: string,
    prazoFatal: string
  ): Promise<void> {
    const formattedProcesso = this.formatProcessNumber(numeroProcesso)

    const message: WhatsAppMessage = {
      to,
      type: 'text',
      text: {
        body: `🚨 ATENÇÃO: PRAZO FATAL\n\nOlá ${firstName},\n\nProcesso: ${formattedProcesso}\n\n⏰ Prazo máximo: ${prazoFatal}\n\nEsta movimentação requer ação urgente. Nossa equipe já foi notificada e está trabalhando no caso.\n\nEm caso de dúvidas, entre em contato imediatamente.`,
      },
    }

    await this.sendMessage(message)
  }

  /**
   * Envia mensagem de sucesso
   */
  async sendSuccessMessage(
    to: string,
    firstName: string,
    message: string
  ): Promise<void> {
    const whatsappMessage: WhatsAppMessage = {
      to,
      type: 'text',
      text: {
        body: `✅ Sucesso!\n\nOlá ${firstName},\n\n${message}\n\nContinue acompanhando em: https://garcezpalha.com/dashboard`,
      },
    }

    await this.sendMessage(whatsappMessage)
  }

  /**
   * Formata número de processo no padrão brasileiro
   */
  private formatProcessNumber(numero: string): string {
    // Remove caracteres não numéricos
    const cleaned = numero.replace(/\D/g, '')

    // Formato: NNNNNNN-DD.AAAA.J.TR.OOOO
    if (cleaned.length === 20) {
      return `${cleaned.substring(0, 7)}-${cleaned.substring(7, 9)}.${cleaned.substring(9, 13)}.${cleaned.substring(13, 14)}.${cleaned.substring(14, 16)}.${cleaned.substring(16, 20)}`
    }

    // Retorna original se não tiver 20 dígitos
    return numero
  }

  /**
   * Processa webhook do WhatsApp
   */
  async handleWebhook(data: any): Promise<void> {
    console.log('[WhatsApp] Webhook received:', JSON.stringify(data, null, 2))

    // TODO: Processar mensagens recebidas
    // TODO: Processar status updates (delivered, read, failed)
    // TODO: Processar button clicks
    // TODO: Trigger automation flows baseado em keywords
  }

  /**
   * Executa um automation flow
   */
  async executeFlow(flow: WhatsAppAutomationFlow, to: string, context: Record<string, any>): Promise<void> {
    console.log('[WhatsApp] Executing flow:', flow.name, 'for:', to)

    for (const step of flow.steps) {
      // Delay entre steps
      if (step.delaySeconds && step.delaySeconds > 0) {
        await new Promise((resolve) => setTimeout(resolve, step.delaySeconds! * 1000))
      }

      // Substituir variáveis no message
      const message = this.replaceVariables(step.message, context)

      // Enviar mensagem
      await this.sendMessage(message)

      // TODO: Aguardar resposta se houver conditions
      // TODO: Navegar para próximo step baseado em resposta
    }
  }

  /**
   * Substitui variáveis em uma mensagem
   */
  private replaceVariables(message: WhatsAppMessage, context: Record<string, any>): WhatsAppMessage {
    const stringified = JSON.stringify(message)
    let result = stringified

    Object.keys(context).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      result = result.replace(regex, context[key] || '')
    })

    return JSON.parse(result)
  }
}

export const whatsappAutomation = new WhatsAppAutomationEngine()
