/**
 * Payment Reminders Cron Job
 *
 * Runs twice daily to send payment reminders
 *
 * Schedule: Daily at 9 AM and 6 PM Brazil time
 *
 * Sends reminders for:
 * - Pending payment links (24h, 48h, 7 days after creation)
 * - Overdue invoices
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { whatsappCloudAPI } from '@/lib/whatsapp/cloud-api'
import { emailService } from '@/lib/email/email-service'

/**
 * GET - Run payment reminder cycle
 *
 * Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`

    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      console.error('[Payment Reminders] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Payment Reminders] Starting reminder cycle...')

    const supabase = await createClient()
    const now = new Date()
    const results = {
      remindersSent: 0,
      overdueAlerts: 0,
      failed: 0,
    }

    // Calculate reminder windows
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Get pending payment links that need reminders
    const { data: pendingPayments, error } = await supabase
      .from('payment_links')
      .select(`
        id,
        amount,
        description,
        payment_url,
        created_at,
        reminder_count,
        lead:leads(name, email, phone)
      `)
      .eq('status', 'pending')
      .in('reminder_count', [0, 1, 2]) // Max 3 reminders
      .lt('created_at', oneDayAgo.toISOString())
      .order('created_at', { ascending: true })
      .limit(30)

    if (error) throw error

    if (pendingPayments && pendingPayments.length > 0) {
      console.log(`[Payment Reminders] Processing ${pendingPayments.length} pending payments`)

      for (const payment of pendingPayments as any[]) {
        try {
          const lead = payment.lead
          if (!lead) continue

          const createdAt = new Date(payment.created_at)
          const daysSinceCreation = Math.floor(
            (now.getTime() - createdAt.getTime()) / (24 * 60 * 60 * 1000)
          )

          // Determine if reminder should be sent
          // 0 reminders: send after 24h (day 1)
          // 1 reminder: send after 48h (day 2)
          // 2 reminders: send after 7 days (day 7)
          let shouldSend = false
          if (payment.reminder_count === 0 && daysSinceCreation >= 1) shouldSend = true
          if (payment.reminder_count === 1 && daysSinceCreation >= 2) shouldSend = true
          if (payment.reminder_count === 2 && daysSinceCreation >= 7) shouldSend = true

          if (!shouldSend) continue

          const formattedAmount = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(payment.amount / 100)

          const urgencyEmoji = daysSinceCreation >= 7 ? '⚠️' : '📋'
          const urgencyText = daysSinceCreation >= 7 ? 'Última Chance' : 'Lembrete'

          // Send WhatsApp reminder
          if (lead.phone && whatsappCloudAPI.isConfigured()) {
            const message = `${urgencyEmoji} *${urgencyText} de Pagamento*

Olá ${lead.name},

Identificamos que você ainda não finalizou o pagamento:

*Serviço:* ${payment.description}
*Valor:* ${formattedAmount}

🔗 Link para pagamento: ${payment.payment_url}

Se você já efetuou o pagamento, por favor desconsidere esta mensagem.

---
Garcez Palha - Consultoria Jurídica & Pericial
📞 (21) 99535-4010`

            try {
              await whatsappCloudAPI.sendMessage(lead.phone, message, true)
              results.remindersSent++
            } catch (err) {
              console.error('[Payment Reminders] WhatsApp error:', err)
            }
          }

          // Send email reminder
          if (lead.email) {
            const emailSent = await emailService.sendCustomEmail({
              to: lead.email,
              subject: `${urgencyEmoji} ${urgencyText} de Pagamento - Garcez Palha`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Garcez Palha</h1>
                  </div>
                  <div style="padding: 30px; background: #f7f8fa;">
                    <h2 style="color: #1a365d;">${urgencyEmoji} ${urgencyText} de Pagamento</h2>
                    <p>Olá <strong>${lead.name}</strong>,</p>
                    <p>Identificamos que você ainda não finalizou o pagamento:</p>
                    <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #c9a227;">
                      <p style="margin: 0 0 10px;"><strong>Serviço:</strong> ${payment.description}</p>
                      <p style="margin: 0; font-size: 24px; color: #c9a227;"><strong>${formattedAmount}</strong></p>
                    </div>
                    <p style="text-align: center;">
                      <a href="${payment.payment_url}" style="display: inline-block; background: #c9a227; color: white; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: bold; font-size: 16px;">Realizar Pagamento</a>
                    </p>
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">Se você já efetuou o pagamento, por favor desconsidere esta mensagem.</p>
                  </div>
                  <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
                    <p style="margin: 0;">Garcez Palha - Consultoria Jurídica & Pericial</p>
                    <p style="margin: 5px 0 0;">📞 (21) 99535-4010 | contato@garcezpalha.com</p>
                  </div>
                </div>
              `,
              text: `${urgencyText} de Pagamento\n\nOlá ${lead.name},\n\nIdentificamos que você ainda não finalizou o pagamento:\n\nServiço: ${payment.description}\nValor: ${formattedAmount}\n\nLink: ${payment.payment_url}\n\nGarcez Palha - (21) 99535-4010`,
              tags: ['payment-reminder', 'invoice'],
            })

            if (emailSent) {
              results.remindersSent++
            }
          }

          // Update reminder count
          await supabase
            .from('payment_links')
            .update({
              reminder_count: payment.reminder_count + 1,
              last_reminder_at: now.toISOString(),
            })
            .eq('id', payment.id)
        } catch (err) {
          console.error(`[Payment Reminders] Error processing payment ${payment.id}:`, err)
          results.failed++
        }
      }
    }

    console.log('[Payment Reminders] Cycle complete:', results)

    return NextResponse.json(
      {
        success: true,
        results,
        timestamp: now.toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Payment Reminders] Error:', error instanceof Error ? error.message : String(error))
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
