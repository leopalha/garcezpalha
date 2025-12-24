import { NextRequest, NextResponse } from 'next/server'
import { paymentClient, isMercadoPagoConfigured } from '@/lib/mercadopago'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    if (!isMercadoPagoConfigured() || !paymentClient) {
      return NextResponse.json({ error: 'MercadoPago not configured' }, { status: 500 })
    }

    const body = await request.json()

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
