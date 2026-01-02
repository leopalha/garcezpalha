/**
 * Content Scheduling API
 * Schedule and manage content for automated publishing
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSocialAgent } from '@/lib/ai/agents/marketing/social-agent'
import { createQAAgent } from '@/lib/ai/agents/operations/qa-agent'
import { logger } from '@/lib/logger'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ScheduleRequest {
  contentId: string
  scheduledFor: string // ISO datetime
  platform?: string
  optimizeTime?: boolean
}

interface BulkScheduleRequest {
  contentIds: string[]
  startDate: string
  endDate: string
  postsPerDay?: number
  platforms?: string[]
  optimizeTimes?: boolean
}

// Schedule single content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ScheduleRequest

    const { contentId, scheduledFor, platform, optimizeTime } = body

    if (!contentId || !scheduledFor) {
      return NextResponse.json(
        { error: 'contentId and scheduledFor are required' },
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

    let finalScheduledFor = scheduledFor

    // Optimize time if requested
    if (optimizeTime) {
      const socialAgent = createSocialAgent()
      const targetPlatform = platform || content.platform || 'instagram'
      const optimalTimes = socialAgent.getOptimalPostingTimes(targetPlatform as 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok')

      // Find closest optimal time on the same day
      const scheduledDate = new Date(scheduledFor)
      const scheduledHour = scheduledDate.getHours()

      const closestOptimalTime = optimalTimes.reduce((closest, time) => {
        const [hour] = time.split(':').map(Number)
        const currentDiff = Math.abs(hour - scheduledHour)
        const closestDiff = Math.abs(parseInt(closest.split(':')[0]) - scheduledHour)
        return currentDiff < closestDiff ? time : closest
      })

      const [optimalHour, optimalMinute] = closestOptimalTime.split(':').map(Number)
      scheduledDate.setHours(optimalHour, optimalMinute, 0, 0)
      finalScheduledFor = scheduledDate.toISOString()
    }

    // Run QA check before scheduling
    const qaAgent = createQAAgent()
    const oabCheck = await qaAgent.quickOABCheck(content.content)

    if (!oabCheck.passed) {
      return NextResponse.json({
        success: false,
        error: 'Content failed OAB compliance check',
        violation: oabCheck.criticalViolation,
      }, { status: 422 })
    }

    // Update the content with schedule
    const { data: updatedContent, error: updateError } = await supabase
      .from('scheduled_posts')
      .update({
        scheduled_for: finalScheduledFor,
        platform: platform || content.platform,
        status: 'scheduled',
        metadata: {
          ...content.metadata,
          scheduleInfo: {
            originalTime: scheduledFor,
            optimized: optimizeTime,
            finalTime: finalScheduledFor,
            scheduledAt: new Date().toISOString(),
          },
        },
      })
      .eq('id', contentId)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to schedule content', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedContent,
      schedule: {
        scheduledFor: finalScheduledFor,
        optimized: optimizeTime,
        oabCompliant: true,
      },
    })

  } catch (error) {
    logger.error('Schedule error:', error)
    return NextResponse.json(
      { error: 'Failed to schedule content', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Bulk schedule multiple contents
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as BulkScheduleRequest

    const {
      contentIds,
      startDate,
      endDate,
      postsPerDay = 2,
      platforms,
      optimizeTimes = true,
    } = body

    if (!contentIds || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'contentIds, startDate, and endDate are required' },
        { status: 400 }
      )
    }

    // Fetch all contents
    const { data: contents, error: fetchError } = await supabase
      .from('scheduled_posts')
      .select('*')
      .in('id', contentIds)

    if (fetchError || !contents || contents.length === 0) {
      return NextResponse.json(
        { error: 'Contents not found' },
        { status: 404 }
      )
    }

    // Calculate date range
    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    // Distribute posts across days
    const socialAgent = createSocialAgent()
    const scheduledResults: Array<{ id: string; scheduledFor: string; platform: string }> = []
    let currentIndex = 0

    for (let day = 0; day < daysDiff && currentIndex < contents.length; day++) {
      const currentDate = new Date(start)
      currentDate.setDate(start.getDate() + day)

      // Skip weekends for professional content (optional)
      // const dayOfWeek = currentDate.getDay()
      // if (dayOfWeek === 0 || dayOfWeek === 6) continue

      for (let post = 0; post < postsPerDay && currentIndex < contents.length; post++) {
        const content = contents[currentIndex]
        const platform = platforms?.[currentIndex % platforms.length] || content.platform || 'instagram'

        // Get optimal time for this platform
        const optimalTimes = socialAgent.getOptimalPostingTimes(platform as 'instagram' | 'linkedin' | 'facebook' | 'twitter' | 'tiktok')
        const timeIndex = post % optimalTimes.length
        const [hour, minute] = optimalTimes[timeIndex].split(':').map(Number)

        currentDate.setHours(hour, minute, 0, 0)
        const scheduledFor = currentDate.toISOString()

        scheduledResults.push({
          id: content.id,
          scheduledFor,
          platform,
        })

        currentIndex++
      }
    }

    // Update all contents
    const updatePromises = scheduledResults.map(({ id, scheduledFor, platform }) =>
      supabase
        .from('scheduled_posts')
        .update({
          scheduled_for: scheduledFor,
          platform,
          status: 'scheduled',
        })
        .eq('id', id)
    )

    await Promise.all(updatePromises)

    return NextResponse.json({
      success: true,
      scheduled: scheduledResults.length,
      unscheduled: contents.length - scheduledResults.length,
      schedule: scheduledResults,
    })

  } catch (error) {
    logger.error('Bulk schedule error:', error)
    return NextResponse.json(
      { error: 'Failed to bulk schedule content', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Get scheduled content calendar
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const platform = searchParams.get('platform')

    let query = supabase
      .from('content_calendar')
      .select('*')
      .order('scheduled_for', { ascending: true })

    if (startDate) {
      query = query.gte('scheduled_for', startDate)
    }
    if (endDate) {
      query = query.lte('scheduled_for', endDate)
    }
    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch calendar', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }

    // Group by date for calendar view
    const calendarByDate: Record<string, typeof data> = {}
    data?.forEach((item) => {
      const date = item.scheduled_date
      if (!calendarByDate[date]) {
        calendarByDate[date] = []
      }
      calendarByDate[date].push(item)
    })

    return NextResponse.json({
      success: true,
      calendar: calendarByDate,
      totalPosts: data?.length || 0,
    })

  } catch (error) {
    logger.error('Calendar fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calendar', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// Cancel scheduled content
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contentId = searchParams.get('contentId')

    if (!contentId) {
      return NextResponse.json(
        { error: 'contentId is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('scheduled_posts')
      .update({
        status: 'cancelled',
        scheduled_for: null,
      })
      .eq('id', contentId)
      .eq('status', 'scheduled')
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to cancel schedule', details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })

  } catch (error) {
    logger.error('Cancel schedule error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel schedule', details: (error as Error).message },
      { status: 500 }
    )
  }
}
