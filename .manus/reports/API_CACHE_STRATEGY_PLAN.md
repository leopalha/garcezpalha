# PLANO DE API CACHE STRATEGY
**Data:** 29/12/2025
**Tarefa:** P1 - Implementar API cache strategy
**Impacto:** Performance + Redução de custos OpenAI/Anthropic

---

## 🎯 OBJETIVO

Implementar estratégia de cache inteligente para APIs:
1. **Cache de respostas IA** (OpenAI/Anthropic) - reduzir custos 60-80%
2. **Cache de dados Supabase** - reduzir latência 70%
3. **Cache de produtos** (catálogo estático) - 100% cache
4. **ISR (Incremental Static Regeneration)** para páginas dinâmicas

---

## 📊 ANÁLISE ATUAL

### APIs que precisam de cache:

#### 1. **APIs de IA** (Alta Prioridade)
```
src/app/api/chat/route.ts           ← Chat tradicional (OpenAI)
src/app/api/chat/realtime/route.ts  ← Realtime voice (OpenAI)
src/app/api/agent-flow/route.ts     ← Qualification flow (Anthropic)
```

**Problema:**
- Cada mensagem = 1 chamada API ($$$)
- Perguntas repetidas não são cacheadas
- Respostas idênticas recalculadas

**Custo Atual:**
- ~500 conversas/dia × 10 mensagens = 5.000 requests/dia
- Custo médio: $0.02/request = **$100/dia = $3.000/mês**

**Com Cache (60% redução):**
- 3.000 requests cacheados
- Custo: $0.02 × 2.000 = **$40/dia = $1.200/mês**
- **Economia: $1.800/mês** 💰

#### 2. **APIs de Dados** (Supabase)
```
src/app/api/products/route.ts              ← Lista de produtos (estático)
src/app/api/leads/route.ts                 ← Leads (dinâmico, 5min cache)
src/app/api/admin/conversations/route.ts   ← Conversas (dinâmico, 1min cache)
src/app/api/admin/leads/stats/route.ts     ← Stats (dinâmico, 5min cache)
```

**Problema:**
- Catálogo de produtos nunca muda (mas é buscado a cada request)
- Dashboard admin faz 10+ requests simultâneos
- Leads list recarrega dados a cada refresh

**Latência Atual:**
- Supabase query: 200-500ms
- Com cache: **10-50ms** (95% redução)

#### 3. **Páginas Dinâmicas** (ISR)
```
src/app/(marketing)/[category]/[slug]/page.tsx  ← 57 páginas de produtos
```

**Problema:**
- Páginas re-renderizam a cada request (SSR)
- Dados raramente mudam
- Performance Score: 85 (pode ser 95+)

---

## ✅ ESTRATÉGIA DE IMPLEMENTAÇÃO

### CAMADA 1: Next.js Cache Nativo

#### 1.1 ISR para Páginas de Produtos
```tsx
// src/app/(marketing)/[category]/[slug]/page.tsx

export const revalidate = 3600 // 1 hora
// ou
export const revalidate = false // cache permanente (unstable_cache)

export async function generateStaticParams() {
  // Gerar 57 páginas em build time
  return products.map((product) => ({
    category: product.category,
    slug: product.slug,
  }))
}
```

**Benefício:**
- Páginas servidas do cache Edge (Vercel/CDN)
- TTFB: 500ms → 50ms (90% redução)
- Sem custo de servidor para requests cacheados

#### 1.2 Route Cache para APIs
```ts
// src/app/api/products/route.ts
export const revalidate = 86400 // 24 horas (produtos não mudam)

// src/app/api/leads/route.ts
export const revalidate = 300 // 5 minutos

// src/app/api/admin/conversations/route.ts
export const revalidate = 60 // 1 minuto
```

---

### CAMADA 2: Redis Cache (Opcional - Fase 2)

Para cache mais sofisticado (não essencial agora):

```ts
// lib/cache/redis.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600
): Promise<T> {
  // Try cache first
  const cached = await redis.get(key)
  if (cached) return cached as T

  // Fetch fresh data
  const data = await fetcher()

  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data))

  return data
}
```

**Nota:** Por enquanto, **SKIP Redis** e usar apenas Next.js cache nativo. Redis só se necessário depois.

---

### CAMADA 3: Cache de Respostas IA

#### 3.1 Cache Semântico (OpenAI)
```ts
// src/lib/ai/cache.ts
import { createHash } from 'crypto'

const responseCache = new Map<string, { response: string; timestamp: number }>()
const CACHE_TTL = 3600 * 1000 // 1 hora

export function getCacheKey(messages: Message[], productId: string): string {
  // Hash das últimas 3 mensagens + productId
  const content = JSON.stringify({
    messages: messages.slice(-3),
    productId,
  })
  return createHash('sha256').update(content).digest('hex')
}

export function getCachedResponse(key: string): string | null {
  const cached = responseCache.get(key)
  if (!cached) return null

  // Check TTL
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    responseCache.delete(key)
    return null
  }

  return cached.response
}

export function setCachedResponse(key: string, response: string): void {
  responseCache.set(key, {
    response,
    timestamp: Date.now(),
  })

  // Cleanup old entries (max 1000)
  if (responseCache.size > 1000) {
    const oldest = Array.from(responseCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)[0]
    responseCache.delete(oldest[0])
  }
}
```

