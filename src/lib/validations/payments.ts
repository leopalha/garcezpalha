/**
 * Payments API Validation Schemas
 * CRITICAL: All payment-related endpoints must use these schemas
 */

import { z } from 'zod'
import { emailSchema, nameSchema, phoneSchema, cpfCnpjSchema } from './common'

// ==================== STRIPE ====================

export const stripeCheckoutSchema = z.object({
  priceId: z.string().startsWith('price_', 'Invalid Stripe price ID'),
  planId: z.enum(['starter', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'yearly']),
  customerDetails: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: phoneSchema.optional(),
    taxId: cpfCnpjSchema.optional(),
    companyName: z.string().max(200).optional(),
  }),
  addons: z.array(z.string()).max(10).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

export const stripeWebhookSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
  created: z.number(),
  livemode: z.boolean(),
})

// ==================== MERCADOPAGO ====================

export const mercadoPagoCheckoutSchema = z.object({
  items: z.array(
    z.object({
      title: z.string().min(1).max(256),
      quantity: z.number().int().positive(),
      currency_id: z.literal('BRL'),
      unit_price: z.number().positive().multipleOf(0.01), // cents precision
    })
  ).min(1).max(100),
  payer: z.object({
    name: nameSchema,
    email: emailSchema,
    phone: z.object({
      area_code: z.string().regex(/^\d{2}$/),
      number: z.string().regex(/^\d{8,9}$/),
    }).optional(),
    identification: z.object({
      type: z.enum(['CPF', 'CNPJ']),
      number: z.string(),
    }).optional(),
  }),
  back_urls: z.object({
    success: z.string().url(),
    failure: z.string().url(),
    pending: z.string().url(),
  }).optional(),
  notification_url: z.string().url().optional(),
  external_reference: z.string().max(256).optional(),
})

export const mercadoPagoWebhookSchema = z.object({
  id: z.number(),
  live_mode: z.boolean(),
  type: z.string(),
  date_created: z.string().datetime(),
  user_id: z.number(),
  api_version: z.string(),
  action: z.string(),
  data: z.object({
    id: z.string(),
  }),
})

// ==================== CLICKSIGN ====================

export const clicksignDocumentSchema = z.object({
  path: z.string().url(), // Document URL
  template: z.object({
    key: z.string(),
  }).optional(),
  signers: z.array(
    z.object({
      name: nameSchema,
      email: emailSchema,
      documentation: cpfCnpjSchema.optional(),
      birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      has_documentation: z.boolean().optional(),
      phone_number: phoneSchema.optional(),
      auths: z.array(z.enum(['email', 'sms', 'api', 'whatsapp'])).optional(),
      delivery: z.enum(['email', 'sms', 'whatsapp']).optional(),
    })
  ).min(1).max(100),
  message: z.string().max(5000).optional(),
  skip_email: z.boolean().optional(),
  auto_close: z.boolean().optional(),
})

export const clicksignWebhookSchema = z.object({
  event: z.object({
    name: z.string(),
    occurred_at: z.string().datetime(),
  }),
  document: z.object({
    key: z.string(),
    status: z.enum(['running', 'closed', 'canceled']),
  }),
  user: z.object({
    key: z.string(),
    email: emailSchema,
  }).optional(),
})

// ==================== SUBSCRIPTION MANAGEMENT ====================

export const createSubscriptionSchema = z.object({
  userId: z.string(),
  planId: z.enum(['starter', 'pro', 'enterprise']),
  billingCycle: z.enum(['monthly', 'yearly']),
  paymentMethod: z.enum(['credit_card', 'pix', 'boleto']),
  addons: z.array(z.string()).max(10).optional(),
  couponCode: z.string().max(50).optional(),
})

export const updateSubscriptionSchema = z.object({
  planId: z.enum(['starter', 'pro', 'enterprise']).optional(),
  billingCycle: z.enum(['monthly', 'yearly']).optional(),
  addons: z.array(z.string()).max(10).optional(),
  couponCode: z.string().max(50).optional(),
})

export const cancelSubscriptionSchema = z.object({
  reason: z.enum([
    'too_expensive',
    'missing_features',
    'switching_provider',
    'business_closed',
    'not_using',
    'other',
  ]),
  feedback: z.string().max(1000).optional(),
  cancelAtPeriodEnd: z.boolean().default(true),
})

// ==================== INVOICE ====================

export const createInvoiceSchema = z.object({
  customerId: z.string(),
  items: z.array(
    z.object({
      description: z.string().min(1).max(500),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive().multipleOf(0.01),
      taxRate: z.number().min(0).max(100).optional(),
    })
  ).min(1).max(100),
  dueDate: z.string().datetime(),
  notes: z.string().max(5000).optional(),
})

// ==================== REFUND ====================

export const createRefundSchema = z.object({
  paymentId: z.string(),
  amount: z.number().positive().multipleOf(0.01).optional(), // full refund if not provided
  reason: z.enum([
    'duplicate',
    'fraudulent',
    'requested_by_customer',
    'product_not_received',
    'product_defective',
    'other',
  ]),
  notes: z.string().max(1000).optional(),
})
