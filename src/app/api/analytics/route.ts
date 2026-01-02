import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { logger } from '@/lib/logger'

// Analytics event schema
const analyticsEventSchema = z.object({
  category: z.enum([
    'page_view',
    'lead',
    'referral',
    'payment',
    'chat',
    'engagement',
    'error',
    'conversion',
  ]),
  action: z.string(),
  label: z.string().optional(),
  value: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.string(),
  url: z.string(),
  userAgent: z.string(),
})

// Store events in memory (in production, this would go to a database)
const eventStore: Array<z.infer<typeof analyticsEventSchema> & { ip: string; id: string }> = []

// Simple UUID generator for environments without crypto.randomUUID
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the event
    const event = analyticsEventSchema.parse(body)

    // Get client IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'

    // Store event with unique ID
    const storedEvent = {
      id: generateId(),
      ...event,
      ip,
    }

    eventStore.push(storedEvent)

    // Keep only last 1000 events in memory
    if (eventStore.length > 1000) {
      eventStore.shift()
    }

    // In production, you would:
    // 1. Store in database
    // 2. Send to analytics service (BigQuery, Mixpanel, etc.)
    // 3. Process for real-time dashboards

    // Log significant events
    if (event.category === 'conversion' || event.category === 'error') {
      console.log(`[Analytics] ${event.category}:`, {
        action: event.action,
        label: event.label,
        value: event.value,
        timestamp: event.timestamp,
      })
    }

    return NextResponse.json({
      success: true,
      eventId: storedEvent.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid event data',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    logger.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    )
  }
}

// Get analytics summary (admin only in production)
export async function GET(request: NextRequest) {
  // In production, add authentication check here
  const url = new URL(request.url)
  const category = url.searchParams.get('category')
  const hours = parseInt(url.searchParams.get('hours') || '24')

  const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)

  let filteredEvents = eventStore.filter(
    (event) => new Date(event.timestamp) >= cutoff
  )

  if (category) {
    filteredEvents = filteredEvents.filter((event) => event.category === category)
  }

  // Calculate summary statistics
  const summary = {
    totalEvents: filteredEvents.length,
    byCategory: {} as Record<string, number>,
    byAction: {} as Record<string, number>,
    conversions: {
      leads: 0,
      payments: 0,
      referrals: 0,
      totalValue: 0,
    },
    errors: {
      total: 0,
      bySeverity: {} as Record<string, number>,
    },
    engagement: {
      pageViews: 0,
      avgTimeOnPage: 0,
      uniqueIPs: new Set<string>(),
    },
  }

  filteredEvents.forEach((event) => {
    // Count by category
    summary.byCategory[event.category] = (summary.byCategory[event.category] || 0) + 1

    // Count by action
    summary.byAction[event.action] = (summary.byAction[event.action] || 0) + 1

    // Track conversions
    if (event.category === 'conversion') {
      if (event.action === 'lead') summary.conversions.leads++
      if (event.action === 'payment') summary.conversions.payments++
      if (event.action === 'referral') summary.conversions.referrals++
      if (event.value) summary.conversions.totalValue += event.value
    }

    // Track errors
    if (event.category === 'error') {
      summary.errors.total++
      const severity = event.action || 'unknown'
      summary.errors.bySeverity[severity] = (summary.errors.bySeverity[severity] || 0) + 1
    }

    // Track engagement
    if (event.category === 'page_view') {
      summary.engagement.pageViews++
    }
    summary.engagement.uniqueIPs.add(event.ip)
  })

  return NextResponse.json({
    timeframe: `Last ${hours} hours`,
    summary: {
      ...summary,
      engagement: {
        ...summary.engagement,
        uniqueVisitors: summary.engagement.uniqueIPs.size,
        uniqueIPs: undefined, // Don't expose raw IPs
      },
    },
    recentEvents: filteredEvents.slice(-10).map((event) => ({
      id: event.id,
      category: event.category,
      action: event.action,
      label: event.label,
      timestamp: event.timestamp,
    })),
  })
}
