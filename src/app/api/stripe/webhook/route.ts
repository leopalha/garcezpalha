import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/payments/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Update order status in database
        const { error } = await (supabase
          .from('checkout_orders') as any)
          .update({
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)

        if (error) {
          console.error('Database update error:', error)
        }

        console.log(`Payment successful for session: ${session.id}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        // Mark as cancelled
        await (supabase
          .from('checkout_orders') as any)
          .update({
            payment_status: 'cancelled',
          })
          .eq('stripe_session_id', session.id)

        console.log(`Session expired: ${session.id}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Find order by payment intent and mark as failed
        const { data: orders } = await (supabase
          .from('checkout_orders') as any)
          .select('*')
          .eq('stripe_session_id', paymentIntent.id)

        if (orders && orders.length > 0) {
          await (supabase
            .from('checkout_orders') as any)
            .update({
              payment_status: 'failed',
            })
            .eq('id', orders[0].id)
        }

        console.log(`Payment failed for intent: ${paymentIntent.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
