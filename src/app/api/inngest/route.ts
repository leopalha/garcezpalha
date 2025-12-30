/**
 * Inngest API Route - Serves Inngest functions
 * Handles cron jobs and event-triggered functions
 */

import { serve } from 'inngest/next'
import {
  inngest,
  processEmailSequences,
  triggerWelcomeSequence,
  handleEmailEvent,
  generateSequenceReport,
} from '@/lib/jobs/email-sequences'

// Serve Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processEmailSequences, // Cron: every 15 minutes
    triggerWelcomeSequence, // Event: lead/created
    handleEmailEvent, // Event: email/event
    generateSequenceReport, // Cron: daily at 9am
  ],
})
