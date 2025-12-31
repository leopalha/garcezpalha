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
      // =============== SUBSCRIPTION EVENTS ===============
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription

        // Extract metadata
        const userId = subscription.metadata.user_id
        const planId = subscription.metadata.plan_id
        const billingCycle = subscription.metadata.billing_cycle || 'monthly'

        if (!userId) {
          console.error('Missing user_id in subscription metadata')
          break
        }

        // Get subscription item details
        const subscriptionItem = subscription.items.data[0]
        const priceId = subscriptionItem.price.id

        // Upsert subscription record
        const { error: subError } = await supabase
          .from('subscriptions')
          .upsert({
            id: subscription.id,
            user_id: userId,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            plan_id: planId,
            billing_cycle: billingCycle,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
            trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
          })

        if (subError) {
          console.error('Failed to upsert subscription:', subError)
          break
        }

        // Update user's current plan
        await supabase
          .from('users')
          .update({ current_plan: planId })
          .eq('id', userId)

        console.log(`Subscription ${event.type === 'customer.subscription.created' ? 'created' : 'updated'}: ${subscription.id}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.user_id

        // Update subscription status
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        // Downgrade user to free plan
        if (userId) {
          await supabase
            .from('users')
            .update({ current_plan: 'free' })
            .eq('id', userId)
        }

        console.log(`Subscription deleted: ${subscription.id}`)
        break
      }

      // =============== INVOICE EVENTS ===============
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          // Record invoice in database
          await supabase
            .from('invoices')
            .upsert({
              id: invoice.id,
              subscription_id: invoice.subscription as string,
              stripe_invoice_id: invoice.id,
              amount_paid: invoice.amount_paid,
              amount_due: invoice.amount_due,
              currency: invoice.currency,
              status: invoice.status || 'paid',
              invoice_pdf: invoice.invoice_pdf,
              hosted_invoice_url: invoice.hosted_invoice_url,
              period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
              period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
              paid_at: new Date().toISOString(),
            })

          // Update subscription payment status
          await supabase
            .from('subscriptions')
            .update({ status: 'active' })
            .eq('stripe_subscription_id', invoice.subscription)

          console.log(`Invoice paid: ${invoice.id}`)
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription) {
          // Record failed invoice
          await supabase
            .from('invoices')
            .upsert({
              id: invoice.id,
              subscription_id: invoice.subscription as string,
              stripe_invoice_id: invoice.id,
              amount_paid: invoice.amount_paid,
              amount_due: invoice.amount_due,
              currency: invoice.currency,
              status: 'payment_failed',
              invoice_pdf: invoice.invoice_pdf,
              hosted_invoice_url: invoice.hosted_invoice_url,
              period_start: invoice.period_start ? new Date(invoice.period_start * 1000).toISOString() : null,
              period_end: invoice.period_end ? new Date(invoice.period_end * 1000).toISOString() : null,
            })

          // Update subscription status
          await supabase
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription)

          console.log(`Invoice payment failed: ${invoice.id}`)
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
            await supabase
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
              })

            console.log(`Payment method attached: ${paymentMethod.id}`)
          }
        }
        break
      }

      case 'payment_method.detached': {
        const paymentMethod = event.data.object as Stripe.PaymentMethod

        await supabase
          .from('payment_methods')
          .delete()
          .eq('stripe_payment_method_id', paymentMethod.id)

        console.log(`Payment method detached: ${paymentMethod.id}`)
        break
      }

      // =============== CHECKOUT EVENTS (Legacy) ===============
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session

        // Handle product checkout (legacy)
        if (session.mode === 'payment') {
          const { error } = await supabase
            .from('checkout_orders')
            .update({
              payment_status: 'paid',
              paid_at: new Date().toISOString(),
            })
            .eq('stripe_session_id', session.id)

          if (error) {
            console.error('Database update error:', error)
          }
        }

        console.log(`Checkout session completed: ${session.id}`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session

        await supabase
          .from('checkout_orders')
          .update({
            payment_status: 'cancelled',
          })
          .eq('stripe_session_id', session.id)

        console.log(`Session expired: ${session.id}`)
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
