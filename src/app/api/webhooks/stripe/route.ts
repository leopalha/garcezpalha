import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { processStripePaymentWebhook } from '@/lib/workflows/financeiro-flow'

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize Stripe only if configured
function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey || secretKey === 'your-stripe-secret-key') {
    return null
  }
  return new Stripe(secretKey, {
    apiVersion: '2025-10-29.clover',
    typescript: true,
  })
}

export async function POST(request: NextRequest) {
  const stripe = getStripe()

  if (!stripe) {
    console.log('Stripe not configured, webhook disabled')
    return NextResponse.json(
      { error: 'Stripe not configured' },
      { status: 503 }
    )
  }

  const body = await request.text()
  const headersList = headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentSucceeded(paymentIntent)
        // Processar fluxo financeiro completo
        await processStripePaymentWebhook(paymentIntent)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaid(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCreated(subscription)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Event handlers
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed:', session.id)

  const orderId = session.metadata?.orderId
  const leadId = session.metadata?.leadId
  const serviceId = session.metadata?.serviceId

  // Update checkout_orders table
  if (orderId) {
    const { error } = await supabaseAdmin
      .from('checkout_orders')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        stripe_session_id: session.id,
        payment_id: session.payment_intent as string,
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating checkout order:', error)
      throw error
    }

    console.log(`Checkout order ${orderId} marked as paid`)
  }

  // Update lead status if linked
  if (leadId) {
    const { error } = await supabaseAdmin
      .from('leads')
      .update({
        status: 'converted',
        converted_at: new Date().toISOString(),
      })
      .eq('id', leadId)

    if (error) {
      console.error('Error updating lead:', error)
    } else {
      console.log(`Lead ${leadId} marked as converted`)
    }
  }

  // Log the successful payment
  console.log(`Payment confirmed for session ${session.id}, service: ${serviceId}`)
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id)

  const orderId = paymentIntent.metadata?.orderId

  if (orderId) {
    // Update checkout order with payment details
    const { error } = await supabaseAdmin
      .from('checkout_orders')
      .update({
        status: 'paid',
        payment_id: paymentIntent.id,
        paid_at: new Date().toISOString(),
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order on payment success:', error)
    } else {
      console.log(`Order ${orderId} payment confirmed`)
    }
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id)

  const orderId = paymentIntent.metadata?.orderId

  if (orderId) {
    // Update checkout order status to failed
    const { error } = await supabaseAdmin
      .from('checkout_orders')
      .update({
        status: 'failed',
        payment_id: paymentIntent.id,
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order on payment failure:', error)
    } else {
      console.log(`Order ${orderId} marked as failed`)
    }
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log('Invoice paid:', invoice.id)

  // Update subscription or service status
  // await updateServiceStatus(invoice.customer as string, 'active')
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Invoice payment failed:', invoice.id)

  // Handle failed recurring payment
  // await notifyOfPaymentIssue(invoice.customer as string)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id)

  // Create subscription record
  // await createSubscriptionRecord({
  //   customerId: subscription.customer as string,
  //   subscriptionId: subscription.id,
  //   status: subscription.status,
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  // })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id)

  // Update subscription status
  // await updateSubscriptionStatus(subscription.id, subscription.status)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id)

  // Mark subscription as cancelled
  // await cancelSubscription(subscription.id)
}
