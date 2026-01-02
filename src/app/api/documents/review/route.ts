import { NextRequest, NextResponse } from 'next/server'
import { reviewQueueManager } from '@/lib/ai/production/review-queue'
import { logger } from '@/lib/logger'

/**
 * GET /api/documents/review
 * Get review queue items
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters = {
      status: searchParams.get('status') as any,
      priority: searchParams.get('priority') as any,
      assignedTo: searchParams.get('assignedTo') || undefined,
      documentType: searchParams.get('documentType') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20,
      offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0
    }

    // Get stats if requested
    if (searchParams.get('stats') === 'true') {
      const stats = await reviewQueueManager.getStats()
      return NextResponse.json({ stats })
    }

    // Get specific item with document
    const itemId = searchParams.get('itemId')
    if (itemId) {
      const result = await reviewQueueManager.getItemWithDocument(itemId)
      if (!result) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(result)
    }

    // Get queue items
    const items = await reviewQueueManager.getQueueItems(filters)

    return NextResponse.json({
      items,
      count: items.length,
      filters
    })

  } catch (error) {
    logger.error('[API] Error fetching review queue:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review queue' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/documents/review
 * Perform review action (approve, reject, assign, request-revision)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, itemId, reviewerId, notes, reason, feedback } = body

    if (!action || !itemId) {
      return NextResponse.json(
        { error: 'Missing required fields: action, itemId' },
        { status: 400 }
      )
    }

    let success = false
    let message = ''

    switch (action) {
      case 'assign':
        if (!reviewerId) {
          return NextResponse.json(
            { error: 'reviewerId is required for assign action' },
            { status: 400 }
          )
        }
        success = await reviewQueueManager.assignToReviewer(itemId, reviewerId)
        message = success ? 'Item assigned successfully' : 'Failed to assign item'
        break

      case 'approve':
        if (!reviewerId) {
          return NextResponse.json(
            { error: 'reviewerId is required for approve action' },
            { status: 400 }
          )
        }
        success = await reviewQueueManager.approveDocument(itemId, reviewerId, notes)
        message = success ? 'Document approved successfully' : 'Failed to approve document'
        break

      case 'reject':
        if (!reviewerId || !reason) {
          return NextResponse.json(
            { error: 'reviewerId and reason are required for reject action' },
            { status: 400 }
          )
        }
        success = await reviewQueueManager.rejectDocument(itemId, reviewerId, reason)
        message = success ? 'Document rejected' : 'Failed to reject document'
        break

      case 'request-revision':
        if (!reviewerId || !feedback) {
          return NextResponse.json(
            { error: 'reviewerId and feedback are required for request-revision action' },
            { status: 400 }
          )
        }
        success = await reviewQueueManager.requestRevision(itemId, reviewerId, feedback)
        message = success ? 'Revision requested' : 'Failed to request revision'
        break

      default:
        return NextResponse.json(
          { error: `Invalid action: ${action}. Valid actions: assign, approve, reject, request-revision` },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success,
      message,
      action,
      itemId
    }, { status: success ? 200 : 500 })

  } catch (error) {
    logger.error('[API] Error processing review action:', error)
    return NextResponse.json(
      { error: 'Failed to process review action', details: error instanceof Error ? error instanceof Error ? error.message : String(error) : 'Unknown error' },
      { status: 500 }
    )
  }
}
