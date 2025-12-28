import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-10-29.clover',
    })
  }
  return stripeInstance
}

export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY
}

// Backward compatibility: export instance directly
// @deprecated Use getStripe() instead
export const stripe = getStripe()

export interface CreateCheckoutSessionParams {
  clientId: string
  invoiceId: string
  amount: number
  description: string
  customerEmail: string
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<{ url: string; sessionId: string }> {
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: params.customerEmail,
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: params.description,
            description: `Fatura #${params.invoiceId}`,
          },
          unit_amount: Math.round(params.amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      clientId: params.clientId,
      invoiceId: params.invoiceId,
    },
    success_url: params.successUrl,
    cancel_url: params.cancelUrl,
  })

  if (!session.url) {
    throw new Error('Failed to create checkout session')
  }

  return {
    url: session.url,
    sessionId: session.id,
  }
}

export async function verifyPayment(sessionId: string): Promise<{
  paid: boolean
  invoiceId: string | null
  clientId: string | null
}> {
  const stripe = getStripe()

  const session = await stripe.checkout.sessions.retrieve(sessionId)

  return {
    paid: session.payment_status === 'paid',
    invoiceId: (session.metadata?.invoiceId as string) || null,
    clientId: (session.metadata?.clientId as string) || null,
  }
}

export async function createPaymentIntent(
  amount: number,
  currency: string = 'brl',
  metadata: Record<string, string> = {}
): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const stripe = getStripe()

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
  })

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to create payment intent')
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  }
}
