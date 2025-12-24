/**
 * WhatsApp Cloud API Service
 * Official Meta/Facebook WhatsApp Business API
 *
 * Documentation: https://developers.facebook.com/docs/whatsapp/cloud-api
 *
 * This is the SINGLE source of truth for WhatsApp Cloud API integration.
 * All WhatsApp functionality should use this module.
 */

const WHATSAPP_API_VERSION = 'v21.0'
const GRAPH_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`

// OAB Compliance Disclaimer (mandatory for legal services)
const OAB_DISCLAIMER = `⚠️ Este chatbot fornece informações gerais. Não substitui consulta jurídica formal. Análise do caso será feita por advogado habilitado (OAB/RJ 219.390).`

export interface SendMessageOptions {
  to: string
  message: string
  includeDisclaimer?: boolean
}

export interface WhatsAppCloudResponse {
  messaging_product: string
  contacts: Array<{
    input: string
    wa_id: string
  }>
  messages: Array<{
    id: string
  }>
}

export interface WhatsAppIncomingMessage {
  from: string
  id: string
  timestamp: string
  type: 'text' | 'audio' | 'image' | 'document' | 'video' | 'interactive'
  text?: { body: string }
  audio?: { id: string; mime_type: string }
  image?: { id: string; mime_type: string; caption?: string }
  document?: { id: string; filename: string; mime_type: string }
  interactive?: { type: string; button_reply?: { id: string; title: string } }
}

class WhatsAppCloudService {
  private accessToken: string
  private phoneNumberId: string

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || ''
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || ''

    if (!this.accessToken || !this.phoneNumberId) {
      console.warn('[WhatsApp] Cloud API credentials not configured')
    }
  }

  /**
   * Check if the service is properly configured
   */
  isConfigured(): boolean {
    return !!(this.accessToken && this.phoneNumberId)
  }

  /**
   * Send a text message
   */
  async sendMessage(to: string, message: string, includeDisclaimer: boolean = false): Promise<boolean> {
    if (!this.isConfigured()) {
      console.error('[WhatsApp] Cloud API not configured')
      return false
    }

    // Add disclaimer if requested
    const finalMessage = includeDisclaimer
      ? `${OAB_DISCLAIMER}\n\n${message}`
      : message

    // Format phone number (remove spaces, dashes, parentheses)
    const formattedPhone = to.replace(/[\s\-\(\)]/g, '')

    const url = `${GRAPH_API_URL}/${this.phoneNumberId}/messages`

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: {
        preview_url: false,
        body: finalMessage,
      },
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[WhatsApp] API Error:', errorData)
        return false
      }

      return true
    } catch (error) {
      console.error('[WhatsApp] Error sending message:', error)
      return false
    }
  }

  /**
   * Send a template message (pre-approved by Meta)
   */
  async sendTemplate(
    to: string,
    templateName: string,
    languageCode: string = 'pt_BR',
    components?: any[]
  ): Promise<WhatsAppCloudResponse | null> {
    if (!this.isConfigured()) {
      console.error('[WhatsApp] Cloud API not configured')
      return null
    }

    const formattedPhone = to.replace(/[\s\-\(\)]/g, '')
    const url = `${GRAPH_API_URL}/${this.phoneNumberId}/messages`

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: {
          code: languageCode,
        },
        ...(components && { components }),
      },
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[WhatsApp] API Error:', errorData)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('[WhatsApp] Error sending template:', error)
      return null
    }
  }

  /**
   * Mark a message as read
   */
  async markAsRead(messageId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    const url = `${GRAPH_API_URL}/${this.phoneNumberId}/messages`

    const payload = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: messageId,
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      return response.ok
    } catch (error) {
      console.error('[WhatsApp] Error marking as read:', error)
      return false
    }
  }

  /**
   * Get media URL from media ID
   */
  async getMediaUrl(mediaId: string): Promise<string | null> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const response = await fetch(
        `${GRAPH_API_URL}/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.url || null
    } catch (error) {
      console.error('[WhatsApp] Error getting media URL:', error)
      return null
    }
  }

  /**
   * Download media file
   */
  async downloadMedia(mediaId: string): Promise<ArrayBuffer | null> {
    const mediaUrl = await this.getMediaUrl(mediaId)
    if (!mediaUrl) {
      return null
    }

    try {
      const response = await fetch(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      })

      if (!response.ok) {
        return null
      }

      return await response.arrayBuffer()
    } catch (error) {
      console.error('[WhatsApp] Error downloading media:', error)
      return null
    }
  }

  /**
   * Parse incoming webhook message
   */
  parseWebhookMessage(webhookData: any): WhatsAppIncomingMessage | null {
    try {
      const entry = webhookData.entry?.[0]
      const change = entry?.changes?.[0]
      const message = change?.value?.messages?.[0]

      if (!message) {
        return null
      }

      return {
        from: message.from,
        id: message.id,
        timestamp: message.timestamp,
        type: message.type,
        text: message.text,
        audio: message.audio,
        image: message.image,
        document: message.document,
        interactive: message.interactive
      }
    } catch (error) {
      console.error('[WhatsApp] Error parsing webhook:', error)
      return null
    }
  }
}

// Export singleton instance
export const whatsappCloudAPI = new WhatsAppCloudService()

// Also export as default for compatibility
export default whatsappCloudAPI
