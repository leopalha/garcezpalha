/**
 * SEO Keywords API
 * Keyword research and analysis
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSEOAgent } from '@/lib/ai/agents/marketing/seo-agent'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface KeywordResearchRequest {
  legalArea: string
  competitors?: string[]
}

interface ContentGapRequest {
  currentPages: Array<{ url: string; keyword?: string; position?: number }>
  competitors: string[]
  legalArea: string
}

// POST - Research keywords or analyze content gaps
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action') || 'research'

    const seoAgent = createSEOAgent()

    switch (action) {
      case 'research': {
        const body = await request.json() as KeywordResearchRequest
        const { legalArea, competitors } = body

        if (!legalArea) {
          return NextResponse.json(
            { error: 'legalArea is required' },
            { status: 400 }
          )
        }

        const research = await seoAgent.researchKeywords(legalArea, competitors)

        // Save keyword research
        const { error: saveError } = await supabase
          .from('seo_keyword_research')
          .insert({
            legal_area: legalArea,
            primary_keywords: research.primaryKeywords,
            longtail_keywords: research.longTailKeywords,
            question_keywords: research.questionKeywords,
            local_keywords: research.localKeywords,
            created_at: new Date().toISOString(),
          })

        if (saveError) {
          console.error('Error saving keyword research:', saveError)
        }

        return NextResponse.json({
          success: true,
          research,
        })
      }

      case 'content-gap': {
        const body = await request.json() as ContentGapRequest
        const { currentPages, competitors, legalArea } = body

        if (!currentPages || !competitors || !legalArea) {
          return NextResponse.json(
            { error: 'currentPages, competitors, and legalArea are required' },
            { status: 400 }
          )
        }

        const analysis = await seoAgent.analyzeContentGaps(currentPages, competitors, legalArea)

        return NextResponse.json({
          success: true,
          analysis,
        })
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Keyword research error:', error)
    return NextResponse.json(
      { error: 'Failed to research keywords', details: (error as Error).message },
      { status: 500 }
    )
  }
}

// GET - Get saved keyword research
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const legalArea = searchParams.get('legalArea')
    const limit = parseInt(searchParams.get('limit') || '10')

    let query = supabase
      .from('seo_keyword_research')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (legalArea) {
      query = query.eq('legal_area', legalArea)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch keyword research', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })

  } catch (error) {
    console.error('Keyword fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch keywords', details: (error as Error).message },
      { status: 500 }
    )
  }
}
