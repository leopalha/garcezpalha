/**
 * Zod Validation Schemas - User Management APIs
 *
 * Centralizes all validation schemas for user/client endpoints
 * Covers: Clients, Documents, User Profile, Preferences
 */

import { z } from 'zod'

// ============================================================================
// CLIENT SCHEMAS
// ============================================================================

export const clientCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, 'Invalid CPF').optional(),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/, 'Invalid CNPJ').optional(),
  companyName: z.string().max(200).optional(),
  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    neighborhood: z.string().optional(),
    city: z.string().optional(),
    state: z.string().length(2).optional(),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
    country: z.string().default('BR')
  }).optional(),
  metadata: z.object({
    source: z.string().optional(),
    referral: z.string().optional(),
    campaign: z.string().optional()
  }).optional()
})

export const clientUpdateSchema = clientCreateSchema.partial()

export const clientFilterSchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'inactive', 'blocked']).optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  hasActiveSubscription: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
})

// ============================================================================
// DOCUMENT UPLOAD SCHEMAS
// ============================================================================

export const documentUploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required').max(255),
  fileType: z.enum([
    'pdf',
    'doc',
    'docx',
    'jpg',
    'jpeg',
    'png',
    'txt'
  ], {
    errorMap: () => ({ message: 'Invalid file type. Allowed: PDF, DOC, DOCX, JPG, PNG, TXT' })
  }),
  fileSize: z.number().int().positive().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  documentType: z.enum([
    'rg',
    'cpf',
    'cnpj',
    'proof_of_address',
    'contract',
    'invoice',
    'receipt',
    'other'
  ]),
  description: z.string().max(500).optional(),
  clientId: z.string().uuid('Invalid client ID').optional(),
  caseId: z.string().uuid('Invalid case ID').optional(),
  isPublic: z.boolean().default(false),
  expiresAt: z.string().datetime().optional()
})

export const documentUpdateSchema = z.object({
  fileName: z.string().min(1).max(255).optional(),
  description: z.string().max(500).optional(),
  documentType: documentUploadSchema.shape.documentType.optional(),
  isPublic: z.boolean().optional(),
  expiresAt: z.string().datetime().nullable().optional()
})

export const documentFilterSchema = z.object({
  clientId: z.string().uuid().optional(),
  caseId: z.string().uuid().optional(),
  documentType: documentUploadSchema.shape.documentType.optional(),
  uploadedAfter: z.string().datetime().optional(),
  uploadedBefore: z.string().datetime().optional(),
  isPublic: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
})

// ============================================================================
// USER PROFILE SCHEMAS
// ============================================================================

export const userProfileUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
  bio: z.string().max(500).optional(),
  preferences: z.object({
    language: z.enum(['pt-BR', 'en-US', 'es-ES']).optional(),
    timezone: z.string().optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      push: z.boolean().optional()
    }).optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional()
  }).optional(),
  metadata: z.object({}).passthrough().optional()
})

export const userPasswordChangeSchema = z.object({
  currentPassword: z.string().min(8, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

export const userEmailChangeSchema = z.object({
  newEmail: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password is required for email change')
})

// ============================================================================
// NOTIFICATION PREFERENCES
// ============================================================================

export const notificationPreferencesSchema = z.object({
  emailNotifications: z.object({
    marketing: z.boolean().default(false),
    productUpdates: z.boolean().default(true),
    caseUpdates: z.boolean().default(true),
    paymentReminders: z.boolean().default(true),
    securityAlerts: z.boolean().default(true)
  }).optional(),
  smsNotifications: z.object({
    caseUpdates: z.boolean().default(false),
    paymentReminders: z.boolean().default(false),
    urgentAlerts: z.boolean().default(true)
  }).optional(),
  pushNotifications: z.object({
    enabled: z.boolean().default(false),
    sound: z.boolean().default(true),
    badge: z.boolean().default(true)
  }).optional()
})

// ============================================================================
// SESSION & SECURITY SCHEMAS
// ============================================================================

export const sessionCreateSchema = z.object({
  deviceInfo: z.object({
    userAgent: z.string(),
    platform: z.string().optional(),
    browser: z.string().optional(),
    os: z.string().optional(),
    ip: z.string().ip().optional()
  }).optional(),
  remember: z.boolean().default(false)
})

export const twoFactorEnableSchema = z.object({
  method: z.enum(['sms', 'email', 'authenticator']),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  password: z.string().min(8, 'Password is required to enable 2FA')
})

export const twoFactorVerifySchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d{6}$/),
  method: z.enum(['sms', 'email', 'authenticator'])
})

// ============================================================================
// GDPR / LGPD DATA REQUESTS
// ============================================================================

export const dataExportRequestSchema = z.object({
  includeDocuments: z.boolean().default(true),
  includeConversations: z.boolean().default(true),
  includePayments: z.boolean().default(true),
  format: z.enum(['json', 'csv', 'pdf']).default('json')
})

export const dataDeleteRequestSchema = z.object({
  reason: z.enum([
    'no_longer_needed',
    'privacy_concerns',
    'switching_service',
    'data_security',
    'other'
  ]),
  feedback: z.string().max(1000).optional(),
  password: z.string().min(8, 'Password confirmation required for account deletion'),
  confirmText: z.string().refine(val => val === 'DELETE MY ACCOUNT', {
    message: 'You must type "DELETE MY ACCOUNT" to confirm'
  })
})

// ============================================================================
// EXPORT TYPE INFERENCE
// ============================================================================

export type ClientCreate = z.infer<typeof clientCreateSchema>
export type ClientUpdate = z.infer<typeof clientUpdateSchema>
export type ClientFilter = z.infer<typeof clientFilterSchema>
export type DocumentUpload = z.infer<typeof documentUploadSchema>
export type DocumentUpdate = z.infer<typeof documentUpdateSchema>
export type DocumentFilter = z.infer<typeof documentFilterSchema>
export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>
export type UserPasswordChange = z.infer<typeof userPasswordChangeSchema>
export type UserEmailChange = z.infer<typeof userEmailChangeSchema>
export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>
export type SessionCreate = z.infer<typeof sessionCreateSchema>
export type TwoFactorEnable = z.infer<typeof twoFactorEnableSchema>
export type TwoFactorVerify = z.infer<typeof twoFactorVerifySchema>
export type DataExportRequest = z.infer<typeof dataExportRequestSchema>
export type DataDeleteRequest = z.infer<typeof dataDeleteRequestSchema>
