import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'
import { withValidation } from '@/lib/validations/api-middleware'
import { stripeCheckoutSchema } from '@/lib/validations/payments'
import { withRateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

/**
 * POST /api/stripe/checkout
 * Cria uma Stripe Checkout Session para assinatura
 *
 * SECURITY:
 * - Zod validation (P1-010)
 * - Rate limiting: 10 checkout attempts per hour
 * - Authentication required
 * - Input sanitization
 */
async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Autenticação
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId, planId, billingCycle, customerDetails, addons } = (request as any).validatedData

    // Get user details
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user already has a Stripe customer ID
    let customerId = user.stripe_customer_id

    if (!customerId) {
      // Create Stripe customer with details from checkout form
      const customer = await stripe.customers.create({
        email: customerDetails?.email || session.user.email!,
        name: customerDetails?.name || user.name || undefined,
        phone: customerDetails?.phone || undefined,
        metadata: {
          user_id: session.user.id,
          tenant_id: user.tenant_id || '',
          company_name: customerDetails?.companyName || '',
          tax_id: customerDetails?.taxId || '',
        },
      })

      customerId = customer.id

      // Update user with Stripe customer ID and additional info
      await supabase
        .from('users')
        .update({
          stripe_customer_id: customerId,
          name: customerDetails?.name || user.name,
          phone: customerDetails?.phone || user.phone,
        })
        .eq('id', session.user.id)
    }

    // Build line items (plan + addons)
    const lineItems = [
      {
        price: priceId,
        quantity: 1,
      },
    ]

    // Add addon line items if any
    // NOTE: Addon price IDs should be created in Stripe and mapped here
    if (addons && addons.length > 0) {
      const addonPriceIds: Record<string, string> = {
        'nicho-extra': process.env.NEXT_PUBLIC_STRIPE_PRICE_ADDON_NICHO || 'price_addon_nicho',
        'catalogo': process.env.NEXT_PUBLIC_STRIPE_PRICE_ADDON_CATALOGO || 'price_addon_catalogo',
      }

      addons.forEach((addonId) => {
        if (addonPriceIds[addonId]) {
          lineItems.push({
            price: addonPriceIds[addonId],
            quantity: 1,
          })
        }
      })
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/checkout?plan=${planId}`,
      metadata: {
        user_id: session.user.id,
        plan_id: planId,
        billing_cycle: billingCycle,
        addons: addons?.join(',') || '',
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      tax_id_collection: {
        enabled: true,
      },
    })

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Apply validation, sanitization, and rate limiting
export const POST = withRateLimit(
  withValidation(stripeCheckoutSchema, handler, { sanitize: true }),
  { type: 'checkout', limit: 10 } // 10 checkout attempts per hour
)
