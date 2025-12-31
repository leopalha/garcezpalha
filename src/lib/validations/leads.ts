/**
 * Leads & CRM API Validation Schemas
 */

import { z } from 'zod'
import { emailSchema, nameSchema, phoneSchema, cpfCnpjSchema, metadataSchema } from './common'

// ==================== LEAD CREATION ====================

export const createLeadSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  cpfCnpj: cpfCnpjSchema.optional(),
  company: z.string().max(200).optional(),
  source: z.enum([
    'website',
    'landing_page',
    'chat',
    'whatsapp',
    'referral',
    'social_media',
    'ads',
    'other',
  ]),
  productId: z.string().optional(),
  message: z.string().max(5000).optional(),
  metadata: metadataSchema,
})

// ==================== LEAD UPDATE ====================

export const updateLeadSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  cpfCnpj: cpfCnpjSchema.optional(),
  company: z.string().max(200).optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'proposal', 'won', 'lost']).optional(),
  score: z.number().int().min(0).max(100).optional(),
  notes: z.string().max(5000).optional(),
  metadata: metadataSchema,
})

// ==================== QUALIFICATION ====================

export const qualifyLeadSchema = z.object({
  leadId: z.string(),
  problemType: z.string().min(3).max(200),
  urgency: z.enum(['baixa', 'média', 'alta', 'crítica']),
  budget: z.string().max(100).optional(),
  timeline: z.string().max(100).optional(),
  score: z.number().int().min(0).max(100),
  notes: z.string().max(5000).optional(),
  isQualified: z.boolean(),
})

// ==================== SCHEDULING ====================

export const scheduleConsultationSchema = z.object({
  leadId: z.string(),
  datetime: z.string().datetime(),
  duration: z.number().int().min(15).max(240), // 15 min to 4 hours
  type: z.enum(['presencial', 'online', 'telefone']),
  notes: z.string().max(1000).optional(),
})

// ==================== CONTACT ====================

export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  category: z.enum(['suporte', 'comercial', 'duvida', 'feedback', 'outro']).optional(),
})
