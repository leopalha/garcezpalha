import twilio from 'twilio'

/**
 * Cliente Twilio para envio de mensagens WhatsApp
 */

// Credenciais Twilio (via env vars)
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER // Ex: whatsapp:+14155238886

// Inicializar cliente Twilio
let twilioClient: ReturnType<typeof twilio> | null = null

function getTwilioClient() {
  if (!accountSid || !authToken) {
    console.error('[Twilio] Credenciais não configuradas')
    console.error('[Twilio] Configure TWILIO_ACCOUNT_SID e TWILIO_AUTH_TOKEN')
    throw new Error('Twilio credentials not configured')
  }

  if (!twilioClient) {
    twilioClient = twilio(accountSid, authToken)
  }

  return twilioClient
}

/**
 * Envia mensagem WhatsApp via Twilio
 *
 * @param to - Número do destinatário (formato: 5521999999999)
 * @param message - Texto da mensagem
 * @returns MessageSid ou erro
 */
export async function sendTwilioMessage(
  to: string,
  message: string
): Promise<string> {
  try {
    const client = getTwilioClient()

    if (!twilioWhatsAppNumber) {
      throw new Error('TWILIO_WHATSAPP_NUMBER not configured')
    }

    // Formatar número para Twilio (whatsapp:+5521999999999)
    const formattedTo = to.startsWith('whatsapp:')
      ? to
      : `whatsapp:+${to.replace(/[^\d]/g, '')}`

    console.log('[Twilio] Enviando mensagem')
    console.log('[Twilio] Para:', formattedTo)
    console.log('[Twilio] De:', twilioWhatsAppNumber)
    console.log('[Twilio] Mensagem:', message.substring(0, 100))

    const response = await client.messages.create({
      from: twilioWhatsAppNumber,
      to: formattedTo,
      body: message,
    })

    console.log('[Twilio] Mensagem enviada com sucesso')
    console.log('[Twilio] MessageSid:', response.sid)
    console.log('[Twilio] Status:', response.status)

    return response.sid

  } catch (error) {
    console.error('[Twilio] Erro ao enviar mensagem:', error)

    if (error instanceof Error) {
      console.error('[Twilio] Detalhes:', error.message)
    }

    throw error
  }
}

/**
 * Valida se as credenciais Twilio estão configuradas
 */
export function isTwilioConfigured(): boolean {
  return !!(accountSid && authToken && twilioWhatsAppNumber)
}

/**
 * Retorna informações sobre a configuração Twilio
 */
export function getTwilioConfig() {
  return {
    configured: isTwilioConfigured(),
    accountSid: accountSid ? `${accountSid.substring(0, 10)}...` : 'not set',
    whatsappNumber: twilioWhatsAppNumber || 'not set',
  }
}
