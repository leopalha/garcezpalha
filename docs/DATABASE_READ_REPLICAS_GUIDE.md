# Database Read Replicas Setup Guide - D7-012

## Overview

This guide covers setting up database read replicas to improve read performance and reduce load on the primary database.

## Why Read Replicas?

**Benefits:**
- Offload read queries from primary database
- Improve read performance for analytics and reports
- Geographic distribution for lower latency
- High availability (failover capabilities)

**When to use:**
- **> 500 concurrent users**
- **Read-heavy workloads** (80%+ read operations)
- **Complex analytical queries**
- **Geographic distribution** needed

## Supabase Read Replicas

### Prerequisites

- Supabase Pro plan or higher ($25/month)
- Primary database already configured
- Understanding of read vs write operations

### Setup Steps

#### 1. Enable Read Replicas in Supabase

```bash
# Via Supabase CLI
supabase db replicas create \
  --project-ref your-project-ref \
  --region us-east-1 \
  --size medium
```

Or via Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Navigate to Database → Replicas
4. Click "Create Read Replica"
5. Choose region and size
6. Wait for provisioning (5-10 minutes)

#### 2. Get Read Replica Connection String

After creation, you'll receive:
- **Primary (Write)**: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`
- **Replica (Read)**: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres`

Note the different port: **5432** (primary) vs **6543** (read replica)

#### 3. Configure Environment Variables

```bash
# .env.local

# Primary database (for writes)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Read replica (for reads)
NEXT_PUBLIC_SUPABASE_READ_REPLICA_URL=https://your-project-read.supabase.co
# Read replicas use same anon key

# Connection pooling (recommended)
SUPABASE_POOLER_URL=postgresql://postgres.your-project:6543/postgres
DATABASE_URL=postgresql://postgres.your-project:5432/postgres
```

## Implementation

### 1. Create Dual Supabase Clients

```typescript
// src/lib/supabase/client-with-replicas.ts
import { createBrowserClient } from '@supabase/ssr'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_READ_REPLICA_URL = process.env.NEXT_PUBLIC_SUPABASE_READ_REPLICA_URL || SUPABASE_URL

// Primary client (for writes and critical reads)
export function createPrimaryClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// Read replica client (for analytics, reports, non-critical reads)
export function createReadReplicaClient() {
  return createBrowserClient(SUPABASE_READ_REPLICA_URL, SUPABASE_ANON_KEY)
}

// Smart client selector
export function createSupabaseClient(preferReplica: boolean = false) {
  // Use replica for read-heavy operations
  if (preferReplica && SUPABASE_READ_REPLICA_URL !== SUPABASE_URL) {
    return createReadReplicaClient()
  }

  // Default to primary
  return createPrimaryClient()
}
```

### 2. Server-Side Client

```typescript
// src/lib/supabase/server-with-replicas.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createPrimaryServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

export async function createReadReplicaServerClient() {
  const cookieStore = cookies()
  const replicaUrl = process.env.NEXT_PUBLIC_SUPABASE_READ_REPLICA_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!

  return createServerClient(
    replicaUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
```

### 3. Usage Examples

#### Analytics Queries (Use Replica)

```typescript
// src/app/api/admin/analytics/revenue/route.ts
import { createReadReplicaServerClient } from '@/lib/supabase/server-with-replicas'

export async function GET() {
  // Use read replica for heavy analytics
  const supabase = await createReadReplicaServerClient()

  const { data: revenue } = await supabase
    .from('orders')
    .select('amount, created_at')
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: true })

  return NextResponse.json({ revenue })
}
```

#### Write Operations (Use Primary)

```typescript
// src/app/api/leads/route.ts
import { createPrimaryServerClient } from '@/lib/supabase/server-with-replicas'

export async function POST(request: Request) {
  // Always use primary for writes
  const supabase = await createPrimaryServerClient()

  const body = await request.json()

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
    })
    .select()
    .single()

  return NextResponse.json({ data, error })
}
```

#### Mixed Operations (Smart Routing)

```typescript
// src/app/api/conversations/[id]/messages/route.ts
import { createPrimaryServerClient, createReadReplicaServerClient } from '@/lib/supabase/server-with-replicas'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Use replica for reading messages (non-critical)
  const supabase = await createReadReplicaServerClient()

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', params.id)
    .order('created_at', { ascending: true })

  return NextResponse.json({ messages })
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  // Use primary for creating messages
  const supabase = await createPrimaryServerClient()

  const body = await request.json()

  const { data: message } = await supabase
    .from('messages')
    .insert({
      conversation_id: params.id,
      content: body.content,
      role: body.role,
    })
    .select()
    .single()

  return NextResponse.json({ message })
}
```

## Connection Pooling

### PgBouncer Configuration

Supabase includes PgBouncer for connection pooling:

```typescript
// For serverless functions (connection pooling)
const poolerUrl = process.env.SUPABASE_POOLER_URL

// Direct connection for migrations/admin tasks
const directUrl = process.env.DATABASE_URL
```

#### When to use Pooler vs Direct:

**Use Pooler (Port 6543):**
- API routes
- Serverless functions
- High concurrency
- Short-lived connections

**Use Direct (Port 5432):**
- Migrations
- Admin tasks
- Long-running queries
- Subscriptions (realtime)

## Replication Lag Monitoring

