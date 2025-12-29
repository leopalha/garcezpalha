/**
 * Google Calendar API Service
 *
 * Automatically syncs process deadlines to Google Calendar
 *
 * Features:
 * - Create calendar events for deadlines
 * - Set reminders (7 days, 3 days, 1 day before)
 * - Update events when deadline changes
 * - Delete events when deadline is cancelled
 *
 * Google Calendar API Setup:
 * 1. Create project: https://console.cloud.google.com
 * 2. Enable Google Calendar API
 * 3. Create OAuth2 credentials (same as Gmail API)
 * 4. Get refresh token
 * 5. Add to .env:
 *    GOOGLE_CALENDAR_CLIENT_ID=your_client_id
 *    GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
 *    GOOGLE_CALENDAR_REFRESH_TOKEN=your_refresh_token
 *
 * Docs: https://developers.google.com/calendar/api
 */

import { google } from 'googleapis'
import type { calendar_v3 } from 'googleapis'
import type { OAuth2Client } from 'google-auth-library'
import { createClient } from '@/lib/supabase/server'

const calendar = google.calendar('v3')

interface CalendarEvent {
  deadlineId: string
  summary: string
  description: string
  startDate: Date
  endDate: Date
  reminders: number[] // Days before to send reminders [7, 3, 1]
}

class GoogleCalendarService {
  private oauth2Client: OAuth2Client | null = null

  constructor() {
    if (this.isConfigured()) {
      this.oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GMAIL_CLIENT_ID,
        process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GMAIL_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      )

      this.oauth2Client.setCredentials({
        refresh_token:
          process.env.GOOGLE_CALENDAR_REFRESH_TOKEN || process.env.GMAIL_REFRESH_TOKEN,
      })
    }
  }

  /**
   * Check if Google Calendar API is configured
   */
  isConfigured(): boolean {
    return !!(
      (process.env.GOOGLE_CALENDAR_CLIENT_ID || process.env.GMAIL_CLIENT_ID) &&
      (process.env.GOOGLE_CALENDAR_CLIENT_SECRET || process.env.GMAIL_CLIENT_SECRET) &&
      (process.env.GOOGLE_CALENDAR_REFRESH_TOKEN || process.env.GMAIL_REFRESH_TOKEN)
    )
  }

  /**
   * Create calendar event for deadline
   */
  async createDeadlineEvent(event: CalendarEvent): Promise<string | null> {
    if (!this.isConfigured()) {
      console.warn('Google Calendar API not configured')
      return null
    }

    try {
      // Format event for Google Calendar
      const calendarEvent = {
        summary: `⚖️ ${event.summary}`,
        description: event.description,
        start: {
          date: event.startDate.toISOString().split('T')[0], // All-day event
        },
        end: {
          date: event.endDate.toISOString().split('T')[0],
        },
        reminders: {
          useDefault: false,
          overrides: event.reminders.map((days) => ({
            method: 'email',
            minutes: days * 24 * 60, // Convert days to minutes
          })),
        },
        colorId: '11', // Red for legal deadlines
      }

      const response = await calendar.events.insert({
        auth: this.oauth2Client,
        calendarId: 'primary',
        requestBody: calendarEvent,
      })

      const eventId = response.data.id

      if (eventId) {
        // Update database with Google Calendar event ID
        const supabase = await createClient()
        await supabase
          .from('process_deadlines')
          .update({ google_calendar_event_id: eventId })
          .eq('id', event.deadlineId)

        console.log('[Google Calendar] Event created:', eventId)
        return eventId
      }

      return null
    } catch (error) {
      console.error('[Google Calendar] Error creating event:', error)
      return null
    }
  }

  /**
   * Update existing calendar event
   */
  async updateDeadlineEvent(
    eventId: string,
    event: Partial<CalendarEvent>
  ): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    try {
      const updateData: calendar_v3.Schema$Event = {}

      if (event.summary) {
        updateData.summary = `⚖️ ${event.summary}`
      }

      if (event.description) {
        updateData.description = event.description
      }

      if (event.startDate) {
        updateData.start = {
          date: event.startDate.toISOString().split('T')[0],
        }
      }

      if (event.endDate) {
        updateData.end = {
          date: event.endDate.toISOString().split('T')[0],
        }
      }

      if (event.reminders) {
        updateData.reminders = {
          useDefault: false,
          overrides: event.reminders.map((days) => ({
            method: 'email',
            minutes: days * 24 * 60,
          })),
        }
      }

      await calendar.events.patch({
        auth: this.oauth2Client,
        calendarId: 'primary',
        eventId,
        requestBody: updateData,
      })

      console.log('[Google Calendar] Event updated:', eventId)
      return true
    } catch (error) {
      console.error('[Google Calendar] Error updating event:', error)
      return false
    }
  }

  /**
   * Delete calendar event
   */
  async deleteDeadlineEvent(eventId: string): Promise<boolean> {
    if (!this.isConfigured()) {
      return false
    }

    try {
      await calendar.events.delete({
        auth: this.oauth2Client,
        calendarId: 'primary',
        eventId,
      })

      console.log('[Google Calendar] Event deleted:', eventId)
      return true
    } catch (error) {
      console.error('[Google Calendar] Error deleting event:', error)
      return false
    }
  }

  /**
   * Sync deadline to Google Calendar
   * (High-level function that handles create/update/delete)
   */
  async syncDeadline(
    deadlineId: string,
    processNumber: string,
    deadlineType: string,
    dueDate: Date,
    description: string,
    status: 'pending' | 'completed' | 'cancelled' | 'expired'
  ): Promise<string | null> {
    const supabase = await createClient()

    try {
      // Get existing event ID
      const { data: deadline } = await supabase
        .from('process_deadlines')
        .select('google_calendar_event_id')
        .eq('id', deadlineId)
        .single()

      const existingEventId = deadline?.google_calendar_event_id

      // If cancelled or completed, delete event
      if (status === 'cancelled' || status === 'completed') {
        if (existingEventId) {
          await this.deleteDeadlineEvent(existingEventId)
          await supabase
            .from('process_deadlines')
            .update({ google_calendar_event_id: null })
            .eq('id', deadlineId)
        }
        return null
      }

      // If pending and no event exists, create new event
      if (!existingEventId && status === 'pending') {
        const eventId = await this.createDeadlineEvent({
          deadlineId,
          summary: `${deadlineType} - ${processNumber}`,
          description: `📋 Processo: ${processNumber}\n📝 ${description}\n\n⚖️ Prazo processual automático via Garcez Palha`,
          startDate: dueDate,
          endDate: dueDate, // Same day (all-day event)
          reminders: [7, 3, 1], // 7 days, 3 days, 1 day before
        })

        return eventId
      }

      // If pending and event exists, update it
      if (existingEventId && status === 'pending') {
        await this.updateDeadlineEvent(existingEventId, {
          summary: `${deadlineType} - ${processNumber}`,
          description: `📋 Processo: ${processNumber}\n📝 ${description}\n\n⚖️ Prazo processual automático via Garcez Palha`,
          startDate: dueDate,
          endDate: dueDate,
          reminders: [7, 3, 1],
        })

        return existingEventId
      }

      return null
    } catch (error) {
      console.error('[Google Calendar] Error syncing deadline:', error)
      return null
    }
  }

  /**
   * Sync all pending deadlines (called by cron job)
   */
  async syncAllDeadlines(): Promise<{
    success: boolean
    synced: number
    errors: number
  }> {
    if (!this.isConfigured()) {
      console.warn('[Google Calendar] Not configured, skipping sync')
      return { success: false, synced: 0, errors: 0 }
    }

    const supabase = await createClient()

    try {
      console.log('[Google Calendar] Starting sync of all deadlines...')

      // Get all pending deadlines without calendar events
      const { data: deadlines, error } = await supabase
        .from('process_deadlines')
        .select(
          `
          *,
          alert:process_alerts(
            process_number
          )
        `
        )
        .eq('status', 'pending')
        .is('google_calendar_event_id', null)
        .limit(50) // Sync max 50 per run to avoid rate limits

      if (error) throw error

      let synced = 0
      let errors = 0

      for (const deadline of deadlines || []) {
        try {
          const eventId = await this.createDeadlineEvent({
            deadlineId: deadline.id,
            summary: `${deadline.deadline_type} - ${deadline.alert?.process_number}`,
            description: deadline.description || '',
            startDate: new Date(deadline.due_date),
            endDate: new Date(deadline.due_date),
            reminders: [7, 3, 1],
          })

          if (eventId) {
            synced++
          } else {
            errors++
          }
        } catch (error) {
          console.error(
            `[Google Calendar] Error syncing deadline ${deadline.id}:`,
            error
          )
          errors++
        }
      }

      console.log(
        `[Google Calendar] Sync complete: ${synced} synced, ${errors} errors`
      )

      return {
        success: true,
        synced,
        errors,
      }
    } catch (error) {
      console.error('[Google Calendar] Error syncing all deadlines:', error)
      return {
        success: false,
        synced: 0,
        errors: 0,
      }
    }
  }
}

