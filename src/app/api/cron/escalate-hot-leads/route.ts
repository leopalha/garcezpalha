/**
 * Escalate Hot Leads Cron Job
 *
 * Runs every hour to alert about hot leads without contact
 *
 * Schedule: Every hour
 *
 * Escalates:
 * - Hot leads (score > 80) without response in 30 minutes
 * - High-value leads without response in 1 hour
 * - Any lead without first contact in 2 hours
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import telegramBotService from '@/lib/telegram/bot-service'
import { logger } from '@/lib/logger'

/**
 * GET - Run hot leads escalation cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      logger.error('[Escalate Hot Leads] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[Escalate Hot Leads] Starting escalation cycle...')

    const supabase = await createClient()
    const now = new Date()
    const results = {
      hotLeadsEscalated: 0,
      highValueEscalated: 0,
      noContactEscalated: 0,
    }

    // Time thresholds
    const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000)
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000)

    // 1. Hot leads (score >= 80) without response in 30 minutes
    const { data: hotLeads, error: hotError } = await supabase
      .from('leads')
      .select('id, name, email, phone, product, qualification_score, created_at, last_contact_at')
      .gte('qualification_score', 80)
      .eq('status', 'new')
      .lt('created_at', thirtyMinutesAgo.toISOString())
      .is('last_contact_at', null)
      .eq('escalated', false)
      .limit(20)

    if (hotError) throw hotError

    if (hotLeads && hotLeads.length > 0) {
      logger.info(`[Escalate Hot Leads] Found ${hotLeads.length} hot leads to escalate`)

      for (const lead of hotLeads) {
        try {
          // Send Telegram alert
          await sendTelegramAlert({
            type: 'HOT_LEAD',
            lead,
            message: `🔥 *LEAD QUENTE SEM CONTATO*\n\nScore: ${lead.qualification_score}%\nNome: ${lead.name}\nTelefone: ${lead.phone || 'N/A'}\nEmail: ${lead.email}\nProduto: ${lead.product}\n\n⏰ Há ${getMinutesSince(new Date(lead.created_at))} min sem contato!`,
          })

          // Mark as escalated
          await supabase
            .from('leads')
            .update({ escalated: true, escalated_at: now.toISOString() })
            .eq('id', lead.id)

          results.hotLeadsEscalated++
        } catch (err) {
          logger.error(`[Escalate Hot Leads] Error escalating lead ${lead.id}:`, err)
        }
      }
    }

    // 2. High-value leads (estimated value > R$ 10k) without response in 1 hour
    const { data: highValueLeads, error: hvError } = await supabase
      .from('leads')
      .select('id, name, email, phone, product, qualification_score, estimated_value, created_at')
      .gt('estimated_value', 10000)
      .eq('status', 'new')
      .lt('created_at', oneHourAgo.toISOString())
      .is('last_contact_at', null)
      .eq('escalated', false)
      .limit(15)

    if (hvError) throw hvError

    if (highValueLeads && highValueLeads.length > 0) {
      logger.info(`[Escalate Hot Leads] Found ${highValueLeads.length} high-value leads`)

      for (const lead of highValueLeads) {
        try {
          const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(lead.estimated_value || 0)

          await sendTelegramAlert({
            type: 'HIGH_VALUE',
            lead,
            message: `💰 *LEAD ALTO VALOR SEM CONTATO*\n\nValor Estimado: ${formattedValue}\nNome: ${lead.name}\nTelefone: ${lead.phone || 'N/A'}\nEmail: ${lead.email}\nProduto: ${lead.product}\n\n⏰ Há ${getMinutesSince(new Date(lead.created_at))} min sem contato!`,
          })

          await supabase
            .from('leads')
            .update({ escalated: true, escalated_at: now.toISOString() })
            .eq('id', lead.id)

          results.highValueEscalated++
        } catch (err) {
          logger.error(`[Escalate Hot Leads] Error escalating lead ${lead.id}:`, err)
        }
      }
    }

    // 3. Any leads without first contact in 2 hours
    const { data: noContactLeads, error: ncError } = await supabase
      .from('leads')
      .select('id, name, email, phone, product, created_at')
      .eq('status', 'new')
      .lt('created_at', twoHoursAgo.toISOString())
      .is('last_contact_at', null)
      .eq('escalated', false)
      .limit(20)

    if (ncError) throw ncError

    if (noContactLeads && noContactLeads.length > 0) {
      logger.info(`[Escalate Hot Leads] Found ${noContactLeads.length} leads without contact`)

      for (const lead of noContactLeads) {
        try {
          await sendTelegramAlert({
            type: 'NO_CONTACT',
            lead,
            message: `⚠️ *LEAD SEM PRIMEIRO CONTATO*\n\nNome: ${lead.name}\nTelefone: ${lead.phone || 'N/A'}\nEmail: ${lead.email}\nProduto: ${lead.product}\n\n⏰ Há ${getMinutesSince(new Date(lead.created_at))} min sem contato!`,
          })

          await supabase
            .from('leads')
            .update({ escalated: true, escalated_at: now.toISOString() })
            .eq('id', lead.id)

          results.noContactEscalated++
        } catch (err) {
          logger.error(`[Escalate Hot Leads] Error escalating lead ${lead.id}:`, err)
        }
      }
    }

    logger.info('[Escalate Hot Leads] Cycle complete:', results)

    return NextResponse.json(
      {
        success: true,
        escalated: results,
        timestamp: now.toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    logger.error('[Escalate Hot Leads] Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
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
 * Helper to calculate minutes since a date
 */
function getMinutesSince(date: Date): number {
  return Math.floor((Date.now() - date.getTime()) / (60 * 1000))
}

/**
 * Send Telegram alert to admin
 */
async function sendTelegramAlert({
  type,
  lead,
  message,
}: {
  type: string
  lead: any
  message: string
}): Promise<void> {
  try {
    // Get admin chat IDs from env or database
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

    if (!adminChatId) {
      logger.warn('[Escalate Hot Leads] No admin chat ID configured')
      return
    }

    // Add quick action links to message
    const whatsappLink = lead.phone ? `\n\n💬 WhatsApp: https://wa.me/${lead.phone?.replace(/\D/g, '')}` : ''
    const messageWithLinks = `${message}${whatsappLink}`

    await telegramBotService.sendMessage(adminChatId, messageWithLinks, {
      parse_mode: 'Markdown',
    })
  } catch (error) {
    logger.error('[Escalate Hot Leads] Telegram error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
  }
}

/**
 * POST - Manual trigger (for testing)
 */
export async function POST(request: NextRequest) {
  return GET(request)
}
