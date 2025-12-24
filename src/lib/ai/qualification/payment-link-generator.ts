/**
 * Payment Link Generator
 * Generates payment links for qualified leads with dynamic pricing
 */

import type { QualificationResult, LeadCategory } from './types'

/**
 * Payment provider types
 */
export type PaymentProvider = 'mercadopago' | 'stripe'

/**
 * Payment method options
 */
export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'boleto' | 'all'

/**
 * Payment link configuration
 */
export interface PaymentLinkConfig {
  provider: PaymentProvider
  methods: PaymentMethod[]
  installments?: number
  discountPercentage?: number
  expirationHours?: number
  successUrl?: string
  cancelUrl?: string
}

/**
 * Generated payment link
 */
export interface PaymentLink {
  id: string
  url: string
  amount: number
  originalAmount: number
  discountApplied: number
  discountPercentage?: number
  provider: PaymentProvider
  methods: PaymentMethod[]
  installments: number
  expiresAt: Date
  metadata: {
    leadId: string
    productId: string
    category: LeadCategory
    qualificationScore: number
  }
}

/**
 * Payment discount tiers based on lead category
 */
const CATEGORY_DISCOUNTS: Record<LeadCategory, number> = {
  hot: 0,        // No discount needed - high urgency
  warm: 5,       // 5% discount to incentivize
  cold: 10,      // 10% discount to convert
  unqualified: 0 // No discount for unqualified
}

/**
 * Payment urgency (expiration hours) based on lead category
 */
const CATEGORY_EXPIRATION: Record<LeadCategory, number> = {
  hot: 24,       // 24 hours - create urgency
  warm: 72,      // 3 days
  cold: 168,     // 1 week
  unqualified: 48 // 2 days
}

/**
 * Default installment options by category
 */
const CATEGORY_INSTALLMENTS: Record<LeadCategory, number> = {
  hot: 1,        // Full payment for hot leads
  warm: 3,       // Up to 3x for warm
  cold: 6,       // Up to 6x for cold
  unqualified: 1 // Full payment only
}

/**
 * Generate payment link for a qualified lead
 */
export async function generatePaymentLink(
  result: QualificationResult,
  config?: Partial<PaymentLinkConfig>
): Promise<PaymentLink> {
  // Get category-based defaults
  const category = result.score.category
  const baseDiscount = CATEGORY_DISCOUNTS[category]
  const expirationHours = config?.expirationHours || CATEGORY_EXPIRATION[category]
  const installments = config?.installments || CATEGORY_INSTALLMENTS[category]

  // Calculate final discount
  const discountPercentage = config?.discountPercentage ?? baseDiscount
  const originalAmount = result.recommendedAction.estimatedFee || 0
  const discountAmount = Math.round(originalAmount * (discountPercentage / 100))
  const finalAmount = originalAmount - discountAmount

  // Default configuration
  const provider = config?.provider || 'mercadopago'
  const methods = config?.methods || ['all']

  // Generate link based on provider
  const paymentLink = await createProviderPaymentLink(
    provider,
    {
      amount: finalAmount,
      description: getPaymentDescription(result),
      metadata: {
        leadId: result.leadId,
        productId: result.productId,
        category: result.score.category,
        qualificationScore: result.score.total,
      },
      methods,
      installments,
      expirationHours,
      successUrl: config?.successUrl,
      cancelUrl: config?.cancelUrl,
    }
  )

  return {
    id: paymentLink.id,
    url: paymentLink.url,
    amount: finalAmount,
    originalAmount,
    discountApplied: discountAmount,
    provider,
    methods,
    installments,
    expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000),
    metadata: {
      leadId: result.leadId,
      productId: result.productId,
      category: result.score.category,
      qualificationScore: result.score.total,
    },
  }
}

/**
 * Generate payment description from qualification result
 */
