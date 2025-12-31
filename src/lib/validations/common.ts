/**
 * Common Zod Validation Schemas
 * Reusable schemas for API validation
 */

import { z } from 'zod'

// ==================== PRIMITIVES ====================

export const emailSchema = z.string().email('Email inválido').toLowerCase()

export const phoneSchema = z
  .string()
  .min(10, 'Telefone deve ter pelo menos 10 dígitos')
  .max(15, 'Telefone deve ter no máximo 15 dígitos')
  .regex(/^\+?[\d\s()-]+$/, 'Formato de telefone inválido')

export const cpfSchema = z
  .string()
  .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'CPF inválido')

export const cnpjSchema = z
  .string()
  .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, 'CNPJ inválido')

export const cpfCnpjSchema = z.union([cpfSchema, cnpjSchema])

export const urlSchema = z.string().url('URL inválida')

export const uuidSchema = z.string().uuid('UUID inválido')

export const dateSchema = z.coerce.date()

export const isoDateSchema = z.string().datetime()

// ==================== TEXT ====================

export const nameSchema = z
  .string()
  .min(3, 'Nome deve ter pelo menos 3 caracteres')
  .max(100, 'Nome deve ter no máximo 100 caracteres')
  .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')

export const descriptionSchema = z
  .string()
  .min(10, 'Descrição deve ter pelo menos 10 caracteres')
  .max(5000, 'Descrição deve ter no máximo 5000 caracteres')

export const titleSchema = z
  .string()
  .min(3, 'Título deve ter pelo menos 3 caracteres')
  .max(200, 'Título deve ter no máximo 200 caracteres')

export const messageSchema = z
  .string()
  .min(1, 'Mensagem não pode estar vazia')
  .max(10000, 'Mensagem muito longa')

// ==================== NUMERIC ====================

export const positiveIntSchema = z.number().int().positive('Deve ser um número positivo')

export const priceSchema = z
  .number()
  .positive('Preço deve ser positivo')
  .max(1000000, 'Preço muito alto')

export const percentageSchema = z
  .number()
  .min(0, 'Percentual mínimo é 0')
  .max(100, 'Percentual máximo é 100')

// ==================== BUSINESS LOGIC ====================

export const oabSchema = z
  .string()
  .regex(/^OAB\/[A-Z]{2}\s?\d{3,6}$/, 'Formato OAB inválido (ex: OAB/SP 123456)')

export const brazilianStateSchema = z.enum([
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
])

export const cepSchema = z
  .string()
  .regex(/^\d{5}-?\d{3}$/, 'CEP inválido')

// ==================== PAGINATION ====================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// ==================== SEARCH & FILTERS ====================

export const searchSchema = z.object({
  q: z.string().min(1).max(200).optional(),
  filters: z.record(z.string(), z.any()).optional(),
  ...paginationSchema.shape,
})

// ==================== FILES ====================

export const fileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: z.string().regex(/^[a-z]+\/[a-z0-9.+-]+$/),
  size: z.number().positive().max(50 * 1024 * 1024), // 50MB max
  checksum: z.string().optional(),
})

export const imageUploadSchema = fileUploadSchema.extend({
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  size: z.number().positive().max(10 * 1024 * 1024), // 10MB max for images
})

// ==================== METADATA ====================

export const metadataSchema = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
  .optional()

// ==================== TIMESTAMPS ====================

export const timestampsSchema = z.object({
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
})

// ==================== RESPONSE WRAPPERS ====================

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
  })

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.any().optional(),
})

export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int(),
      limit: z.number().int(),
      total: z.number().int(),
      totalPages: z.number().int(),
    }),
  })
