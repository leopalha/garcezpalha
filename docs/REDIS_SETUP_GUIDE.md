# 🚀 Redis Setup Guide - Garcez Palha

**Data:** 29/12/2025
**Status:** Configuração Completa

---

## 📋 Opções de Redis

O projeto suporta **3 opções** de Redis:

1. **Upstash (Recomendado)** - Redis cloud gratuito, zero configuração
2. **Docker Local** - Para desenvolvimento local
3. **Fallback Automático** - Sistema funciona sem Redis (usa cache em memória)

---

## ✅ OPÇÃO 1: Upstash (RECOMENDADO - Grátis)

### Vantagens
- ✅ **100% gratuito** (10,000 commands/dia)
- ✅ Zero configuração de infraestrutura
- ✅ Funciona em desenvolvimento e produção
- ✅ HTTPS REST API (não precisa de porta 6379)
- ✅ Dashboard web para monitoring

### Setup (5 minutos)

**1. Criar conta Upstash**
```
https://upstash.com
→ Sign up (gratuito)
→ Create Database
→ Nome: garcezpalha-cache
→ Região: US East (ou mais próxima)
```

**2. Copiar credenciais**

No dashboard do Upstash, copie:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

**3. Adicionar no .env.local**

```bash
# ===================================
# REDIS CACHE (Upstash - Cloud)
# ===================================
UPSTASH_REDIS_REST_URL=https://XXXXXXXX.upstash.io
UPSTASH_REDIS_REST_TOKEN=XXXXXXXXXXXXXXXXXXXXX
```

**4. Pronto!** 🎉

O sistema detecta automaticamente e usa Upstash.

---

## 🐳 OPÇÃO 2: Docker Local

### Pré-requisitos
- Docker Desktop instalado
- Docker em execução

### Setup (2 minutos)

**1. Iniciar Redis**
```bash
# Inicia Redis + Redis Commander (UI)
docker compose up -d redis

# Verificar se está rodando
docker compose ps

# Ver logs
docker compose logs redis
```

**2. Variáveis já configuradas em .env.local**
```bash
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=garcezpalha2025
```

**3. Acessar Redis Commander (UI)**
```
http://localhost:8081

Visualize keys, valores, TTL em tempo real
```

**4. Comandos úteis**
```bash
# Parar Redis
docker compose stop redis

# Reiniciar
docker compose restart redis

# Ver uso de memória
docker stats redis

# Limpar cache
docker compose exec redis redis-cli -a garcezpalha2025 FLUSHALL
```

---

## 🔄 OPÇÃO 3: Fallback Automático (Zero Config)

### Como Funciona

Se **nenhuma** variável de Redis está configurada, o sistema usa:
- ✅ **Cache em memória** (node-cache)
- ✅ TTL respeitado
- ✅ Mesma interface de API
- ✅ Performance boa (em processo)

### Limitações

- ❌ Cache não persiste entre restarts
- ❌ Não compartilha entre múltiplas instâncias
- ❌ Sem monitoramento visual

### Quando Usar

- ✅ Desenvolvimento rápido
- ✅ Testes locais
- ✅ Prototipagem

---

## 🧪 Testar Configuração

```bash
# 1. Verificar variáveis
npm run env:check

# 2. Testar cache
npm test -- redis

# 3. Testar em development
npm run dev

# 4. Ver logs de cache
# Procure por:
# [Redis] Connected successfully
# [Cache] HIT/MISS logs
```

---

## 📊 Monitoring

### Upstash Dashboard
```
https://console.upstash.com
→ Databases
→ garcezpalha-cache
→ Ver: requests, latency, storage
```

### Redis Commander (Docker)
```
http://localhost:8081
→ Ver todas as keys
→ Inspecionar valores
→ TTL em tempo real
```

### Logs da Aplicação
```bash
# Ver hits/misses
npm run dev

# Procure por:
✅ Cache HIT: product:key
❌ Cache MISS: product:key
[Redis] Connected successfully
```

---

## 🎯 Configuração Atual

**Status:** ✅ Configurado para Upstash + Docker + Fallback

### Variáveis em .env.local

