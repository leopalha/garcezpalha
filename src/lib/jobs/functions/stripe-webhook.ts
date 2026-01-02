/**
 * Inngest Function: Process Stripe Webhooks
 * Handles all Stripe events assíncronamente
 */

import { inngest } from '../inngest-client'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import Stripe from 'stripe'

// Lazy-loaded Stripe client to avoid build-time initialization errors
let stripeClient: Stripe | null = null
function getStripe(): Stripe {
  if (!stripeClient) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY not configured')
    }
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      // @ts-expect-error - Using stable API version
      apiVersion: '2024-11-20.acacia',
    })
  }
  return stripeClient
}

export const stripeWebhookHandler = inngest.createFunction(
  {
    id: 'stripe-webhook-processor',
    name: 'Process Stripe Webhook',
    retries: 3,
  },
  { event: 'stripe/webhook.received' },
  async ({ event, step }) => {
    const { eventId, type, payload } = event.data

    logger.info('Processing Stripe webhook', { eventId, type })

    // Step 1: Validate event with Stripe API
    const stripeEvent = await step.run('validate-event', async () => {
      try {
        return await getStripe().events.retrieve(eventId)
      } catch (error) {
        logger.error('Failed to validate Stripe event', { eventId, error })
        throw error
      }
    })

    // Step 2: Process based on event type
    const result = await step.run('process-event', async () => {
      const supabase = await createClient()

      switch (type) {
        case 'checkout.session.completed': {
          const session = payload as Stripe.Checkout.Session

          // Update payment record
          const { error: updateError } = await supabase
            .from('payments')
            .update({
              status: 'completed',
              stripe_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_session_id', session.id)

          if (updateError) {
            logger.error('Failed to update payment', { sessionId: session.id, error: updateError })
            throw updateError
          }

          // Create service record
          const { data: payment } = await supabase
            .from('payments')
            .select('user_id, product_id, amount')
            .eq('stripe_session_id', session.id)
            .single()

          if (payment) {
            const { error: serviceError } = await supabase
              .from('client_services')
              .insert({
                user_id: payment.user_id,
                product_id: payment.product_id,
                status: 'active',
                payment_amount: payment.amount,
                payment_method: 'stripe',
                start_date: new Date().toISOString(),
              })

            if (serviceError) {
              logger.error('Failed to create service', { error: serviceError })
            }

            // Send confirmation email
            await inngest.send({
              name: 'email/send',
              data: {
                to: session.customer_email!,
                subject: 'Pagamento Confirmado - Garcez Palha Advogados',
                template: 'payment-confirmation',
                variables: {
                  amount: payment.amount,
                  productId: payment.product_id,
                },
              },
            })

            // Send notification
            await inngest.send({
              name: 'notification/send',
              data: {
                userId: payment.user_id,
                type: 'payment',
                title: 'Pagamento Confirmado',
                message: 'Seu pagamento foi processado com sucesso!',
                link: '/dashboard/pagamentos',
                sendEmail: false,
              },
            })
          }

          return { success: true, type: 'checkout_completed' }
        }

        case 'payment_intent.succeeded': {
          const paymentIntent = payload as Stripe.PaymentIntent

          await supabase
            .from('payments')
            .update({
              status: 'completed',
              stripe_payment_intent_id: paymentIntent.id,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_payment_intent_id', paymentIntent.id)

          return { success: true, type: 'payment_succeeded' }
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = payload as Stripe.PaymentIntent

          await supabase
            .from('payments')
            .update({
              status: 'failed',
              error_message: paymentIntent.last_payment_error?.message || 'Payment failed',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_payment_intent_id', paymentIntent.id)

          // Schedule retry
          await inngest.send({
            name: 'payment/retry',
            data: {
              paymentId: paymentIntent.id,
              attempt: 1,
            },
          })

          return { success: true, type: 'payment_failed' }
        }

        case 'customer.subscription.created':
        case 'customer.subscription.updated': {
          const subscription = payload as Stripe.Subscription & {
            current_period_start: number
            current_period_end: number
          }

          await supabase
            .from('subscriptions')
            .upsert({
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
              updated_at: new Date().toISOString(),
            })

          return { success: true, type: 'subscription_updated' }
        }

        case 'customer.subscription.deleted': {
          const subscription = payload as Stripe.Subscription

          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              canceled_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id)

          return { success: true, type: 'subscription_canceled' }
        }

        default:
          logger.warn('Unhandled Stripe event type', { type })
          return { success: true, type: 'unhandled' }
      }
    })

    // Step 3: Log completion
    await step.run('log-completion', async () => {
      logger.info('Stripe webhook processed successfully', {
        eventId,
        type,
        result
      })
    })

    return result
  }
)
