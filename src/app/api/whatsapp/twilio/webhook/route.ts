import { NextRequest, NextResponse } from 'next/server'
import { whatsappMessageHandler } from '@/lib/whatsapp/message-handler'
import { sendTwilioMessage } from '@/lib/whatsapp/twilio-client'

/**
 * POST /api/whatsapp/twilio/webhook
 *
 * Recebe mensagens do Twilio WhatsApp
 *
 * Twilio envia como application/x-www-form-urlencoded:
 * {
 *   From: "whatsapp:+5521999999999",
 *   To: "whatsapp:+14155238886",
 *   Body: "mensagem do usuário",
 *   MessageSid: "SM...",
 *   NumMedia: "0"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Twilio envia form data, não JSON
    const formData = await request.formData()

    const from = formData.get('From')?.toString() || ''
    const body = formData.get('Body')?.toString() || ''
    const messageSid = formData.get('MessageSid')?.toString() || ''
    const numMedia = parseInt(formData.get('NumMedia')?.toString() || '0')

    console.log('[Twilio Webhook] Mensagem recebida')
    console.log('[Twilio Webhook] From:', from)
    console.log('[Twilio Webhook] Body:', body)
    console.log('[Twilio Webhook] MessageSid:', messageSid)
    console.log('[Twilio Webhook] NumMedia:', numMedia)

    if (!from || !body) {
      console.error('[Twilio Webhook] Campos obrigatórios ausentes')
      return NextResponse.json(
        { error: 'Campos "From" e "Body" são obrigatórios' },
        { status: 400 }
      )
    }

    // Extrair número do formato "whatsapp:+5521999999999"
    const phoneNumber = from.replace('whatsapp:', '').replace('+', '')

    // Processar mensagem com o handler existente
    const incomingMessage = {
      from: phoneNumber,
      id: messageSid,
      timestamp: Date.now().toString(),
      type: 'text' as const,
      text: { body },
    }

    console.log('[Twilio Webhook] Processando mensagem para:', phoneNumber)

    // Processar com o sistema de qualificação
    const result = await whatsappMessageHandler.processMessage(incomingMessage)

    // Enviar resposta via Twilio
    const reply = result?.response || 'Mensagem recebida!'

    console.log('[Twilio Webhook] Enviando resposta:', reply)

    await sendTwilioMessage(phoneNumber, reply)

    // Twilio espera resposta vazia ou TwiML
    // Retornando 200 OK vazio para confirmar recebimento
    return new NextResponse('', { status: 200 })

  } catch (error) {
    console.error('[Twilio Webhook] Erro:', error)

    // Mesmo com erro, retornar 200 para Twilio não retentar
    // (evita loop de mensagens)
    return new NextResponse('', { status: 200 })
  }
}

/**
 * GET /api/whatsapp/twilio/webhook
 * Health check
 */
export async function GET() {
  return NextResponse.json({
    service: 'Twilio WhatsApp Webhook',
    status: 'active',
    timestamp: new Date().toISOString()
  })
}
