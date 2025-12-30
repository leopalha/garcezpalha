# Redis Cache Strategy - Garcez Palha

Implementação completa do Redis como cache layer conforme `REDIS_CACHE_STRATEGY.md`.

## 🚀 Quick Start

### 1. Setup Local (Docker)

```bash
# Start Redis + Redis Commander
docker-compose up -d

# Check if running
docker ps

# Access Redis Commander UI
open http://localhost:8081
```

### 2. Environment Variables

Add to `.env.local`:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=garcezpalha2025
```

### 3. Basic Usage

```typescript
import { getCached, REDIS_KEYS, TTL_STRATEGY } from '@/lib/redis'

// Cache-aside pattern
const products = await getCached(
  REDIS_KEYS.products(),
  async () => {
    // Fetch from database
    const { data } = await supabase.from('products').select('*')
    return data
  },
  { ttl: TTL_STRATEGY.products } // 1 hour
)
```

## 📚 API Reference

### `getCached<T>(key, fallback, options)`

Cache-aside pattern implementation.

**Parameters:**
- `key` - Redis key
- `fallback` - Function to fetch data on cache miss
- `options` - `{ ttl?: number, prefix?: string }`

**Returns:** Cached or fresh data

**Example:**
```typescript
const user = await getCached(
  REDIS_KEYS.user(userId),
  async () => getUserFromDB(userId),
  { ttl: 1800 } // 30 minutes
)
```

### `setCache<T>(key, value, ttl)`

Manually set cache value.

```typescript
await setCache('user:123', userData, 3600)
```

### `invalidateCache(key)`

Delete single cache entry.

```typescript
await invalidateCache(REDIS_KEYS.product(productId))
```

### `invalidateCachePattern(pattern)`

Delete multiple keys by pattern.

```typescript
await invalidateCachePattern('product:*')
```

## 🔑 Redis Keys Convention

All keys follow this structure:

```typescript
REDIS_KEYS.product(id)           // → product:abc123
REDIS_KEYS.products()            // → products:all
REDIS_KEYS.agent(id)             // → agent:xyz789
REDIS_KEYS.session(token)        // → session:token123
REDIS_KEYS.rateLimit(ip, endpoint) // → ratelimit:1.2.3.4:api:chat
```

## ⏱️ TTL Strategy

Recommended TTL values:

```typescript
TTL_STRATEGY = {
  products: 3600,      // 1 hour (changes rarely)
  agents: 86400,       // 24 hours (static)
  conversations: 300,  // 5 minutes (active)
  leads: 600,          // 10 minutes
  sessions: 1800,      // 30 minutes (security)
  analytics: 600,      // 10 minutes
}
```

## 🧪 Testing

Test cache functionality:

```bash
# Basic test
curl http://localhost:3000/api/cache/test?type=basic

# Cache miss test
curl http://localhost:3000/api/cache/test?type=miss

# Performance test
curl http://localhost:3000/api/cache/test?type=performance
```

## 📊 Monitoring

Check Redis status:

```bash
# CLI
docker exec -it garcezpalha-redis-1 redis-cli -a garcezpalha2025

# Inside redis-cli
INFO
DBSIZE
KEYS *
GET key-name
```

## 🚀 Production (Upstash)

1. Create account: https://upstash.com
2. Create Redis database
3. Add env vars to Vercel:

```env
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

4. Update client to use Upstash SDK (already configured)

## 📈 Performance Gains

Expected improvements with Redis cache:

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Products API | 150ms | 5ms | 97% ⬇️ |
| Agents API | 200ms | 3ms | 98% ⬇️ |
| Sessions | 50ms | 1ms | 98% ⬇️ |
| Cache Hit Rate | 0% | 85% | +85% |
| DB Load | 100% | 20% | 80% ⬇️ |

## 🔗 Resources

- [Full Strategy Doc](../../../../docs/REDIS_CACHE_STRATEGY.md)
- [Redis Documentation](https://redis.io/docs)
- [ioredis Guide](https://github.com/redis/ioredis)
- [Upstash Redis](https://upstash.com/docs/redis)

## ✅ Status

- ✅ Phase 1: Basic cache (DONE)
- ⏳ Phase 2: Rate limiting
- ⏳ Phase 3: Pub/Sub + Queues
