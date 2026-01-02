/**
 * Supabase Server Client with Read Replicas Support - D7-012
 * Server-side dual client setup for Next.js API routes
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createLogger } from '@/lib/logger'

const logger = createLogger('supabase-server-replicas')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_READ_REPLICA_URL =
  process.env.NEXT_PUBLIC_SUPABASE_READ_REPLICA_URL || SUPABASE_URL

const hasReplica = SUPABASE_READ_REPLICA_URL !== SUPABASE_URL

// ============================================================================
// SERVER CLIENT FACTORIES
// ============================================================================

/**
 * Create primary server client (for writes and critical reads)
 */
export async function createPrimaryServerClient() {
  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // Handle cookie setting errors gracefully
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // Handle cookie removal errors gracefully
        }
      },
    },
  })
}

/**
 * Create read replica server client (for analytics and non-critical reads)
 */
export async function createReadReplicaServerClient() {
  if (!hasReplica) {
    return createPrimaryServerClient()
  }

  const cookieStore = await cookies()

  return createServerClient(SUPABASE_READ_REPLICA_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // Handle cookie setting errors gracefully
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // Handle cookie removal errors gracefully
        }
      },
    },
  })
}

// ============================================================================
// SMART CLIENT SELECTOR
// ============================================================================

export type QueryType = 'read' | 'write' | 'critical-read'

/**
 * Get smart server client based on query type
 */
export async function getSmartServerClient(queryType: QueryType = 'read') {
  switch (queryType) {
    case 'write':
      // All writes go to primary
      return createPrimaryServerClient()

    case 'critical-read':
      // Critical reads (user profile, auth, real-time data) go to primary
      // to avoid replication lag issues
      return createPrimaryServerClient()

    case 'read':
    default:
      // Non-critical reads (analytics, reports, lists) can use replica
      return createReadReplicaServerClient()
  }
}

// ============================================================================
// QUERY ROUTING HELPERS
// ============================================================================

/**
 * Execute query with automatic client selection
 */
export async function executeQuery<T>(
  queryType: QueryType,
  query: (client: any) => Promise<T>
): Promise<T> {
  const client = await getSmartServerClient(queryType)
  return query(client)
}

/**
 * Execute read query (uses replica if available)
 */
export async function executeReadQuery<T>(query: (client: any) => Promise<T>): Promise<T> {
  return executeQuery('read', query)
}

/**
 * Execute write query (always uses primary)
 */
export async function executeWriteQuery<T>(query: (client: any) => Promise<T>): Promise<T> {
  return executeQuery('write', query)
}

/**
 * Execute critical read query (always uses primary)
 */
export async function executeCriticalReadQuery<T>(
  query: (client: any) => Promise<T>
): Promise<T> {
  return executeQuery('critical-read', query)
}

// ============================================================================
// FAILOVER SUPPORT
// ============================================================================

/**
 * Execute query with automatic failover from replica to primary
 */
export async function executeQueryWithFailover<T>(
  query: (client: any) => Promise<T>,
  preferReplica: boolean = true
): Promise<T> {
  if (!preferReplica || !hasReplica) {
    const client = await createPrimaryServerClient()
    return query(client)
  }

  try {
    // Try replica first
    const replica = await createReadReplicaServerClient()
    return await query(replica)
  } catch (error) {
    logger.warn('[Failover] Replica query failed, trying primary', { error: error instanceof Error ? error.message : String(error) })

    // Fallback to primary
    const primary = await createPrimaryServerClient()
    return query(primary)
  }
}

// ============================================================================
// REPLICATION LAG MONITORING
// ============================================================================

/**
 * Check replication lag in milliseconds
 */
export async function checkReplicationLag(): Promise<number> {
  if (!hasReplica) {
    return 0
  }

  try {
    const replica = await createReadReplicaServerClient()

    // Query last replay timestamp from replica
    const { data, error } = await replica.rpc('pg_last_xact_replay_timestamp')

    if (error) {
      logger.error('[Replication] Failed to check lag', error)
      return 0
    }

    // Calculate lag
    const replicaTime = new Date(data).getTime()
    const now = Date.now()
    const lagMs = now - replicaTime

    if (lagMs > 5000) {
      logger.warn('[Replication] High lag detected', { lagMs })
    }

    return lagMs
  } catch (error) {
    logger.error('[Replication] Error checking lag', error)
    return 0
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export const serverReplicaConfig = {
  hasReplica,
  primaryUrl: SUPABASE_URL,
  replicaUrl: SUPABASE_READ_REPLICA_URL,
}
