/**
 * WhatsApp Integration Type Definitions
 * Centralized type definitions for Twilio and WhatsApp Cloud API integrations
 */

import { unformatPhone } from '@/lib/formatting/br-formats'

// ============================================================================
// Twilio Types
// ============================================================================

export interface TwilioConfig {
  accountSid: string
  authToken: string
  whatsappNumber: string
}

export interface TwilioMessageOptions {
  from: string
  to: string
  body: string
  mediaUrl?: string[]
  statusCallback?: string
}

export interface TwilioMessageResponse {
  sid: string
  status: 'queued' | 'sending' | 'sent' | 'delivered' | 'undelivered' | 'failed'
  to: string
  from: string
  body: string
  errorCode?: string
  errorMessage?: string
}

export interface TwilioWebhookPayload {
  MessageSid: string
  From: string
  To: string
  Body: string
  NumMedia: string
  MediaUrl0?: string
  MediaContentType0?: string
  AccountSid: string
  MessagingServiceSid?: string
}

// ============================================================================
// WhatsApp Session Types
// ============================================================================

export interface WhatsAppSession {
  phoneNumber: string
  sessionId: string
  startedAt: Date
  lastMessageAt: Date
  clientName?: string
  inQualification: boolean
  conversationHistory: WhatsAppMessage[]
}

export interface WhatsAppMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

// ============================================================================
// WhatsApp Cloud API Types
// ============================================================================

export interface WhatsAppIncomingMessage {
  from: string
  id: string
  timestamp: string
  type: 'text' | 'audio' | 'image' | 'video' | 'document' | 'interactive' | 'location'
  text?: {
    body: string
  }
  audio?: {
    id: string
    mime_type: string
  }
  image?: {
    id: string
    mime_type: string
    caption?: string
  }
  video?: {
    id: string
    mime_type: string
    caption?: string
  }
  document?: {
    id: string
    mime_type: string
    filename?: string
  }
  interactive?: {
    type: 'button_reply' | 'list_reply'
    button_reply?: {
      id: string
      title: string
    }
    list_reply?: {
      id: string
      title: string
      description?: string
    }
  }
  location?: {
    latitude: number
    longitude: number
    name?: string
    address?: string
  }
}

export interface WhatsAppOutgoingMessage {
  messaging_product: 'whatsapp'
  recipient_type: 'individual'
  to: string
  type: 'text' | 'template' | 'interactive'
  text?: {
    body: string
    preview_url?: boolean
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: any[]
  }
  interactive?: {
    type: 'button' | 'list'
    header?: {
      type: 'text' | 'image' | 'video' | 'document'
      text?: string
      image?: { link: string }
      video?: { link: string }
      document?: { link: string; filename?: string }
    }
    body: {
      text: string
    }
    footer?: {
      text: string
    }
    action: {
      buttons?: Array<{
        type: 'reply'
        reply: {
          id: string
          title: string
        }
      }>
      button?: string
      sections?: Array<{
        title: string
        rows: Array<{
          id: string
          title: string
          description?: string
        }>
      }>
    }
  }
}

// ============================================================================
// Message Handler Types
// ============================================================================

export interface MessageHandlerConfig {
  maxMessageLength?: number
  sessionExpirationHours?: number
  enableAudioTranscription?: boolean
  enableImageProcessing?: boolean
}

export interface ProcessMessageResult {
  response?: string
  error?: string
  metadata?: {
    sessionId: string
    messageType: string
    processingTime: number
    qualificationStatus?: QualificationStatus
  }
}

export type QualificationStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'abandoned'
  | 'escalated'

// ============================================================================
// Qualification Integration Types
// ============================================================================

export interface QualificationRequest {
  sessionId: string
  message: string
  source: 'whatsapp' | 'telegram' | 'website' | 'phone'
  clientInfo: ClientInfo
  userId?: string
}

export interface ClientInfo {
  name?: string
  phone?: string
  email?: string
  cpf?: string
  additionalData?: Record<string, any>
}

export interface QualificationResponse {
  type: 'question' | 'completion' | 'error' | 'info'
  message: string
  progress?: QualificationProgress
  paymentLink?: string
  proposalText?: string
  metadata?: Record<string, any>
}

export interface QualificationProgress {
  percentage: number
  answered: number
  total: number
  currentStep?: string
}

// ============================================================================
// Audio Transcription Types
// ============================================================================

export interface AudioTranscriptionRequest {
  audioId: string
  language?: string
  model?: string
}

export interface AudioTranscriptionResponse {
  text: string
  language?: string
  duration?: number
  confidence?: number
}

// ============================================================================
// Error Types
// ============================================================================

export class WhatsAppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'WhatsAppError'
  }
}

export interface ErrorResponse {
  error: string
  code?: string
  details?: any
  timestamp: string
}

// ============================================================================
// Logging Types
// ============================================================================

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  level: LogLevel
  timestamp: Date
  service: string
  message: string
  metadata?: Record<string, any>
  error?: Error
}

// ============================================================================
// Utility Types
// ============================================================================

export type PhoneNumber = string // Format: 5521999999999 (without + or spaces)
export type SessionId = string   // Format: wa_5521999999999_timestamp or custom

/**
 * Type guard for Twilio webhook payload
 */
export function isTwilioWebhookPayload(payload: any): payload is TwilioWebhookPayload {
  return (
    typeof payload === 'object' &&
    typeof payload.MessageSid === 'string' &&
    typeof payload.From === 'string' &&
    typeof payload.To === 'string' &&
    typeof payload.Body === 'string'
  )
}

/**
 * Type guard for WhatsApp incoming message
 */
export function isWhatsAppIncomingMessage(message: any): message is WhatsAppIncomingMessage {
  return (
    typeof message === 'object' &&
    typeof message.from === 'string' &&
    typeof message.id === 'string' &&
    typeof message.type === 'string'
  )
}

/**
 * Helper to format phone numbers consistently
 * @deprecated Use unformatPhone from @/lib/formatting/br-formats instead
 */
export function formatPhoneNumber(phone: string): PhoneNumber {
  return unformatPhone(phone)
}

/**
 * Helper to create WhatsApp-formatted phone number
 */
export function toWhatsAppFormat(phone: PhoneNumber): string {
  return `whatsapp:+${phone}`
}
