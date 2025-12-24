import { NextRequest, NextResponse } from 'next/server'
import { whatsappMessageHandler } from '@/lib/whatsapp/message-handler'
import { whatsappCloudAPI } from '@/lib/whatsapp/cloud-api'

/**
 * GET /api/whatsapp-cloud/webhook
 * Webhook verification endpoint (required by Meta)
 *
 * When you configure the webhook URL in Meta Business Manager,
 * they will send a GET request to verify the webhook.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  // Parse query parameters
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'garcezpalha-webhook-verify-token-2025'

  // Check if mode and token are present
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    // Respond with the challenge token from the request
    console.log('[WhatsApp Webhook] Verified successfully')
    return new NextResponse(challenge, { status: 200 })
  } else {
    // Respond with '403 Forbidden' if verify tokens do not match
    console.error('[WhatsApp Webhook] Verification failed')
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }
}

/**
 * POST /api/whatsapp-cloud/webhook
 * Webhook endpoint to receive messages from WhatsApp
 *
 * Integrates with Lead Qualification System for automated:
 * - Lead qualification
 * - Payment link generation
 * - Proposal creation
 * - Follow-up scheduling
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    console.log('[WhatsApp Webhook] Received:', JSON.stringify(body, null, 2))

    // Extract message data
    const entry = body.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    // Check if this is a message notification
    if (value?.messages) {
      const message = value.messages[0]
      const contact = value.contacts?.[0]

      console.log('[WhatsApp Webhook] Message from:', message.from)
      console.log('[WhatsApp Webhook] Message type:', message.type)

      // Mark message as read immediately
      try {
        await whatsappCloudAPI.markAsRead(message.id)
      } catch (error) {
        console.error('[WhatsApp Webhook] Error marking as read:', error)
      }

      // Process message with handler (async, don't wait)
      // This allows webhook to return quickly while processing continues
      processMessageAsync(message, contact).catch(error => {
        console.error('[WhatsApp Webhook] Error in async processing:', error)
      })
    }

    // Check if this is a status update
    if (value?.statuses) {
      const status = value.statuses[0]
      console.log('[WhatsApp Webhook] Status update:', status.status, 'for', status.recipient_id)

      // Log delivery/read status
      // Could be: sent, delivered, read, failed
      if (status.status === 'failed') {
        console.error('[WhatsApp Webhook] Message failed:', status.errors)
      }
    }

    // Return 200 OK immediately to acknowledge receipt
    // Meta expects response within 20 seconds
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[WhatsApp Webhook] Error:', error)
    // Still return 200 to avoid Meta retrying
    return NextResponse.json({ success: false, error: 'Internal error' })
  }
}

/**
 * Process message asynchronously to avoid webhook timeout
 */
async function processMessageAsync(message: any, contact?: any): Promise<void> {
  try {
    // Build message object for handler
    const incomingMessage = {
      from: message.from,
      id: message.id,
      timestamp: message.timestamp,
      type: message.type,
      text: message.text,
      audio: message.audio,
      image: message.image,
      document: message.document,
      interactive: message.interactive
    }

    // Process with qualification system
    await whatsappMessageHandler.processMessage(incomingMessage)

  } catch (error) {
    console.error('[WhatsApp Webhook] Async processing error:', error)

    // Try to send error message to user
    try {
      await whatsappCloudAPI.sendMessage(
        message.from,
        '❌ Desculpe, ocorreu um erro. Por favor, tente novamente ou ligue (21) 2220-0685.'
      )
    } catch (sendError) {
      console.error('[WhatsApp Webhook] Failed to send error message:', sendError)
    }
  }
}
