/**
 * Ads Campaigns API
 * Manage Google Ads and Meta Ads campaigns
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createAdsAgent } from '@/lib/ai/agents/marketing/ads-agent'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface CreateCampaignRequest {
  platform: 'google' | 'meta'
  legalArea: string
  objective?: 'leads' | 'traffic' | 'awareness' | 'engagement'
  budget: {
    daily: number
    monthly: number
  }
}

// POST - Create new campaign
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateCampaignRequest

    const { platform, legalArea, objective = 'leads', budget } = body

    if (!platform || !legalArea || !budget) {
      return NextResponse.json(
        { error: 'platform, legalArea, and budget are required' },
        { status: 400 }
      )
    }

    const adsAgent = createAdsAgent()

    let campaign
    if (platform === 'google') {
      campaign = await adsAgent.createGoogleAdsCampaign(legalArea, objective, budget)
    } else {
      campaign = await adsAgent.createMetaAdsCampaign(legalArea, objective, budget)
    }

    // Save campaign to database
    const { data: savedCampaign, error: saveError } = await supabase
      .from('ad_campaigns')
      .insert({
        platform,
        legal_area: legalArea,
        objective,
        name: campaign.campaignName,
        budget_daily: budget.daily,
        budget_monthly: budget.monthly,
        campaign_data: campaign,
        status: 'draft',
        created_by: 'ai_agent',
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving campaign:', saveError)
      return NextResponse.json({
        success: true,
        campaign,
        saved: false,
        error: saveError.message,
      })
    }

    return NextResponse.json({
      success: true,
      campaign,
      saved: true,
      campaignId: savedCampaign.id,
    })

  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create campaign', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET - List campaigns
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')
    const legalArea = searchParams.get('legalArea')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('ad_campaigns')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (platform) query = query.eq('platform', platform)
    if (status) query = query.eq('status', status)
    if (legalArea) query = query.eq('legal_area', legalArea)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch campaigns', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })

  } catch (error) {
    console.error('Campaign list error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns', details: (error as Error).message },
      { status: 500 }
    )
  }
}
