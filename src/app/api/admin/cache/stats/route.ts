import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { semanticCache } from '@/lib/cache/semantic-cache'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:admin:cache:stats')

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/admin/cache/stats - Get semantic cache statistics
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authorization
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get stats for each model
    const models = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo']
    const modelStats = await Promise.all(
      models.map(async (model) => {
        const stats = await semanticCache.getStats(model)
        return {
          model,
          ...stats,
        }
      })
    )

    // Get overall stats
    const overallStats = await semanticCache.getStats()
    const costSavings = await semanticCache.getCostSavings()

    logger.info('[Cache Stats] Retrieved', { totalEntries: overallStats.totalEntries })

    return NextResponse.json({
      overall: {
        ...overallStats,
        costSavings,
      },
      byModel: modelStats,
    })
  } catch (error) {
    logger.error('[Cache Stats] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get cache stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ============================================================================
// DELETE /api/admin/cache/stats - Clear semantic cache
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin authorization
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get model from query params
    const searchParams = request.nextUrl.searchParams
    const model = searchParams.get('model') || undefined

    await semanticCache.clear(model)

    logger.info('[Cache Stats] Cleared cache', { model })

    return NextResponse.json({
      success: true,
      message: model ? `Cache cleared for ${model}` : 'All cache cleared',
    })
  } catch (error) {
    logger.error('[Cache Stats] Error clearing cache:', error)

    return NextResponse.json(
      {
        error: 'Failed to clear cache',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
