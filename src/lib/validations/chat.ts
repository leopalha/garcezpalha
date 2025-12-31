/**
 * Chat & AI API Validation Schemas
 */

import { z } from 'zod'
import { messageSchema, uuidSchema, metadataSchema } from './common'

// ==================== CHAT ====================

export const chatMessageSchema = z.object({
  message: messageSchema,
  conversationId: uuidSchema.optional(),
  productId: z.string().optional(),
  mode: z.enum(['chat', 'agent-flow', 'realtime-voice']).default('chat'),
  channel: z.enum(['website', 'whatsapp', 'email', 'telegram']).default('website'),
  files: z
    .array(
      z.object({
        name: z.string(),
        type: z.string(),
        size: z.number().max(50 * 1024 * 1024), // 50MB
        url: z.string().url(),
      })
    )
    .max(20, 'Máximo 20 arquivos por mensagem')
    .optional(),
  metadata: metadataSchema,
})

// ==================== AGENT FLOW ====================

export const agentFlowSchema = z.object({
  message: messageSchema,
  conversationId: uuidSchema,
  currentState: z.enum([
    'greeting',
    'collecting_problem',
    'collecting_details',
    'qualifying',
    'scheduling',
    'closing',
    'escalated',
  ]),
  qualification: z
    .object({
      problemType: z.string(),
      urgency: z.enum(['baixa', 'média', 'alta', 'crítica']),
      budget: z.string().optional(),
      timeline: z.string().optional(),
      isQualified: z.boolean(),
      score: z.number().min(0).max(100),
    })
    .optional(),
})

// ==================== VOICE ====================

export const voiceSchema = z.object({
  audioData: z.string(), // base64
  format: z.enum(['pcm', 'wav', 'mp3', 'ogg']),
  sampleRate: z.number().int().min(8000).max(48000),
  channels: z.number().int().min(1).max(2),
  conversationId: uuidSchema.optional(),
})

export const ttsSchema = z.object({
  text: messageSchema,
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).default('alloy'),
  speed: z.number().min(0.25).max(4.0).default(1.0),
  format: z.enum(['mp3', 'opus', 'aac', 'flac']).default('mp3'),
})

// ==================== FEEDBACK ====================

export const chatFeedbackSchema = z.object({
  conversationId: uuidSchema,
  messageId: z.string(),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().max(1000).optional(),
})
