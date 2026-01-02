import { NextRequest, NextResponse } from 'next/server'
import telegramBotService, { type TelegramUpdate } from '@/lib/telegram/bot-service'
import telegramConversationService from '@/lib/telegram/conversation-service'
import telegramLeadQualifier from '@/lib/telegram/lead-qualifier'
import telegramAIChatService from '@/lib/telegram/ai-chat'
import { logger } from '@/lib/logger'

/**
 * POST /api/telegram/webhook
 * Webhook endpoint to receive updates from Telegram
 */
export async function POST(request: NextRequest) {
  try {
    const update: TelegramUpdate = await request.json()

    logger.info('Telegram update received:', JSON.stringify(update, null, 2))

    // Handle message
    if (update.message) {
      const message = update.message
      const chatId = message.chat.id
      const text = message.text

      logger.info(`Message from ${message.from.first_name} (${chatId}): ${text}`)

      // Get or create conversation in database
      const conversation = await telegramConversationService.getOrCreateConversation(
        chatId,
        message.from.id,
        message.from.first_name,
        message.from.last_name,
        message.from.username,
        message.from.language_code
      )

      // Save incoming message to database
      if (conversation && text) {
        const savedMessage = await telegramConversationService.saveIncomingMessage(
          conversation.id,
          message.message_id,
          chatId,
          message.from.id,
          message.from.first_name,
          message.from.username,
          text,
          'text',
          new Date(message.date * 1000)
        )

        // Process message with AI (intent and entity extraction)
        if (savedMessage) {
          const intent = telegramLeadQualifier.detectIntent(text)
          const entities = telegramLeadQualifier.extractEntities(text)

          // Update message with AI processing
          await telegramConversationService.updateMessageAI(
            savedMessage.id,
            intent,
            Object.keys(entities).length > 0 ? entities : undefined,
            'neutral' // Can be enhanced with sentiment analysis
          )
        }

        // Qualify conversation after each message (async, don't block response)
        setTimeout(async () => {
          const qualification = await telegramLeadQualifier.qualifyConversation(conversation.id)

          if (qualification.score > 0) {
            await telegramConversationService.qualifyConversation(
              conversation.id,
              qualification.score,
              qualification.reason
            )

            logger.info(`Conversation ${conversation.id} qualified with score ${qualification.score}`)
            if (qualification.isQualified) {
              logger.info(`🎯 Lead qualified! Reason: ${qualification.reason}`)
            }
          }
        }, 100)
      }

      // Handle commands
      if (text?.startsWith('/')) {
        const command = text.split(' ')[0].toLowerCase()
        let responseText = ''
        let intent = ''

        switch (command) {
          case '/start':
            intent = 'greeting'
            responseText = `Olá ${message.from.first_name}! 👋\n\nBem-vindo ao bot do Garcez Palha - Escritório de Advocacia.\n\nComo posso ajudá-lo hoje?`
            break

          case '/help':
            intent = 'help'
            responseText = `🤖 *Comandos Disponíveis:*\n\n` +
              `/start - Iniciar conversa\n` +
              `/help - Mostrar ajuda\n` +
              `/contato - Informações de contato\n` +
              `/servicos - Nossos serviços`
            break

          case '/contato':
            intent = 'contact_info'
            responseText = `📞 *Contato:*\n\n` +
              `Email: contato@garcezpalha.com\n` +
              `Telefone: +55 21 99535-4010\n` +
              `Site: https://garcezpalha.com`
            break

          case '/servicos':
            intent = 'services_inquiry'
            responseText = `⚖️ *Nossos Serviços:*\n\n` +
              `• Direito Imobiliário\n` +
              `• Direito Criminal\n` +
              `• Direito Civil\n` +
              `• Direito Trabalhista\n` +
              `• Direito do Consumidor\n` +
              `• Perícia Documental\n` +
              `• Avaliação de Imóveis\n` +
              `• Perícia Médica\n` +
              `• Secretaria Remota\n\n` +
              `Entre em contato para mais informações!`
            break

          default:
            intent = 'unknown_command'
            responseText = `Comando não reconhecido. Use /help para ver os comandos disponíveis.`
        }

        const sentMessage = await telegramBotService.sendMessage(
          chatId,
          responseText,
          (command !== '/start' && command !== 'default') ? { parse_mode: 'Markdown' } : undefined
        )

        // Save outgoing message
        if (conversation && sentMessage) {
          await telegramConversationService.saveOutgoingMessage(
            conversation.id,
            sentMessage.message_id,
            chatId,
            responseText,
            responseText,
            intent
          )
        }
      } else if (text) {
        // AI-powered response
        let responseText = ''
        let aiIntent = 'general'

        // Check if it's a simple command that can use quick response
        const commandCheck = telegramAIChatService.isSimpleCommand(text)

        if (commandCheck.isCommand && commandCheck.intent) {
          // Use quick response for simple commands
          responseText = telegramAIChatService.getQuickResponse(
            commandCheck.intent,
            message.from.first_name
          )
          aiIntent = commandCheck.intent
        } else if (conversation) {
          // Use GPT-4 for complex queries
          // Get conversation history
          const history = await telegramConversationService.getMessages(conversation.id, 10)
          const conversationHistory = history.map(msg => ({
            direction: msg.direction,
            text: msg.text || ''
          }))

          const aiResponse = await telegramAIChatService.generateResponse(
            text,
            conversationHistory,
            message.from.first_name
          )

          responseText = aiResponse.text
          aiIntent = aiResponse.intent || 'general'

          // Handle escalation suggestion
          if (aiResponse.suggestedAction === 'escalate') {
            logger.info(`🔔 Conversation ${conversation.id} should be escalated to human`)
            // TODO: Notify admin for human handoff
          }
        } else {
          // Fallback if no conversation
          responseText = `Olá ${message.from.first_name}! 👋\n\nBem-vindo ao Garcez Palha - Escritório de Advocacia.\n\nComo posso ajudá-lo hoje?`
          aiIntent = 'greeting'
        }

        const sentMessage = await telegramBotService.sendMessage(
          chatId,
          responseText
        )

        // Save outgoing message
        if (conversation && sentMessage) {
          await telegramConversationService.saveOutgoingMessage(
            conversation.id,
            sentMessage.message_id,
            chatId,
            responseText,
            responseText,
            aiIntent
          )
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    logger.error('Error processing Telegram webhook:', error)
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 })
  }
}

/**
 * GET /api/telegram/webhook
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'Telegram webhook endpoint',
    configured: telegramBotService.isConfigured()
  })
}
