import { NextRequest, NextResponse } from 'next/server'
import { whatsappMessageHandler } from '@/lib/whatsapp/message-handler'

/**
 * POST /api/whatsapp/baileys/webhook
 *
 * Recebe mensagens do Baileys Server (Railway)
 *
 * Payload:
 * {
 *   from: "5521999999999@s.whatsapp.net",
 *   message: "texto da mensagem",
 *   timestamp: 1234567890,
 *   messageId: "ABC123",
 *   type: "text"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[Baileys Webhook] Mensagem recebida:', body)

    const { from, message, messageId, timestamp, type } = body

    if (!from || !message) {
      return NextResponse.json(
        { error: 'Campos "from" e "message" são obrigatórios' },
        { status: 400 }
      )
    }

    // Extrair número (remover @s.whatsapp.net)
    const phoneNumber = from.replace('@s.whatsapp.net', '')

    // Processar mensagem com o handler existente
    const incomingMessage = {
      from: phoneNumber,
      id: messageId || `msg_${Date.now()}`,
      timestamp: timestamp || Date.now().toString(),
      type: type || 'text',
      text: { body: message },
    }

    // Processar com o sistema de qualificação
    const result = await whatsappMessageHandler.processMessage(incomingMessage)

    // Retornar resposta para o Baileys enviar
    // O handler retorna a mensagem que deve ser enviada
    const reply = result?.response || 'Mensagem recebida!'

    return NextResponse.json({
      success: true,
      processed: true,
      reply: reply,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[Baileys Webhook] Erro:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Erro ao processar mensagem',
        details: error instanceof Error ? error instanceof Error ? error.message : String(error) : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/whatsapp/baileys/webhook
 * Health check
 */
export async function GET() {
  return NextResponse.json({
    service: 'Baileys Webhook',
    status: 'active',
    timestamp: new Date().toISOString()
  })
}
