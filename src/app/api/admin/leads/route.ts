/**
 * Leads List API Route
 * Returns paginated list of leads
 */

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { listLeads } from '@/lib/leads/lead-database'
import type { LeadCategory } from '@/lib/ai/qualification/types'
import type { LeadStatus } from '@/lib/leads/lead-database'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:admin:leads')

// Cache leads list for 5 minutes
export const revalidate = 300

export async function GET(request: NextRequest) {
  try {
    logger.info('Fetching leads list')

    // Check authentication using next-auth
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      logger.warn('Leads list fetch failed - unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin/lawyer role
    const userRole = session.user.role
    if (userRole !== 'admin' && userRole !== 'lawyer') {
      logger.warn('Leads list fetch failed - insufficient permissions', { userId: session.user.id, role: userRole })
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const category = url.searchParams.get('category') as LeadCategory | null
    const status = url.searchParams.get('status') as LeadStatus | null
    const search = url.searchParams.get('search')

    logger.info('Leads list query parameters', { userId: session.user.id, page, limit, category, status, search })

    // Fetch leads from database with filters
    const result = await listLeads({
      page,
      limit,
      category: category || undefined,
      status: status || undefined,
      search: search || undefined,
    })

    // Format for frontend
    const formattedLeads = result.leads.map((lead) => ({
      id: lead.id,
      clientName: lead.clientName,
      email: lead.email,
      phone: lead.phone,
      productId: lead.productId,
      productName: lead.productName,
      category: lead.category,
      score: lead.scoreTotal,
      status: lead.status,
      estimatedValue: lead.estimatedValue,
      createdAt: lead.createdAt,
      lastContactAt: lead.lastContactAt,
    }))

    logger.info('Leads list fetched successfully', { userId: session.user.id, total: result.total, returned: formattedLeads.length, status: 200 })

    return NextResponse.json({
      leads: formattedLeads,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      total: result.total,
    })
  } catch (error) {
    logger.error('Leads list fetch failed', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
