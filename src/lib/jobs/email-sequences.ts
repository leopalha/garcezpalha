/**
 * Email Sequences Cron Job - Processes scheduled email sends
 * Runs every 15 minutes via Inngest
 */

import { inngest } from '@/lib/jobs/inngest-client'
import { emailSequenceEngine } from '@/lib/email/sequences/engine'

// Re-export inngest client for backward compatibility
export { inngest }

/**
 * Process Email Sequences - Cron Job
 * Runs every 15 minutes to send scheduled emails
 */
export const processEmailSequences = inngest.createFunction(
  {
    id: 'process-email-sequences',
    name: 'Process Email Sequences',
  },
  { cron: '*/15 * * * *' }, // Every 15 minutes
  async ({ event, step }) => {
    const startTime = Date.now()

    // Step 1: Process scheduled emails
    const stats = await step.run('send-scheduled-emails', async () => {
      return await emailSequenceEngine.processScheduledEmails()
    })

    const duration = Date.now() - startTime

    console.log('[Email Sequences] Cron job completed:', {
      duration: `${duration}ms`,
      stats,
    })

    return {
      success: true,
      duration,
      stats,
      timestamp: new Date().toISOString(),
    }
  }
)

/**
 * Welcome Sequence - Triggered when new lead is created
 * Automatically subscribes lead to welcome sequence
 */
export const triggerWelcomeSequence = inngest.createFunction(
  {
    id: 'trigger-welcome-sequence',
    name: 'Trigger Welcome Sequence',
  },
  { event: 'lead/created' },
  async ({ event, step }) => {
    const { leadId, email, name } = event.data

    console.log('[Email Sequences] Triggering welcome sequence for:', { leadId, email })

    // Subscribe to welcome sequence
    const subscription = await step.run('subscribe-to-welcome', async () => {
      return await emailSequenceEngine.subscribe('welcome-sequence', {
        leadId,
        email,
        firstName: name?.split(' ')[0] || 'Cliente',
        metadata: {
          source: event.data.source || 'website',
          produto: event.data.produto || 'geral',
        },
      } as any)
    })

    return {
      success: true,
      subscription,
      timestamp: new Date().toISOString(),
    }
  }
)

/**
 * Handle Email Event - Triggered by Resend webhooks
 * Updates sequence metrics and triggers conditional actions
 */
export const handleEmailEvent = inngest.createFunction(
  {
    id: 'handle-email-event',
    name: 'Handle Email Event',
  },
  { event: 'email/event' },
  async ({ event, step }) => {
    const { type, email_id, email, timestamp, link } = event.data

    console.log('[Email Sequences] Processing email event:', { type, email_id })

    // Process webhook event
    await step.run('process-webhook', async () => {
      await emailSequenceEngine.handleWebhook({
        type,
        email_id,
        email,
        timestamp,
        link,
      })
    })

    // Conditional actions based on event type
    if (type === 'email.clicked') {
      // High intent - notify sales team
      await step.run('notify-sales-team', async () => {
        console.log('[Email Sequences] High intent detected - email clicked:', {
          email,
          link,
        })
        // TODO: Send Slack notification or update CRM
      })
    }

    if (type === 'email.bounced' || type === 'email.complained') {
      // Bad email - mark lead as inactive
      await step.run('mark-lead-inactive', async () => {
        console.log('[Email Sequences] Bad email detected - marking inactive:', {
          email,
          type,
        })
        // TODO: Update lead status in database
      })
    }

    return {
      success: true,
      timestamp: new Date().toISOString(),
    }
  }
)

/**
 * Generate Sequence Report - Daily at 9am
 * Calculates metrics and sends report to admin
 */
export const generateSequenceReport = inngest.createFunction(
  {
    id: 'generate-sequence-report',
    name: 'Generate Sequence Report',
  },
  { cron: '0 9 * * *' }, // Daily at 9am
  async ({ event, step }) => {
    console.log('[Email Sequences] Generating daily report')

    // Calculate stats for all sequences
    const stats = await step.run('calculate-stats', async () => {
      return await emailSequenceEngine.calculateStats('welcome-sequence')
    })

    // Format report
    const report = await step.run('format-report', async () => {
      return {
        date: new Date().toISOString().split('T')[0],
        sequences: [
          {
            id: 'welcome-sequence',
            name: 'Sequência de Boas-Vindas',
            ...stats,
            performance: {
              openRate: `${(((stats as any).totalOpened / (stats as any).totalSent) * 100).toFixed(1)}%`,
              clickRate: `${(((stats as any).totalClicked / (stats as any).totalSent) * 100).toFixed(1)}%`,
              bounceRate: `${(((stats as any).totalBounced / (stats as any).totalSent) * 100).toFixed(1)}%`,
              complaintRate: `${(((stats as any).totalComplaints / (stats as any).totalSent) * 100).toFixed(1)}%`,
            },
          },
        ],
      }
    })

    console.log('[Email Sequences] Daily report:', report)

    // TODO: Send report via email or Slack
    // await sendEmailReport(report)

    return {
      success: true,
      report,
      timestamp: new Date().toISOString(),
    }
  }
)
