/**
 * Circuit Breaker for WhatsApp Providers
 * Fallback strategy: WhatsApp Cloud API → Twilio → Baileys (local)
 */

import { createCircuitBreaker } from './circuit-breaker'
import { logger } from '@/lib/logger'

// Types
interface SendMessageParams {
  to: string // Phone number with country code (e.g., +5511999999999)
  message: string
  mediaUrl?: string
}

interface SendMessageResult {
  id: string
  provider: 'whatsapp-cloud' | 'twilio' | 'baileys'
  status: 'sent' | 'queued' | 'failed'
}

/**
 * Send via WhatsApp Cloud API (Meta)
 */
async function sendViaWhatsAppCloud(
  params: SendMessageParams
): Promise<SendMessageResult> {
  logger.info('Sending via WhatsApp Cloud API', { to: params.to })

  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN!

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: params.to,
        type: 'text',
        text: {
          body: params.message,
        },
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`WhatsApp Cloud API error: ${error}`)
  }

  const data = await response.json()

  return {
    id: data.messages[0].id,
    provider: 'whatsapp-cloud',
    status: 'sent',
  }
}

/**
 * Send via Twilio
 */
async function sendViaTwilio(
  params: SendMessageParams
): Promise<SendMessageResult> {
  logger.info('Sending via Twilio', { to: params.to })

  const accountSid = process.env.TWILIO_ACCOUNT_SID!
  const authToken = process.env.TWILIO_AUTH_TOKEN!
  const from = process.env.TWILIO_WHATSAPP_NUMBER! // e.g., whatsapp:+14155238886

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization':
          'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: from,
        To: `whatsapp:${params.to}`,
        Body: params.message,
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Twilio error: ${error}`)
  }

  const data = await response.json()

  return {
    id: data.sid,
    provider: 'twilio',
    status: data.status === 'sent' || data.status === 'queued' ? 'sent' : 'failed',
  }
}

/**
 * Send via Baileys (local WhatsApp Web connection)
 * Note: This is a fallback for development/emergency only
 */
async function sendViaBaileys(
  params: SendMessageParams
): Promise<SendMessageResult> {
  logger.warn('Sending via Baileys (local connection)', { to: params.to })

  // This would connect to a local Baileys instance
  // For now, we'll simulate it
  // In production, this would use a local WebSocket connection to Baileys

  return {
    id: `baileys-${Date.now()}`,
    provider: 'baileys',
    status: 'queued',
  }
}

/**
 * Circuit Breaker for WhatsApp Cloud API
 */
export const whatsappCloudBreaker = createCircuitBreaker(
  sendViaWhatsAppCloud,
  {
    name: 'whatsapp-cloud',
    timeout: 10000, // 10s
    errorThresholdPercentage: 50,
    resetTimeout: 60000, // 1min
    volumeThreshold: 3,
  },
  async (params) => {
    logger.warn('WhatsApp Cloud failed, falling back to Twilio')
    return await twilioBreaker.fire(params)
  }
)

/**
 * Circuit Breaker for Twilio
 */
export const twilioBreaker = createCircuitBreaker(
  sendViaTwilio,
  {
    name: 'twilio-whatsapp',
    timeout: 10000, // 10s
    errorThresholdPercentage: 50,
    resetTimeout: 60000, // 1min
    volumeThreshold: 3,
  },
  async (params) => {
    logger.warn('Twilio failed, falling back to Baileys')
    return await baileysBreaker.fire(params)
  }
)

/**
 * Circuit Breaker for Baileys
 */
export const baileysBreaker = createCircuitBreaker(
  sendViaBaileys,
  {
    name: 'baileys-whatsapp',
    timeout: 5000, // 5s (local)
    errorThresholdPercentage: 50,
    resetTimeout: 30000, // 30s
    volumeThreshold: 3,
  },
  async (params) => {
    logger.error('All WhatsApp providers failed')
    throw new Error('WhatsApp messaging unavailable. Please try again later.')
  }
)

/**
 * Smart WhatsApp Send with automatic fallback
 */
export async function sendWhatsAppWithFallback(
  params: SendMessageParams
): Promise<SendMessageResult> {
  try {
    return await whatsappCloudBreaker.fire(params)
  } catch (error) {
    logger.error('WhatsApp message sending failed', { error })
    throw error
  }
}

/**
 * Get WhatsApp Circuit Breaker Stats
 */
export function getWhatsAppCircuitBreakerStats() {
  return {
    cloud: whatsappCloudBreaker.status.stats,
    twilio: twilioBreaker.status.stats,
    baileys: baileysBreaker.status.stats,
  }
}
