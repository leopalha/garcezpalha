import { NextRequest, NextResponse } from 'next/server'
import { processDocumentQueue } from '@/lib/workers/document-processor'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds

// ============================================================================
// GET /api/cron/process-documents - Background worker for document processing
// Called by Vercel Cron or external scheduler every 5 minutes
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    logger.info('[Cron] Starting document processing queue...')

    await processDocumentQueue()

    logger.info('[Cron] Document processing queue completed')

    return NextResponse.json({
      success: true,
      message: 'Document queue processed successfully',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    logger.error('[Cron] Document processing error:', error)

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
