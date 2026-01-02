import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { stripe } from '@/lib/payments/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'
import { logger } from '@/lib/logger'

const createSessionSchema = z.object({
  serviceId: z.string(),
  serviceName: z.string(),
  amount: z.number().positive(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  customerCpfCnpj: z.string().optional(),
  description: z.string().optional(),
  urgency: z.enum(['normal', 'urgent']).default('normal'),
})

async function handler(request: NextRequest) {
  try {
    logger.info('[DEBUG] STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? `EXISTS (${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...)` : 'NOT FOUND')

    const data = (request as any).validatedData

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: data.serviceName,
              description: data.description || `Serviço jurídico: ${data.serviceName}`,
            },
            unit_amount: Math.round(data.amount * 100), // Convert to centavos
          },
          quantity: 1,
        },
      ],
      customer_email: data.customerEmail,
      metadata: {
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerCpfCnpj: data.customerCpfCnpj || '',
        urgency: data.urgency,
      },
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    })

    // Save order to database
    const supabase = getSupabaseAdmin()
    const { error: dbError } = await supabase.from('checkout_orders').insert({
      service_id: data.serviceId,
      service_name: data.serviceName,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone,
      customer_cpf_cnpj: data.customerCpfCnpj,
      amount: data.amount,
      payment_method: 'credit_card' as const,
      payment_status: 'pending' as const,
      stripe_session_id: session.id,
      description: data.description,
      urgency: data.urgency,
    } as any)

    if (dbError) {
      logger.error('Database error:', dbError)
      // Don't fail the request if DB insert fails
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    logger.error('Stripe session creation error:', error)
    return NextResponse.json(
      {
        error: 'Erro ao criar sessão de pagamento',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

// Apply validation and rate limiting
export const POST = withRateLimit(
  withValidation(createSessionSchema, handler, { sanitize: true }),
  { type: 'checkout', limit: 10 }
)
