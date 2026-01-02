/**
 * Zod Validation Schemas - Payment APIs
 *
 * Centralizes all validation schemas for payment endpoints
 * Covers: Stripe, MercadoPago, Subscriptions
 */

import { z } from 'zod'

// ============================================================================
// STRIPE SCHEMAS
// ============================================================================

export const stripeCheckoutSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  productId: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  mode: z.enum(['payment', 'subscription']).default('payment'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  metadata: z.object({
    productSlug: z.string().optional(),
    tier: z.enum(['essencial', 'completo', 'premium']).optional(),
    userId: z.string().uuid().optional()
  }).optional(),
  customerId: z.string().optional(),
  couponCode: z.string().optional(),
  addons: z.array(z.string()).optional()
})

export const stripeWebhookSchema = z.object({
  type: z.string().min(1),
  data: z.object({
    object: z.object({}).passthrough()
  })
})

export const stripeCreateSessionSchema = z.object({
  productSlug: z.string().min(1, 'Product slug is required'),
  tier: z.enum(['essencial', 'completo', 'premium'], {
    message: 'Invalid tier. Must be: essencial, completo, or premium'
  }),
  addons: z.array(z.string()).optional().default([]),
  couponCode: z.string().optional(),
  successUrl: z.string().url('Invalid success URL').optional(),
  cancelUrl: z.string().url('Invalid cancel URL').optional()
})

// ============================================================================
// MERCADOPAGO SCHEMAS
// ============================================================================

export const mercadoPagoCreatePaymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required').max(500),
  paymentMethodId: z.enum(['pix', 'credit_card', 'boleto']).default('pix'),
  email: z.string().email('Invalid email'),
  metadata: z.object({
    productSlug: z.string().optional(),
    tier: z.string().optional(),
    userId: z.string().uuid().optional(),
    orderId: z.string().optional()
  }).optional(),
  installments: z.number().int().min(1).max(12).default(1),
  notificationUrl: z.string().url().optional(),
  externalReference: z.string().optional()
})

export const mercadoPagoWebhookSchema = z.object({
  action: z.string(),
  api_version: z.string(),
  data: z.object({
    id: z.string()
  }),
  date_created: z.string(),
  id: z.number(),
  live_mode: z.boolean(),
  type: z.string(),
  user_id: z.string()
})

// ============================================================================
// SUBSCRIPTION SCHEMAS
// ============================================================================

export const subscriptionCreateSchema = z.object({
  planId: z.string().uuid('Invalid plan ID'),
  userId: z.string().uuid('Invalid user ID'),
  paymentMethodId: z.string().min(1, 'Payment method is required'),
  billingCycle: z.enum(['monthly', 'quarterly', 'yearly']).default('monthly'),
  startDate: z.string().datetime().optional(),
  couponCode: z.string().optional(),
  autoRenew: z.boolean().default(true)
})

export const subscriptionUpdateSchema = z.object({
  planId: z.string().uuid().optional(),
  status: z.enum(['active', 'paused', 'cancelled', 'expired']).optional(),
  autoRenew: z.boolean().optional(),
  nextBillingDate: z.string().datetime().optional(),
  cancelAtPeriodEnd: z.boolean().optional()
})

export const subscriptionCancelSchema = z.object({
  reason: z.enum([
    'too_expensive',
    'not_using',
    'missing_features',
    'poor_support',
    'switching_competitor',
    'other'
  ]),
  feedback: z.string().max(1000).optional(),
  cancelImmediately: z.boolean().default(false)
})

// ============================================================================
// INVOICE SCHEMAS
// ============================================================================

export const invoiceCreateSchema = z.object({
  customerId: z.string().uuid('Invalid customer ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['BRL', 'USD']).default('BRL'),
  description: z.string().min(1).max(500),
  dueDate: z.string().datetime(),
  items: z.array(z.object({
    description: z.string().min(1),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    total: z.number().positive()
  })).min(1, 'At least one item is required'),
  taxRate: z.number().min(0).max(1).default(0),
  notes: z.string().max(1000).optional()
})

export const invoiceUpdateSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional(),
  paidAt: z.string().datetime().optional(),
  paymentMethod: z.string().optional(),
  notes: z.string().max(1000).optional()
})

// ============================================================================
// REFUND SCHEMAS
// ============================================================================

export const refundCreateSchema = z.object({
  paymentId: z.string().min(1, 'Payment ID is required'),
  amount: z.number().positive('Amount must be positive').optional(), // partial refund
  reason: z.enum([
    'duplicate',
    'fraudulent',
    'requested_by_customer',
    'service_not_delivered',
    'other'
  ]),
  description: z.string().max(500).optional(),
  notifyCustomer: z.boolean().default(true)
})

// ============================================================================
// PAYMENT METHOD SCHEMAS
// ============================================================================

export const paymentMethodAddSchema = z.object({
  type: z.enum(['credit_card', 'debit_card', 'pix', 'boleto']),
  cardToken: z.string().optional(), // for cards
  customerId: z.string().uuid('Invalid customer ID'),
  isDefault: z.boolean().default(false),
  metadata: z.object({}).passthrough().optional()
})

export const paymentMethodUpdateSchema = z.object({
  isDefault: z.boolean().optional(),
  billingAddress: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2).optional(),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/).optional()
  }).optional()
})

// ============================================================================
// EXPORT TYPE INFERENCE
// ============================================================================

export type StripeCheckout = z.infer<typeof stripeCheckoutSchema>
export type StripeWebhook = z.infer<typeof stripeWebhookSchema>
export type StripeCreateSession = z.infer<typeof stripeCreateSessionSchema>
export type MercadoPagoCreatePayment = z.infer<typeof mercadoPagoCreatePaymentSchema>
export type MercadoPagoWebhook = z.infer<typeof mercadoPagoWebhookSchema>
export type SubscriptionCreate = z.infer<typeof subscriptionCreateSchema>
export type SubscriptionUpdate = z.infer<typeof subscriptionUpdateSchema>
export type SubscriptionCancel = z.infer<typeof subscriptionCancelSchema>
export type InvoiceCreate = z.infer<typeof invoiceCreateSchema>
export type InvoiceUpdate = z.infer<typeof invoiceUpdateSchema>
export type RefundCreate = z.infer<typeof refundCreateSchema>
export type PaymentMethodAdd = z.infer<typeof paymentMethodAddSchema>
export type PaymentMethodUpdate = z.infer<typeof paymentMethodUpdateSchema>