```bash
# OPÇÃO 1: Upstash (Cloud - Adicione suas credenciais)
UPSTASH_REDIS_REST_URL=https://XXXXXXXX.upstash.io
UPSTASH_REDIS_REST_TOKEN=XXXXXXXXXXXXXXXXXXXXX

# OPÇÃO 2: Docker Local (Já configurado)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=garcezpalha2025
```

### Prioridade de Detecção

1. Se `UPSTASH_REDIS_REST_URL` → Usa Upstash
2. Senão, se `REDIS_HOST` → Usa Redis local
3. Senão → Usa cache em memória

---

## 🚀 Casos de Uso

### AI Response Caching

```typescript
import { getCachedResponse, setCachedResponse } from '@/lib/redis/cache'

// Verificar cache
const cached = getCachedResponse('chat:user123:message5')
if (cached) {
  return cached // Cache HIT - resposta instantânea
}

// Cache MISS - chamar AI
const response = await openai.chat.completions.create(...)

// Salvar no cache (1 hora)
setCachedResponse('chat:user123:message5', response, 'chat', 5)
```

### Product Data Caching

```typescript
import { getCacheOrFetch } from '@/lib/redis/cache'

const product = await getCacheOrFetch(
  `product:${productId}`,
  async () => {
    // Buscar do banco se não estiver em cache
    return await db.product.findUnique({ where: { id: productId } })
  },
  3600 // 1 hora de TTL
)
```

### Session Caching

```typescript
// User session cache
const session = await getCacheOrFetch(
  `session:${sessionId}`,
  async () => await getSessionFromDB(sessionId),
  1800 // 30 minutos
)
```

---

## 🔧 Troubleshooting

### "Redis connection failed"

**Upstash:**
```bash
# Verificar credenciais
echo $UPSTASH_REDIS_REST_URL
echo $UPSTASH_REDIS_REST_TOKEN

# Testar manualmente
curl $UPSTASH_REDIS_REST_URL/ping \
  -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN"

# Deve retornar: "PONG"
```

**Docker:**
```bash
# Verificar se está rodando
docker compose ps

# Ver logs de erro
docker compose logs redis

# Reiniciar
docker compose restart redis

# Verificar porta 6379
netstat -an | findstr 6379
```

### "Cache sempre MISS"

```bash
# Verificar TTL
# TTL pode estar muito curto

# Ver keys no Redis
docker compose exec redis redis-cli -a garcezpalha2025 KEYS "*"

# Verificar se keys estão sendo criadas
```

### "Memory usage alto"

```bash
# Ver uso de memória (Docker)
docker stats redis

# Limpar cache antigo
docker compose exec redis redis-cli -a garcezpalha2025 FLUSHDB

# Upstash: Dashboard → Clear Database
```

---

## 📈 Performance Esperada

### Com Redis (Upstash/Docker)

- **Cache HIT:** < 50ms
- **Cache MISS + Set:** 200-500ms (depende da AI)
- **Hit Rate:** 60-80% (ideal)

### Sem Redis (Fallback)

- **Cache HIT:** < 5ms (em memória)
- **Cache MISS + Set:** 200-500ms
- **Hit Rate:** 40-60% (reinicia em cada deploy)

---

## 🎉 Próximos Passos

1. ✅ **Configure Upstash** (5min) - Melhor custo-benefício
2. ✅ **Monitor dashboard** - Ver hit rates
3. ✅ **Ajustar TTLs** - Otimizar por tipo de dado
4. ✅ **Implementar cache warming** - Pre-popular cache frequente

---

## 📞 Suporte

**Upstash Docs:** https://docs.upstash.com/redis
**Redis Docs:** https://redis.io/documentation
**Docker Compose:** https://docs.docker.com/compose/

**Código:**
- `src/lib/redis/cache.ts` - Sistema de cache
- `src/lib/redis/client.ts` - Cliente Redis
- `docker-compose.yml` - Configuração Docker

---

**Status:** ✅ PRONTO PARA USO
**Recomendação:** Use Upstash (gratuito e zero config)

---

**Última atualização:** 29/12/2025
**MANUS v7.0 - Session 3 Extended**