```typescript
// src/lib/db/replication-lag.ts
import { createReadReplicaServerClient } from '@/lib/supabase/server-with-replicas'
import { createLogger } from '@/lib/logger'

const logger = createLogger('replication-lag')

export async function checkReplicationLag(): Promise<number> {
  try {
    const supabase = await createReadReplicaServerClient()

    // Query replica's lag
    const { data, error } = await supabase.rpc('pg_last_xact_replay_timestamp')

    if (error) throw error

    // Calculate lag in seconds
    const replicaTime = new Date(data).getTime()
    const now = Date.now()
    const lagMs = now - replicaTime

    if (lagMs > 5000) {
      logger.warn('[Replication] High lag detected', { lagMs })
    }

    return lagMs
  } catch (error) {
    logger.error('[Replication] Failed to check lag', error)
    return 0
  }
}

// Alert if lag exceeds threshold
export async function monitorReplicationLag() {
  const lag = await checkReplicationLag()

  if (lag > 10000) {
    // Send alert (Slack, email, etc.)
    logger.error('[Replication] Critical lag', { lagMs: lag })
  }

  return lag
}
```

## Query Routing Strategy

### Automatic Routing

```typescript
// src/lib/db/smart-client.ts
import { createPrimaryServerClient, createReadReplicaServerClient } from '@/lib/supabase/server-with-replicas'

export type QueryType = 'read' | 'write' | 'critical-read'

export async function getSmartClient(queryType: QueryType = 'read') {
  switch (queryType) {
    case 'write':
      // All writes go to primary
      return createPrimaryServerClient()

    case 'critical-read':
      // Critical reads (user profile, auth) go to primary
      return createPrimaryServerClient()

    case 'read':
    default:
      // Non-critical reads can use replica
      return createReadReplicaServerClient()
  }
}
```

### Usage:

```typescript
// Read from replica
const supabase = await getSmartClient('read')
const { data: analytics } = await supabase.from('analytics').select('*')

// Write to primary
const supabaseWrite = await getSmartClient('write')
await supabaseWrite.from('leads').insert({ name: 'John' })

// Critical read from primary (to avoid stale data)
const supabaseCritical = await getSmartClient('critical-read')
const { data: user } = await supabaseCritical.from('profiles').select('*').eq('id', userId).single()
```

## Performance Metrics

Expected improvements with read replicas:

- **Read Query Latency**: 30-50% reduction
- **Primary DB Load**: 40-60% reduction
- **Concurrent Connections**: 2-5x increase capacity
- **Analytics Query Time**: 50-70% improvement

## Cost Analysis

### Supabase Pricing

- **Pro Plan**: $25/month (includes 8GB database)
- **Read Replica**: +$32/month per replica (Small)
  - Small: 2 CPU, 1GB RAM
  - Medium: 2 CPU, 4GB RAM (+$100/month)
  - Large: 4 CPU, 8GB RAM (+$200/month)

### ROI Calculation

For a platform with:
- 1000+ daily active users
- 100K+ read queries/day
- 10K+ write queries/day

**Without Replicas:**
- Primary DB at 80% capacity
- Slow analytics queries (3-5s)
- Risk of downtime during peak hours

**With Replicas:**
- Primary DB at 40% capacity
- Fast analytics queries (<1s)
- Better user experience
- **ROI: ~$200/month in reduced support + improved conversion**

## Failover Strategy

```typescript
// src/lib/db/failover.ts
import { createPrimaryServerClient, createReadReplicaServerClient } from '@/lib/supabase/server-with-replicas'
import { createLogger } from '@/lib/logger'

const logger = createLogger('db-failover')

export async function queryWithFailover<T>(
  query: (client: any) => Promise<T>,
  preferReplica: boolean = true
): Promise<T> {
  try {
    if (preferReplica) {
      // Try replica first
      const replica = await createReadReplicaServerClient()
      return await query(replica)
    }
  } catch (error) {
    logger.warn('[Failover] Replica failed, trying primary', error)
  }

  // Fallback to primary
  const primary = await createPrimaryServerClient()
  return await query(primary)
}
```

## Testing Read Replicas

```bash
# Test primary connection
psql postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres

# Test replica connection
psql postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres

# Check replication status
SELECT * FROM pg_stat_replication;

# Check replica lag
SELECT now() - pg_last_xact_replay_timestamp() AS replication_lag;
```

## Migration Checklist

- [ ] Upgrade to Supabase Pro plan
- [ ] Create read replica in dashboard
- [ ] Update environment variables
- [ ] Implement dual client setup
- [ ] Identify read-heavy operations
- [ ] Route analytics to replica
- [ ] Monitor replication lag
- [ ] Set up failover logic
- [ ] Test under load
- [ ] Monitor performance metrics

## Best Practices

1. **Route by Operation Type**
   - Writes → Primary always
   - Critical reads → Primary
   - Analytics → Replica
   - Reports → Replica

2. **Handle Replication Lag**
   - Accept eventual consistency for analytics
   - Use primary for real-time data
   - Monitor lag continuously

3. **Connection Management**
   - Use PgBouncer for serverless
   - Close connections properly
   - Monitor connection pool size

4. **Monitoring**
   - Track query performance
   - Alert on high lag
   - Monitor failover events

For more information:
- Supabase Read Replicas: https://supabase.com/docs/guides/platform/read-replicas
- PostgreSQL Replication: https://www.postgresql.org/docs/current/warm-standby.html
