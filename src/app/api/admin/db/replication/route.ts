import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkReplicationLag, serverReplicaConfig } from '@/lib/supabase/server-with-replicas'
import { createLogger } from '@/lib/logger'

const logger = createLogger('api:admin:db:replication')

export const dynamic = 'force-dynamic'

// ============================================================================
// GET /api/admin/db/replication - Get database replication status
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

    // Get replication status
    const status = {
      enabled: serverReplicaConfig.hasReplica,
      primaryUrl: serverReplicaConfig.primaryUrl,
      replicaUrl: serverReplicaConfig.hasReplica
        ? serverReplicaConfig.replicaUrl
        : null,
      lag: serverReplicaConfig.hasReplica ? await checkReplicationLag() : 0,
      lagThresholds: {
        healthy: 1000, // < 1s
        warning: 5000, // 1-5s
        critical: 10000, // > 10s
      },
    }

    const lagStatus =
      status.lag === 0
        ? 'not_configured'
        : status.lag < status.lagThresholds.healthy
        ? 'healthy'
        : status.lag < status.lagThresholds.critical
        ? 'warning'
        : 'critical'

    logger.info('[Replication] Status checked', { lagMs: status.lag, status: lagStatus })

    return NextResponse.json({
      ...status,
      lagStatus,
    })
  } catch (error) {
    logger.error('[Replication] Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to get replication status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
