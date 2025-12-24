/**
 * Stripe Client Configuration
 * Handles server-side Stripe operations
 */

import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

// Lazy initialization of Stripe client
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }

    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-10-29.clover',
      typescript: true,
    })
  }

  return stripeInstance
}

// Backward compatibility
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripe() as any)[prop]
  }
})

/**
 * Get Stripe publishable key for client-side
 */
export function getStripePublishableKey(): string {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set')
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
}
