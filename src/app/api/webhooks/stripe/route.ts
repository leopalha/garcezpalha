import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { withRateLimit } from '@/lib/rate-limit'
import { sendEvent } from '@/lib/jobs/inngest-client'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

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

async function handler(request: NextRequest) {
  const stripe = getStripe()

  if (!stripe) {
    logger.info('Stripe not configured, webhook disabled')
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
    logger.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    logger.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  // P0-001: TODO - Enqueue event para processamento assíncrono (Inngest integration pending)
  // For now, process synchronously
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
          logger.info(`Unhandled event type: ${event.type}`)
      }

    return NextResponse.json({ received: true })
  } catch (error) {
    logger.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Event handlers
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  logger.info('Checkout completed:', session.id)

  const orderId = session.metadata?.orderId
  const leadId = session.metadata?.leadId
  const serviceId = session.metadata?.serviceId
  const conversationId = session.metadata?.conversation_id

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
      logger.error('Error updating checkout order:', error)
      throw error
    }

    logger.info(`Checkout order ${orderId} marked as paid`)
  }

  // Update lead status if linked
  if (leadId) {
    const { error } = await supabaseAdmin
      .from('leads')
      .update({
        status: 'converted',
        converted_at: new Date().toISOString(),
        payment_status: 'paid',
        payment_provider: 'stripe',
        payment_id: session.payment_intent as string,
      })
      .eq('id', leadId)

    if (error) {
      logger.error('Error updating lead:', error)
    } else {
      logger.info(`Lead ${leadId} marked as converted`)
    }
  }

  // Update conversation state to 'paid' → 'contract_pending'
  if (conversationId) {
    const { error: convError } = await supabaseAdmin
      .from('conversations')
      .update({
        status: {
          state: 'paid',
          updated_at: new Date().toISOString(),
        },
        proposal: {
          payment_status: 'paid',
          payment_provider: 'stripe',
          payment_id: session.payment_intent as string,
          paid_at: new Date().toISOString(),
          paid_amount: session.amount_total,
        },
      })
      .eq('conversation_id', conversationId)

    if (convError) {
      logger.error('[Stripe] Error updating conversation:', convError)
    } else {
      logger.info(`[Stripe] Conversation ${conversationId} moved to paid state`)

      // Transition to contract_pending and trigger ClickSign after 1 second
      setTimeout(async () => {
        // First, get the full conversation data
        const { data: conversation, error: fetchError } = await supabaseAdmin
          .from('conversations')
          .select('*')
          .eq('conversation_id', conversationId)
          .single()

        if (fetchError || !conversation) {
          logger.error('[Stripe] Error fetching conversation:', fetchError)
          return
        }

        const { error: transitionError } = await supabaseAdmin
          .from('conversations')
          .update({
            status: {
              state: 'contract_pending',
              updated_at: new Date().toISOString(),
            },
          })
          .eq('conversation_id', conversationId)

        if (transitionError) {
          logger.error('[Stripe] Error transitioning to contract_pending:', transitionError)
        } else {
          logger.info(`[Stripe] Conversation ${conversationId} moved to contract_pending`)

          // Trigger ClickSign contract generation
          try {
            const { generateContractForConversation } = await import('@/lib/integrations/clicksign')

            const result = await generateContractForConversation({
              conversationId,
              clientName: conversation.client?.name || 'Cliente',
              clientEmail: conversation.client?.email || conversation.email || '',
              clientPhone: conversation.client?.phone || conversation.phone_number,
              clientCPF: conversation.client?.cpf,
              productName: conversation.classification?.product || 'Serviço Jurídico',
              amount: session.amount_total || 0,
              paymentProvider: 'stripe',
            })

            // Update conversation with ClickSign document key
            await supabaseAdmin
              .from('conversations')
              .update({
                proposal: {
                  ...conversation.proposal,
                  clicksign_document_key: result.documentKey,
                  clicksign_sign_url: result.signUrl,
                },
              })
              .eq('conversation_id', conversationId)

            logger.info(`[ClickSign] Contract generated for conversation ${conversationId}`)
          } catch (clicksignError) {
            logger.error('[ClickSign] Error generating contract:', clicksignError)
            // Don't fail the webhook, just log the error
          }
        }
      }, 1000)
    }
  }

  // Log the successful payment
  logger.info(`Payment confirmed for session ${session.id}, service: ${serviceId}`)
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  logger.info('Payment succeeded:', paymentIntent.id)

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
      logger.error('Error updating order on payment success:', error)
    } else {
      logger.info(`Order ${orderId} payment confirmed`)
    }
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  logger.info('Payment failed:', paymentIntent.id)

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
      logger.error('Error updating order on payment failure:', error)
    } else {
      logger.info(`Order ${orderId} marked as failed`)
    }
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  logger.info('Invoice paid:', invoice.id)

  // Update subscription or service status
  // await updateServiceStatus(invoice.customer as string, 'active')
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  logger.info('Invoice payment failed:', invoice.id)

  // Handle failed recurring payment
  // await notifyOfPaymentIssue(invoice.customer as string)
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  logger.info('Subscription created:', subscription.id)

  // Create subscription record
  // await createSubscriptionRecord({
  //   customerId: subscription.customer as string,
  //   subscriptionId: subscription.id,
  //   status: subscription.status,
  //   currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  // })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  logger.info('Subscription updated:', subscription.id)

  // Update subscription status
  // await updateSubscriptionStatus(subscription.id, subscription.status)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  logger.info('Subscription deleted:', subscription.id)

  // Mark subscription as cancelled
  // await cancelSubscription(subscription.id)
}

// Apply rate limiting
export const POST = withRateLimit(handler, { type: 'webhook', limit: 100 })
