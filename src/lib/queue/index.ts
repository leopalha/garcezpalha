/**
 * Message Queue System - D7-003
 * Bull Queue with Redis for background job processing
 */

import { Queue, Worker, Job } from 'bullmq'
import { createLogger } from '@/lib/logger'

const logger = createLogger('queue')

// Redis connection configuration
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
}

// ============================================================================
// QUEUE DEFINITIONS
// ============================================================================

export const emailQueue = new Queue('email', { connection })
export const documentQueue = new Queue('document', { connection })
export const reportQueue = new Queue('report', { connection })
export const webhookQueue = new Queue('webhook', { connection })

// ============================================================================
// EMAIL QUEUE
// ============================================================================

export interface EmailJobData {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  template?: string
  templateData?: Record<string, any>
}

export async function addEmailJob(data: EmailJobData, options?: {
  delay?: number
  priority?: number
  attempts?: number
}) {
  logger.info('[EmailQueue] Adding email job', { to: data.to, subject: data.subject })

  await emailQueue.add('send-email', data, {
    attempts: options?.attempts || 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    delay: options?.delay,
    priority: options?.priority,
  })
}

// ============================================================================
// DOCUMENT QUEUE
// ============================================================================

export interface DocumentJobData {
  documentId: string
  filePath: string
  processType: 'ocr' | 'analysis' | 'extraction' | 'classification' | 'fraud_detection'
  options?: Record<string, any>
}

export async function addDocumentJob(data: DocumentJobData) {
  logger.info('[DocumentQueue] Adding document processing job', {
    documentId: data.documentId,
    processType: data.processType,
  })

  await documentQueue.add('process-document', data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  })
}

// ============================================================================
// REPORT QUEUE
// ============================================================================

export interface ReportJobData {
  reportType: 'weekly' | 'monthly' | 'custom'
  userId: string
  filters?: Record<string, any>
  format: 'pdf' | 'excel' | 'csv'
}

export async function addReportJob(data: ReportJobData) {
  logger.info('[ReportQueue] Adding report generation job', {
    userId: data.userId,
    reportType: data.reportType,
  })

  await reportQueue.add('generate-report', data, {
    attempts: 2,
  })
}

// ============================================================================
// WEBHOOK QUEUE
// ============================================================================

export interface WebhookJobData {
  url: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
  eventType: string
}

export async function addWebhookJob(data: WebhookJobData, options?: {
  attempts?: number
  delay?: number
}) {
  logger.info('[WebhookQueue] Adding webhook job', {
    url: data.url,
    eventType: data.eventType,
  })

  await webhookQueue.add('send-webhook', data, {
    attempts: options?.attempts || 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    delay: options?.delay,
  })
}

// ============================================================================
// QUEUE MONITORING
// ============================================================================

export async function getQueueStats() {
  const [emailStats, documentStats, reportStats, webhookStats] = await Promise.all([
    getQueueCounts(emailQueue),
    getQueueCounts(documentQueue),
    getQueueCounts(reportQueue),
    getQueueCounts(webhookQueue),
  ])

  return {
    email: emailStats,
    document: documentStats,
    report: reportStats,
    webhook: webhookStats,
  }
}

async function getQueueCounts(queue: Queue) {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ])

  return { waiting, active, completed, failed, delayed }
}

// ============================================================================
// QUEUE CLEANUP
// ============================================================================

export async function cleanOldJobs() {
  logger.info('[Queue] Cleaning old jobs...')

  await Promise.all([
    emailQueue.clean(24 * 60 * 60 * 1000, 1000, 'completed'), // 24h
    emailQueue.clean(7 * 24 * 60 * 60 * 1000, 1000, 'failed'), // 7 days
    documentQueue.clean(24 * 60 * 60 * 1000, 1000, 'completed'),
    documentQueue.clean(7 * 24 * 60 * 60 * 1000, 1000, 'failed'),
    reportQueue.clean(24 * 60 * 60 * 1000, 1000, 'completed'),
    reportQueue.clean(7 * 24 * 60 * 60 * 1000, 1000, 'failed'),
    webhookQueue.clean(24 * 60 * 60 * 1000, 1000, 'completed'),
    webhookQueue.clean(7 * 24 * 60 * 60 * 1000, 1000, 'failed'),
  ])

  logger.info('[Queue] Old jobs cleaned')
}
