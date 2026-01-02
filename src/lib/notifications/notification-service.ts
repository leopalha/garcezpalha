/**
 * Unified Notification Service
 * Sends notifications via Email (Resend) and WhatsApp (Cloud API)
 */

import { Resend } from 'resend'

// Lazy-loaded Resend client to avoid build-time initialization errors
let resendClient: Resend | null = null
function getResend(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

interface EmailNotification {
  to: string
  subject: string
  html: string
  from?: string
}

interface WhatsAppNotification {
  to: string
  message: string
}

export async function sendEmail(params: EmailNotification): Promise<boolean> {
  try {
    const resend = getResend()
    const { data, error } = await resend.emails.send({
      from: params.from || 'Garcez Palha <noreply@garcezpalha.com>',
      to: params.to,
      subject: params.subject,
      html: params.html,
    })

    if (error) {
      console.error('[Resend] Error:', error)
      return false
    }

    console.log('[Resend] Email sent:', data?.id)
    return true
  } catch (error) {
    console.error('[Resend] Failed:', error)
    return false
  }
}

export async function sendWhatsApp(params: WhatsAppNotification): Promise<boolean> {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!token || !phoneNumberId) {
    console.warn('[WhatsApp] Not configured')
    return false
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: params.to.replace(/\D/g, ''),
          type: 'text',
          text: { body: params.message },
        }),
      }
    )

    const data = await response.json()
    if (!response.ok) {
      console.error('[WhatsApp] Error:', data)
      return false
    }

    console.log('[WhatsApp] Sent:', data.messages?.[0]?.id)
    return true
  } catch (error) {
    console.error('[WhatsApp] Failed:', error)
    return false
  }
}
