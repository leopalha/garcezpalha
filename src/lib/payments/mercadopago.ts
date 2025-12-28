import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'

let mpClient: MercadoPagoConfig | null = null

export function getMercadoPago(): MercadoPagoConfig {
  if (!mpClient) {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('MERCADOPAGO_ACCESS_TOKEN environment variable is not set')
    }
    mpClient = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    })
  }
  return mpClient
}

export function isMercadoPagoConfigured(): boolean {
  return !!process.env.MERCADOPAGO_ACCESS_TOKEN
}

// Backward compatibility: export client directly
// @deprecated Use getMercadoPago() and create your own Payment instance
export const paymentClient = new Payment(getMercadoPago())

export interface CreatePixPaymentParams {
  clientId: string
  invoiceId: string
  amount: number
  description: string
  payerEmail: string
  payerName: string
  payerCpf: string
}

export interface PixPaymentResult {
  id: number
  status: string
  qrCode: string
  qrCodeBase64: string
  expirationDate: string
}

export async function createPixPayment(
  params: CreatePixPaymentParams
): Promise<PixPaymentResult> {
  const client = getMercadoPago()
  const payment = new Payment(client)

  const response = await payment.create({
    body: {
      transaction_amount: params.amount,
      description: params.description,
      payment_method_id: 'pix',
      payer: {
        email: params.payerEmail,
        first_name: params.payerName.split(' ')[0],
        last_name: params.payerName.split(' ').slice(1).join(' ') || params.payerName,
        identification: {
          type: 'CPF',
          number: params.payerCpf.replace(/\D/g, ''),
        },
      },
      metadata: {
        client_id: params.clientId,
        invoice_id: params.invoiceId,
      },
    },
  })

  const pointOfInteraction = response.point_of_interaction as {
    transaction_data?: {
      qr_code?: string
      qr_code_base64?: string
    }
  }

  if (!response.id || !pointOfInteraction?.transaction_data?.qr_code) {
    throw new Error('Failed to create PIX payment')
  }

  return {
    id: response.id,
    status: response.status || 'pending',
    qrCode: pointOfInteraction.transaction_data.qr_code,
    qrCodeBase64: pointOfInteraction.transaction_data.qr_code_base64 || '',
    expirationDate: response.date_of_expiration || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
  }
}

export interface CreatePreferenceParams {
  clientId: string
  invoiceId: string
  amount: number
  description: string
  payerEmail: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
}

export async function createPreference(
  params: CreatePreferenceParams
): Promise<{ id: string; initPoint: string }> {
  const client = getMercadoPago()
  const preference = new Preference(client)

  const response = await preference.create({
    body: {
      items: [
        {
          id: params.invoiceId,
          title: params.description,
          quantity: 1,
          unit_price: params.amount,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: params.payerEmail,
      },
      back_urls: {
        success: params.successUrl,
        failure: params.failureUrl,
        pending: params.pendingUrl,
      },
      auto_return: 'approved',
      metadata: {
        client_id: params.clientId,
        invoice_id: params.invoiceId,
      },
      payment_methods: {
        excluded_payment_types: [],
        installments: 12,
      },
    },
  })

  if (!response.id || !response.init_point) {
    throw new Error('Failed to create preference')
  }

  return {
    id: response.id,
    initPoint: response.init_point,
  }
}

export async function getPaymentStatus(paymentId: number): Promise<{
  status: string
  statusDetail: string
  invoiceId: string | null
  clientId: string | null
}> {
  const client = getMercadoPago()
  const payment = new Payment(client)

  const response = await payment.get({ id: paymentId })

  const metadata = response.metadata as Record<string, string> | undefined

  return {
    status: response.status || 'unknown',
    statusDetail: response.status_detail || '',
    invoiceId: metadata?.invoice_id || null,
    clientId: metadata?.client_id || null,
  }
}
