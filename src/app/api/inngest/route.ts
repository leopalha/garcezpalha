/**
 * Inngest API Route - Serves Inngest functions
 * Handles cron jobs and event-triggered functions
 * Atualizado: 02/01/2026 - P0-003 Cron Jobs
 */

import { serve } from 'inngest/next'
import { inngest } from '@/lib/jobs/inngest-client'

// Email sequences (existing)
import {
  processEmailSequences,
  triggerWelcomeSequence,
  handleEmailEvent,
  generateSequenceReport,
} from '@/lib/jobs/email-sequences'

// Webhook processors (P0-001)
import { stripeWebhookHandler } from '@/lib/jobs/functions/stripe-webhook'
import { mercadoPagoWebhookHandler } from '@/lib/jobs/functions/mercadopago-webhook'

// Background processors (P0-001)
import { emailSenderHandler } from '@/lib/jobs/functions/email-sender'
import { documentAnalyzerHandler } from '@/lib/jobs/functions/document-analyzer'

// Cron Jobs (P0-003 - 02/01/2026)
import {
  followUpLeadsJob,
  dailyReportsJob,
  cleanupTempDataJob,
  processualDeadlinesJob,
  syncMetricsJob,
  backupVerificationJob,
  integrationHealthCheckJob,
} from '@/lib/jobs/cron-jobs'

// Serve Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    // Email sequences (existing)
    processEmailSequences, // Cron: every 15 minutes
    triggerWelcomeSequence, // Event: lead/created
    handleEmailEvent, // Event: email/event
    generateSequenceReport, // Cron: daily at 9am

    // Webhook processors (P0-001)
    stripeWebhookHandler, // Event: stripe/webhook.received
    mercadoPagoWebhookHandler, // Event: mercadopago/webhook.received

    // Background processors (P0-001)
    emailSenderHandler, // Event: email/send
    documentAnalyzerHandler, // Event: document/analyze

    // Cron Jobs (P0-003 - 02/01/2026)
    followUpLeadsJob, // Cron: 10h, 14h, 18h - Seg-Sex
    dailyReportsJob, // Cron: 6h daily
    cleanupTempDataJob, // Cron: 3h daily
    processualDeadlinesJob, // Cron: 7h, 12h, 17h - Seg-Sex
    syncMetricsJob, // Cron: every 30 minutes
    backupVerificationJob, // Cron: 5h daily
    integrationHealthCheckJob, // Cron: every 10 minutes
  ],
  servePath: '/api/inngest',
})
