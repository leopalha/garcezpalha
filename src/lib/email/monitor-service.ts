/**
 * Email Monitor Service
 *
 * FREE Alternative to Judit.io (saves R$ 12,000/year)
 *
 * Monitors Gmail inbox for tribunal notifications:
 * - TJ-RJ (Tribunal de Justiça do Rio de Janeiro)
 * - STJ (Superior Tribunal de Justiça)
 * - Other Brazilian courts
 *
 * Gmail API Setup:
 * 1. Create project: https://console.cloud.google.com
 * 2. Enable Gmail API
 * 3. Create OAuth2 credentials
 * 4. Get refresh token for your account
 * 5. Add to .env:
 *    GMAIL_CLIENT_ID=your_client_id
 *    GMAIL_CLIENT_SECRET=your_client_secret
 *    GMAIL_REFRESH_TOKEN=your_refresh_token
 *
 * Docs: https://developers.google.com/gmail/api
 */

import { google } from 'googleapis'
import type { gmail_v1 } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'
import { createClient } from '@/lib/supabase/server'

const gmail = google.gmail('v1')

interface TribunalEmail {
  id: string
  subject: string
  from: string
  date: Date
  processNumber?: string
  tribunal?: string
  updateType?: string
  snippet: string
  hasAttachment: boolean
}

interface ProcessAlert {
  process_number: string
  tribunal: string
  update_type: string
  email_subject: string
  email_date: Date
  email_snippet: string
  has_attachment: boolean
  status: 'pending' | 'downloaded' | 'processed'
}

class EmailMonitorService {
  private oauth2Client: OAuth2Client | null = null

  constructor() {
    if (this.isConfigured()) {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      )

      this.oauth2Client.setCredentials({
        refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      })
    }
  }

  /**
   * Check if Gmail API is configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN
    )
  }

  /**
   * Fetch recent emails from Gmail
   * @param maxResults - Number of emails to fetch (default: 50)
   * @param daysBack - How many days back to search (default: 7)
   */
  async fetchRecentEmails(
    maxResults: number = 50,
    daysBack: number = 7
  ): Promise<TribunalEmail[]> {
    if (!this.isConfigured()) {
      console.warn('Gmail API not configured')
      return []
    }

    try {
      // Calculate date filter (emails from last N days)
      const dateFilter = new Date()
      dateFilter.setDate(dateFilter.getDate() - daysBack)
      const afterDate = dateFilter.toISOString().split('T')[0].replace(/-/g, '/')

      // Search query for tribunal emails
      const query = `after:${afterDate} (from:tjrj.jus.br OR from:stj.jus.br OR from:trf2.jus.br OR subject:"processo" OR subject:"citação" OR subject:"intimação" OR subject:"sentença")`

      const response = await gmail.users.messages.list({
        auth: this.oauth2Client,
        userId: 'me',
        q: query,
        maxResults,
      })

      const messages = response.data.messages || []
      const emails: TribunalEmail[] = []

      // Fetch details for each message
      for (const message of messages) {
        const details = await gmail.users.messages.get({
          auth: this.oauth2Client,
          userId: 'me',
          id: message.id!,
          format: 'full',
        })

        const headers = details.data.payload?.headers || []
        const subject = headers.find((h) => h.name === 'Subject')?.value || ''
        const from = headers.find((h) => h.name === 'From')?.value || ''
        const dateStr = headers.find((h) => h.name === 'Date')?.value || ''

        // Extract process number from subject/body
        const processNumber = this.extractProcessNumber(subject)
        const tribunal = this.identifyTribunal(from, subject)
        const updateType = this.classifyUpdateType(subject)

        // Check for attachments
        const hasAttachment = this.hasAttachments(details.data.payload)

        emails.push({
          id: message.id!,
          subject,
          from,
          date: new Date(dateStr),
          processNumber,
          tribunal,
          updateType,
          snippet: details.data.snippet || '',
          hasAttachment,
        })
      }

      return emails
    } catch (error) {
      console.error('Gmail API error:', error)
      return []
    }
  }

  /**
   * Extract Brazilian process number from text
   * Format: NNNNNNN-DD.YYYY.J.TR.OOOO
   * Example: 0123456-78.2023.8.19.0001
   */
  private extractProcessNumber(text: string): string | undefined {
    // Brazilian unified process number format (CNJ)
    const pattern = /(\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4})/g
    const matches = text.match(pattern)
    return matches ? matches[0] : undefined
  }

  /**
   * Identify which tribunal sent the email
   */
  private identifyTribunal(from: string, subject: string): string {
    const lowerFrom = from.toLowerCase()
    const lowerSubject = subject.toLowerCase()

    if (lowerFrom.includes('tjrj.jus.br') || lowerSubject.includes('tjrj')) {
      return 'TJ-RJ'
    }
    if (lowerFrom.includes('stj.jus.br') || lowerSubject.includes('stj')) {
      return 'STJ'
    }
    if (lowerFrom.includes('trf2.jus.br') || lowerSubject.includes('trf2')) {
      return 'TRF2'
    }
    if (lowerFrom.includes('tst.jus.br') || lowerSubject.includes('tst')) {
      return 'TST'
    }
    if (lowerFrom.includes('stf.jus.br') || lowerSubject.includes('stf')) {
      return 'STF'
    }

    // Generic federal or state court
    if (lowerFrom.includes('.jus.br')) {
      return 'Tribunal (outro)'
    }

    return 'Desconhecido'
  }

  /**
   * Classify the type of update from subject
   */
  private classifyUpdateType(subject: string): string {
    const lowerSubject = subject.toLowerCase()

    if (lowerSubject.includes('citação') || lowerSubject.includes('citacao')) {
      return 'Citação'
    }
    if (lowerSubject.includes('intimação') || lowerSubject.includes('intimacao')) {
      return 'Intimação'
    }
    if (lowerSubject.includes('sentença') || lowerSubject.includes('sentenca')) {
      return 'Sentença'
    }
    if (lowerSubject.includes('despacho')) {
      return 'Despacho'
    }
    if (lowerSubject.includes('decisão') || lowerSubject.includes('decisao')) {
      return 'Decisão'
    }
    if (lowerSubject.includes('acórdão') || lowerSubject.includes('acordao')) {
      return 'Acórdão'
    }
    if (lowerSubject.includes('julgamento')) {
      return 'Julgamento'
    }

    return 'Movimentação'
  }

  /**
   * Check if email has PDF attachments
   */
  private hasAttachments(payload: gmail_v1.Schema$MessagePart | undefined): boolean {
    if (!payload) return false

    // Check parts for attachments
    const parts = payload.parts || []
    for (const part of parts) {
      if (part.filename && part.filename.toLowerCase().endsWith('.pdf')) {
        return true
      }
      // Recursively check nested parts
      if (part.parts) {
        if (this.hasAttachments(part)) return true
      }
    }

    return false
  }

  /**
   * Download attachment from email
   * @param messageId - Gmail message ID
   * @param attachmentId - Gmail attachment ID
   */
  async downloadAttachment(
    messageId: string,
    attachmentId: string
  ): Promise<Buffer | null> {
    if (!this.isConfigured()) {
      return null
    }

    try {
      const response = await gmail.users.messages.attachments.get({
        auth: this.oauth2Client,
        userId: 'me',
        messageId,
        id: attachmentId,
      })

      const data = response.data.data
      if (!data) return null

      // Decode base64url to buffer
      const buffer = Buffer.from(data, 'base64url')
      return buffer
    } catch (error) {
      console.error('Failed to download attachment:', error)
      return null
    }
  }

  /**
   * Save alerts to database
   */
  async saveAlertsToDatabase(emails: TribunalEmail[]): Promise<number> {
    const supabase = await createClient()
    let savedCount = 0

    for (const email of emails) {
      // Skip if no process number identified
      if (!email.processNumber) continue

      // Check if alert already exists
      const { data: existing } = await supabase
        .from('process_alerts')
        .select('id')
        .eq('process_number', email.processNumber)
        .eq('email_date', email.date.toISOString())
        .single()

      if (existing) continue // Skip duplicates

      // Insert new alert
      const alert: Omit<ProcessAlert, 'id' | 'created_at'> = {
        process_number: email.processNumber,
        tribunal: email.tribunal || 'Desconhecido',
        update_type: email.updateType || 'Movimentação',
        email_subject: email.subject,
        email_date: email.date,
        email_snippet: email.snippet,
        has_attachment: email.hasAttachment,
        status: 'pending',
      }

      const { error } = await supabase.from('process_alerts').insert(alert)

      if (!error) {
        savedCount++
      } else {
        console.error('Failed to save alert:', error)
      }
    }

    return savedCount
  }

  /**
   * Main monitoring function (called by cron job)
   */
  async monitorEmails(): Promise<{
    success: boolean
    emailsFound: number
    alertsCreated: number
  }> {
    try {
      console.log('[Email Monitor] Starting monitoring cycle...')

      const emails = await this.fetchRecentEmails(50, 7)
      console.log(`[Email Monitor] Found ${emails.length} tribunal emails`)

      const alertsCreated = await this.saveAlertsToDatabase(emails)
      console.log(`[Email Monitor] Created ${alertsCreated} new alerts`)

      return {
        success: true,
        emailsFound: emails.length,
        alertsCreated,
      }
    } catch (error) {
      console.error('[Email Monitor] Error:', error)
      return {
        success: false,
        emailsFound: 0,
        alertsCreated: 0,
      }
    }
  }
}

