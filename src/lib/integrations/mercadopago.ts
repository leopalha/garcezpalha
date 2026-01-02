/**
 * MercadoPago Integration
 * PIX and Payment Links
 */

import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
  options: {
    timeout: 5000,
  },
})

const payment = new Payment(client)
const preference = new Preference(client)

export interface CreatePixPaymentParams {
  amount: number // in cents
  email: string
  description: string
  externalReference: string // proposalId or orderId
}

export interface CreatePaymentLinkParams {
  amount: number // in cents
  title: string
  description: string
  email: string
  externalReference: string
}

/**
 * Create PIX payment
 */
export async function createPixPayment(params: CreatePixPaymentParams) {
  try {
    const paymentData = {
      transaction_amount: params.amount / 100, // Convert cents to reais
      description: params.description,
      payment_method_id: 'pix',
      payer: {
        email: params.email,
      },
      external_reference: params.externalReference,
    }

    const result = await payment.create({ body: paymentData })

    return {
      success: true,
      paymentId: result.id,
      pixCode: result.point_of_interaction?.transaction_data?.qr_code,
      pixBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      ticketUrl: result.point_of_interaction?.transaction_data?.ticket_url,
    }
  } catch (error) {
    console.error('[MercadoPago] Error creating PIX payment:', error)
    throw new Error('Failed to create PIX payment')
  }
}

/**
 * Create payment preference (payment link)
 */
export async function createPaymentLink(params: CreatePaymentLinkParams) {
  try {
    const preferenceData = {
      items: [
        {
          id: params.externalReference,
          title: params.title,
          description: params.description,
          quantity: 1,
          unit_price: params.amount / 100, // Convert cents to reais
        },
      ],
      payer: {
        email: params.email,
      },
      external_reference: params.externalReference,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
      },
      auto_return: 'approved' as const,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    }

    const result = await preference.create({ body: preferenceData })

    return {
      success: true,
      preferenceId: result.id,
      initPoint: result.init_point, // Payment link URL
      sandboxInitPoint: result.sandbox_init_point,
    }
  } catch (error) {
    console.error('[MercadoPago] Error creating payment link:', error)
    throw new Error('Failed to create payment link')
  }
}

/**
 * Get payment status
 */
export async function getPaymentStatus(paymentId: string | number) {
  try {
    const result = await payment.get({ id: String(paymentId) })

    return {
      success: true,
      status: result.status,
      statusDetail: result.status_detail,
      amount: result.transaction_amount,
      externalReference: result.external_reference,
      dateApproved: result.date_approved,
    }
  } catch (error) {
    console.error('[MercadoPago] Error getting payment status:', error)
    throw new Error('Failed to get payment status')
  }
}
