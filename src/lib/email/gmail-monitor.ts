/**
 * Gmail Monitor Service
 *
 * Monitors Gmail inbox for new lead emails and creates leads automatically
 *
 * Setup:
 * 1. Use same OAuth2 credentials as Google Calendar
 * 2. Enable Gmail API in Google Cloud Console
 * 3. Add to .env (same as Calendar):
 *    GMAIL_CLIENT_ID=your_client_id
 *    GMAIL_CLIENT_SECRET=your_client_secret
 *    GMAIL_REFRESH_TOKEN=your_refresh_token
 */

import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'

const gmail = google.gmail({ version: 'v1' })

interface EmailLead {
  from: string
  subject: string
  body: string
  receivedAt: Date
}

export class GmailMonitorService {
  private oauth2Client: any

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

  isConfigured(): boolean {
    return !!(
      process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN
    )
  }

  /**
   * Fetch recent unread emails (last 15 minutes)
   */
  async fetchRecentEmails(): Promise<EmailLead[]> {
    if (!this.isConfigured()) {
      return []
    }

    try {
      const fifteenMinutesAgo = Math.floor(Date.now() / 1000) - 15 * 60

      const response = await gmail.users.messages.list({
        auth: this.oauth2Client,
        userId: 'me',
        q: `is:unread after:${fifteenMinutesAgo}`,
        maxResults: 50,
      })

      const messages = response.data.messages || []
      const emails: EmailLead[] = []

      for (const message of messages) {
        const email = await this.parseEmail(message.id!)
        if (email) emails.push(email)
      }

      return emails
    } catch (error) {
      console.error('[Gmail Monitor] Error fetching emails:', error)
      return []
    }
  }

  /**
   * Parse email message
   */
  private async parseEmail(messageId: string): Promise<EmailLead | null> {
    try {
      const message = await gmail.users.messages.get({
        auth: this.oauth2Client,
        userId: 'me',
        id: messageId,
        format: 'full',
      })

      const headers = message.data.payload?.headers || []
      const from = headers.find((h) => h.name === 'From')?.value || ''
      const subject = headers.find((h) => h.name === 'Subject')?.value || ''
      const date = headers.find((h) => h.name === 'Date')?.value || new Date().toISOString()

      // Extract email body
      let body = ''
      if (message.data.payload?.body?.data) {
        body = Buffer.from(message.data.payload.body.data, 'base64').toString('utf-8')
      } else if (message.data.payload?.parts) {
        const textPart = message.data.payload.parts.find((p) => p.mimeType === 'text/plain')
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, 'base64').toString('utf-8')
        }
      }

      return {
        from,
        subject,
        body: body.substring(0, 500), // First 500 chars
        receivedAt: new Date(date),
      }
    } catch (error) {
      console.error('[Gmail Monitor] Error parsing email:', error)
      return null
    }
  }

  /**
   * Create lead from email
   */
  async createLeadFromEmail(email: EmailLead): Promise<boolean> {
    try {
      const supabase = await createClient()

      // Extract email address
      const emailMatch = email.from.match(/<(.+)>/)
      const emailAddress = emailMatch ? emailMatch[1] : email.from

      // Extract name
      const nameMatch = email.from.match(/(.+?)\s*</)
      const name = nameMatch ? nameMatch[1].trim().replace(/"/g, '') : emailAddress.split('@')[0]

      // Check if lead already exists
      const { data: existing } = await supabase
        .from('leads')
        .select('id')
        .eq('email', emailAddress)
        .single()

      if (existing) {
        console.log(`[Gmail Monitor] Lead already exists: ${emailAddress}`)
        return false
      }

      // Create new lead
      const { error } = await supabase.from('leads').insert({
        full_name: name,
        email: emailAddress,
        phone: null,
        company: null,
        service_interest: this.detectServiceInterest(email.subject + ' ' + email.body),
        source: 'email',
        status: 'new',
        message: `Assunto: ${email.subject}\n\n${email.body}`,
        assigned_to: null,
      })

      if (error) {
        console.error('[Gmail Monitor] Error creating lead:', error)
        return false
      }

      console.log(`[Gmail Monitor] ✅ Created lead from email: ${emailAddress}`)
      return true
    } catch (error) {
      console.error('[Gmail Monitor] Error creating lead from email:', error)
      return false
    }
  }

  /**
   * Detect service interest from email content
   */
  private detectServiceInterest(content: string): string {
    const contentLower = content.toLowerCase()

    const keywords = {
      'Direito Imobiliário': ['imóvel', 'compra', 'venda', 'aluguel', 'contrato', 'locação'],
      'Perícia Médica': ['acidente', 'perícia', 'laudo', 'médic', 'lesão', 'inss'],
      'Avaliação de Imóveis': ['avaliação', 'avaliar', 'valor', 'mercado'],
      'Direito Criminal': ['criminal', 'defesa', 'acusação', 'processo penal'],
      'Grafotécnia': ['assinatura', 'documento', 'falso', 'perícia documental'],
    }

    for (const [service, words] of Object.entries(keywords)) {
      if (words.some((word) => contentLower.includes(word))) {
        return service
      }
    }

    return 'Consulta Geral'
  }

  /**
   * Mark email as read
   */
  async markAsRead(messageId: string): Promise<boolean> {
    if (!this.isConfigured()) return false

    try {
      await gmail.users.messages.modify({
        auth: this.oauth2Client,
        userId: 'me',
        id: messageId,
        requestBody: {
          removeLabelIds: ['UNREAD'],
        },
      })
      return true
    } catch (error) {
      console.error('[Gmail Monitor] Error marking as read:', error)
      return false
    }
  }
}

export const gmailMonitor = new GmailMonitorService()
