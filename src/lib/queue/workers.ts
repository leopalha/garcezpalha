/**
 * Queue Workers - D7-003
 * Background workers to process queue jobs
 */

import { Worker, Job } from 'bullmq'
import { createLogger } from '@/lib/logger'
import type { EmailJobData, DocumentJobData, ReportJobData, WebhookJobData } from './index'

const logger = createLogger('queue:workers')

const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
}

// ============================================================================
// EMAIL WORKER
// ============================================================================

export const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job: Job<EmailJobData>) => {
    logger.info('[EmailWorker] Processing email job', { jobId: job.id })

    const { to, subject, html, text, template, templateData } = job.data

    try {
      // TODO: Integrate with email service (Resend, SendGrid, etc.)
      // For now, log the email
      logger.info('[EmailWorker] Sending email', {
        to,
        subject,
        hasHtml: !!html,
        hasText: !!text,
        template,
      })

      // Simulate email sending
      await new Promise((resolve) => setTimeout(resolve, 500))

      logger.info('[EmailWorker] Email sent successfully', { jobId: job.id })

      return { success: true, sentAt: new Date().toISOString() }
    } catch (error) {
      logger.error('[EmailWorker] Failed to send email', error, { jobId: job.id })
      throw error
    }
  },
  {
    connection,
    concurrency: 5, // Process 5 emails concurrently
  }
)

// ============================================================================
// DOCUMENT WORKER
// ============================================================================

export const documentWorker = new Worker<DocumentJobData>(
  'document',
  async (job: Job<DocumentJobData>) => {
    logger.info('[DocumentWorker] Processing document job', { jobId: job.id })

    const { documentId, filePath, processType, options } = job.data

    try {
      // TODO: Import and use DocumentProcessor
      // const processor = new DocumentProcessor(supabase)
      // await processor.processJob({ ... })

      logger.info('[DocumentWorker] Processing document', {
        documentId,
        processType,
      })

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      logger.info('[DocumentWorker] Document processed successfully', { jobId: job.id })

      return {
        success: true,
        documentId,
        processedAt: new Date().toISOString(),
      }
    } catch (error) {
      logger.error('[DocumentWorker] Failed to process document', error, { jobId: job.id })
      throw error
    }
  },
  {
    connection,
    concurrency: 2, // Process 2 documents concurrently (CPU intensive)
  }
)

// ============================================================================
// REPORT WORKER
// ============================================================================

export const reportWorker = new Worker<ReportJobData>(
  'report',
  async (job: Job<ReportJobData>) => {
    logger.info('[ReportWorker] Processing report job', { jobId: job.id })

    const { reportType, userId, filters, format } = job.data

    try {
      // TODO: Implement report generation
      logger.info('[ReportWorker] Generating report', {
        reportType,
        userId,
        format,
      })

      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      logger.info('[ReportWorker] Report generated successfully', { jobId: job.id })

      return {
        success: true,
        reportUrl: `/reports/${userId}/${Date.now()}.${format}`,
        generatedAt: new Date().toISOString(),
      }
    } catch (error) {
      logger.error('[ReportWorker] Failed to generate report', error, { jobId: job.id })
      throw error
    }
  },
  {
    connection,
    concurrency: 3,
  }
)

// ============================================================================
// WEBHOOK WORKER
// ============================================================================

export const webhookWorker = new Worker<WebhookJobData>(
  'webhook',
  async (job: Job<WebhookJobData>) => {
    logger.info('[WebhookWorker] Processing webhook job', { jobId: job.id })

    const { url, method, headers, body, eventType } = job.data

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Webhook failed with status ${response.status}`)
      }

      logger.info('[WebhookWorker] Webhook sent successfully', {
        jobId: job.id,
        status: response.status,
      })

      return {
        success: true,
        status: response.status,
        sentAt: new Date().toISOString(),
      }
    } catch (error) {
      logger.error('[WebhookWorker] Failed to send webhook', error, {
        jobId: job.id,
        url,
        eventType,
      })
      throw error
    }
  },
  {
    connection,
    concurrency: 10, // Process 10 webhooks concurrently
  }
)

// ============================================================================
// ERROR HANDLERS
// ============================================================================

;[emailWorker, documentWorker, reportWorker, webhookWorker].forEach((worker) => {
  worker.on('completed', (job) => {
    logger.info(`[${worker.name}Worker] Job completed`, {
      jobId: job.id,
      duration: job.finishedOn && job.processedOn ? job.finishedOn - job.processedOn : 0,
    })
  })

  worker.on('failed', (job, error) => {
    logger.error(`[${worker.name}Worker] Job failed`, error, {
      jobId: job?.id,
      attemptsMade: job?.attemptsMade,
    })
  })

  worker.on('error', (error) => {
    logger.error(`[${worker.name}Worker] Worker error`, error)
  })
})

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

export async function shutdownWorkers() {
  logger.info('[Workers] Shutting down workers...')

  await Promise.all([
    emailWorker.close(),
    documentWorker.close(),
    reportWorker.close(),
    webhookWorker.close(),
  ])

  logger.info('[Workers] All workers shut down')
}

// Handle process termination
process.on('SIGTERM', async () => {
  await shutdownWorkers()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await shutdownWorkers()
  process.exit(0)
})
