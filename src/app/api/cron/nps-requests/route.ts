/**
 * NPS Feedback Requests Cron Job
 *
 * Runs daily to send NPS satisfaction surveys
 *
 * Schedule: Daily at 10 AM Brazil time
 *
 * Sends NPS survey to clients:
 * - 7 days after service completion
 * - Once per completed service
 * - Only if not already sent
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'
import { logger } from '@/lib/logger'

/**
 * GET - Run NPS request cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      logger.error('[NPS Requests] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[NPS Requests] Starting NPS survey cycle...')

    const supabase = await createClient()
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const results = {
      surveysSent: 0,
      failed: 0,
    }

    // Get completed services that need NPS survey (7 days after completion)
    // Looking for conversations in 'completed' state that haven't received NPS yet
    const { data: completedServices, error } = await supabase
      .from('conversations')
      .select(`
        conversation_id,
        email,
        phone_number,
        client,
        classification,
        created_at,
        updated_at,
        status,
        nps_sent
      `)
      .eq('status->>state', 'completed')
      .is('nps_sent', null) // Haven't sent NPS yet
      .lt('updated_at', sevenDaysAgo.toISOString())
      .order('updated_at', { ascending: true })
      .limit(50)

    if (error) {
      logger.error('[NPS Requests] Error fetching completed services:', error)
      throw error
    }

    if (completedServices && completedServices.length > 0) {
      logger.info(`[NPS Requests] Processing ${completedServices.length} completed services`)

      for (const service of completedServices) {
        try {
          const client = service.client as any
          const clientName = client?.name || 'Cliente'
          const clientEmail = service.email || client?.email

          if (!clientEmail) {
            logger.info(`[NPS Requests] No email for conversation ${service.conversation_id}`)
            continue
          }

          const productName = (service.classification as any)?.product || 'Serviço Jurídico'
          const completionDate = new Date(service.updated_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })

          // Generate NPS URL with conversation ID
          const baseUrl = process.env.NEXTAUTH_URL || 'https://garcezpalha.com'
          const npsUrl = `${baseUrl}/nps/${service.conversation_id}`

          // Send NPS survey email
          const emailSent = await emailService.sendNPSRequest({
            to: clientEmail,
            name: clientName,
            service: productName,
            completionDate,
            npsUrl,
            serviceId: service.conversation_id,
          })

          if (emailSent) {
            results.surveysSent++

            // Mark NPS as sent
            await supabase
              .from('conversations')
              .update({
                nps_sent: true,
                nps_sent_at: now.toISOString(),
              })
              .eq('conversation_id', service.conversation_id)

            logger.info(`[NPS Requests] ✅ NPS sent to ${clientEmail} for conversation ${service.conversation_id}`)
          } else {
            results.failed++
          }
        } catch (err) {
          logger.error(`[NPS Requests] Error processing service ${service.conversation_id}:`, err)
          results.failed++
        }
      }
    } else {
      logger.info('[NPS Requests] No completed services requiring NPS surveys at this time')
    }

    logger.info('[NPS Requests] Cycle complete:', results)

    return NextResponse.json(
      {
        success: true,
        results,
        timestamp: now.toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[NPS Requests] Error:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
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
