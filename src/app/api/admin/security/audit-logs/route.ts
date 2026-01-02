/**
 * Security Audit Logs API
 * P1-012: Security Audit Dashboard
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { withRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication and admin role
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role, tenant_id')
      .eq('id', user.id)
      .single()

    if (userData?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const eventType = searchParams.get('event_type') || undefined
    const resourceType = searchParams.get('resource_type') || undefined
    const success = searchParams.get('success')
    const userId = searchParams.get('user_id') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build query
    let query = supabase
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .eq('tenant_id', userData.tenant_id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    if (resourceType) {
      query = query.eq('resource_type', resourceType)
    }

    if (success !== null && success !== undefined) {
      query = query.eq('success', success === 'true')
    }

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data: logs, error, count } = await query

    if (error) {
      logger.error('Fetch audit logs error:', error)
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }

    return NextResponse.json({
      logs,
      total: count || 0,
      limit,
      offset,
    })
  } catch (error: any) {
    logger.error('Audit logs API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// Apply rate limiting
export const GET = withRateLimit(handler, { type: 'api', limit: 100 })
