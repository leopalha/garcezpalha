import { NextResponse } from 'next/server'

/**
 * GET /api/whatsapp/qr
 *
 * DEPRECATED: This endpoint was for WhatsApp Baileys library QR code authentication.
 * We now use WhatsApp Cloud API which doesn't require QR code scanning.
 *
 * See: /api/whatsapp-cloud/webhook for the new implementation
 */
export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'QR code não é mais necessário. Usamos WhatsApp Cloud API.',
    info: 'A autenticação agora é via Meta Business Suite.',
    docs: 'https://developers.facebook.com/docs/whatsapp/cloud-api/get-started',
    newEndpoint: '/api/whatsapp-cloud/webhook',
  }, { status: 410 }) // 410 Gone - Resource no longer available
}
