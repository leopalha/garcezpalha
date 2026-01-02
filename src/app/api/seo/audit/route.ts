/**
 * SEO Audit API
 * Technical, local, and backlink audits
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSEOAgent } from '@/lib/ai/agents/marketing/seo-agent'
import { logger } from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface TechnicalAuditRequest {
  totalPages: number
  indexedPages: number
  mobileScore?: number
  desktopScore?: number
  coreWebVitals?: { lcp: number; fid: number; cls: number }
  httpsEnabled: boolean
  structuredDataTypes?: string[]
}

interface LocalSEORequest {
  gbpClaimed: boolean
  gbpVerified: boolean
  reviews: { count: number; rating: number }
  citations: { consistent: number; inconsistent: number }
  localKeywords: Array<{ keyword: string; position?: number }>
}

interface BacklinkRequest {
  totalBacklinks: number
  referringDomains: number
  domainAuthority: number
  topLinks: Array<{
    domain: string
    da: number
    anchorText: string
  }>
  competitors?: Array<{ domain: string; referringDomains: number; da: number }>
}

// POST - Run audits
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'technical'

    const seoAgent = createSEOAgent()

    switch (type) {
      case 'technical': {
        const body = await request.json() as TechnicalAuditRequest

        if (!body.totalPages) {
          return NextResponse.json(
            { error: 'totalPages is required' },
            { status: 400 }
          )
        }

        const audit = await seoAgent.performTechnicalAudit(body)

        // Save audit
        const { error: saveError } = await supabase
          .from('seo_audits')
          .insert({
            audit_type: 'technical',
            overall_score: audit.overallScore,
            critical_issues: audit.criticalIssues.length,
            warnings: audit.warnings.length,
            audit_data: audit,
            created_at: new Date().toISOString(),
          })

        if (saveError) {
          logger.error('Error saving audit:', saveError)
        }

        return NextResponse.json({
          success: true,
          audit,
        })
      }

      case 'local': {
        const body = await request.json() as LocalSEORequest

        if (!body.reviews) {
          return NextResponse.json(
            { error: 'reviews data is required' },
            { status: 400 }
          )
        }

        const audit = await seoAgent.performLocalSEOAudit(body)

        // Save audit
        const { error: saveError } = await supabase
          .from('seo_audits')
          .insert({
            audit_type: 'local',
            overall_score: audit.googleBusinessProfile.completeness,
            audit_data: audit,
            created_at: new Date().toISOString(),
          })

        if (saveError) {
          logger.error('Error saving audit:', saveError)
        }

        return NextResponse.json({
          success: true,
          audit,
        })
      }

      case 'backlinks': {
        const body = await request.json() as BacklinkRequest
        const { topLinks, competitors, ...overview } = body

        if (!overview.totalBacklinks) {
          return NextResponse.json(
            { error: 'backlink data is required' },
            { status: 400 }
          )
        }

        const analysis = await seoAgent.analyzeBacklinks(
          { ...overview, topLinks },
          competitors
        )

        // Save analysis
        const { error: saveError } = await supabase
          .from('seo_audits')
          .insert({
            audit_type: 'backlinks',
            overall_score: overview.domainAuthority,
            audit_data: analysis,
            created_at: new Date().toISOString(),
          })

        if (saveError) {
          logger.error('Error saving analysis:', saveError)
        }

        return NextResponse.json({
          success: true,
          analysis,
        })
      }

      case 'architecture': {
        const body = await request.json()
        const { pages } = body

        if (!pages || !Array.isArray(pages)) {
          return NextResponse.json(
            { error: 'pages array is required' },
            { status: 400 }
          )
        }

        const analysis = await seoAgent.analyzeSiteArchitecture(pages)

        return NextResponse.json({
          success: true,
          analysis,
        })
      }

      case 'link-building': {
        const body = await request.json()
        const { currentState, targetDA } = body

        if (!currentState || !targetDA) {
          return NextResponse.json(
            { error: 'currentState and targetDA are required' },
            { status: 400 }
          )
        }

        const strategy = await seoAgent.createLinkBuildingStrategy(currentState, targetDA)

        return NextResponse.json({
          success: true,
          strategy,
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown audit type: ${type}` },
          { status: 400 }
        )
    }

  } catch (error) {
    logger.error('Audit error:', error)
    return NextResponse.json(
      { error: 'Failed to run audit', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET - Get saved audits
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('seo_audits')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) {
      query = query.eq('audit_type', type)
    }

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch audits', details: error instanceof Error ? error.message : String(error) },
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
    logger.error('Audit fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audits', details: (error as Error).message },
      { status: 500 }
    )
  }
}
