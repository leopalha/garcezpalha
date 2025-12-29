import { NextRequest, NextResponse } from 'next/server'
import { whatsappMessageHandler } from '@/lib/whatsapp/message-handler'
import { sendTwilioMessage } from '@/lib/whatsapp/twilio-client'
import { formatPhoneNumber } from '@/lib/whatsapp/types'

/**
 * POST /api/whatsapp/twilio/webhook
 *
 * Advanced Twilio WhatsApp webhook endpoint with full message handler integration
 *
 * Receives incoming WhatsApp messages from Twilio and processes them
 * through the complete message handler with audio transcription, image processing,
 * and conversation management.
 *
 * Twilio payload format (application/x-www-form-urlencoded):
 * {
 *   From: "whatsapp:+5521999999999",
 *   To: "whatsapp:+14155238886",
 *   Body: "mensagem do usuário",
 *   MessageSid: "SM...",
 *   NumMedia: "0",
 *   MediaUrl0: "https://...", (if NumMedia > 0)
 *   MediaContentType0: "image/jpeg" (if NumMedia > 0)
 * }
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse form data from Twilio
    const formData = await request.formData()

    const from = formData.get('From')?.toString() || ''
    const body = formData.get('Body')?.toString() || ''
    const messageSid = formData.get('MessageSid')?.toString() || ''
    const numMedia = parseInt(formData.get('NumMedia')?.toString() || '0')

    console.log('[Twilio Webhook] Incoming message', {
      from,
      messageSid,
      bodyLength: body.length,
      numMedia,
      timestamp: new Date().toISOString(),
    })

    // Validate required fields
    if (!from || !body) {
      console.warn('[Twilio Webhook] Missing required fields', { from: !!from, body: !!body })
      // Return 200 to prevent Twilio retries
      return new NextResponse('', { status: 200 })
    }

    // Extract phone number from Twilio format
    const phoneNumber = formatPhoneNumber(from)

    // Build incoming message object for handler
    const incomingMessage = {
      from: phoneNumber,
      id: messageSid,
      timestamp: Date.now().toString(),
      type: 'text' as const,
      text: { body },
    }

    console.log('[Twilio Webhook] Processing message', {
      phoneNumber,
      messageType: 'text',
    })

    // Process through message handler
    const result = await whatsappMessageHandler.processMessage(incomingMessage)

    // Get reply from handler result
    const reply = result?.response || 'Mensagem recebida com sucesso!'

    console.log('[Twilio Webhook] Sending response', {
      to: phoneNumber,
      replyLength: reply.length,
    })

    // Send response via Twilio
    await sendTwilioMessage(phoneNumber, reply)

    const duration = Date.now() - startTime

    console.log('[Twilio Webhook] Request processed successfully', {
      duration: `${duration}ms`,
      messageSid,
    })

    // Twilio expects empty 200 response or TwiML
    return new NextResponse('', { status: 200 })

  } catch (error) {
    const duration = Date.now() - startTime

    console.error('[Twilio Webhook] Error processing webhook', {
      error: error instanceof Error ? error instanceof Error ? error.message : String(error) : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    })

    // Always return 200 to prevent Twilio retries
    // (retries could cause duplicate messages and loops)
    return new NextResponse('', { status: 200 })
  }
}

/**
 * GET /api/whatsapp/twilio/webhook
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    service: 'Garcez Palha - Twilio WhatsApp Webhook (Advanced)',
    status: 'active',
    provider: 'Twilio',
    features: [
      'Audio transcription',
      'Image processing',
      'Conversation management',
      'Lead qualification',
    ],
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  })
}