// Export singleton
export const googleCalendar = new GoogleCalendarService()

/**
 * GOOGLE CALENDAR SETUP GUIDE:
 *
 * 1. Enable Google Calendar API (same project as Gmail):
 *    - Go to: https://console.cloud.google.com
 *    - Select project: "Garcez Palha Email Monitor"
 *    - Go to "APIs & Services" → "Library"
 *    - Search "Google Calendar API"
 *    - Click "Enable"
 *
 * 2. Update OAuth2 Scopes (same credentials as Gmail):
 *    - Go to: https://developers.google.com/oauthplayground
 *    - Add scope: https://www.googleapis.com/auth/calendar
 *    - Authorize and get new refresh token (if needed)
 *
 * 3. Add to .env.local (can use same credentials as Gmail):
 *    GOOGLE_CALENDAR_CLIENT_ID=same_as_gmail
 *    GOOGLE_CALENDAR_CLIENT_SECRET=same_as_gmail
 *    GOOGLE_CALENDAR_REFRESH_TOKEN=same_as_gmail
 *
 * 4. Or use separate credentials:
 *    GOOGLE_CALENDAR_CLIENT_ID=your_calendar_client_id
 *    GOOGLE_CALENDAR_CLIENT_SECRET=your_calendar_client_secret
 *    GOOGLE_CALENDAR_REFRESH_TOKEN=your_calendar_refresh_token
 *
 * NOTE: This service can reuse the same OAuth2 credentials as Gmail API
 *       since both are from the same Google Cloud project.
 */
