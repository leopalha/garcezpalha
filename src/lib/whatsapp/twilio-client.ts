import twilio from 'twilio'
import type {
  TwilioConfig,
  TwilioMessageResponse,
  WhatsAppError,
  PhoneNumber
} from './types'
import { toWhatsAppFormat, formatPhoneNumber } from './types'

/**
 * Twilio WhatsApp Client
 * Handles sending WhatsApp messages via Twilio API with proper error handling and logging
 */

// Twilio configuration from environment variables
const config: TwilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  whatsappNumber: process.env.TWILIO_WHATSAPP_NUMBER || '',
}

// Singleton Twilio client instance
let twilioClient: ReturnType<typeof twilio> | null = null

/**
 * Get or create Twilio client instance
 * @throws {WhatsAppError} If credentials are not configured
 */
function getTwilioClient() {
  if (!config.accountSid || !config.authToken) {
    const error = new WhatsAppError(
      'Twilio credentials not configured. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.',
      'TWILIO_CONFIG_ERROR',
      500
    )
    console.error('[Twilio] Credenciais não configuradas')
    throw error
  }

  if (!twilioClient) {
    twilioClient = twilio(config.accountSid, config.authToken)
    console.log('[Twilio] Client initialized successfully')
  }

  return twilioClient
}

/**
 * Send WhatsApp message via Twilio API
 *
 * @param to - Recipient phone number (format: 5521999999999 or whatsapp:+5521999999999)
 * @param message - Message text content (max 1600 characters recommended)
 * @param options - Optional message configuration
 * @returns Message SID from Twilio
 * @throws {WhatsAppError} If sending fails or configuration is invalid
 *
 * @example
 * ```ts
 * const sid = await sendTwilioMessage('5521999999999', 'Olá! Como posso ajudar?')
 * ```
 */
export async function sendTwilioMessage(
  to: PhoneNumber | string,
  message: string,
  options?: {
    mediaUrl?: string[]
    statusCallback?: string
  }
): Promise<string> {
  const startTime = Date.now()

  try {
    const client = getTwilioClient()

    if (!config.whatsappNumber) {
      throw new WhatsAppError(
        'TWILIO_WHATSAPP_NUMBER not configured',
        'TWILIO_CONFIG_ERROR',
        500
      )
    }

    // Validate message length
    if (!message || message.trim().length === 0) {
      throw new WhatsAppError(
        'Message content cannot be empty',
        'INVALID_MESSAGE',
        400
      )
    }

    if (message.length > 4096) {
      throw new WhatsAppError(
        'Message exceeds WhatsApp limit of 4096 characters',
        'MESSAGE_TOO_LONG',
        400
      )
    }

    // Format phone number to WhatsApp format
    const formattedTo = to.startsWith('whatsapp:')
      ? to
      : toWhatsAppFormat(formatPhoneNumber(to))

    console.log('[Twilio] Sending message', {
      to: formattedTo,
      from: config.whatsappNumber,
      messageLength: message.length,
      hasMedia: !!options?.mediaUrl,
    })

    const response = await client.messages.create({
      from: config.whatsappNumber,
      to: formattedTo,
      body: message,
      ...options,
    })

    const duration = Date.now() - startTime

    console.log('[Twilio] Message sent successfully', {
      sid: response.sid,
      status: response.status,
      duration: `${duration}ms`,
    })

    return response.sid

  } catch (error) {
    const duration = Date.now() - startTime

    console.error('[Twilio] Failed to send message', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      to: to.substring(0, 10) + '...',
    })

    // Re-throw WhatsAppError as-is
    if (error instanceof WhatsAppError) {
      throw error
    }

    // Wrap other errors
    if (error instanceof Error) {
      throw new WhatsAppError(
        `Failed to send WhatsApp message: ${error.message}`,
        'TWILIO_SEND_ERROR',
        500,
        { originalError: error.message }
      )
    }

    throw new WhatsAppError(
      'Unknown error occurred while sending message',
      'UNKNOWN_ERROR',
      500
    )
  }
}

/**
 * Check if Twilio credentials are properly configured
 * @returns true if all required credentials are set
 */
export function isTwilioConfigured(): boolean {
  return !!(config.accountSid && config.authToken && config.whatsappNumber)
}

/**
 * Get Twilio configuration status (safe for logging - credentials are masked)
 * @returns Configuration status object
 */
export function getTwilioConfig() {
  return {
    configured: isTwilioConfigured(),
    accountSid: config.accountSid ? `${config.accountSid.substring(0, 10)}...` : 'not set',
    whatsappNumber: config.whatsappNumber || 'not set',
    hasAuthToken: !!config.authToken,
  }
}

/**
 * Send batch WhatsApp messages with rate limiting
 *
 * @param messages - Array of message objects with recipient and content
 * @param delayMs - Delay between messages in milliseconds (default: 1000)
 * @returns Array of message SIDs
 *
 * @example
 * ```ts
 * const results = await sendBatchMessages([
 *   { to: '5521999999999', message: 'Hello!' },
 *   { to: '5521888888888', message: 'Hi there!' }
 * ])
 * ```
 */
export async function sendBatchMessages(
  messages: Array<{ to: PhoneNumber | string; message: string }>,
  delayMs: number = 1000
): Promise<Array<{ to: string; sid?: string; error?: string }>> {
  const results: Array<{ to: string; sid?: string; error?: string }> = []

  for (const msg of messages) {
    try {
      const sid = await sendTwilioMessage(msg.to, msg.message)
      results.push({ to: msg.to, sid })

      // Rate limiting - wait before next message
      if (messages.indexOf(msg) < messages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      results.push({ to: msg.to, error: errorMessage })
      console.error(`[Twilio] Batch send failed for ${msg.to}:`, errorMessage)
    }
  }

  return results
}
