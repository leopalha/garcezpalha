/**
 * Telegram Bot Service
 *
 * Service for interacting with Telegram Bot API
 */

const TELEGRAM_API_URL = 'https://api.telegram.org'

export interface TelegramMessage {
  message_id: number
  from: {
    id: number
    is_bot: boolean
    first_name: string
    last_name?: string
    username?: string
    language_code?: string
  }
  chat: {
    id: number
    first_name?: string
    last_name?: string
    username?: string
    type: 'private' | 'group' | 'supergroup' | 'channel'
  }
  date: number
  text?: string
}

export interface TelegramUpdate {
  update_id: number
  message?: TelegramMessage
}

class TelegramBotService {
  private botToken: string

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || ''
  }

  isConfigured(): boolean {
    return !!this.botToken && this.botToken !== ''
  }

  /**
   * Send a text message
   */
  async sendMessage(chatId: number | string, text: string, options?: {
    parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
    reply_to_message_id?: number
  }): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Telegram bot token not configured')
    }

    const url = `${TELEGRAM_API_URL}/bot${this.botToken}/sendMessage`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        ...options,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      console.error('Telegram API Error:', data)
      throw new Error(`Telegram API Error: ${data.description || 'Unknown error'}`)
    }

    return data.result
  }

  /**
   * Get bot info
   */
  async getMe(): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Telegram bot token not configured')
    }

    const url = `${TELEGRAM_API_URL}/bot${this.botToken}/getMe`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok || !data.ok) {
      console.error('Telegram API Error:', data)
      throw new Error(`Telegram API Error: ${data.description || 'Unknown error'}`)
    }

    return data.result
  }

  /**
   * Set webhook URL
   */
  async setWebhook(url: string): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Telegram bot token not configured')
    }

    const apiUrl = `${TELEGRAM_API_URL}/bot${this.botToken}/setWebhook`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
      }),
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      console.error('Telegram API Error:', data)
      throw new Error(`Telegram API Error: ${data.description || 'Unknown error'}`)
    }

    return data.result
  }

  /**
   * Get webhook info
   */
  async getWebhookInfo(): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Telegram bot token not configured')
    }

    const url = `${TELEGRAM_API_URL}/bot${this.botToken}/getWebhookInfo`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok || !data.ok) {
      console.error('Telegram API Error:', data)
      throw new Error(`Telegram API Error: ${data.description || 'Unknown error'}`)
    }

    return data.result
  }

  /**
   * Delete webhook (use for polling instead)
   */
  async deleteWebhook(): Promise<any> {
    if (!this.isConfigured()) {
      throw new Error('Telegram bot token not configured')
    }

    const url = `${TELEGRAM_API_URL}/bot${this.botToken}/deleteWebhook`

    const response = await fetch(url, {
      method: 'POST',
    })

    const data = await response.json()

    if (!response.ok || !data.ok) {
      console.error('Telegram API Error:', data)
      throw new Error(`Telegram API Error: ${data.description || 'Unknown error'}`)
    }

    return data.result
  }
}

// Export singleton instance
const telegramBotService = new TelegramBotService()
export default telegramBotService
