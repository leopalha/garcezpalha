/**
 * Resend Webhook Handler
 * Processa eventos de email (opened, clicked, bounced, etc.)
 */

import { NextRequest, NextResponse } from 'next/server'
import { emailSequenceEngine } from '@/lib/email/sequences/engine'
import { inngest } from '@/lib/jobs/email-sequences'
import { logger } from '@/lib/logger'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    // Validar assinatura do webhook (segurança)
    const signature = req.headers.get('resend-signature')

    if (!signature && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    // Clonar request para poder ler body duas vezes
    const clonedReq = req.clone()
    const rawBody = await clonedReq.text()

    // Validar assinatura HMAC
    if (signature && process.env.RESEND_WEBHOOK_SECRET) {
      const isValid = await verifyResendSignature(signature, rawBody)
      if (!isValid) {
        logger.error('[Resend Webhook] Invalid signature')
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        )
      }
    }

    const event = JSON.parse(rawBody)

    logger.info('[Resend Webhook] Event received:', event.type, event.data?.email_id)

    // Processar evento conforme tipo
    switch (event.type) {
      case 'email.sent':
        // Email foi aceito pelo servidor SMTP
        // Não fazemos nada aqui pois já marcamos como sent ao enviar
        break

      case 'email.delivered':
        await emailSequenceEngine.handleWebhook({
          type: 'email.delivered',
          email_id: event.data.email_id,
          email: event.data.to,
          timestamp: event.created_at,
        })
        // Trigger Inngest event for async processing
        await inngest.send({
          name: 'email/event',
          data: {
            type: 'email.delivered',
            email_id: event.data.email_id,
            email: event.data.to,
            timestamp: event.created_at,
          },
        })
        break

      case 'email.delivery_delayed':
        // Email atrasado - pode monitorar mas não precisa ação
        logger.warn('[Resend Webhook] Email delayed:', event.data.email_id)
        break

      case 'email.complained':
        // Marcado como spam
        await emailSequenceEngine.handleWebhook({
          type: 'email.complained',
          email_id: event.data.email_id,
          email: event.data.to,
          timestamp: event.created_at,
        })
        await inngest.send({
          name: 'email/event',
          data: {
            type: 'email.complained',
            email_id: event.data.email_id,
            email: event.data.to,
            timestamp: event.created_at,
          },
        })
        break

      case 'email.bounced':
        // Email bounce (hard ou soft)
        await emailSequenceEngine.handleWebhook({
          type: 'email.bounced',
          email_id: event.data.email_id,
          email: event.data.to,
          timestamp: event.created_at,
        })
        await inngest.send({
          name: 'email/event',
          data: {
            type: 'email.bounced',
            email_id: event.data.email_id,
            email: event.data.to,
            timestamp: event.created_at,
          },
        })
        break

      case 'email.opened':
        // Email foi aberto
        await emailSequenceEngine.handleWebhook({
          type: 'email.opened',
          email_id: event.data.email_id,
          email: event.data.to,
          timestamp: event.created_at,
        })
        await inngest.send({
          name: 'email/event',
          data: {
            type: 'email.opened',
            email_id: event.data.email_id,
            email: event.data.to,
            timestamp: event.created_at,
          },
        })
        break

      case 'email.clicked':
        // Link foi clicado
        await emailSequenceEngine.handleWebhook({
          type: 'email.clicked',
          email_id: event.data.email_id,
          email: event.data.to,
          timestamp: event.created_at,
          link: event.data.link,
        })
        await inngest.send({
          name: 'email/event',
          data: {
            type: 'email.clicked',
            email_id: event.data.email_id,
            email: event.data.to,
            timestamp: event.created_at,
            link: event.data.link,
          },
        })
        break

      default:
        logger.info('[Resend Webhook] Unknown event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    logger.error('[Resend Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

/**
 * Verifica assinatura HMAC SHA-256 do webhook Resend
 * Resend envia header 'resend-signature' com HMAC do body
 */
async function verifyResendSignature(signature: string, body: string): Promise<boolean> {
  const secret = process.env.RESEND_WEBHOOK_SECRET

  if (!secret) {
    logger.warn('[Resend Webhook] RESEND_WEBHOOK_SECRET not configured')
    return true // Em desenvolvimento, aceitar sem validação
  }

  try {
    // Converter secret para Uint8Array
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)

    // Importar chave para uso com Web Crypto API (Edge Runtime)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    // Gerar HMAC do body
    const bodyData = encoder.encode(body)
    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, bodyData)

    // Converter para hex
    const hashArray = Array.from(new Uint8Array(signatureBuffer))
    const expectedSignature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Comparar com signature recebida (case-insensitive)
    return signature.toLowerCase() === expectedSignature.toLowerCase()
  } catch (error) {
    logger.error('[Resend Webhook] Error verifying signature:', error)
    return false
  }
}
