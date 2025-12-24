/**
 * Judit.io Webhook Endpoint
 *
 * Receives notifications when legal processes have movements, status changes, or deadlines
 *
 * URL: https://garcezpalha.com/api/judit/webhook
 * Method: POST
 *
 * Events:
 * - process.movement - New movement in a process
 * - process.status_change - Process status changed
 * - process.deadline - New deadline detected
 *
 * Setup in Judit.io Dashboard:
 * 1. Go to Settings → Webhooks
 * 2. Add new webhook
 * 3. URL: https://garcezpalha.com/api/judit/webhook
 * 4. Events: process.movement, process.status_change, process.deadline
 * 5. Add secret to .env: JUDIT_WEBHOOK_SECRET
 */

import { NextRequest, NextResponse } from 'next/server'
import { juditService, type JuditWebhookPayload } from '@/lib/monitoring/judit-service'

/**
 * POST - Receive webhook from Judit.io
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-judit-signature') || ''

    // Verify webhook signature (security)
    if (!juditService.verifyWebhookSignature(signature, body)) {
      console.error('[Judit Webhook] Invalid signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload: JuditWebhookPayload = JSON.parse(body)

    console.log('[Judit Webhook] Received event:', payload.event, payload.process_number)

    // Process the webhook
    await juditService.handleWebhook(payload)

    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (error) {
    console.error('[Judit Webhook] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * GET - Health check for webhook endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'judit-webhook',
    configured: juditService.isConfigured(),
    timestamp: new Date().toISOString(),
  })
}
