/**
 * Resend Webhook Handler
 *
 * Receives webhook events from Resend for email tracking:
 * - delivered: Email successfully delivered
 * - opened: Recipient opened the email
 * - clicked: Recipient clicked a link
 * - bounced: Email bounced (invalid address, full inbox, etc.)
 * - complained: Marked as spam
 *
 * Setup:
 * 1. Go to https://resend.com/webhooks
 * 2. Add webhook endpoint: https://garcezpalha.com/api/resend/webhook
 * 3. Subscribe to: delivered, opened, clicked, bounced, complained
 * 4. Copy signing secret to RESEND_WEBHOOK_SECRET env var
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'
import { logger } from '@/lib/logger'

interface ResendWebhookEvent {
  type: 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained'
  created_at: string
  data: {
    email_id: string
    to: string
    from: string
    subject: string
    created_at: string
    link?: string // For click events
    bounce_type?: string // For bounce events
  }
}

/**
 * Verify Resend webhook signature
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return hash === signature
}

/**
 * POST - Handle Resend webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text()
    const signature = request.headers.get('resend-signature')

    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production' && process.env.RESEND_WEBHOOK_SECRET) {
      if (!signature) {
        logger.error('[Resend Webhook] Missing signature')
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
      }

      const isValid = verifySignature(rawBody, signature, process.env.RESEND_WEBHOOK_SECRET)
      if (!isValid) {
        logger.error('[Resend Webhook] Invalid signature')
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event: ResendWebhookEvent = JSON.parse(rawBody)
    logger.info('[Resend Webhook] Received event:', event.type)

    // Store event in database
    await storeEmailEvent(event)

    // Process specific event types
    switch (event.type) {
      case 'email.delivered':
        await handleDelivered(event)
        break

      case 'email.opened':
        await handleOpened(event)
        break

      case 'email.clicked':
        await handleClicked(event)
        break

      case 'email.bounced':
        await handleBounced(event)
        break

      case 'email.complained':
        await handleComplained(event)
        break

      default:
        logger.info('[Resend Webhook] Unknown event type:', event.type)
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    logger.error('[Resend Webhook] Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * Store email event in database
 */
async function storeEmailEvent(event: ResendWebhookEvent): Promise<void> {
  const supabase = await createClient()

  try {
    // Extract event type (remove 'email.' prefix)
    const eventType = event.type.replace('email.', '')

    await supabase.from('email_events').insert({
      resend_id: event.data.email_id,
      event_type: eventType,
      email_to: event.data.to,
      occurred_at: event.created_at,
      metadata: {
        from: event.data.from,
        subject: event.data.subject,
        link: event.data.link,
        bounce_type: event.data.bounce_type,
      },
    })

    logger.info('[Resend Webhook] Event stored:', eventType, event.data.email_id)
  } catch (error) {
    logger.error('[Resend Webhook] Error storing event:', error)
    // Don't throw - we don't want to fail the webhook response
  }
}

/**
 * Handle delivered event
 */
async function handleDelivered(event: ResendWebhookEvent): Promise<void> {
  logger.info('[Resend Webhook] Email delivered:', event.data.to)
  // Future: Update email_logs status to 'delivered'
}

/**
 * Handle opened event
 */
async function handleOpened(event: ResendWebhookEvent): Promise<void> {
  logger.info('[Resend Webhook] Email opened:', event.data.to)

  // Future enhancement: Track engagement metrics
  // - Update lead quality score
  // - Trigger follow-up actions
  // - Analytics dashboard
}

/**
 * Handle clicked event
 */
async function handleClicked(event: ResendWebhookEvent): Promise<void> {
  logger.info('[Resend Webhook] Link clicked:', event.data.link, 'by', event.data.to)

  // Future enhancement: Track click-through rates
  // - Which CTAs perform best
  // - User journey mapping
  // - A/B testing results
}

/**
 * Handle bounced event
 */
async function handleBounced(event: ResendWebhookEvent): Promise<void> {
  logger.info('[Resend Webhook] Email bounced:', event.data.to, event.data.bounce_type)

  const supabase = await createClient()

  try {
    // Mark email as invalid in leads table
    if (event.data.bounce_type === 'hard') {
      await supabase
        .from('leads')
        .update({ email_valid: false })
        .eq('email', event.data.to)

      logger.info('[Resend Webhook] Marked email as invalid:', event.data.to)
    }

    // Future: Pause email sequences for this lead
  } catch (error) {
    logger.error('[Resend Webhook] Error handling bounce:', error)
  }
}

/**
 * Handle complained event (marked as spam)
 */
async function handleComplained(event: ResendWebhookEvent): Promise<void> {
  logger.info('[Resend Webhook] Spam complaint:', event.data.to)

  const supabase = await createClient()

  try {
    // Cancel all email sequences for this lead
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', event.data.to)
      .single()

    if (lead) {
      await supabase
        .from('email_sequences')
        .update({ status: 'cancelled' })
        .eq('lead_id', lead.id)
        .in('status', ['active', 'paused'])

      logger.info('[Resend Webhook] Cancelled sequences for lead:', lead.id)
    }

    // Future: Add to unsubscribe list
  } catch (error) {
    logger.error('[Resend Webhook] Error handling complaint:', error)
  }
}
