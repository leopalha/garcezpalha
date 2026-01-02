/**
 * Content Review API
 * QA and approval workflow for content
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createQAAgent } from '@/lib/ai/agents/operations/qa-agent'
import { logger } from '@/lib/logger'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ReviewRequest {
  contentId: string
  reviewType?: 'quick' | 'full' | 'oab' | 'legal' | 'grammar'
}

interface ApprovalRequest {
  contentId: string
  decision: 'approve' | 'reject' | 'revision'
  comments?: string
  changes?: string[]
}

// Request content review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ReviewRequest

    const { contentId, reviewType = 'full' } = body

    if (!contentId) {
      return NextResponse.json(
        { error: 'contentId is required' },
        { status: 400 }
      )
    }

    // Fetch the content
    const { data: content, error: fetchError } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('id', contentId)
      .single()

    if (fetchError || !content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    const qaAgent = createQAAgent()
    let reviewResult: unknown

    switch (reviewType) {
      case 'quick':
        const quickCheck = await qaAgent.quickOABCheck(content.content)
        reviewResult = {
          type: 'quick',
          passed: quickCheck.passed,
          violation: quickCheck.criticalViolation,
        }
        break

      case 'oab':
        reviewResult = await qaAgent.checkOABCompliance(content.content)
        break

      case 'legal':
        reviewResult = await qaAgent.verifyLegalAccuracy(content.content, content.legal_area)
        break

      case 'grammar':
        reviewResult = await qaAgent.checkGrammar(content.content)
        break

      case 'full':
      default:
        reviewResult = await qaAgent.runFullQAPipeline(
          content.content,
          content.content_type,
          content.platform,
          content.legal_area
        )
        break
    }

    // Update content with review result
    const { error: updateError } = await supabase
      .from('scheduled_posts')
      .update({
        status: 'pending_review',
        metadata: {
          ...content.metadata,
          lastReview: {
            type: reviewType,
            result: reviewResult,
            reviewedAt: new Date().toISOString(),
          },
        },
      })
      .eq('id', contentId)

    if (updateError) {
      logger.error('Error updating content review:', updateError)
    }

    return NextResponse.json({
      success: true,
      contentId,
      reviewType,
      result: reviewResult,
    })

  } catch (error) {
    logger.error('Review error:', error)
    return NextResponse.json(
      { error: 'Failed to review content', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Submit approval decision
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as ApprovalRequest

    const { contentId, decision, comments, changes } = body

    if (!contentId || !decision) {
      return NextResponse.json(
        { error: 'contentId and decision are required' },
        { status: 400 }
      )
    }

    // Fetch the content
    const { data: content, error: fetchError } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('id', contentId)
      .single()

    if (fetchError || !content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      )
    }

    // Determine new status based on decision
    let newStatus: string
    switch (decision) {
      case 'approve':
        newStatus = 'approved'
        break
      case 'reject':
        newStatus = 'draft'
        break
      case 'revision':
        newStatus = 'pending_review'
        break
      default:
        return NextResponse.json(
          { error: 'Invalid decision' },
          { status: 400 }
        )
    }

    // Apply changes if provided
    let updatedContent = content.content
    if (changes && changes.length > 0) {
      // Auto-fix if QA agent suggested changes
      const qaAgent = createQAAgent()
      const rawIssues = (content.metadata?.lastReview?.result as { issues?: Array<{ severity: string; category: string; description: string; suggestion: string }> })?.issues || []
      // Convert to proper ContentIssue type
      const issues = rawIssues.map(i => ({
        severity: i.severity as 'critical' | 'high' | 'medium' | 'low',
        category: i.category as 'oab' | 'legal' | 'quality' | 'brand' | 'platform',
        description: i.description,
        suggestion: i.suggestion,
      }))
      if (issues.length > 0) {
        const fixResult = await qaAgent.autoFix(content.content, issues)
        updatedContent = fixResult.fixedContent
      }
    }

    // Update the content
    const { data: updated, error: updateError } = await supabase
      .from('scheduled_posts')
      .update({
        content: updatedContent,
        status: newStatus,
        approved_at: decision === 'approve' ? new Date().toISOString() : null,
        metadata: {
          ...content.metadata,
          approvalHistory: [
            ...(content.metadata?.approvalHistory || []),
            {
              decision,
              comments,
              changes,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      })
      .eq('id', contentId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update approval', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated,
      decision,
      newStatus,
    })

  } catch (error) {
    logger.error('Approval error:', error)
    return NextResponse.json(
      { error: 'Failed to process approval', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Get content review history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contentId = searchParams.get('contentId')
    const status = searchParams.get('status')

    if (contentId) {
      // Get specific content review
      const { data, error } = await supabase
        .from('scheduled_posts')
        .select('*')
        .eq('id', contentId)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Content not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        content: data,
        reviewHistory: data.metadata?.approvalHistory || [],
        lastReview: data.metadata?.lastReview,
      })
    }

    // Get all content pending review
    let query = supabase
      .from('scheduled_posts')
      .select('id, title, content_type, platform, status, created_at, metadata')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    } else {
      query = query.in('status', ['pending_review', 'draft'])
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch reviews', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      counts: {
        pending: data?.filter((c) => c.status === 'pending_review').length || 0,
        draft: data?.filter((c) => c.status === 'draft').length || 0,
      },
    })

  } catch (error) {
    logger.error('Review history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch review history', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Batch review multiple contents
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as { contentIds: string[] }

    const { contentIds } = body

    if (!contentIds || contentIds.length === 0) {
      return NextResponse.json(
        { error: 'contentIds array is required' },
        { status: 400 }
      )
    }

    // Fetch all contents
    const { data: contents, error: fetchError } = await supabase
      .from('scheduled_posts')
      .select('*')
      .in('id', contentIds)

    if (fetchError || !contents) {
      return NextResponse.json(
        { error: 'Contents not found' },
        { status: 404 }
      )
    }

    const qaAgent = createQAAgent()
    const batchResult = await qaAgent.batchReview(
      contents.map((c) => ({
        id: c.id,
        content: c.content,
        contentType: c.content_type,
      }))
    )

    // Update statuses based on batch review
    const updatePromises = batchResult.results.map((result) => {
      let status: string
      switch (result.decision) {
        case 'approved':
          status = 'approved'
          break
        case 'rejected':
          status = 'draft'
          break
        default:
          status = 'pending_review'
      }

      return supabase
        .from('scheduled_posts')
        .update({
          status,
          metadata: {
            ...contents.find((c) => c.id === result.contentId)?.metadata,
            batchReview: {
              score: result.score,
              decision: result.decision,
              summary: result.summary,
              reviewedAt: new Date().toISOString(),
            },
          },
        })
        .eq('id', result.contentId)
    })

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      batchResult,
    })

  } catch (error) {
    logger.error('Batch review error:', error)
    return NextResponse.json(
      { error: 'Failed to batch review', details: (error as Error).message },
      { status: 500 }
    )
  }
}
