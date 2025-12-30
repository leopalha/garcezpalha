/**
 * Resend Webhook Handler
 * Processa eventos de email (opened, clicked, bounced, etc.)
 */

import { NextRequest, NextResponse } from 'next/server'
import { emailSequenceEngine } from '@/lib/email/sequences/engine'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    // Validar assinatura do webhook (segurança)
    const signature = req.headers.get('resend-signature')

    if (!signature && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    // TODO: Implementar validação de assinatura real
    // const isValid = verifyResendSignature(signature, await req.text())
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    const event = await req.json()

    console.log('[Resend Webhook] Event received:', event.type, event.data?.email_id)

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
        break

      case 'email.delivery_delayed':
        // Email atrasado - pode monitorar mas não precisa ação
        console.warn('[Resend Webhook] Email delayed:', event.data.email_id)
        break

      case 'email.complained':
        // Marcado como spam
        await emailSequenceEngine.handleWebhook({
          type: 'email.complained',
          email_id: event.data.email_id,
          email: event.data.to,
          timestamp: event.created_at,
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
        break

      case 'email.opened':
        // Email foi aberto
        await emailSequenceEngine.handleWebhook({
          type: 'email.opened',
          email_id: event.data.email_id,
          email: event.data.to,
          timestamp: event.created_at,
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
        break

      default:
        console.log('[Resend Webhook] Unknown event type:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('[Resend Webhook] Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// Função auxiliar para verificar assinatura (implementar conforme doc Resend)
function verifyResendSignature(signature: string, body: string): boolean {
  // TODO: Implementar verificação HMAC conforme documentação Resend
  // const secret = process.env.RESEND_WEBHOOK_SECRET
  // const hmac = crypto.createHmac('sha256', secret)
  // hmac.update(body)
  // const expectedSignature = hmac.digest('hex')
  // return signature === expectedSignature

  return true // Placeholder
}
