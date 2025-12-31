import { NextRequest, NextResponse } from 'next/server'
import { paymentClient, isMercadoPagoConfigured } from '@/lib/payments/mercadopago'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

/**
 * Verify MercadoPago webhook signature
 * Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
function verifyMercadoPagoSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string,
  secret: string
): boolean {
  if (!xSignature || !xRequestId) {
    return false
  }

  // Extract ts and hash from x-signature header
  // Format: "ts=1234567890,v1=hash"
  const parts = xSignature.split(',')
  const tsPart = parts.find((p) => p.startsWith('ts='))
  const hashPart = parts.find((p) => p.startsWith('v1='))

  if (!tsPart || !hashPart) {
    return false
  }

  const ts = tsPart.replace('ts=', '')
  const receivedHash = hashPart.replace('v1=', '')

  // Create manifest: id:{data.id};request-id:{x-request-id};ts:{ts};
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

  // Generate HMAC SHA256
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(manifest)
  const calculatedHash = hmac.digest('hex')

  return calculatedHash === receivedHash
}

export async function POST(request: NextRequest) {
  try {
    if (!isMercadoPagoConfigured() || !paymentClient) {
      return NextResponse.json({ error: 'MercadoPago not configured' }, { status: 500 })
    }

    const body = await request.json()

    // Verify webhook signature
    const xSignature = request.headers.get('x-signature')
    const xRequestId = request.headers.get('x-request-id')
    const dataId = body.data?.id

    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET

    if (webhookSecret && dataId) {
      const isValid = verifyMercadoPagoSignature(xSignature, xRequestId, dataId, webhookSecret)
      if (!isValid) {
        console.error('MercadoPago webhook signature verification failed')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } else if (!webhookSecret) {
      console.warn('MERCADOPAGO_WEBHOOK_SECRET not configured - skipping signature verification')
    }

    // MercadoPago sends different notification types
    // We're interested in 'payment' notifications
    if (body.type !== 'payment') {
      return NextResponse.json({ received: true })
    }

    const paymentId = body.data?.id

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing payment ID' }, { status: 400 })
    }

    // Fetch payment details from MercadoPago
    const payment = await paymentClient.get({ id: paymentId })

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    const supabase = await createClient()

    // Update order based on payment status
    switch (payment.status) {
      case 'approved': {
        await supabase
          .from('checkout_orders')
          .update({
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('mercadopago_payment_id', paymentId.toString())

        console.log(`PIX payment approved: ${paymentId}`)
        break
      }

      case 'pending':
      case 'in_process': {
        await supabase
          .from('checkout_orders')
          .update({
            payment_status: 'processing',
          })
          .eq('mercadopago_payment_id', paymentId.toString())

        console.log(`PIX payment processing: ${paymentId}`)
        break
      }

      case 'rejected':
      case 'cancelled': {
        await supabase
          .from('checkout_orders')
          .update({
            payment_status: payment.status === 'cancelled' ? 'cancelled' : 'failed',
          })
          .eq('mercadopago_payment_id', paymentId.toString())

        console.log(`PIX payment ${payment.status}: ${paymentId}`)
        break
      }

      default:
        console.log(`Unhandled payment status: ${payment.status}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('MercadoPago webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
