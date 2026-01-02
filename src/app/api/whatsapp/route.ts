import { NextRequest, NextResponse } from 'next/server'
import { sendTwilioMessage } from '@/lib/whatsapp/twilio-client'
import { formatPhoneNumber, type TwilioWebhookPayload } from '@/lib/whatsapp/types'
import { logger } from '@/lib/logger'

/**
 * POST /api/whatsapp
 * Twilio WhatsApp webhook endpoint
 *
 * Receives incoming WhatsApp messages from Twilio and processes them
 * through the qualification system.
 *
 * Expected payload (application/x-www-form-urlencoded):
 * - From: whatsapp:+5521999999999
 * - To: whatsapp:+14155238886
 * - Body: Message content
 * - MessageSid: Unique message identifier
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Parse form data from Twilio
    const formData = await request.formData()

    const from = formData.get('From')?.toString() || ''
    const body = formData.get('Body')?.toString() || ''
    const messageSid = formData.get('MessageSid')?.toString() || ''

    console.log('[WhatsApp Webhook] Incoming message', {
      from,
      messageSid,
      bodyLength: body.length,
      timestamp: new Date().toISOString(),
    })

    // Validate required fields
    if (!from || !body) {
      logger.warn('[WhatsApp Webhook] Missing required fields', { from: !!from, body: !!body })
      // Return 200 to acknowledge receipt (prevents Twilio retries)
      return new NextResponse('', { status: 200 })
    }

    // Extract phone number from Twilio format (whatsapp:+5521999999999)
    const phoneNumber = formatPhoneNumber(from)

    // Call qualification API
    const qualifyUrl = `${request.nextUrl.origin}/api/chat/qualify`

    console.log('[WhatsApp Webhook] Calling qualification API', {
      url: qualifyUrl,
      sessionId: phoneNumber,
    })

    const qualifyResponse = await fetch(qualifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: phoneNumber,
        message: body,
        source: 'whatsapp',
        clientInfo: {
          phone: phoneNumber,
        },
      }),
    })

    // Handle qualification response
    if (!qualifyResponse.ok) {
      console.error('[WhatsApp Webhook] Qualification API error', {
        status: qualifyResponse.status,
        statusText: qualifyResponse.statusText,
      })

      // Send fallback message to user
      await sendTwilioMessage(
        phoneNumber,
        'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em instantes ou ligue (21) 2220-0685.'
      )

      return new NextResponse('', { status: 200 })
    }

    const data = await qualifyResponse.json()
    const reply = data.response || data.message || 'Olá! Como posso ajudar você hoje?'

    console.log('[WhatsApp Webhook] Sending response', {
      to: phoneNumber,
      replyLength: reply.length,
    })

    // Send response via Twilio
    await sendTwilioMessage(phoneNumber, reply)

    const duration = Date.now() - startTime

    console.log('[WhatsApp Webhook] Request processed successfully', {
      duration: `${duration}ms`,
      messageSid,
    })

    // Twilio expects empty 200 response
    return new NextResponse('', { status: 200 })

  } catch (error) {
    const duration = Date.now() - startTime

    console.error('[WhatsApp Webhook] Error processing webhook', {
      error: error instanceof Error ? error instanceof Error ? error.message : String(error) : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      duration: `${duration}ms`,
    })

    // Always return 200 to prevent Twilio from retrying
    // (retries could cause duplicate messages)
    return new NextResponse('', { status: 200 })
  }
}

/**
 * GET /api/whatsapp
 * Health check endpoint for the WhatsApp webhook
 */
export async function GET() {
  return NextResponse.json({
    service: 'Garcez Palha - WhatsApp Webhook',
    status: 'active',
    provider: 'Twilio',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  })
}
