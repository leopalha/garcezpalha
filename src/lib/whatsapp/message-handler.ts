/**
 * WhatsApp Message Handler
 * Processes incoming WhatsApp messages and integrates with lead qualification system
 */

import { whatsappCloudAPI, type WhatsAppIncomingMessage } from './cloud-api'
import { handleChatWithQualification } from '../ai/chat-qualification-integration'

// Session storage for WhatsApp conversations
const whatsappSessions = new Map<string, WhatsAppSession>()

interface WhatsAppSession {
  phoneNumber: string
  sessionId: string
  startedAt: Date
  lastMessageAt: Date
  clientName?: string
  inQualification: boolean
  conversationHistory: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
  }>
}

/**
 * WhatsApp Message Handler Class
 */
class WhatsAppMessageHandler {
  constructor() {
    // No initialization needed
  }

  /**
   * Process incoming WhatsApp message
   */
  async processMessage(message: WhatsAppIncomingMessage): Promise<void> {
    const phoneNumber = message.from

    console.log(`[WhatsApp] Processing message from ${phoneNumber}`)

    try {
      // Get or create session
      const session = this.getOrCreateSession(phoneNumber)

      // Extract message content based on type
      let messageContent = ''

      if (message.type === 'text' && message.text) {
        messageContent = message.text.body
      } else if (message.type === 'audio' && message.audio) {
        // Transcribe audio
        const transcription = await this.transcribeAudio(message.audio.id)
        if (!transcription) {
          await this.sendMessage(phoneNumber, '❌ Não consegui processar o áudio. Por favor, envie sua mensagem por texto.')
          return
        }
        messageContent = transcription
      } else if (message.type === 'interactive' && message.interactive?.button_reply) {
        messageContent = message.interactive.button_reply.title
      } else if (message.type === 'image' && message.image) {
        await this.sendMessage(phoneNumber, '📷 Recebi sua imagem. Para melhor atendimento, descreva o que precisa por texto.')
        return
      } else {
        await this.sendMessage(phoneNumber, 'Por favor, envie sua mensagem por texto ou áudio.')
        return
      }

      // Add to conversation history
      session.conversationHistory.push({
        role: 'user',
        content: messageContent,
        timestamp: new Date()
      })
      session.lastMessageAt = new Date()

      // Check for greeting/start
      if (this.isGreeting(messageContent) && !session.inQualification) {
        await this.sendWelcomeMessage(phoneNumber)
        return
      }

      // Check for help command
      if (this.isHelpCommand(messageContent)) {
        await this.sendHelpMessage(phoneNumber)
        return
      }

      // Check for contact command
      if (this.isContactCommand(messageContent)) {
        await this.sendContactInfo(phoneNumber)
        return
      }

      // Process with qualification system
      const response = await this.processWithQualification(session, messageContent)

      // Send response
      await this.sendMessage(phoneNumber, response)

      // Add to conversation history
      session.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      })

    } catch (error) {
      console.error('[WhatsApp] Error processing message:', error)
      await this.sendMessage(
        phoneNumber,
        '❌ Desculpe, ocorreu um erro. Por favor, tente novamente ou ligue (21) 2220-0685.'
      )
    }
  }

  /**
   * Process message with qualification system
   */
  private async processWithQualification(session: WhatsAppSession, message: string): Promise<string> {
    try {
      const result = await handleChatWithQualification({
        sessionId: session.sessionId,
        message,
        source: 'whatsapp',
        clientInfo: {
          name: session.clientName,
          phone: session.phoneNumber
        }
      })

      session.inQualification = result.type === 'question'

      // Format response based on type
      if (result.type === 'question') {
        return this.formatQuestionForWhatsApp(result)
      } else if (result.type === 'completion') {
        return this.formatCompletionForWhatsApp(result)
      } else {
        return result.message
      }
    } catch (error) {
      console.error('[WhatsApp] Error in qualification:', error)

      // Fallback to generic message
      return 'Desculpe, não consegui processar sua solicitação. Por favor, descreva novamente o seu problema ou entre em contato pelo telefone (21) 2220-0685.'
    }
  }

  /**
   * Format qualification question for WhatsApp
   */
  private formatQuestionForWhatsApp(result: any): string {
    let message = result.message

    if (result.progress) {
      const progressBar = this.createProgressBar(result.progress.percentage)
      message = `${progressBar} ${result.progress.answered}/${result.progress.total}\n\n${message}`
    }

    return message
  }

  /**
   * Format completion message for WhatsApp
   */
  private formatCompletionForWhatsApp(result: any): string {
    let message = result.message

    if (result.paymentLink) {
      message += `\n\n💳 *Link de Pagamento:*\n${result.paymentLink}`
    }

    if (result.proposalText) {
      message += `\n\n📄 *Proposta:*\n${result.proposalText}`
    }

    return message
  }

  /**
   * Create visual progress bar
   */
  private createProgressBar(percentage: number): string {
    const filled = Math.round(percentage / 10)
    const empty = 10 - filled
    return `[${'▓'.repeat(filled)}${'░'.repeat(empty)}]`
  }

  /**
   * Send message via WhatsApp Cloud API
   */
  async sendMessage(to: string, message: string, includeDisclaimer: boolean = false): Promise<boolean> {
    // Split long messages (WhatsApp limit is 4096 characters)
    const maxLength = 4000
    const messages = this.splitMessage(message, maxLength)

    for (const msg of messages) {
      const success = await whatsappCloudAPI.sendMessage(to, msg, includeDisclaimer)
      if (!success) {
        console.error(`[WhatsApp] Failed to send message to ${to}`)
        return false
      }
      if (messages.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    return true
  }

  /**
   * Split long message into chunks
   */
  private splitMessage(message: string, maxLength: number): string[] {
    if (message.length <= maxLength) {
      return [message]
    }

    const chunks: string[] = []
    let remaining = message

    while (remaining.length > 0) {
      if (remaining.length <= maxLength) {
        chunks.push(remaining)
        break
      }

      let breakPoint = remaining.lastIndexOf('\n\n', maxLength)
      if (breakPoint === -1) {
        breakPoint = remaining.lastIndexOf('\n', maxLength)
      }
      if (breakPoint === -1) {
        breakPoint = remaining.lastIndexOf(' ', maxLength)
      }
      if (breakPoint === -1) {
        breakPoint = maxLength
      }

      chunks.push(remaining.substring(0, breakPoint))
      remaining = remaining.substring(breakPoint).trim()
    }

    return chunks
  }

  /**
   * Send welcome message
   */
  private async sendWelcomeMessage(phoneNumber: string): Promise<void> {
    const welcomeMessage = `Olá! 👋 Bem-vindo ao *Garcez Palha - Inteligência Jurídica*

364 anos de tradição, nobreza e excelência.

Como posso ajudá-lo hoje?

📋 *Áreas de Atuação:*
• Proteção Financeira (golpes PIX, conta bloqueada)
• Direito Imobiliário
• Perícias Técnicas
• Saúde e Previdência
• Defesa Criminal

Digite sua dúvida ou problema que vou direcioná-lo para o especialista adequado.

_Comandos úteis:_
• /ajuda - Menu de ajuda
• /contato - Informações de contato`

    await this.sendMessage(phoneNumber, welcomeMessage, true)
  }

  /**
   * Send help message
   */
  private async sendHelpMessage(phoneNumber: string): Promise<void> {
    const helpMessage = `*📚 Central de Ajuda - Garcez Palha*

*Como funciona:*
1️⃣ Descreva sua situação
2️⃣ Respondo algumas perguntas rápidas
3️⃣ Analiso seu caso automaticamente
4️⃣ Envio proposta personalizada

*Comandos disponíveis:*
• /ajuda - Esta mensagem
• /contato - Telefone e endereço

*Horário de Atendimento:*
Segunda a Sexta: 9h às 18h
Sábados: 9h às 13h

Para atendimento urgente: (21) 2220-0685`

    await this.sendMessage(phoneNumber, helpMessage)
  }

  /**
   * Send contact information
   */
  private async sendContactInfo(phoneNumber: string): Promise<void> {
    const contactMessage = `*📍 Garcez Palha - Inteligência Jurídica*

📞 *Telefone:* (21) 2220-0685
📧 *Email:* contato@garcezpalha.com

🏢 *Endereço:*
Rua Buenos Aires, 68 - Sala 2301
Centro, Rio de Janeiro - RJ
CEP: 20070-022

🌐 *Site:* www.garcezpalha.com

*Horário:*
Segunda a Sexta: 9h às 18h
Sábados: 9h às 13h`

    await this.sendMessage(phoneNumber, contactMessage)
  }

  /**
   * Transcribe audio using Groq Whisper API
   */
  private async transcribeAudio(audioId: string): Promise<string | null> {
    try {
      const audioBuffer = await whatsappCloudAPI.downloadMedia(audioId)
      if (!audioBuffer) {
        console.error('[WhatsApp] Failed to download audio')
        return null
      }

      const formData = new FormData()
      formData.append('file', new Blob([audioBuffer], { type: 'audio/ogg' }), 'audio.ogg')
      formData.append('model', 'whisper-large-v3-turbo')
      formData.append('language', 'pt')
      formData.append('response_format', 'json')

      const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: formData
      })

      if (!response.ok) {
        console.error('[WhatsApp] Groq transcription error')
        return null
      }

      const result = await response.json()
      return result.text || null

    } catch (error) {
      console.error('[WhatsApp] Error transcribing audio:', error)
      return null
    }
  }

  /**
   * Get or create session for phone number
   */
  private getOrCreateSession(phoneNumber: string): WhatsAppSession {
    let session = whatsappSessions.get(phoneNumber)

    if (!session) {
      session = {
        phoneNumber,
        sessionId: `wa_${phoneNumber}_${Date.now()}`,
        startedAt: new Date(),
        lastMessageAt: new Date(),
        inQualification: false,
        conversationHistory: []
      }
      whatsappSessions.set(phoneNumber, session)
    }

    return session
  }

  /**
   * Check if message is a greeting
   */
  private isGreeting(message: string): boolean {
    const greetings = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'hello', 'hi', '/start', 'inicio']
    const lower = message.toLowerCase().trim()
    return greetings.some(g => lower === g || lower.startsWith(g + ' '))
  }

  /**
   * Check if message is help command
   */
  private isHelpCommand(message: string): boolean {
    const helpCommands = ['/ajuda', '/help', 'ajuda', 'help', 'menu']
    return helpCommands.includes(message.toLowerCase().trim())
  }

  /**
   * Check if message is contact command
   */
  private isContactCommand(message: string): boolean {
    const contactCommands = ['/contato', '/contact', 'contato', 'telefone', 'endereço', 'endereco']
    return contactCommands.includes(message.toLowerCase().trim())
  }

  /**
   * Clean up expired sessions (older than 24 hours)
   */
  cleanupExpiredSessions(): number {
    const now = Date.now()
    const expirationTime = 24 * 60 * 60 * 1000
    let cleaned = 0

    for (const [phoneNumber, session] of whatsappSessions.entries()) {
      if (now - session.lastMessageAt.getTime() > expirationTime) {
        whatsappSessions.delete(phoneNumber)
        cleaned++
      }
    }

    return cleaned
  }
}

// Export singleton instance
export const whatsappMessageHandler = new WhatsAppMessageHandler()
