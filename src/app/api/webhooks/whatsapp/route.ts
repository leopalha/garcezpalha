import { NextRequest, NextResponse } from 'next/server'
import { processWhatsAppWebhook } from '@/lib/workflows/comunicacao-flow'
import { logger } from '@/lib/logger'

/**
 * WhatsApp Cloud API Webhook
 * https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
 */

export async function GET(request: NextRequest) {
  // Verification request from WhatsApp
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN

  if (!verifyToken) {
    logger.error('WHATSAPP_VERIFY_TOKEN not configured')
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  if (mode === 'subscribe' && token === verifyToken) {
    logger.info('[WhatsApp] Webhook verified successfully')
    return new NextResponse(challenge, { status: 200 })
  }

  logger.error('[WhatsApp] Webhook verification failed')
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    logger.info('[WhatsApp] Webhook received:', JSON.stringify(body, null, 2))

    // Verificar se é uma notificação de mensagem
    if (!body.object || body.object !== 'whatsapp_business_account') {
      logger.info('[WhatsApp] Not a WhatsApp Business webhook')
      return NextResponse.json({ received: true })
    }

    // Processar webhook no fluxo de comunicação
    await processWhatsAppWebhook(body)

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('[WhatsApp] Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
