/**
 * Gmail Monitor Cron Job
 *
 * POST /api/cron/gmail-monitor
 *
 * Runs every 15 minutes to monitor Gmail inbox for new leads
 *
 * Schedule: Every 15 minutes (vercel.json)
 *
 * Features:
 * - Fetches unread emails from last 15 minutes
 * - Creates leads automatically
 * - Sends notifications to admin
 * - Marks emails as processed
 *
 * Protected: Requires CRON_SECRET header
 */

import { NextRequest, NextResponse } from 'next/server'
import { GmailMonitorService } from '@/lib/email/gmail-monitor'
import { createClient } from '@/lib/supabase/server'
import { emailService } from '@/lib/email/email-service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds max

const gmailMonitor = new GmailMonitorService()

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Cron] Unauthorized Gmail monitor attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Cron] Starting Gmail monitor...')

    // Check if Gmail API is configured
    if (!gmailMonitor.isConfigured()) {
      console.warn('[Cron] Gmail API not configured, skipping monitor')
      return NextResponse.json({
        success: false,
        error: 'Gmail API not configured',
        message: 'Configure GMAIL_* environment variables',
      })
    }

    // Fetch recent unread emails
    const emails = await gmailMonitor.fetchRecentEmails()

    console.log(`[Cron] Found ${emails.length} new emails`)

    if (emails.length === 0) {
      return NextResponse.json({
        success: true,
        emailsFound: 0,
        leadsCreated: 0,
        message: 'No new emails found',
        timestamp: new Date().toISOString(),
      })
    }

    // Process emails and create leads
    const supabase = await createClient()
    let leadsCreated = 0
    const createdLeads: any[] = []

    for (const email of emails) {
      try {
        // Extract email address
        const emailMatch = email.from.match(/<([^>]+)>/) || [null, email.from]
        const emailAddress = emailMatch[1] || email.from

        // Extract name
        const nameMatch = email.from.match(/^([^<]+)/)
        const name = nameMatch ? nameMatch[1].trim() : 'Lead via Email'

        // Check if lead already exists
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id')
          .eq('email', emailAddress)
          .single()

        if (existingLead) {
          console.log(`[Cron] Lead already exists: ${emailAddress}`)
          continue
        }

        // Create new lead
        const { data: newLead, error: insertError } = await supabase
          .from('leads')
          .insert({
            name,
            email: emailAddress,
            source: 'gmail',
            status: 'new',
            notes: `📧 Email automático\n\nRecebido: ${email.receivedAt.toLocaleString('pt-BR')}\nAssunto: ${email.subject}\n\nMensagem:\n${email.body.substring(0, 500)}${email.body.length > 500 ? '...' : ''}`,
            created_at: email.receivedAt.toISOString(),
          })
          .select()
          .single()

        if (!insertError && newLead) {
          leadsCreated++
          createdLeads.push(newLead)
          console.log(`[Cron] Lead created: ${name} <${emailAddress}>`)
        } else {
          console.error(`[Cron] Error creating lead:`, insertError)
        }
      } catch (error) {
        console.error(`[Cron] Error processing email:`, error)
      }
    }

    // Notify admin if high-quality leads were created
    if (leadsCreated > 0) {
      await notifyAdminNewLeads(createdLeads)
    }

    const response = {
      success: true,
      emailsFound: emails.length,
      leadsCreated,
      timestamp: new Date().toISOString(),
      message: `Gmail monitor complete: ${leadsCreated} leads created from ${emails.length} emails`,
    }

    console.log('[Cron] Gmail monitor result:', response)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('[Cron] Gmail monitor error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * Notify admin about new leads
 */
async function notifyAdminNewLeads(leads: any[]) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'leonardo.palha@gmail.com'

    const leadsHtml = leads
      .map(
        (lead) => `
      <div style="background: white; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #c9a227;">
        <p style="margin: 0 0 8px;"><strong>👤 Nome:</strong> ${lead.name}</p>
        <p style="margin: 0 0 8px;"><strong>📧 Email:</strong> ${lead.email}</p>
        <p style="margin: 0 0 8px;"><strong>📋 Fonte:</strong> Gmail (automático)</p>
        <p style="margin: 0 0 8px;"><strong>⏰ Recebido:</strong> ${new Date(lead.created_at).toLocaleString('pt-BR')}</p>
        <p style="margin: 0;"><strong>📝 Notas:</strong></p>
        <p style="margin: 5px 0 0; color: #666; font-size: 14px; white-space: pre-wrap;">${lead.notes}</p>
      </div>
    `
      )
      .join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">📧 Novos Leads via Gmail</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">${leads.length} novo${leads.length > 1 ? 's' : ''} lead${leads.length > 1 ? 's' : ''}</p>
        </div>
        <div style="padding: 30px; background: #f7f8fa;">
          <p>Olá,</p>
          <p>O sistema detectou <strong>${leads.length} novo${leads.length > 1 ? 's' : ''} lead${leads.length > 1 ? 's' : ''}</strong> via Gmail:</p>
          ${leadsHtml}
          <div style="margin-top: 20px; text-align: center;">
            <a href="https://garcezpalha.com/admin/leads"
               style="background: #c9a227; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
              Ver Leads no Sistema
            </a>
          </div>
        </div>
        <div style="background: #1a365d; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Garcez Palha - Sistema Automático de Leads</p>
        </div>
      </div>
    `

    const text = `Novos Leads via Gmail\n\n${leads.map((l) => `👤 ${l.name}\n📧 ${l.email}\n\n${l.notes}\n\n---\n\n`).join('')}`

    await emailService.sendCustomEmail({
      to: adminEmail,
      subject: `🔔 ${leads.length} Novo${leads.length > 1 ? 's' : ''} Lead${leads.length > 1 ? 's' : ''} via Gmail`,
      html,
      text,
      tags: ['lead', 'notification', 'gmail'],
    })

    console.log(`[Cron] Admin notified about ${leads.length} new leads`)
  } catch (error) {
    console.error('[Cron] Error notifying admin:', error)
  }
}