// Export singleton
export const emailMonitor = new EmailMonitorService()

/**
 * GMAIL API SETUP GUIDE:
 *
 * 1. Create Google Cloud Project:
 *    - Go to: https://console.cloud.google.com
 *    - Create new project: "Garcez Palha Email Monitor"
 *
 * 2. Enable Gmail API:
 *    - Go to "APIs & Services" → "Library"
 *    - Search "Gmail API"
 *    - Click "Enable"
 *
 * 3. Create OAuth2 Credentials:
 *    - Go to "APIs & Services" → "Credentials"
 *    - Click "Create Credentials" → "OAuth client ID"
 *    - Application type: "Web application"
 *    - Authorized redirect URIs: https://developers.google.com/oauthplayground
 *    - Copy Client ID and Client Secret
 *
 * 4. Get Refresh Token:
 *    - Go to: https://developers.google.com/oauthplayground
 *    - Click settings icon (top right)
 *    - Check "Use your own OAuth credentials"
 *    - Paste Client ID and Client Secret
 *    - In left panel, find "Gmail API v1"
 *    - Select: https://www.googleapis.com/auth/gmail.readonly
 *    - Click "Authorize APIs"
 *    - Login with your Gmail account
 *    - Click "Exchange authorization code for tokens"
 *    - Copy the "Refresh token"
 *
 * 5. Add to .env.local:
 *    GMAIL_CLIENT_ID=your_client_id
 *    GMAIL_CLIENT_SECRET=your_client_secret
 *    GMAIL_REFRESH_TOKEN=your_refresh_token
 *
 * 6. Test:
 *    - Run: npm run dev
 *    - Test endpoint: /api/cron/monitor-emails
 */
