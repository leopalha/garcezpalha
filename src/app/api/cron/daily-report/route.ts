/**
 * Daily Report Cron Job
 *
 * Runs daily to send a summary report via Telegram
 *
 * Schedule: Daily at 8 AM Brazil time
 *
 * Reports:
 * - Yesterday's leads and conversions
 * - Revenue metrics
 * - Pending tasks and deadlines
 * - Agent performance summary
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import telegramBotService from '@/lib/telegram/bot-service'

/**
 * GET - Generate and send daily report
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      console.error('[Daily Report] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Daily Report] Generating daily report...')

    const supabase = await createClient()
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const today = new Date(now)
    today.setHours(0, 0, 0, 0)

    // Collect metrics
    const metrics = {
      leads: { new: 0, qualified: 0, converted: 0 },
      revenue: { total: 0, average: 0 },
      processes: { active: 0, completed: 0 },
      deadlines: { today: 0, thisWeek: 0 },
      content: { published: 0, scheduled: 0 },
    }

    // 1. Leads metrics
    const { count: newLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())

    metrics.leads.new = newLeads || 0

    const { count: qualifiedLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('qualified_at', yesterday.toISOString())
      .lt('qualified_at', today.toISOString())

    metrics.leads.qualified = qualifiedLeads || 0

    const { count: convertedLeads } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'converted')
      .gte('converted_at', yesterday.toISOString())
      .lt('converted_at', today.toISOString())

    metrics.leads.converted = convertedLeads || 0

    // 2. Revenue metrics
    const { data: payments } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())

    if (payments && payments.length > 0) {
      metrics.revenue.total = payments.reduce((sum, p) => sum + (p.amount || 0), 0) / 100
      metrics.revenue.average = metrics.revenue.total / payments.length
    }

    // 3. Process metrics
    const { count: activeProcesses } = await supabase
      .from('process_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    metrics.processes.active = activeProcesses || 0

    // 4. Deadline metrics
    const endOfWeek = new Date(now)
    endOfWeek.setDate(endOfWeek.getDate() + 7)

    const { count: todayDeadlines } = await supabase
      .from('process_deadlines')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .gte('due_date', today.toISOString())
      .lt('due_date', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())

    metrics.deadlines.today = todayDeadlines || 0

    const { count: weekDeadlines } = await supabase
      .from('process_deadlines')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .gte('due_date', today.toISOString())
      .lt('due_date', endOfWeek.toISOString())

    metrics.deadlines.thisWeek = weekDeadlines || 0

    // 5. Content metrics
    const { count: publishedContent } = await supabase
      .from('content_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('published_at', yesterday.toISOString())
      .lt('published_at', today.toISOString())

    metrics.content.published = publishedContent || 0

    const { count: scheduledContent } = await supabase
      .from('content_posts')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'scheduled')
      .gte('scheduled_for', today.toISOString())
      .lt('scheduled_for', endOfWeek.toISOString())

    metrics.content.scheduled = scheduledContent || 0

    // Format report
    const conversionRate =
      metrics.leads.new > 0
        ? ((metrics.leads.converted / metrics.leads.new) * 100).toFixed(1)
        : '0'

    const formattedRevenue = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(metrics.revenue.total)

    const dateStr = yesterday.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })

    const report = `📊 *RELATÓRIO DIÁRIO*
_${dateStr}_

*📈 LEADS*
• Novos: ${metrics.leads.new}
• Qualificados: ${metrics.leads.qualified}
• Convertidos: ${metrics.leads.converted}
• Taxa: ${conversionRate}%

*💰 RECEITA*
• Total: ${formattedRevenue}
${metrics.revenue.average > 0 ? `• Ticket médio: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(metrics.revenue.average)}` : ''}

*⚖️ PROCESSOS*
• Ativos: ${metrics.processes.active}

*📅 PRAZOS*
• Hoje: ${metrics.deadlines.today}
• Esta semana: ${metrics.deadlines.thisWeek}

*📝 CONTEÚDO*
• Publicados ontem: ${metrics.content.published}
• Agendados semana: ${metrics.content.scheduled}

---
_Relatório gerado automaticamente pelo Sistema IA_
_Garcez Palha - ${now.toLocaleTimeString('pt-BR')}_`

    // Send to Telegram
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID

    if (adminChatId) {
      await telegramBotService.sendMessage(adminChatId, report, {
        parse_mode: 'Markdown',
      })
    }

    console.log('[Daily Report] Report sent successfully')

    return NextResponse.json(
      {
        success: true,
        metrics,
        timestamp: now.toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Daily Report] Error:', error instanceof Error ? error instanceof Error ? error.message : String(error) : String(error))
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
