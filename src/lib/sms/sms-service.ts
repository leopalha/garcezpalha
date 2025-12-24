/**
 * SMS Service
 *
 * Service for sending SMS messages via Twilio
 *
 * Setup:
 * 1. Create Twilio account at https://www.twilio.com
 * 2. Get Account SID, Auth Token, and Phone Number
 * 3. Add to .env:
 *    - TWILIO_ACCOUNT_SID
 *    - TWILIO_AUTH_TOKEN
 *    - TWILIO_PHONE_NUMBER (format: +5521999999999)
 *
 * Pricing (Brazil):
 * - Outbound SMS: ~$0.0725 per message
 * - Consider using WhatsApp for most communications (cheaper)
 */

export interface SMSMessageParams {
  to: string
  message: string
  metadata?: Record<string, any>
}

export interface SMSResult {
  success: boolean
  messageId?: string
  error?: string
}

class SMSService {
  private readonly accountSid: string | undefined
  private readonly authToken: string | undefined
  private readonly fromNumber: string | undefined

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID
    this.authToken = process.env.TWILIO_AUTH_TOKEN
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER
  }

  /**
   * Check if SMS service is configured
   */
  isConfigured(): boolean {
    return !!(this.accountSid && this.authToken && this.fromNumber)
  }

  /**
   * Format phone number to E.164 format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '')

    // If already has country code (55 for Brazil)
    if (digits.length === 13 && digits.startsWith('55')) {
      return `+${digits}`
    }

    // If has 11 digits (DDD + number), add Brazil code
    if (digits.length === 11) {
      return `+55${digits}`
    }

    // If has 10 digits (old format without 9), add 9 and Brazil code
    if (digits.length === 10) {
      const ddd = digits.substring(0, 2)
      const number = digits.substring(2)
      return `+55${ddd}9${number}`
    }

    // Return as-is with + prefix
    return digits.startsWith('+') ? digits : `+${digits}`
  }

  /**
   * Send SMS message via Twilio
   */
  async sendSMS(params: SMSMessageParams): Promise<SMSResult> {
    // If not configured, log and return
    if (!this.isConfigured()) {
      console.log('[SMS Service] Not configured - would send:', {
        to: params.to,
        message: params.message.substring(0, 50) + '...',
      })
      return {
        success: false,
        error: 'SMS service not configured',
      }
    }

    try {
      const toNumber = this.formatPhoneNumber(params.to)

      // Twilio REST API
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: toNumber,
          From: this.fromNumber!,
          Body: params.message,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('[SMS Service] Twilio error:', data)
        return {
          success: false,
          error: data.message || 'Failed to send SMS',
        }
      }

      console.log('[SMS Service] SMS sent successfully:', {
        sid: data.sid,
        to: toNumber,
        status: data.status,
      })

      return {
        success: true,
        messageId: data.sid,
      }
    } catch (error: any) {
      console.error('[SMS Service] Error:', error)
      return {
        success: false,
        error: error.message,
      }
    }
  }

  /**
   * Send OTP verification SMS
   */
  async sendOTP(phone: string, code: string): Promise<SMSResult> {
    const message = `Garcez Palha: Seu código de verificação é ${code}. Válido por 10 minutos. Não compartilhe este código.`
    return this.sendSMS({ to: phone, message })
  }

  /**
   * Send appointment reminder SMS
   */
  async sendAppointmentReminder(params: {
    phone: string
    name: string
    date: string
    time: string
    service: string
  }): Promise<SMSResult> {
    const message = `Olá ${params.name}! Lembrete: Sua consulta de ${params.service} está agendada para ${params.date} às ${params.time}. Garcez Palha - (21) 99535-4010`
    return this.sendSMS({ to: params.phone, message })
  }

  /**
   * Send payment reminder SMS
   */
  async sendPaymentReminder(params: {
    phone: string
    name: string
    amount: string
    paymentUrl: string
  }): Promise<SMSResult> {
    const message = `${params.name}, você tem um pagamento pendente de ${params.amount}. Acesse: ${params.paymentUrl} - Garcez Palha`
    return this.sendSMS({ to: params.phone, message })
  }

  /**
   * Send deadline alert SMS
   */
  async sendDeadlineAlert(params: {
    phone: string
    name: string
    deadline: string
    processInfo: string
  }): Promise<SMSResult> {
    const message = `URGENTE ${params.name}: Prazo em ${params.deadline} para ${params.processInfo}. Entre em contato: (21) 99535-4010 - Garcez Palha`
    return this.sendSMS({ to: params.phone, message })
  }
}

// Export singleton
export const smsService = new SMSService()

/**
 * Legacy function for backwards compatibility
 */
export async function sendSMS(params: SMSMessageParams): Promise<void> {
  await smsService.sendSMS(params)
}
