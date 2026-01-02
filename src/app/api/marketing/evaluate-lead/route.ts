import { NextRequest, NextResponse } from 'next/server'
import { MarketingLeadAgent } from '@/lib/marketing/marketing-lead-agent'
import { LeadData } from '@/lib/marketing/lead-scorer'
import { UserSession } from '@/lib/marketing/user-tracker'
import { logger } from '@/lib/logger'

export const runtime = 'edge'

/**
 * Lead evaluation endpoint
 * Evaluates a lead and returns score + recommendations
 */

interface EvaluateLeadRequest {
  // Lead data
  fullName?: string
  email?: string
  phone?: string
  company?: string
  serviceInterest?: string
  message?: string
  source: 'website' | 'whatsapp' | 'gmail' | 'referral' | 'ads'

  // Optional user session data
  userSession?: UserSession

  // Optional: lead ID for re-evaluation
  leadId?: string

  // Metadata
  metadata?: Record<string, any>
}

export async function POST(request: NextRequest) {
  try {
    const body: EvaluateLeadRequest = await request.json()

    // Validate required fields
    if (!body.source) {
      return NextResponse.json(
        { error: 'Source is required' },
        { status: 400 }
      )
    }

    // If leadId is provided, re-evaluate existing lead
    if (body.leadId) {
      const result = await MarketingLeadAgent.reevaluateLead(
        body.leadId,
        body.userSession
      )

      return NextResponse.json(result)
    }

    // Otherwise, evaluate new lead
    const leadData: LeadData = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      company: body.company,
      serviceInterest: body.serviceInterest,
      message: body.message,
      source: body.source,
      userSession: body.userSession,
      metadata: body.metadata,
    }

    const result = await MarketingLeadAgent.evaluateLead(leadData)

    return NextResponse.json(result)
  } catch (error) {
    logger.error('Error evaluating lead:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate lead', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * GET: Batch evaluate leads without scores
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')

    const results = await MarketingLeadAgent.batchEvaluateLeads(limit)

    return NextResponse.json({
      success: true,
      count: results.length,
      leads: results,
    })
  } catch (error) {
    logger.error('Error batch evaluating leads:', error)
    return NextResponse.json(
      { error: 'Failed to batch evaluate leads' },
      { status: 500 }
    )
  }
}
