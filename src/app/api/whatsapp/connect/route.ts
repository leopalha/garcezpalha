import { NextResponse } from 'next/server'

/**
 * POST /api/whatsapp/connect
 *
 * DEPRECATED: This endpoint was for WhatsApp Baileys library.
 * We now use WhatsApp Cloud API which doesn't require QR code scanning.
 *
 * See: /api/whatsapp-cloud/webhook for the new implementation
 */
export async function POST() {
  return NextResponse.json({
    success: false,
    message: 'Este endpoint foi descontinuado. Usamos agora a WhatsApp Cloud API.',
    info: 'Configure WHATSAPP_CLOUD_* variáveis de ambiente para usar a nova API.',
    docs: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
  }, { status: 410 }) // 410 Gone
}

/**
 * GET /api/whatsapp/connect
 * Returns deprecated status
 */
export async function GET() {
  return NextResponse.json({
    status: 'deprecated',
    message: 'WhatsApp Baileys foi substituído por WhatsApp Cloud API',
    connected: false,
    newEndpoint: '/api/whatsapp-cloud/webhook',
  })
}
