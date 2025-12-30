# 🔴 REDIS CACHE STRATEGY - GARCEZ PALHA

**Data:** 29/12/2025
**Versão:** 1.0.0
**Status:** P3 - Planejamento Completo
**Executor:** MANUS v7.0

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Cache Patterns](#cache-patterns)
4. [Session Management](#session-management)
5. [Rate Limiting](#rate-limiting)
6. [Pub/Sub para Realtime](#pubsub-para-realtime)
7. [Queue System](#queue-system)
8. [Implementação](#implementação)
9. [Monitoring](#monitoring)
10. [Deployment](#deployment)

---

## 🎯 VISÃO GERAL

### O que é Redis?

Redis (Remote Dictionary Server) é um banco de dados em memória extremamente rápido usado como:
- **Cache**: Armazenar dados frequentemente acessados
- **Session Store**: Gerenciar sessões de usuários
- **Message Broker**: Pub/Sub e filas
- **Rate Limiter**: Controlar taxa de requests

### Por que implementar?

**Benefícios de Negócio:**
- ✅ +60% performance (cache hit rate 80-90%)
- ✅ -80% latência em queries repetidas
- ✅ Escala para 10k+ usuários simultâneos
- ✅ -70% custo de banco de dados

**Benefícios Técnicos:**
- ✅ Queries: 10ms → 1ms (90% mais rápido)
- ✅ Sessões distribuídas (multi-servidor)
- ✅ Rate limiting robusto
- ✅ Realtime com Pub/Sub

---

## 🏗️ ARQUITETURA

### Stack

```
Next.js App (Multiple Instances)
       ↓
Redis Cluster (Primary + Replicas)
       ↓
PostgreSQL (Supabase) - Source of Truth
```

### Estrutura de Dados

```typescript
// Key Naming Convention
const REDIS_KEYS = {
  // Cache de dados
  product: (id: string) => `product:${id}`,
  products: () => 'products:all',
  agent: (id: string) => `agent:${id}`,

  // Sessões
  session: (token: string) => `session:${token}`,
  user: (id: string) => `user:${id}`,

  // Qualification flows
  flow: (id: string) => `flow:${id}`,
  flowState: (id: string) => `flow:${id}:state`,

  // Rate limiting
  rateLimit: (ip: string, endpoint: string) => `ratelimit:${ip}:${endpoint}`,

  // Pub/Sub channels
  channel: {
    chat: (conversationId: string) => `chat:${conversationId}`,
    notifications: (userId: string) => `notifications:${userId}`,
  },

  // Queues
  queue: {
    emails: 'queue:emails',
    webhooks: 'queue:webhooks',
    whatsapp: 'queue:whatsapp',
  },
} as const
```

### Client Configuration

```typescript
// src/lib/redis/client.ts
import { Redis } from 'ioredis'

// Singleton pattern
let redis: Redis | null = null

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 0,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY'
        if (err.message.includes(targetError)) {
          return true // Reconnect on READONLY error
        }
        return false
      },
    })

    redis.on('connect', () => {
      console.log('✅ Redis connected')
    })

    redis.on('error', (err) => {
      console.error('❌ Redis error:', err)
    })
  }

  return redis
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (redis) {
    await redis.quit()
  }
})
```

---

## 💾 CACHE PATTERNS

### 1. Cache-Aside (Lazy Loading)

**Padrão mais comum:** App gerencia cache manualmente

```typescript
// src/lib/redis/cache.ts
import { getRedisClient } from './client'

interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
}

export async function getCached<T>(
  key: string,
  fallback: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const redis = getRedisClient()
  const { ttl = 3600, prefix = '' } = options
  const fullKey = prefix ? `${prefix}:${key}` : key

  try {
    // 1. Try cache first
    const cached = await redis.get(fullKey)

    if (cached) {
      console.log(`✅ Cache HIT: ${fullKey}`)
      return JSON.parse(cached) as T
    }

    console.log(`❌ Cache MISS: ${fullKey}`)

    // 2. Fallback to database
    const data = await fallback()

    // 3. Store in cache
    await redis.setex(fullKey, ttl, JSON.stringify(data))

    return data
  } catch (error) {
    console.error('Redis error, fallback to DB:', error)
    // Fallback to DB on Redis error
    return fallback()
  }
}

// Exemplo de uso
export async function getProduct(id: string) {
  return getCached(
    REDIS_KEYS.product(id),
    async () => {
      // Database query
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      return data
    },
    { ttl: 3600 } // Cache por 1 hora
  )
}
```

### 2. Write-Through Cache

**Cache sempre atualizado:** Escreve no cache E banco simultaneamente

```typescript
// src/lib/redis/write-through.ts
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const redis = getRedisClient()

  // 1. Update database
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  // 2. Update cache
  await redis.setex(
    REDIS_KEYS.product(id),
    3600,
    JSON.stringify(data)
  )

  // 3. Invalidate list cache
  await redis.del(REDIS_KEYS.products())

  return data
}
```

### 3. Cache Invalidation

**Estratégias de invalidação:**

```typescript
// src/lib/redis/invalidation.ts

// Invalidate single key
export async function invalidateCache(key: string): Promise<void> {
  const redis = getRedisClient()
  await redis.del(key)
}

// Invalidate by pattern
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const redis = getRedisClient()

  // Get all keys matching pattern
  const keys = await redis.keys(pattern)

  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

// Invalidate on events
export async function onProductUpdated(productId: string): Promise<void> {
  await Promise.all([
    invalidateCache(REDIS_KEYS.product(productId)),
    invalidateCache(REDIS_KEYS.products()),
    invalidateCachePattern(`agent:*`), // Agents may reference products
  ])
}

// Time-based invalidation (TTL)
export async function setCacheWithTTL<T>(
  key: string,
  value: T,
  ttl: number
): Promise<void> {
  const redis = getRedisClient()
  await redis.setex(key, ttl, JSON.stringify(value))
}

// Example TTL strategy
const TTL_STRATEGY = {
  products: 3600,        // 1 hour (changes rarely)
  agents: 86400,         // 24 hours (static)
  conversations: 300,    // 5 minutes (active data)
  leads: 600,           // 10 minutes (moderate)
  sessions: 1800,       // 30 minutes (security)
} as const
```

---

## 🔐 SESSION MANAGEMENT

### NextAuth + Redis Sessions

```typescript
// src/lib/auth/redis-adapter.ts
import type { Adapter } from 'next-auth/adapters'
import { getRedisClient } from '@/lib/redis/client'

export function RedisAdapter(): Adapter {
  const redis = getRedisClient()

  return {
    async createSession(session) {
      const key = REDIS_KEYS.session(session.sessionToken)
      await redis.setex(key, 1800, JSON.stringify(session)) // 30min
      return session
    },

    async getSessionAndUser(sessionToken) {
      const key = REDIS_KEYS.session(sessionToken)
      const session = await redis.get(key)

      if (!session) return null

      const parsed = JSON.parse(session)

      // Get user from cache or DB
      const user = await getCached(
        REDIS_KEYS.user(parsed.userId),
        async () => {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', parsed.userId)
            .single()
          return data
        }
      )

      return { session: parsed, user }
    },

    async updateSession(session) {
      const key = REDIS_KEYS.session(session.sessionToken)
      await redis.setex(key, 1800, JSON.stringify(session))
      return session
    },

    async deleteSession(sessionToken) {
      const key = REDIS_KEYS.session(sessionToken)
      await redis.del(key)
    },
  }
}

// Use in NextAuth config
export const authOptions: NextAuthOptions = {
  adapter: RedisAdapter(),
  session: {
    strategy: 'database', // Use Redis as database
    maxAge: 30 * 60, // 30 minutes
  },
}
```

### Distributed Sessions

**Problema:** Multiple Next.js instances precisam compartilhar sessões

**Solução:** Redis como session store centralizado

```typescript
// src/lib/redis/session.ts

interface SessionData {
  userId: string
  email: string
  role: string
  metadata: Record<string, unknown>
  expiresAt: number
}

export async function createSession(
  userId: string,
  data: Partial<SessionData>
): Promise<string> {
  const redis = getRedisClient()

  // Generate secure token
  const token = crypto.randomUUID()

  const session: SessionData = {
    userId,
    email: data.email!,
    role: data.role || 'user',
    metadata: data.metadata || {},
    expiresAt: Date.now() + 30 * 60 * 1000, // 30min
  }

  await redis.setex(
    REDIS_KEYS.session(token),
    1800,
    JSON.stringify(session)
  )

  return token
}

export async function getSession(token: string): Promise<SessionData | null> {
  const redis = getRedisClient()
  const session = await redis.get(REDIS_KEYS.session(token))

  if (!session) return null

  const parsed = JSON.parse(session) as SessionData

  // Check expiration
  if (parsed.expiresAt < Date.now()) {
    await redis.del(REDIS_KEYS.session(token))
    return null
  }

  return parsed
}

export async function refreshSession(token: string): Promise<void> {
  const redis = getRedisClient()
  const session = await getSession(token)

  if (session) {
    session.expiresAt = Date.now() + 30 * 60 * 1000
    await redis.setex(
      REDIS_KEYS.session(token),
      1800,
      JSON.stringify(session)
    )
  }
}

export async function destroySession(token: string): Promise<void> {
  const redis = getRedisClient()
  await redis.del(REDIS_KEYS.session(token))
}
```

---

## ⏱️ RATE LIMITING

### Implementação

```typescript
// src/lib/redis/rate-limit.ts

interface RateLimitConfig {
  max: number      // Max requests
  window: number   // Time window in seconds
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'api:chat': { max: 20, window: 60 },        // 20 msgs/min
  'api:auth': { max: 5, window: 60 },         // 5 logins/min
  'api:products': { max: 100, window: 60 },   // 100 queries/min
  'api:webhooks': { max: 10, window: 60 },    // 10 webhooks/min
}

export async function rateLimit(
  identifier: string, // IP or userId
  endpoint: string
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const redis = getRedisClient()
  const config = RATE_LIMITS[endpoint] || { max: 60, window: 60 }

  const key = REDIS_KEYS.rateLimit(identifier, endpoint)
  const now = Date.now()
  const windowStart = now - config.window * 1000

  // Use Redis sorted set for sliding window
  const pipeline = redis.pipeline()

  // Remove old entries
  pipeline.zremrangebyscore(key, 0, windowStart)

  // Count requests in window
  pipeline.zcard(key)

  // Add current request
  pipeline.zadd(key, now, `${now}`)

  // Set expiry
  pipeline.expire(key, config.window)

  const results = await pipeline.exec()
  const count = results?.[1]?.[1] as number || 0

  const allowed = count < config.max
  const remaining = Math.max(0, config.max - count - 1)
  const resetAt = now + config.window * 1000

  return { allowed, remaining, resetAt }
}

// Middleware
export async function rateLimitMiddleware(
  req: Request,
  endpoint: string
): Promise<Response | null> {
  // Get identifier (IP or userId)
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const identifier = ip.split(',')[0].trim()

  const result = await rateLimit(identifier, endpoint)

  if (!result.allowed) {
    return Response.json(
      {
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': RATE_LIMITS[endpoint].max.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': result.resetAt.toString(),
          'Retry-After': Math.ceil((result.resetAt - Date.now()) / 1000).toString(),
        },
      }
    )
  }

  return null // Allowed
}

// Usage in API route
export async function POST(request: Request) {
  // Check rate limit
  const rateLimitResponse = await rateLimitMiddleware(request, 'api:chat')
  if (rateLimitResponse) return rateLimitResponse

  // Process request
  // ...
}
```

---

## 📡 PUB/SUB PARA REALTIME

### Realtime Chat com Redis Pub/Sub

```typescript
// src/lib/redis/pubsub.ts
import { getRedisClient } from './client'

type MessageHandler = (message: string) => void

class RedisPubSub {
  private publisher: Redis
  private subscriber: Redis
  private handlers: Map<string, Set<MessageHandler>>

  constructor() {
    this.publisher = getRedisClient()
    this.subscriber = this.publisher.duplicate()
    this.handlers = new Map()

    this.subscriber.on('message', (channel, message) => {
      const channelHandlers = this.handlers.get(channel)
      if (channelHandlers) {
        channelHandlers.forEach(handler => handler(message))
      }
    })
  }

  async publish(channel: string, message: unknown): Promise<void> {
    await this.publisher.publish(channel, JSON.stringify(message))
  }

  async subscribe(channel: string, handler: MessageHandler): Promise<void> {
    if (!this.handlers.has(channel)) {
      this.handlers.set(channel, new Set())
      await this.subscriber.subscribe(channel)
    }

    this.handlers.get(channel)!.add(handler)
  }

  async unsubscribe(channel: string, handler: MessageHandler): Promise<void> {
    const channelHandlers = this.handlers.get(channel)

    if (channelHandlers) {
      channelHandlers.delete(handler)

      if (channelHandlers.size === 0) {
        this.handlers.delete(channel)
        await this.subscriber.unsubscribe(channel)
      }
    }
  }
}

export const pubsub = new RedisPubSub()

// Usage: Chat notifications
export async function notifyNewMessage(
  conversationId: string,
  message: Message
): Promise<void> {
  await pubsub.publish(
    REDIS_KEYS.channel.chat(conversationId),
    {
      type: 'new_message',
      data: message,
    }
  )
}

// Subscribe to chat updates
export async function subscribeToChat(
  conversationId: string,
  onMessage: (msg: Message) => void
): Promise<void> {
  await pubsub.subscribe(
    REDIS_KEYS.channel.chat(conversationId),
    (data) => {
      const parsed = JSON.parse(data)
      if (parsed.type === 'new_message') {
        onMessage(parsed.data)
      }
    }
  )
}
```

### Integration with Next.js API Route

```typescript
// app/api/chat/stream/route.ts
import { pubsub, REDIS_KEYS } from '@/lib/redis/pubsub'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')

  if (!conversationId) {
    return Response.json({ error: 'Missing conversationId' }, { status: 400 })
  }

  // Server-Sent Events
  const encoder = new TextEncoder()
  const stream = new TransformStream()
  const writer = stream.writable.getWriter()

  const channel = REDIS_KEYS.channel.chat(conversationId)

  const handler = async (data: string) => {
    await writer.write(encoder.encode(`data: ${data}\n\n`))
  }

  // Subscribe to Redis channel
  await pubsub.subscribe(channel, handler)

  // Cleanup on disconnect
  request.signal.addEventListener('abort', async () => {
    await pubsub.unsubscribe(channel, handler)
    await writer.close()
  })

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

---

## 📬 QUEUE SYSTEM

### Background Jobs com Redis Queue

```typescript
// src/lib/redis/queue.ts
import { Queue, Worker, Job } from 'bullmq'
import { getRedisClient } from './client'

// Email queue
export const emailQueue = new Queue('emails', {
  connection: getRedisClient(),
})

// Add job
export async function sendEmailAsync(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await emailQueue.add('send-email', {
    to,
    subject,
    html,
  })
}

// Worker to process jobs
const emailWorker = new Worker(
  'emails',
  async (job: Job) => {
    const { to, subject, html } = job.data

    // Send email using Resend
    await resend.emails.send({
      from: 'Garcez Palha <contato@garcezpalha.com.br>',
      to,
      subject,
      html,
    })

    console.log(`✅ Email sent to ${to}`)
  },
  {
    connection: getRedisClient(),
    concurrency: 5, // Process 5 jobs simultaneously
  }
)

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`)
})

emailWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err)
})
```

### WhatsApp Queue

```typescript
// src/lib/redis/whatsapp-queue.ts
import { Queue, Worker } from 'bullmq'

export const whatsappQueue = new Queue('whatsapp', {
  connection: getRedisClient(),
})

export async function sendWhatsAppAsync(
  to: string,
  message: string
): Promise<void> {
  await whatsappQueue.add(
    'send-whatsapp',
    { to, message },
    {
      attempts: 3, // Retry 3 times
      backoff: {
        type: 'exponential',
        delay: 5000, // Start with 5s delay
      },
    }
  )
}

const whatsappWorker = new Worker(
  'whatsapp',
  async (job) => {
    const { to, message } = job.data

    // Send via WhatsApp API
    await fetch('https://api.whatsapp.com/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      },
      body: JSON.stringify({
        to,
        message,
      }),
    })
  },
  { connection: getRedisClient() }
)
```

### Webhook Queue

```typescript
// src/lib/redis/webhook-queue.ts
export const webhookQueue = new Queue('webhooks', {
  connection: getRedisClient(),
})

export async function processWebhookAsync(
  event: string,
  payload: unknown
): Promise<void> {
  await webhookQueue.add(
    'process-webhook',
    { event, payload },
    { priority: event === 'payment' ? 1 : 5 } // High priority for payments
  )
}

const webhookWorker = new Worker(
  'webhooks',
  async (job) => {
    const { event, payload } = job.data

    switch (event) {
      case 'payment':
        await handlePaymentWebhook(payload)
        break
      case 'whatsapp':
        await handleWhatsAppWebhook(payload)
        break
      default:
        console.warn(`Unknown webhook event: ${event}`)
    }
  },
  { connection: getRedisClient() }
)
```

---

## 🚀 IMPLEMENTAÇÃO

### Step 1: Install Dependencies

```bash
npm install ioredis bullmq
npm install -D @types/ioredis
```

### Step 2: Environment Variables

```bash
# .env.local
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_URL=redis://default:password@localhost:6379
```

### Step 3: Docker Compose (Local Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --requirepass your-redis-password

  redis-commander:
    image: rediscommander/redis-commander:latest
    environment:
      - REDIS_HOSTS=local:redis:6379:0:your-redis-password
    ports:
      - '8081:8081'
    depends_on:
      - redis

volumes:
  redis-data:
```

Start Redis:
```bash
docker-compose up -d
```

### Step 4: Redis Client Wrapper

```typescript
// src/lib/redis/index.ts
export { getRedisClient } from './client'
export { getCached, invalidateCache } from './cache'
export { rateLimit, rateLimitMiddleware } from './rate-limit'
export { pubsub } from './pubsub'
export { emailQueue, whatsappQueue, webhookQueue } from './queue'
export * from './session'
```

### Step 5: Use in API Routes

```typescript
// app/api/products/route.ts
import { getCached, REDIS_KEYS } from '@/lib/redis'

export async function GET() {
  const products = await getCached(
    REDIS_KEYS.products(),
    async () => {
      const { data } = await supabase.from('products').select('*')
      return data
    },
    { ttl: 3600 } // 1 hour
  )

  return Response.json(products)
}
```

---

## 📊 MONITORING

### Redis Metrics

```typescript
// src/lib/redis/monitoring.ts
export async function getRedisMetrics() {
  const redis = getRedisClient()

  const info = await redis.info()
  const dbsize = await redis.dbsize()
  const memory = await redis.info('memory')

  return {
    connected: redis.status === 'ready',
    dbsize,
    memory: parseMemoryInfo(memory),
    uptime: parseUptime(info),
  }
}

function parseMemoryInfo(info: string) {
  const match = info.match(/used_memory_human:(.+)/)
  return match ? match[1].trim() : 'unknown'
}

function parseUptime(info: string) {
  const match = info.match(/uptime_in_seconds:(\d+)/)
  return match ? parseInt(match[1]) : 0
}

// Health check endpoint
// app/api/health/redis/route.ts
export async function GET() {
  const metrics = await getRedisMetrics()

  return Response.json({
    status: metrics.connected ? 'healthy' : 'unhealthy',
    metrics,
  })
}
```

### Cache Hit Rate Tracking

```typescript
// src/lib/redis/analytics.ts
let cacheHits = 0
let cacheMisses = 0

export function trackCacheHit() {
  cacheHits++
}

export function trackCacheMiss() {
  cacheMisses++
}

export function getCacheHitRate() {
  const total = cacheHits + cacheMisses
  return total > 0 ? (cacheHits / total) * 100 : 0
}

// Reset daily
setInterval(() => {
  cacheHits = 0
  cacheMisses = 0
}, 24 * 60 * 60 * 1000)
```

---

## 🚀 DEPLOYMENT

### Vercel + Upstash Redis

**Upstash:** Serverless Redis com free tier

```bash
# Install Upstash SDK
npm install @upstash/redis
```

```typescript
// src/lib/redis/upstash.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})
```

### Environment Variables (Vercel)

```bash
# Vercel Dashboard > Settings > Environment Variables
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

### Alternative: Railway Redis

```bash
# Railway CLI
railway add redis

# Automatically sets:
# REDIS_URL=redis://default:password@host:port
```

---

## 📈 PERFORMANCE BENCHMARKS

### Expected Metrics

| Métrica | Antes (Sem Redis) | Depois (Com Redis) | Ganho |
|---------|-------------------|-------------------|-------|
| **Products API** | 150ms | 5ms | 97% ⬇️ |
| **Agents API** | 200ms | 3ms | 98% ⬇️ |
| **Sessions** | 50ms (DB) | 1ms | 98% ⬇️ |
| **Rate Limit** | N/A | 1ms | ✅ |
| **Cache Hit Rate** | 0% | 85% | +85% |
| **DB Load** | 100% | 20% | 80% ⬇️ |

### Load Testing

```bash
# Install k6
brew install k6

# Load test
k6 run scripts/load-test.js
```

```javascript
// scripts/load-test.js
import http from 'k6/http'
import { check } from 'k6'

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '3m', target: 100 },  // Stay at 100 users
    { duration: '1m', target: 0 },    // Ramp down
  ],
}

export default function () {
  const res = http.get('https://garcezpalha.com.br/api/products')

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 50ms': (r) => r.timings.duration < 50,
  })
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 (P3 - Setup Básico - 4h)
- [ ] Instalar dependencies (ioredis, bullmq)
- [ ] Setup Docker Compose local
- [ ] Criar Redis client singleton
- [ ] Implementar getCached helper
- [ ] Testar cache em 1-2 endpoints
- [ ] Validar cache hit/miss

### Fase 2 (Produção - 6h)
- [ ] Criar conta Upstash/Railway
- [ ] Configurar env vars em Vercel
- [ ] Migrar para Upstash SDK
- [ ] Implementar session management
- [ ] Implementar rate limiting
- [ ] Deploy e testar

### Fase 3 (Features Avançadas - 8h)
- [ ] Implementar Pub/Sub para chat
- [ ] Criar email queue (BullMQ)
- [ ] Criar WhatsApp queue
- [ ] Implementar webhook queue
- [ ] Monitoring e alertas
- [ ] Load testing

### Validação
- [ ] Cache hit rate > 80%
- [ ] API response time < 50ms (cached)
- [ ] Rate limiting funcionando
- [ ] Queues processando jobs
- [ ] Zero downtime em deploy
- [ ] Documentação completa

---

## 📚 RECURSOS

### Documentação
- [Redis Documentation](https://redis.io/docs/)
- [ioredis Guide](https://github.com/luin/ioredis)
- [BullMQ Documentation](https://docs.bullmq.io/)
- [Upstash Redis](https://upstash.com/docs/redis)

### Ferramentas
- [Redis Commander](http://joeferner.github.io/redis-commander/) - GUI
- [RedisInsight](https://redis.com/redis-enterprise/redis-insight/) - Official GUI
- [k6](https://k6.io/) - Load testing

---

## 🎯 PRÓXIMOS PASSOS

### Imediato (Esta Semana)
1. Setup Docker Compose local
2. Implementar cache básico em 3 endpoints principais
3. Validar performance gains

### Curto Prazo (2 Semanas)
1. Deploy Upstash em produção
2. Implementar session management
3. Rate limiting em todas APIs

### Médio Prazo (1 Mês)
1. Pub/Sub para realtime features
2. Background jobs com queues
3. Monitoring avançado

---

**Documento criado por:** MANUS v7.0
**Data:** 29/12/2025
**Status:** ✅ Completo
**Próximo:** Implementar Fase 1 (Docker + Cache Básico)
