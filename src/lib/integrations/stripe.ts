/**
 * Stripe Integration
 * Payment Links and Checkout Sessions
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})

export interface CreatePaymentLinkParams {
  amount: number // in cents
  productName: string
  description: string
  customerEmail: string
  metadata: Record<string, string>
}

export interface CreateCheckoutSessionParams {
  amount: number // in cents
  productName: string
  description: string
  customerEmail: string
  successUrl: string
  cancelUrl: string
  metadata: Record<string, string>
}

/**
 * Create Payment Link
 */
export async function createPaymentLink(params: CreatePaymentLinkParams) {
  try {
    // Create product
    const product = await stripe.products.create({
      name: params.productName,
      description: params.description,
    })

    // Create price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: params.amount,
      currency: 'brl',
    })

    // Create payment link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
      after_completion: {
        type: 'redirect',
        redirect: { url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success` },
      },
      metadata: params.metadata,
    })

    return {
      success: true,
      paymentLinkId: paymentLink.id,
      url: paymentLink.url,
      active: paymentLink.active,
    }
  } catch (error) {
    console.error('[Stripe] Error creating payment link:', error)
    throw new Error('Failed to create payment link')
  }
}

/**
 * Create Checkout Session
 */
export async function createCheckoutSession(params: CreateCheckoutSessionParams) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: params.productName,
              description: params.description,
            },
            unit_amount: params.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      customer_email: params.customerEmail,
      metadata: params.metadata,
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url,
    }
  } catch (error) {
    console.error('[Stripe] Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

/**
 * Get payment intent status
 */
export async function getPaymentIntentStatus(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return {
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    }
  } catch (error) {
    console.error('[Stripe] Error retrieving payment intent:', error)
    throw new Error('Failed to retrieve payment intent')
  }
}

/**
 * Verify webhook signature
 */
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error('[Stripe] Webhook signature verification failed:', error)
    throw new Error('Webhook signature verification failed')
  }
}
