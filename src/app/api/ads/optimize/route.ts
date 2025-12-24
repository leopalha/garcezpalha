/**
 * Ads Optimization API
 * Optimize campaign performance using AI
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createAdsAgent, CampaignPerformanceData } from '@/lib/ai/agents/marketing/ads-agent'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface OptimizeCampaignRequest {
  campaignId?: string
  performanceData: CampaignPerformanceData
  legalArea: string
}

interface OptimizeKeywordsRequest {
  keywords: Array<{
    keyword: string
    matchType: string
    impressions: number
    clicks: number
    conversions: number
    cpc: number
    qualityScore?: number
  }>
  legalArea: string
}

interface OptimizeBudgetRequest {
  campaigns: Array<{
    name: string
    platform: 'google' | 'meta'
    budget: number
    spend: number
    conversions: number
    roas?: number
  }>
  totalBudget: number
}

// POST - Optimize campaign, keywords, or budget
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'campaign'

    const adsAgent = createAdsAgent()

    switch (type) {
      case 'campaign': {
        const body = await request.json() as OptimizeCampaignRequest
        const { campaignId, performanceData, legalArea } = body

        if (!performanceData || !legalArea) {
          return NextResponse.json(
            { error: 'performanceData and legalArea are required' },
            { status: 400 }
          )
        }

        const optimization = await adsAgent.optimizeCampaign(performanceData, legalArea)

        // Save optimization recommendations
        if (campaignId) {
          await supabase
            .from('ad_optimizations')
            .insert({
              campaign_id: campaignId,
              optimization_type: 'campaign',
              score: optimization.overallScore,
              health_status: optimization.healthStatus,
              recommendations: optimization.recommendations,
              created_at: new Date().toISOString(),
            })
        }

        return NextResponse.json({
          success: true,
          optimization,
        })
      }

      case 'keywords': {
        const body = await request.json() as OptimizeKeywordsRequest
        const { keywords, legalArea } = body

        if (!keywords || !legalArea) {
          return NextResponse.json(
            { error: 'keywords and legalArea are required' },
            { status: 400 }
          )
        }

        const analysis = await adsAgent.analyzeKeywords(keywords, legalArea)

        return NextResponse.json({
          success: true,
          analysis,
        })
      }

      case 'budget': {
        const body = await request.json() as OptimizeBudgetRequest
        const { campaigns, totalBudget } = body

        if (!campaigns || !totalBudget) {
          return NextResponse.json(
            { error: 'campaigns and totalBudget are required' },
            { status: 400 }
          )
        }

        const allocation = await adsAgent.optimizeBudget(campaigns, totalBudget)

        return NextResponse.json({
          success: true,
          allocation,
        })
      }

      case 'audience': {
        const body = await request.json()
        const { audienceData } = body

        if (!audienceData) {
          return NextResponse.json(
            { error: 'audienceData is required' },
            { status: 400 }
          )
        }

        const analysis = await adsAgent.analyzeAudience(audienceData)

        return NextResponse.json({
          success: true,
          analysis,
        })
      }

      case 'adcopy': {
        const body = await request.json()
        const { ads, legalArea, platform } = body

        if (!ads || !legalArea || !platform) {
          return NextResponse.json(
            { error: 'ads, legalArea, and platform are required' },
            { status: 400 }
          )
        }

        const optimization = await adsAgent.optimizeAdCopy(ads, legalArea, platform)

        return NextResponse.json({
          success: true,
          optimization,
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown optimization type: ${type}` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize', details: (error as Error).message },
      { status: 500 }
    )
  }
}
