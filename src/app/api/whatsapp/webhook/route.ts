/**
 * WhatsApp Webhook Endpoint (Legacy)
 *
 * DEPRECATED: Use /api/whatsapp-cloud/webhook instead
 * This endpoint is kept for backwards compatibility
 */

import { NextRequest, NextResponse } from 'next/server'

/**
 * GET - Webhook Verification
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === 'subscribe' && token === verifyToken) {
    console.log('[WhatsApp Legacy] Webhook verified')
    return new NextResponse(challenge, { status: 200 })
  } else {
    return new NextResponse('Forbidden', { status: 403 })
  }
}

/**
 * POST - Redirect to new endpoint
 */
export async function POST(request: NextRequest) {
  // Redirect to new unified webhook
  const body = await request.text()

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/whatsapp-cloud/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hub-signature-256': request.headers.get('x-hub-signature-256') || '',
    },
    body,
  })

  const data = await response.json()
  return NextResponse.json(data, { status: response.status })
}
