/**
 * Leads List API Route
 * Returns paginated list of leads
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { listLeads } from '@/lib/leads/lead-database'
import type { LeadCategory } from '@/lib/ai/qualification/types'
import type { LeadStatus } from '@/lib/leads/lead-database'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin/lawyer role
    const userRole = user.user_metadata?.role
    if (userRole !== 'admin' && userRole !== 'lawyer') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const category = url.searchParams.get('category') as LeadCategory | null
    const status = url.searchParams.get('status') as LeadStatus | null
    const search = url.searchParams.get('search')

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

    return NextResponse.json({
      leads: formattedLeads,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      total: result.total,
    })
  } catch (error) {
    console.error('[API /admin/leads] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
