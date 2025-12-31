# 🚂 Railway Redis Setup Guide

**Provedor:** Railway.app
**Custo:** $5/mês (512MB RAM) - Melhor custo-benefício
**Vantagens:** Persistente, rápido, fácil configuração

---

## ⚡ Setup Rápido (5 minutos)

### 1. Criar Conta Railway

```
https://railway.app/
→ Sign up with GitHub (grátis)
→ Verify email
```

### 2. Criar Redis Database

```
1. New Project
2. Add Service → Database → Redis
3. Nome: garcezpalha-redis
4. Região: us-west (ou sa-east se disponível)
5. Deploy (automático)
```

### 3. Copiar Credenciais

No Railway Dashboard → Redis → Connect:

```
REDIS_URL: redis://default:XXXXXXX@region.railway.app:6379
```

Railway fornece URL completa, vamos separar:

**Formato:**
```
redis://default:PASSWORD@HOST:PORT
```

**Exemplo:**
```
redis://default:abc123xyz@monorail.railway.app:6379
```

Extraia:
- `HOST`: monorail.railway.app
- `PORT`: 6379
- `PASSWORD`: abc123xyz

---

## 🔧 Configurar no Projeto

### Opção 1: Usar REDIS_URL (Recomendado)

No `.env.local`:
```bash
# ===================================
# REDIS CACHE (Railway)
# ===================================
REDIS_URL=redis://default:PASSWORD@HOST:6379
```

**Atualizar código** `src/lib/redis/client.ts`:

```typescript
import Redis from 'ioredis'

export const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
    })
```

### Opção 2: Usar variáveis separadas

No `.env.local`:
```bash
# ===================================
# REDIS CACHE (Railway)
# ===================================
REDIS_HOST=monorail.railway.app
REDIS_PORT=6379
REDIS_PASSWORD=abc123xyz
```

---

## ✅ Verificar Conexão

### Teste no código:

```typescript
// src/lib/redis/__tests__/connection.test.ts
import { redis } from '@/lib/redis/client'

describe('Railway Redis Connection', () => {
  it('should connect to Railway Redis', async () => {
    await redis.set('test-key', 'test-value')
    const value = await redis.get('test-key')
    expect(value).toBe('test-value')
    await redis.del('test-key')
  })
})
```

```bash
npm test -- connection
```

### Teste manual:

```bash
# Instalar redis-cli (se não tiver)
# Windows: https://github.com/microsoftarchive/redis/releases
# Mac: brew install redis
# Linux: sudo apt-get install redis-tools

# Conectar ao Railway
redis-cli -h HOST -p 6379 -a PASSWORD

# Dentro do redis-cli:
> PING
PONG
> SET test "hello"
OK
> GET test
"hello"
> DEL test
(integer) 1
> QUIT
```

---

## 📊 Railway Dashboard

### Metrics disponíveis:
- Memory usage
- CPU usage
- Network I/O
- Connected clients
- Commands per second

### Logs em tempo real:
```
Railway Dashboard → Redis → Logs
```

---

## 💰 Custos

### Free Trial
- $5 de crédito inicial
- Suficiente para ~1 mês

### Plano Hobby ($5/mês)
- 512MB RAM
- Unlimited bandwidth
- Persistência automática
- Backups automáticos

### Comparação com Upstash:

| Feature | Railway | Upstash Free |
|---------|---------|--------------|
| **Preço** | $5/mês | Free |
| **RAM** | 512MB | Compartilhada |
| **Commands** | Ilimitado | 10k/dia |
| **Latência** | <10ms | 20-50ms (REST API) |
| **Protocolo** | Native Redis | HTTPS REST |
| **Recomendado** | ✅ Produção | Dev/Hobby |

---

## 🚀 Deploy no Vercel

### Variáveis de ambiente no Vercel:

```
Settings → Environment Variables

REDIS_URL=redis://default:PASSWORD@HOST:6379
```

ou

```
REDIS_HOST=monorail.railway.app
REDIS_PORT=6379
REDIS_PASSWORD=abc123xyz
```

---

## 🔒 Segurança

### Whitelist IPs (Opcional)

Railway permite restringir acesso por IP:

```
Railway Dashboard → Redis → Settings → Network
→ Add Allowed IP
```

**Vercel IPs** (se quiser restringir):
- Vercel não tem IPs fixos
- Melhor: Usar senha forte + TLS

### TLS/SSL

Railway Redis já vem com TLS habilitado:

```typescript
import Redis from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL, {
  tls: {
    rejectUnauthorized: false // Railway usa certificado autoassinado
  }
})
```

---

## 🧪 Testar Cache

```typescript
import { getCached, setCache } from '@/lib/redis/cache'

// Teste 1: Set + Get
await setCache('test-key', { name: 'Garcez Palha' }, 60)
const data = await getCache('test-key')
console.log(data) // { name: 'Garcez Palha' }

// Teste 2: Cache AI Response
const response = await getCached(
  'chat:user123:msg456',
  async () => {
    return await openai.chat.completions.create(...)
  }
)
```

---

## 📈 Monitoring

### Railway Dashboard:
- Memory: Ver uso de RAM
- CPU: Ver processamento
- Network: Ver requests/segundo

### Application Logs:
```typescript
// Ver cache hits/misses
console.log('[Cache] HIT:', key)
console.log('[Cache] MISS:', key)
```

---

## 🔧 Troubleshooting

### "Connection refused"
```bash
# Verificar credenciais
echo $REDIS_URL

# Testar conexão
redis-cli -h HOST -p 6379 -a PASSWORD PING
```

### "Authentication failed"
```bash
# Verificar senha
# Railway → Redis → Connect → Copy password
```

### "Too many connections"
```typescript
// Aumentar maxRetriesPerRequest
export const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    return Math.min(times * 50, 2000)
  }
})
```

---

## ✅ Checklist

- [ ] Conta Railway criada
- [ ] Redis database provisionado
- [ ] REDIS_URL copiada
- [ ] Adicionada em .env.local
- [ ] Código atualizado (se necessário)
- [ ] Teste de conexão passou
- [ ] Deploy no Vercel atualizado
- [ ] Monitoring ativo

---

## 🎯 Próximos Passos

1. **Configure Railway Redis** (5 min)
2. **Teste localmente** (2 min)
3. **Deploy no Vercel** com novas vars (1 min)
4. **Monitor dashboard** (ongoing)

---

**Custo:** $5/mês (melhor que Upstash para produção)
**Performance:** Native Redis (muito mais rápido que REST API)
**Recommended:** ✅ SIM para produção
