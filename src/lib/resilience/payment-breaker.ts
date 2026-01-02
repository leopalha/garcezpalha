/**
 * Circuit Breaker for Payment Providers
 * Fallback strategy: Stripe → MercadoPago (or vice-versa based on primary)
 */

import { createCircuitBreaker } from './circuit-breaker'
import { logger } from '@/lib/logger'
import Stripe from 'stripe'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Initialize clients
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-expect-error - Using stable API version
  apiVersion: '2024-11-20.acacia',
})

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})
const preferenceAPI = new Preference(mpClient)

// Types
interface CreateCheckoutParams {
  amount: number
  currency: string
  successUrl: string
  cancelUrl: string
  metadata: Record<string, any>
  customerEmail?: string
  mode?: 'payment' | 'subscription' // Added for Stripe subscription support
  customerId?: string // Added for existing Stripe customers
  lineItems?: Array<{ price: string; quantity: number }> // For Stripe price IDs
}

/**
 * Create Stripe Checkout Session
 * Supports both payment and subscription modes
 */
async function createStripeCheckout(params: CreateCheckoutParams) {
  logger.info('Creating Stripe checkout', {
    amount: params.amount,
    mode: params.mode || 'payment'
  })

  // Use provided line items (for subscriptions) or create price_data (for one-time)
  const lineItems = params.lineItems || [
    {
      price_data: {
        currency: params.currency,
        product_data: {
          name: params.metadata.productName || 'Legal Service',
        },
        unit_amount: params.amount,
      },
      quantity: 1,
    },
  ]

  const session = await stripe.checkout.sessions.create({
    customer: params.customerId, // Use existing customer if provided
    payment_method_types: ['card'],
    line_items: lineItems as any,
    mode: params.mode || 'payment',
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
    customer_email: params.customerId ? undefined : params.customerEmail, // Only if no customer
    metadata: params.metadata,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    tax_id_collection: {
      enabled: true,
    },
  })

  return {
    id: session.id,
    url: session.url!,
    provider: 'stripe' as const,
  }
}

/**
 * Create MercadoPago Checkout Preference
 */
async function createMercadoPagoCheckout(params: CreateCheckoutParams) {
  logger.info('Creating MercadoPago checkout', { amount: params.amount })

  const preference = await preferenceAPI.create({
    body: {
      items: [
        {
          id: `item-${Date.now()}`,
          title: params.metadata.productName || 'Legal Service',
          quantity: 1,
          unit_price: params.amount / 100, // MercadoPago uses decimal
          currency_id: params.currency.toUpperCase(),
        },
      ],
      back_urls: {
        success: params.successUrl,
        failure: params.cancelUrl,
        pending: params.successUrl,
      },
      auto_return: 'approved',
      metadata: params.metadata,
      payer: params.customerEmail
        ? {
            email: params.customerEmail,
          }
        : undefined,
    },
  })

  return {
    id: preference.id!,
    url: preference.init_point!,
    provider: 'mercadopago' as const,
  }
}

/**
 * Circuit Breaker for Stripe
 */
export const stripeCheckoutBreaker = createCircuitBreaker(
  createStripeCheckout,
  {
    name: 'stripe-checkout',
    timeout: 15000, // 15s
    errorThresholdPercentage: 50,
    resetTimeout: 60000, // 1min
    volumeThreshold: 3,
  },
  async (params) => {
    logger.warn('Stripe failed, falling back to MercadoPago')
    return await mercadoPagoCheckoutBreaker.fire(params)
  }
)

/**
 * Circuit Breaker for MercadoPago
 */
export const mercadoPagoCheckoutBreaker = createCircuitBreaker(
  createMercadoPagoCheckout,
  {
    name: 'mercadopago-checkout',
    timeout: 15000, // 15s
    errorThresholdPercentage: 50,
    resetTimeout: 60000, // 1min
    volumeThreshold: 3,
  },
  async (params) => {
    logger.error('Both payment providers failed')
    throw new Error('Payment gateway unavailable. Please try again later.')
  }
)

/**
 * Smart Payment Checkout with automatic fallback
 * @param preferredProvider - 'stripe' or 'mercadopago'
 */
export async function createCheckoutWithFallback(
  params: CreateCheckoutParams,
  preferredProvider: 'stripe' | 'mercadopago' = 'stripe'
) {
  try {
    if (preferredProvider === 'stripe') {
      return await stripeCheckoutBreaker.fire(params)
    } else {
      return await mercadoPagoCheckoutBreaker.fire(params)
    }
  } catch (error) {
    logger.error('Payment checkout creation failed', { error })
    throw error
  }
}

/**
 * Get Payment Circuit Breaker Stats
 */
export function getPaymentCircuitBreakerStats() {
  return {
    stripe: stripeCheckoutBreaker.status.stats,
    mercadopago: mercadoPagoCheckoutBreaker.status.stats,
  }
}
