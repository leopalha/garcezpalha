import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { paymentClient, isMercadoPagoConfigured } from '@/lib/payments/mercadopago'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { withValidation } from '@/lib/validations/api-middleware'

const createPaymentSchema = z.object({
  serviceId: z.string(),
  serviceName: z.string(),
  amount: z.number().positive(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string(),
  customerCpfCnpj: z.string().min(11),
  description: z.string().optional(),
  urgency: z.enum(['normal', 'urgent']).default('normal'),
})

async function handler(request: NextRequest) {
  try {
    // Authentication check
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user to validate tenant_id
    const { data: user } = await supabase
      .from('users')
      .select('id, tenant_id')
      .eq('id', session.user.id)
      .single()

    if (!user || !user.tenant_id) {
      return NextResponse.json({ error: 'User or tenant not found' }, { status: 404 })
    }

    if (!isMercadoPagoConfigured() || !paymentClient) {
      return NextResponse.json(
        { error: 'MercadoPago não está configurado' },
        { status: 500 }
      )
    }

    const data = (request as any).validatedData

    // Create PIX payment
    const payment = await paymentClient.create({
      body: {
        transaction_amount: data.amount,
        description: data.description || `${data.serviceName} - Garcez Palha`,
        payment_method_id: 'pix',
        payer: {
          email: data.customerEmail,
          first_name: data.customerName.split(' ')[0],
          last_name: data.customerName.split(' ').slice(1).join(' ') || data.customerName.split(' ')[0],
          identification: {
            type: data.customerCpfCnpj.length === 11 ? 'CPF' : 'CNPJ',
            number: data.customerCpfCnpj.replace(/\D/g, ''),
          },
        },
        metadata: {
          service_id: data.serviceId,
          service_name: data.serviceName,
          urgency: data.urgency,
        },
      },
    })

    if (!payment.id || !payment.point_of_interaction?.transaction_data) {
      throw new Error('Failed to create PIX payment')
    }

    const pixData = payment.point_of_interaction.transaction_data
    const qrCode = pixData.qr_code
    const qrCodeBase64 = pixData.qr_code_base64

    // Save order to database with tenant isolation
    const { data: order, error: dbError } = await supabase
      .from('checkout_orders')
      .insert({
        tenant_id: user.tenant_id,
        user_id: session.user.id,
        service_id: data.serviceId,
        service_name: data.serviceName,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        customer_cpf_cnpj: data.customerCpfCnpj,
        amount: data.amount,
        payment_method: 'pix',
        payment_status: 'pending',
        mercadopago_payment_id: payment.id.toString(),
        description: data.description,
        urgency: data.urgency,
        metadata: {
          qr_code: qrCode,
          qr_code_base64: qrCodeBase64,
          expiration_date: pixData.ticket_url,
        },
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return NextResponse.json({
      paymentId: payment.id,
      status: payment.status,
      qrCode,
      qrCodeBase64,
      orderId: order?.id,
    })
  } catch (error) {
    console.error('MercadoPago payment creation error:', error)
    return NextResponse.json(
      {
        error: 'Erro ao criar pagamento PIX',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      },
      { status: 500 }
    )
  }
}

// Apply validation and rate limiting
export const POST = withRateLimit(
  withValidation(createPaymentSchema, handler, { sanitize: true }),
  { type: 'checkout', limit: 10 }
)
