import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/payments/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { withRateLimit } from '@/lib/rate-limit'
import Stripe from 'stripe'
import { PerformanceTimer, trackApiCall, trackError, trackConversion } from '@/lib/monitoring/observability'
import { logger } from '@/lib/logger'

async function handler(request: NextRequest) {
  const timer = new PerformanceTimer('POST /api/stripe/webhook')

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    timer.end()
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    timer.end()
    logger.error('STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    timer.end()
    trackError(error as Error, { endpoint: '/api/stripe/webhook', type: 'signature_verification' })
    logger.error('Webhook signature verification failed:', error)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = getSupabaseAdmin()

  try {
    switch (event.type) {
      // =============== SUBSCRIPTION EVENTS ===============
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Extract metadata
        const userId = subscription.metadata.user_id
        const planId = subscription.metadata.plan_id
        const billingCycle = subscription.metadata.billing_cycle || 'monthly'

        if (!userId) {
          logger.error('Missing user_id in subscription metadata')
          break
        }

        // Get subscription item details
        const subscriptionItem = subscription.items.data[0]
        const priceId = subscriptionItem.price.id

        // Upsert subscription record
        const subAny = subscription as any
        const { error: subError } = await (supabase as any)
          .from('subscriptions')
          .upsert({
            id: subscription.id,
            user_id: userId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            plan_id: planId,
            billing_cycle: billingCycle,
            status: subscription.status as any,
            current_period_start: new Date(subAny.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subAny.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          } as any)

        if (subError) {
          logger.error('Failed to upsert subscription:', subError)
          break
        }

        // Update user's current plan
        await supabase
          .from('users')
          .update({ current_plan: planId } as any)
          .eq('id', userId)

        logger.info(`Subscription ${event.type === 'customer.subscription.created' ? 'created' : 'updated'}: ${subscription.id}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id

        // Update subscription status
        await (supabase as any)
          .from('subscriptions')
          .update({
            status: 'canceled' as any,
            canceled_at: new Date().toISOString(),
          } as any)
          .eq('stripe_subscription_id', subscription.id)

        // Downgrade user to free plan
        if (userId) {
          await supabase
            .from('users')
            .update({ current_plan: 'free' } as any)
            .eq('id', userId)
        }

        logger.info(`Subscription deleted: ${subscription.id}`)
        break
      }

      // =============== INVOICE EVENTS ===============
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceAny = invoice as any

        if (invoiceAny.subscription) {
          // Record invoice in database
          await (supabase as any)
            .from('invoices')
            .upsert({
              id: invoice.id,
              subscription_id: invoiceAny.subscription as string,
              stripe_invoice_id: invoice.id,
              amount_paid: invoice.amount_paid,
              amount_due: invoice.amount_due,
              currency: invoice.currency,
              status: (invoice.status || 'paid') as any,
              invoice_pdf: invoice.invoice_pdf,
              hosted_invoice_url: invoice.hosted_invoice_url,
              period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
              period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
              paid_at: new Date().toISOString(),
            } as any)

          // Update subscription payment status
          await (supabase as any)
            .from('subscriptions')
            .update({ status: 'active' } as any)
            .eq('stripe_subscription_id', invoiceAny.subscription)

          logger.info(`Invoice paid: ${invoice.id}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const invoiceAny = invoice as any

        if (invoiceAny.subscription) {
          // Record failed invoice
          await (supabase as any)
            .from('invoices')
            .upsert({
              id: invoice.id,
              subscription_id: invoiceAny.subscription as string,
              stripe_invoice_id: invoice.id,
              amount_paid: invoice.amount_paid,
              amount_due: invoice.amount_due,
              currency: invoice.currency,
              status: 'payment_failed' as any,
              invoice_pdf: invoice.invoice_pdf,
              hosted_invoice_url: invoice.hosted_invoice_url,
              period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
              period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
            } as any)

          // Update subscription status
          await (supabase as any)
            .from('subscriptions')
            .update({ status: 'past_due' } as any)
            .eq('stripe_subscription_id', invoiceAny.subscription)

          logger.info(`Invoice payment failed: ${invoice.id}`)
        }
        break
      }

      // =============== PAYMENT METHOD EVENTS ===============
      case 'payment_method.attached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod

        if (paymentMethod.customer) {
          // Find user by stripe_customer_id
          const { data: user } = await supabase
            .from('users')
            .select('id')
            .eq('stripe_customer_id', paymentMethod.customer)
            .single()

          if (user) {
            await (supabase as any)
              .from('payment_methods')
              .upsert({
                id: paymentMethod.id,
                user_id: user.id,
                stripe_payment_method_id: paymentMethod.id,
                type: paymentMethod.type,
                card_brand: paymentMethod.card?.brand,
                card_last4: paymentMethod.card?.last4,
                card_exp_month: paymentMethod.card?.exp_month,
                card_exp_year: paymentMethod.card?.exp_year,
                is_default: true, // Set as default when attached
              } as any)

            logger.info(`Payment method attached: ${paymentMethod.id}`)
          }
        }
        break
      }

      case 'payment_method.detached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod

        await (supabase as any)
          .from('payment_methods')
          .delete()
          .eq('stripe_payment_method_id', paymentMethod.id)

        logger.info(`Payment method detached: ${paymentMethod.id}`)
        break
      }

      // =============== CHECKOUT EVENTS (Legacy) ===============
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Handle product checkout (legacy)
        if (session.mode === 'payment') {
          const { error } = await (supabase as any)
            .from('checkout_orders')
            .update({
              payment_status: 'paid' as any,
              paid_at: new Date().toISOString(),
            } as any)
            .eq('stripe_session_id', session.id)

          if (error) {
            logger.error('Database update error:', error)
          }
        }

        logger.info(`Checkout session completed: ${session.id}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        await (supabase as any)
          .from('checkout_orders')
          .update({
            payment_status: 'cancelled' as any,
          } as any)
          .eq('stripe_session_id', session.id)

        logger.info(`Session expired: ${session.id}`)
        break
      }

      default:
        logger.info(`Unhandled event type: ${event.type}`)
    }

    const duration = timer.end()
    trackApiCall('/api/stripe/webhook', duration, 200, { eventType: event.type })

    return NextResponse.json({ received: true })
  } catch (error) {
    timer.end()
    trackError(error as Error, { endpoint: '/api/stripe/webhook', eventType: event.type })
    logger.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Apply rate limiting for webhook
export const POST = withRateLimit(handler, { type: 'webhook', limit: 100 })