#### 3.2 Usar no Chat API
```ts
// src/app/api/chat/route.ts
import { getCacheKey, getCachedResponse, setCachedResponse } from '@/lib/ai/cache'

export async function POST(req: Request) {
  const { messages, productId } = await req.json()

  // Try cache first
  const cacheKey = getCacheKey(messages, productId)
  const cached = getCachedResponse(cacheKey)

  if (cached) {
    console.log('[Cache HIT]', cacheKey.slice(0, 8))
    return NextResponse.json({ message: cached, cached: true })
  }

  // Cache miss - call OpenAI
  console.log('[Cache MISS]', cacheKey.slice(0, 8))
  const completion = await openai.chat.completions.create({...})
  const response = completion.choices[0].message.content

  // Store in cache
  setCachedResponse(cacheKey, response)

  return NextResponse.json({ message: response, cached: false })
}
```

---

## 📋 IMPLEMENTAÇÃO PASSO A PASSO

### PASSO 1: ISR para Páginas de Produtos (30min)

```bash
cd d:\garcezpalha\src\app\(marketing)\[category]\[slug]
```

**Atualizar page.tsx:**
```tsx
// Adicionar no topo do arquivo
export const revalidate = 3600 // 1 hora

export async function generateStaticParams() {
  const products = await import('@/lib/products/catalog').then((m) => m.allProducts)

  return products.map((product) => ({
    category: product.category,
    slug: product.slug,
  }))
}
```

**Testar:**
```bash
npm run build
# Verificar "○" (Static) nas páginas de produtos
```

---

### PASSO 2: Route Cache para API de Produtos (15min)

```bash
cd d:\garcezpalha\src\app\api\products
```

**Atualizar route.ts:**
```tsx
// Adicionar export
export const revalidate = 86400 // 24 horas

export async function GET() {
  // código existente
}
```

---

### PASSO 3: Cache para APIs de Leads/Stats (15min)

```bash
cd d:\garcezpalha\src\app\api\admin
```

**Atualizar leads/route.ts:**
```tsx
export const revalidate = 300 // 5 minutos
```

**Atualizar leads/stats/route.ts:**
```tsx
export const revalidate = 300 // 5 minutos
```

**Atualizar conversations/route.ts:**
```tsx
export const revalidate = 60 // 1 minuto
```

---

### PASSO 4: Implementar Cache de IA (1h)

**Criar lib/ai/cache.ts:**
```bash
cd d:\garcezpalha\src\lib\ai
touch cache.ts
```

**Implementar código completo** (ver Camada 3.1 acima)

**Atualizar app/api/chat/route.ts:**
- Adicionar imports
- Adicionar lógica de cache before/after OpenAI call

**Atualizar app/api/agent-flow/route.ts:**
- Mesma lógica de cache

---

### PASSO 5: Testar Build e Medir Impacto (30min)

```bash
npm run build

# Verificar páginas estáticas
# ○ (Static)    = Pre-rendered as static HTML
# ● (SSG)       = Pre-rendered as static HTML (uses getStaticProps)
# λ (Server)    = Server-side rendered on demand
# ƒ (Dynamic)   = Dynamically rendered

# Executar dev e testar cache
npm run dev

# Fazer requests repetidos e verificar logs:
# [Cache HIT] abc123...
# [Cache MISS] def456...
```

---

## 📊 IMPACTO ESPERADO

### Performance
| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| **TTFB Páginas** | 500ms | 50ms | **90%** ✅ |
| **API Products** | 300ms | 20ms | **93%** ✅ |
| **API Leads** | 400ms | 50ms | **87%** ✅ |
| **Chat Response (cached)** | 2000ms | 50ms | **97%** ✅ |

### Custos
| Item | Antes | Depois | Economia |
|------|-------|--------|----------|
| **OpenAI/Anthropic** | $3.000/mês | $1.200/mês | **$1.800/mês** 💰 |
| **Supabase reads** | 1M/mês | 400K/mês | **60%** ✅ |
| **Vercel bandwidth** | 100GB | 80GB | **20%** ✅ |

### Performance Score
- **Antes:** 85/100
- **Depois:** 93/100
- **Ganho:** +8 pontos ⭐

---

## ✅ CHECKLIST

### Fase 1: ISR e Route Cache (1h)
- [ ] Adicionar `export const revalidate = 3600` em páginas de produtos
- [ ] Adicionar `generateStaticParams` para 57 produtos
- [ ] Adicionar `export const revalidate = 86400` em /api/products
- [ ] Adicionar `export const revalidate = 300` em /api/admin/leads
- [ ] Adicionar `export const revalidate = 300` em /api/admin/leads/stats
- [ ] Adicionar `export const revalidate = 60` em /api/admin/conversations
- [ ] Build e verificar páginas estáticas (○ no output)

### Fase 2: Cache de IA (1h)
- [ ] Criar lib/ai/cache.ts com funções de cache
- [ ] Implementar getCacheKey, getCachedResponse, setCachedResponse
- [ ] Atualizar app/api/chat/route.ts com lógica de cache
- [ ] Atualizar app/api/agent-flow/route.ts com lógica de cache
- [ ] Testar em dev (verificar logs de CACHE HIT/MISS)

### Fase 3: Validação (30min)
- [ ] Build final: `npm run build`
- [ ] Verificar todas as páginas estáticas
- [ ] Testar cache de produtos (deve retornar instantâneo)
- [ ] Testar cache de chat (fazer 2 requests idênticos)
- [ ] Lighthouse audit (deve ter score 93+)

---

## 🎯 CRITÉRIOS DE SUCESSO

✅ **Páginas de produtos:** Static (○) no build
✅ **API products:** <50ms response time
✅ **Chat cache:** 60%+ hit rate após 1 dia
✅ **Performance Score:** 93/100
✅ **Build sem erros:** OK

---

**Status:** PRONTO PARA EXECUÇÃO
**Prioridade:** P1 (ALTA)
**Tempo Estimado:** 2.5h
**Bloqueadores:** Nenhum
**Dependências:** Next.js 14+ (já instalado)
