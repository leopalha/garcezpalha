/**
 * Gmail Monitor API
 *
 * POST /api/gmail/monitor
 *
 * Monitors Gmail inbox for new lead emails and creates leads automatically
 *
 * Features:
 * - Fetches recent unread emails (last 15 minutes)
 * - Parses email content and extracts lead information
 * - Creates leads in database
 * - Marks emails as processed
 *
 * Protected: Requires CRON_SECRET header (called by cron job)
 */

import { NextRequest, NextResponse } from 'next/server'
import { GmailMonitorService } from '@/lib/email/gmail-monitor'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds max

const gmailMonitor = new GmailMonitorService()

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret (only for automated cron calls)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn('[Gmail Monitor] Unauthorized access attempt')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Gmail Monitor] Starting email scan...')

    // Check if Gmail API is configured
    if (!gmailMonitor.isConfigured()) {
      console.warn('[Gmail Monitor] Gmail API not configured')
      return NextResponse.json({
        success: false,
        error: 'Gmail API not configured',
        message: 'Configure GMAIL_* environment variables',
        leadsCreated: 0,
      })
    }

    // Fetch recent emails
    const emails = await gmailMonitor.fetchRecentEmails()

    console.log(`[Gmail Monitor] Found ${emails.length} new emails`)

    if (emails.length === 0) {
      return NextResponse.json({
        success: true,
        leadsCreated: 0,
        message: 'No new emails found',
      })
    }

    // Process emails and create leads
    const supabase = await createClient()
    let leadsCreated = 0

    for (const email of emails) {
      try {
        // Extract email address from "Name <email@example.com>" format
        const emailMatch = email.from.match(/<([^>]+)>/) || [null, email.from]
        const emailAddress = emailMatch[1] || email.from

        // Extract name (before <email>)
        const nameMatch = email.from.match(/^([^<]+)/)
        const name = nameMatch ? nameMatch[1].trim() : 'Lead via Email'

        // Check if lead already exists
        const { data: existingLead } = await supabase
          .from('leads')
          .select('id')
          .eq('email', emailAddress)
          .single()

        if (existingLead) {
          console.log(`[Gmail Monitor] Lead already exists: ${emailAddress}`)
          continue
        }

        // Create new lead
        const { error: insertError } = await supabase.from('leads').insert({
          name,
          email: emailAddress,
          source: 'gmail',
          status: 'new',
          notes: `📧 Email automático\n\nAssunto: ${email.subject}\n\nMensagem:\n${email.body.substring(0, 500)}${email.body.length > 500 ? '...' : ''}`,
          created_at: email.receivedAt.toISOString(),
        })

        if (!insertError) {
          leadsCreated++
          console.log(`[Gmail Monitor] Lead created: ${name} <${emailAddress}>`)
        } else {
          console.error(`[Gmail Monitor] Error creating lead:`, insertError)
        }
      } catch (error) {
        console.error(`[Gmail Monitor] Error processing email:`, error)
      }
    }

    const response = {
      success: true,
      emailsFound: emails.length,
      leadsCreated,
      timestamp: new Date().toISOString(),
      message: `Gmail monitor complete: ${leadsCreated} leads created from ${emails.length} emails`,
    }

    console.log('[Gmail Monitor] Scan complete:', response)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('[Gmail Monitor] Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Unknown error',
        leadsCreated: 0,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}

/**
 * MANUAL TEST:
 *
 * curl -X POST http://localhost:3000/api/gmail/monitor \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 *
 * PRODUCTION TEST:
 *
 * curl -X POST https://garcezpalha.com/api/gmail/monitor \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 *
 * ENVIRONMENT VARIABLES REQUIRED:
 * - CRON_SECRET: Secret token for cron job authentication
 * - GMAIL_CLIENT_ID: Google OAuth2 client ID
 * - GMAIL_CLIENT_SECRET: Google OAuth2 client secret
 * - GMAIL_REFRESH_TOKEN: Google OAuth2 refresh token
 */