function getPaymentDescription(result: QualificationResult): string {
  const productNames: Record<string, string> = {
    'desbloqueio-conta': 'Desbloqueio de Conta Bancária',
    'golpe-pix': 'Recuperação de Valores - Golpe PIX',
    'negativacao-indevida': 'Remoção de Negativação Indevida',
    'plano-saude': 'Ação contra Plano de Saúde',
    'cirurgia-bariatrica': 'Autorização de Cirurgia Bariátrica',
    'tratamento-tea': 'Cobertura de Tratamento TEA',
    'bpc-loas': 'BPC/LOAS - Benefício Assistencial',
    'aposentadoria': 'Aposentadoria INSS',
    'direito-imobiliario': 'Consultoria Imobiliária',
    'usucapiao': 'Usucapião',
    'holding-familiar': 'Constituição de Holding Familiar',
    'inventario': 'Inventário e Partilha',
    'avaliacao-imoveis': 'Avaliação de Imóveis',
    'pericia-documental': 'Perícia Documental',
    'grafotecnia': 'Perícia Grafotécnica',
    'direito-criminal': 'Defesa Criminal',
  }

  const productName = productNames[result.productId] || 'Serviço Jurídico'
  return `${productName} - Garcez Palha Advocacia`
}

/**
 * Create payment link with specific provider
 */
async function createProviderPaymentLink(
  provider: PaymentProvider,
  params: {
    amount: number
    description: string
    metadata: Record<string, any>
    methods: PaymentMethod[]
    installments: number
    expirationHours: number
    successUrl?: string
    cancelUrl?: string
  }
): Promise<{ id: string; url: string }> {
  switch (provider) {
    case 'mercadopago':
      return createMercadoPagoLink(params)
    case 'stripe':
      return createStripeLink(params)
    default:
      throw new Error(`Unsupported payment provider: ${provider}`)
  }
}

/**
 * Create MercadoPago payment link
 */
async function createMercadoPagoLink(params: {
  amount: number
  description: string
  metadata: Record<string, any>
  methods: PaymentMethod[]
  installments: number
  expirationHours: number
  successUrl?: string
  cancelUrl?: string
}): Promise<{ id: string; url: string }> {
  // Import MercadoPago client
  const { MercadoPagoConfig, Preference } = await import('mercadopago')

  // Get credentials from env
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured')
  }

  const client = new MercadoPagoConfig({ accessToken })
  const preference = new Preference(client)

  // Map payment methods
  const paymentMethods = mapMercadoPagoPaymentMethods(params.methods)

  // Create preference
  const response = await preference.create({
    body: {
      items: [
        {
          id: `item_${Date.now()}`,
          title: params.description,
          quantity: 1,
          unit_price: params.amount / 100, // Convert cents to reais
          currency_id: 'BRL',
        },
      ],
      payment_methods: paymentMethods,
      expires: true,
      expiration_date_to: new Date(
        Date.now() + params.expirationHours * 60 * 60 * 1000
      ).toISOString(),
      back_urls: {
        success: params.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
        failure: params.cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/cancelado`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/pendente`,
      },
      auto_return: 'approved',
      metadata: params.metadata,
      statement_descriptor: 'GARCEZ PALHA',
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  })

  return {
    id: response.id!,
    url: response.init_point!,
  }
}

/**
 * Map payment methods to MercadoPago format
 */
function mapMercadoPagoPaymentMethods(methods: PaymentMethod[]): any {
  if (methods.includes('all')) {
    return {
      excluded_payment_methods: [],
      excluded_payment_types: [],
    }
  }

  const mpMethods: string[] = []
  const mpTypes: string[] = []

  if (methods.includes('credit_card')) mpTypes.push('credit_card')
  if (methods.includes('debit_card')) mpTypes.push('debit_card')
  if (methods.includes('pix')) mpMethods.push('pix')
  if (methods.includes('boleto')) mpMethods.push('bolbradesco')

  return {
    excluded_payment_methods: [],
    excluded_payment_types: [],
    installments: methods.includes('credit_card') ? undefined : 1,
  }
}

/**
 * Create Stripe payment link
 */
