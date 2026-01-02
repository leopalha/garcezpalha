/**
 * Supabase Client with Read Replicas Support - D7-012
 * Dual client setup for primary (writes) and replicas (reads)
 */

import { createBrowserClient } from '@supabase/ssr'
import { createLogger } from '@/lib/logger'

const logger = createLogger('supabase-replicas')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_READ_REPLICA_URL =
  process.env.NEXT_PUBLIC_SUPABASE_READ_REPLICA_URL || SUPABASE_URL

const hasReplica = SUPABASE_READ_REPLICA_URL !== SUPABASE_URL

if (hasReplica) {
  logger.info('[Supabase] Read replica enabled', { replicaUrl: SUPABASE_READ_REPLICA_URL })
} else {
  logger.info('[Supabase] Using primary database only (no replica configured)')
}

// ============================================================================
// CLIENT FACTORIES
// ============================================================================

/**
 * Create primary Supabase client (for writes and critical reads)
 */
export function createPrimaryClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

/**
 * Create read replica Supabase client (for analytics, reports, non-critical reads)
 */
export function createReadReplicaClient() {
  if (!hasReplica) {
    logger.debug('[Supabase] No replica configured, using primary')
    return createPrimaryClient()
  }

  return createBrowserClient(SUPABASE_READ_REPLICA_URL, SUPABASE_ANON_KEY)
}

/**
 * Smart client selector based on operation type
 */
export function createSupabaseClient(options: {
  preferReplica?: boolean
  queryType?: 'read' | 'write' | 'critical-read'
} = {}) {
  const { preferReplica = false, queryType = 'read' } = options

  // Always use primary for writes
  if (queryType === 'write') {
    return createPrimaryClient()
  }

  // Use primary for critical reads (user data, auth, real-time)
  if (queryType === 'critical-read') {
    return createPrimaryClient()
  }

  // Use replica for non-critical reads if available
  if (preferReplica && hasReplica) {
    return createReadReplicaClient()
  }

  // Default to primary
  return createPrimaryClient()
}

// ============================================================================
// QUERY TYPE HELPERS
// ============================================================================

/**
 * Get client for read operations (uses replica if available)
 */
export function getReadClient() {
  return createSupabaseClient({ preferReplica: true, queryType: 'read' })
}

/**
 * Get client for write operations (always primary)
 */
export function getWriteClient() {
  return createSupabaseClient({ queryType: 'write' })
}

/**
 * Get client for critical read operations (always primary)
 */
export function getCriticalReadClient() {
  return createSupabaseClient({ queryType: 'critical-read' })
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const replicaConfig = {
  hasReplica,
  primaryUrl: SUPABASE_URL,
  replicaUrl: SUPABASE_READ_REPLICA_URL,
}
