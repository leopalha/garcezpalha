import { NextRequest, NextResponse } from 'next/server'
import { createLogger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'

const logger = createLogger('cron:data-retention')

/**
 * GET /api/cron/data-retention
 * Run data retention cleanup job
 * Should be called by a cron service (Vercel Cron, GitHub Actions, etc)
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      logger.warn('Unauthorized cron attempt')
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    logger.info('Starting data retention cleanup job')

    const supabase = await createClient()

    // Call PostgreSQL function to cleanup expired data
    const { data: cleanupResult, error: cleanupError } = await supabase.rpc('cleanup_expired_data')

    if (cleanupError) {
      logger.error('Error in cleanup_expired_data', cleanupError)
      throw cleanupError
    }

    logger.info('Cleanup completed', { itemsCleaned: cleanupResult })

    // Additional cleanup tasks
    const tasks = await runCleanupTasks()

    return NextResponse.json({
      success: true,
      itemsCleaned: cleanupResult,
      tasks,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Error in data retention cron', error)
    return NextResponse.json({
      error: 'Erro no job de retenção de dados',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * Run additional cleanup tasks
 */
async function runCleanupTasks(): Promise<Record<string, any>> {
  const results: Record<string, any> = {}
  const supabase = await createClient()

  try {
    // 1. Delete expired export requests
    const { data: expiredExports, error: exportsError } = await supabase
      .from('data_export_requests')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id')

    results.deletedExports = expiredExports?.length || 0

    if (exportsError) {
      logger.error('Error deleting expired exports', exportsError)
      results.exportsError = exportsError.message
    }

    // 2. Mark expired certificates
    const { data: expiredCerts, error: certsError } = await supabase
      .from('digital_certificates')
      .update({ is_active: false })
      .lt('valid_until', new Date().toISOString())
      .eq('is_active', true)
      .select('id')

    results.expiredCertificates = expiredCerts?.length || 0

    if (certsError) {
      logger.error('Error marking expired certificates', certsError)
      results.certsError = certsError.message
    }

    // 3. Mark expired signature documents
    const { data: expiredDocs, error: docsError } = await supabase
      .from('signature_documents')
      .update({ status: 'expired' })
      .lt('expires_at', new Date().toISOString())
      .in('status', ['pending', 'sent'])
      .select('id')

    results.expiredDocuments = expiredDocs?.length || 0

    if (docsError) {
      logger.error('Error marking expired documents', docsError)
      results.docsError = docsError.message
    }

    // 4. Delete old security events (keep last 90 days for non-critical)
    const ninetyDaysAgo = new Date()
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

    const { data: deletedEvents, error: eventsError } = await supabase
      .from('security_events')
      .delete()
      .lt('created_at', ninetyDaysAgo.toISOString())
      .in('severity', ['low', 'medium'])
      .eq('status', 'resolved')
      .select('id')

    results.deletedSecurityEvents = deletedEvents?.length || 0

    if (eventsError) {
      logger.error('Error deleting old security events', eventsError)
      results.eventsError = eventsError.message
    }

    // 5. Clean up old webhook records (keep last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: deletedWebhooks, error: webhooksError } = await supabase
      .from('signature_webhooks')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())
      .select('id')

    results.deletedWebhooks = deletedWebhooks?.length || 0

    if (webhooksError) {
      logger.error('Error deleting old webhooks', webhooksError)
      results.webhooksError = webhooksError.message
    }

    // 6. Archive old completed deadlines (older than 1 year)
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

    const { data: archivedDeadlines, error: deadlinesError } = await supabase
      .from('deadlines')
      .update({ status: 'archived' })
      .lt('due_date', oneYearAgo.toISOString())
      .eq('status', 'completed')
      .select('id')

    results.archivedDeadlines = archivedDeadlines?.length || 0

    if (deadlinesError) {
      logger.error('Error archiving old deadlines', deadlinesError)
      results.deadlinesError = deadlinesError.message
    }

    logger.info('Cleanup tasks completed', results)

  } catch (error) {
    logger.error('Error in cleanup tasks', error)
    results.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return results
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