async function createStripeLink(params: {
  amount: number
  description: string
  metadata: Record<string, any>
  methods: PaymentMethod[]
  installments: number
  expirationHours: number
  successUrl?: string
  cancelUrl?: string
}): Promise<{ id: string; url: string }> {
  // Import Stripe
  const Stripe = (await import('stripe')).default

  const apiKey = process.env.STRIPE_SECRET_KEY
  if (!apiKey) {
    throw new Error('STRIPE_SECRET_KEY not configured')
  }

  const stripe = new Stripe(apiKey, {
    apiVersion: '2025-10-29.clover',
  })

  // Create product (or get existing)
  const product = await stripe.products.create({
    name: params.description,
    metadata: params.metadata,
  })

  // Create price
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: params.amount,
    currency: 'brl',
    metadata: params.metadata,
  })

  // Create payment link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: price.id, quantity: 1 }],
    after_completion: {
      type: 'redirect',
      redirect: {
        url: params.successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pagamento/sucesso`,
      },
    },
    metadata: params.metadata,
    // Stripe doesn't support expiration on payment links
    // Would need to use checkout sessions for expiration
  })

  return {
    id: paymentLink.id,
    url: paymentLink.url,
  }
}

/**
 * Get recommended payment configuration for a lead category
 */
export function getRecommendedPaymentConfig(category: LeadCategory): PaymentLinkConfig {
  return {
    provider: 'mercadopago', // Default to MercadoPago for Brazil
    methods: ['all'],
    installments: CATEGORY_INSTALLMENTS[category],
    discountPercentage: CATEGORY_DISCOUNTS[category],
    expirationHours: CATEGORY_EXPIRATION[category],
  }
}

/**
 * Format payment link for WhatsApp message
 */
export function formatPaymentLinkForWhatsApp(
  paymentLink: PaymentLink,
  clientName: string
): string {
  const discount = paymentLink.discountApplied > 0
    ? `~R$ ${(paymentLink.originalAmount / 100).toFixed(2)}~ *R$ ${(paymentLink.amount / 100).toFixed(2)}*`
    : `*R$ ${(paymentLink.amount / 100).toFixed(2)}*`

  const installmentText = paymentLink.installments > 1
    ? `\n💳 Até *${paymentLink.installments}x* sem juros`
    : ''

  const expiresIn = Math.round(
    (paymentLink.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)
  )

  return `Olá ${clientName}! 👋

Preparamos uma proposta especial para você:

${discount}${installmentText}

⏰ Válido por *${expiresIn} horas*

Para garantir seu atendimento prioritário, finalize o pagamento em:
${paymentLink.url}

✅ Pagamento 100% seguro
✅ Atendimento imediato após confirmação
✅ Suporte completo durante todo o processo

Qualquer dúvida, estou à disposição!

*Garcez Palha Advocacia*
364 anos de tradição em Direito`
}

/**
 * Format payment link for email
 */
export function formatPaymentLinkForEmail(
  paymentLink: PaymentLink,
  clientName: string,
  productName: string
): { subject: string; html: string; text: string } {
  const discount = paymentLink.discountApplied > 0
    ? `<del>R$ ${(paymentLink.originalAmount / 100).toFixed(2)}</del> <strong>R$ ${(paymentLink.amount / 100).toFixed(2)}</strong>`
    : `<strong>R$ ${(paymentLink.amount / 100).toFixed(2)}</strong>`

  const installmentText = paymentLink.installments > 1
    ? `<li>Até <strong>${paymentLink.installments}x sem juros</strong></li>`
    : ''

  const expiresAt = paymentLink.expiresAt.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return {
    subject: `Proposta ${productName} - Garcez Palha`,
    html: `
      <h2>Olá ${clientName},</h2>

      <p>Preparamos uma proposta personalizada para <strong>${productName}</strong>:</p>

      <h3>Valor: ${discount}</h3>

      <ul>
        ${installmentText}
        <li>Pagamento 100% seguro</li>
        <li>Atendimento imediato após confirmação</li>
        <li>Válido até: <strong>${expiresAt}</strong></li>
      </ul>

      <p>
        <a href="${paymentLink.url}"
           style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
          Finalizar Pagamento
        </a>
      </p>

      <p>Qualquer dúvida, estamos à disposição.</p>

      <p>
        <strong>Garcez Palha Advocacia</strong><br>
        364 anos de tradição em Direito
      </p>
    `,
    text: `
Olá ${clientName},

Preparamos uma proposta personalizada para ${productName}:

Valor: R$ ${(paymentLink.amount / 100).toFixed(2)}
${paymentLink.installments > 1 ? `Até ${paymentLink.installments}x sem juros\n` : ''}
Válido até: ${expiresAt}

Para finalizar o pagamento, acesse:
${paymentLink.url}

Qualquer dúvida, estamos à disposição.

Garcez Palha Advocacia
364 anos de tradição em Direito
    `.trim(),
  }
}
