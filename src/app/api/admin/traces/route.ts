import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:admin:traces')

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/admin/traces - Get distributed traces (mock endpoint)
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

    // In production, this would query the tracing backend (Jaeger, Datadog, etc.)
    // For now, return mock data showing trace structure

    const mockTraces = [
      {
        traceId: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
        spans: [
          {
            spanId: '1a2b3c4d5e6f7g8h',
            name: 'POST /api/chat/message',
            kind: 'SERVER',
            startTime: Date.now() - 5000,
            duration: 2340,
            status: 'OK',
            attributes: {
              'http.method': 'POST',
              'http.status_code': 200,
            },
          },
          {
            spanId: '2b3c4d5e6f7g8h9i',
            parentSpanId: '1a2b3c4d5e6f7g8h',
            name: 'DB SELECT messages',
            kind: 'CLIENT',
            startTime: Date.now() - 4800,
            duration: 45,
            status: 'OK',
            attributes: {
              'db.system': 'postgresql',
              'db.operation': 'SELECT',
            },
          },
          {
            spanId: '3c4d5e6f7g8h9i0j',
            parentSpanId: '1a2b3c4d5e6f7g8h',
            name: 'AI gpt-4o-mini chat',
            kind: 'CLIENT',
            startTime: Date.now() - 4700,
            duration: 2100,
            status: 'OK',
            attributes: {
              'ai.model': 'gpt-4o-mini',
              'ai.provider': 'openai',
            },
          },
        ],
      },
    ]

    logger.info('[Traces] Retrieved mock traces')

    return NextResponse.json({
      traces: mockTraces,
      message:
        'This is mock data. Configure OTEL_EXPORTER_ENDPOINT to send traces to Jaeger/Datadog.',
    })
  } catch (error) {
    logger.error('[Traces] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get traces',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
