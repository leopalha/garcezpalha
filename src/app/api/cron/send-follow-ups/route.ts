/**
 * Send Follow-ups Cron Job
 *
 * Runs every 30 minutes to send scheduled follow-up messages
 *
 * Schedule: Every 30 minutes
 *
 * Sends:
 * - Scheduled WhatsApp follow-ups
 * - Email follow-ups for leads
 * - Document request reminders
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { whatsappCloudAPI } from '@/lib/whatsapp/cloud-api'
import { emailService } from '@/lib/email/email-service'
import { logger } from '@/lib/logger'

interface ScheduledFollowUp {
  id: string
  lead_id: string
  message_type: string
  message_content: string
  channel: 'whatsapp' | 'email'
  scheduled_for: string
  lead: {
    name: string
    email: string
    phone: string
  }
}

/**
 * GET - Run follow-up sending cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      logger.error('[Send Follow-ups] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[Send Follow-ups] Starting follow-up cycle...')

    const supabase = await createClient()
    const now = new Date()
    const results = {
      whatsappSent: 0,
      emailSent: 0,
      failed: 0,
    }

    // Get scheduled follow-ups that are due
    const { data: followUps, error } = await supabase
      .from('scheduled_follow_ups')
      .select(`
        id,
        lead_id,
        message_type,
        message_content,
        channel,
        scheduled_for,
        lead:leads(name, email, phone)
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', now.toISOString())
      .order('scheduled_for', { ascending: true })
      .limit(50)

    if (error) throw error

    if (!followUps || followUps.length === 0) {
      logger.info('[Send Follow-ups] No follow-ups to send')
      return NextResponse.json(
        {
          success: true,
          sent: results,
          timestamp: now.toISOString(),
        },
        { status: 200 }
      )
    }

    logger.info(`[Send Follow-ups] Processing ${followUps.length} follow-ups`)

    for (const followUp of followUps as any[]) {
      try {
        const lead = followUp.lead

        if (!lead) {
          logger.warn(`[Send Follow-ups] Lead not found for follow-up ${followUp.id}`)
          continue
        }

        let sent = false

        if (followUp.channel === 'whatsapp' && lead.phone) {
          // Send WhatsApp message
          if (whatsappCloudAPI.isConfigured()) {
            await whatsappCloudAPI.sendMessage(
              lead.phone,
              followUp.message_content,
              true // Include OAB disclaimer
            )
            results.whatsappSent++
            sent = true
          }
        } else if (followUp.channel === 'email' && lead.email) {
          // Send email
          const emailSent = await emailService.sendCustomEmail({
            to: lead.email,
            subject: `Olá ${lead.name}, temos uma mensagem para você`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">Garcez Palha</h1>
                </div>
                <div style="padding: 30px; background: #f7f8fa;">
                  <p>Olá <strong>${lead.name}</strong>,</p>
                  <div style="white-space: pre-wrap;">${followUp.message_content}</div>
                </div>
                <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
                  <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
                  <p style="margin: 5px 0 0;">📞 (21) 99535-4010 | contato@garcezpalha.com</p>
                </div>
              </div>
            `,
            text: `Olá ${lead.name},\n\n${followUp.message_content}\n\nGarcez Palha - (21) 99535-4010`,
            tags: ['follow-up', followUp.message_type],
          })

          if (emailSent) {
            results.emailSent++
            sent = true
          }
        }

        // Update follow-up status
        await supabase
          .from('scheduled_follow_ups')
          .update({
            status: sent ? 'sent' : 'failed',
            sent_at: sent ? now.toISOString() : null,
          })
          .eq('id', followUp.id)

        if (!sent) {
          results.failed++
        }
      } catch (err) {
        logger.error(`[Send Follow-ups] Error sending follow-up ${followUp.id}:`, err)
        results.failed++

        // Mark as failed
        await supabase
          .from('scheduled_follow_ups')
          .update({ status: 'failed' })
          .eq('id', followUp.id)
      }
    }

    logger.info('[Send Follow-ups] Cycle complete:', results)

    return NextResponse.json(
      {
        success: true,
        sent: results,
        timestamp: now.toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Send Follow-ups] Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
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
 * POST - Manual trigger (for testing)
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
