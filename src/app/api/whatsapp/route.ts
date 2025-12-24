import { NextRequest, NextResponse } from 'next/server'
import { sendTwilioMessage } from '@/lib/whatsapp/twilio-client'

/**
 * POST /api/whatsapp
 * Webhook simplificado para Twilio WhatsApp
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const from = formData.get('From')?.toString() || ''
    const body = formData.get('Body')?.toString() || ''

    console.log('[WhatsApp] Mensagem recebida de:', from)
    console.log('[WhatsApp] Conteúdo:', body)

    if (!from || !body) {
      return new NextResponse('', { status: 200 })
    }

    // Extrair número
    const phoneNumber = from.replace('whatsapp:', '').replace('+', '')

    // Chamar API de qualificação
    const qualifyResponse = await fetch(`${request.nextUrl.origin}/api/chat/qualify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: phoneNumber,
        message: body,
        source: 'whatsapp',
        clientInfo: { phone: phoneNumber }
      })
    })

    if (qualifyResponse.ok) {
      const data = await qualifyResponse.json()
      const reply = data.response || data.message || 'Olá! Como posso ajudar?'

      console.log('[WhatsApp] Enviando resposta:', reply)
      await sendTwilioMessage(phoneNumber, reply)
    }

    return new NextResponse('', { status: 200 })
  } catch (error) {
    console.error('[WhatsApp] Erro:', error)
    return new NextResponse('', { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'WhatsApp Webhook',
    status: 'active',
    timestamp: new Date().toISOString()
  })
}
