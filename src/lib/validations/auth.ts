/**
 * Auth API Validation Schemas
 */

import { z } from 'zod'
import { emailSchema, nameSchema, phoneSchema } from './common'

// ==================== SIGNUP ====================

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  phone: phoneSchema.optional(),
  role: z.enum(['client', 'lawyer', 'admin', 'partner']).default('client'),
})

// ==================== LOGIN ====================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Senha é obrigatória'),
  remember: z.boolean().optional(),
})

// ==================== PASSWORD RESET ====================

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .max(100, 'Senha muito longa')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
})

// ==================== 2FA ====================

export const enable2FASchema = z.object({
  method: z.enum(['sms', 'email', 'authenticator']),
  phone: phoneSchema.optional(),
})

export const verify2FASchema = z.object({
  code: z.string().length(6, 'Código deve ter 6 dígitos').regex(/^\d{6}$/, 'Código deve conter apenas números'),
})

export const disable2FASchema = z.object({
  password: z.string().min(1, 'Senha é obrigatória para desativar 2FA'),
})

// ==================== SESSION ====================

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
})
