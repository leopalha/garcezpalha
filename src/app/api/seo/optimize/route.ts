/**
 * SEO Optimization API
 * Page optimization and content briefs
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSEOAgent } from '@/lib/ai/agents/marketing/seo-agent'
import { logger } from '@/lib/logger'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface OptimizePageRequest {
  url: string
  targetKeyword: string
  currentTitle: string
  currentDescription: string
  h1: string
  h2s: string[]
  wordCount: number
  internalLinks: number
}

interface ContentBriefRequest {
  topic: string
  targetKeyword: string
  legalArea: string
  competitors?: Array<{ url: string; wordCount: number }>
}

// POST - Optimize page or create content brief
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'optimize-page'

    const seoAgent = createSEOAgent()

    switch (action) {
      case 'optimize-page': {
        const body = await request.json() as OptimizePageRequest

        if (!body.url || !body.targetKeyword) {
          return NextResponse.json(
            { error: 'url and targetKeyword are required' },
            { status: 400 }
          )
        }

        const optimization = await seoAgent.optimizePage(body)

        // Save optimization
        const { error: saveError } = await supabase
          .from('seo_page_optimizations')
          .insert({
            url: body.url,
            target_keyword: body.targetKeyword,
            current_score: optimization.currentScore,
            optimized_score: optimization.optimizedScore,
            title_suggested: optimization.titleTag.suggested,
            meta_suggested: optimization.metaDescription.suggested,
            recommendations: optimization.content.suggestions,
            technical_issues: optimization.technicalIssues,
            created_at: new Date().toISOString(),
          })

        if (saveError) {
          logger.error('Error saving optimization:', saveError)
        }

        return NextResponse.json({
          success: true,
          optimization,
        })
      }

      case 'content-brief': {
        const body = await request.json() as ContentBriefRequest
        const { topic, targetKeyword, legalArea, competitors } = body

        if (!topic || !targetKeyword || !legalArea) {
          return NextResponse.json(
            { error: 'topic, targetKeyword, and legalArea are required' },
            { status: 400 }
          )
        }

        const brief = await seoAgent.createContentBrief(topic, targetKeyword, legalArea, competitors)

        // Save brief
        const { data: savedBrief, error: saveError } = await supabase
          .from('seo_content_briefs')
          .insert({
            topic,
            target_keyword: targetKeyword,
            legal_area: legalArea,
            title_suggested: brief.suggestedTitle,
            meta_suggested: brief.suggestedMetaDescription,
            outline: brief.outline,
            word_count_target: brief.targetWordCount,
            brief_data: brief,
            status: 'draft',
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (saveError) {
          logger.error('Error saving brief:', saveError)
          return NextResponse.json({
            success: true,
            brief,
            saved: false,
          })
        }

        return NextResponse.json({
          success: true,
          brief,
          saved: true,
          briefId: savedBrief.id,
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

  } catch (error) {
    logger.error('SEO optimization error:', error)
    return NextResponse.json(
      { error: 'Failed to optimize', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET - Get saved optimizations or briefs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') || 'optimizations'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    const table = type === 'briefs' ? 'seo_content_briefs' : 'seo_page_optimizations'

    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json(
        { error: `Failed to fetch ${type}`, details: error instanceof Error ? error.message : String(error) },
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
    logger.error('SEO fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', details: (error as Error).message },
      { status: 500 }
    )
  }
}
