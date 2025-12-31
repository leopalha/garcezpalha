# ⚡ QUICK SETUP - Garcez Palha

**Última atualização:** 29/12/2025
**Status:** ✅ EMAIL COMPLETO + REDIS PENDENTE

---

## 🎯 CHECKLIST RÁPIDO

### ✅ JÁ FEITO (29/12/2025)
- [x] Resend API key configurada
- [x] Redis código atualizado (suporta Railway)
- [x] D-ID removido
- [x] Todos os testes passando (200/200)
- [x] **DNS Resend configurado** (DKIM, SPF, DMARC)
- [x] **ImprovMX configurado** (MX records + SPF)
- [x] **Email @garcezpalha.com FUNCIONANDO**
  - RECEBER: leonardo@garcezpalha.com → Gmail
  - ENVIAR: Resend API (3,000/mês grátis)

### ⏳ FALTA FAZER (você)

#### 1. ~~Configurar DNS do Resend~~ ✅ FEITO

**Status:** ✅ Todos os DNS records adicionados no Hostinger

#### 2. Testar Email @garcezpalha.com (5 min)

**Aguardar propagação DNS:** 5-30 minutos

**Testar ENVIO:**
```bash
npm run dev
# Abrir: http://localhost:3000/api/test-email
# Verificar se email chegou no leonardo.palha@gmail.com
```

**Testar RECEBIMENTO:**
```bash
# Enviar email de qualquer conta para:
leonardo@garcezpalha.com
# Verificar se chegou no leonardo.palha@gmail.com
```

**Guia completo:** [docs/EMAIL_SETUP_COMPLETE.md](docs/EMAIL_SETUP_COMPLETE.md)

---

#### 3. Configurar Railway Redis (5 min)

**Link:** https://railway.app

**Passos:**
1. Sign up com GitHub
2. New Project → Add Service → Database → Redis
3. Nome: `garcezpalha-redis`
4. Copiar REDIS_URL:
   ```
   redis://default:XXXXXXX@monorail.railway.app:6379
   ```

**Adicionar em `.env.local`:**
```bash
# Adicione esta linha:
REDIS_URL=redis://default:XXXXXXX@monorail.railway.app:6379

# Comente as outras (não precisa mais):
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=garcezpalha2025
```

**Custo:** $5/mês (muito melhor que Upstash free)

**Guia completo:** [docs/RAILWAY_REDIS_SETUP.md](docs/RAILWAY_REDIS_SETUP.md)

---

#### 4. Atualizar Vercel (1 min)

**Onde:** https://vercel.com → Settings → Environment Variables

**Adicionar:**
```
REDIS_URL=redis://default:XXXXXXX@monorail.railway.app:6379
```

**Redeploy:**
```
Vercel Dashboard → Deployments → ... → Redeploy
```

---

## 📊 COMO VERIFICAR SE ESTÁ FUNCIONANDO

### Email (Resend)
```bash
# 1. Domínio verificado no dashboard
https://resend.com/domains
# Status deve estar: ✅ Verified

# 2. Testar envio
npm run dev
# Trigger signup ou lead
# Verificar inbox
```

### Redis (Railway)
```bash
# 1. Ver logs do Railway
Railway Dashboard → Redis → Logs
# Deve aparecer conexões

# 2. Ver logs da aplicação
npm run dev
# Procure por: "✅ Redis connected"

# 3. Testar cache
npm test -- redis
# Deve passar: 17/17 tests
```

---

## 🎯 VALORES QUE VOCÊ PRECISA

### DNS Records (já tenho)
```
✅ DKIM: p=MIGfMA0GCS... (copiado acima)
✅ SPF MX: feedback-smtp.sa-east-1.amazonses.com
✅ SPF TXT: v=spf1 include:amazonses.com ~all
✅ DMARC: v=DMARC1; p=none;
```

### Railway Redis (você vai criar)
```
⏳ REDIS_URL: Você vai copiar do Railway dashboard
```

---

## ⚙️ ARQUIVOS JÁ CONFIGURADOS

```bash
✅ .env.local
   - RESEND_API_KEY (já tem)
   - REDIS_HOST/PORT/PASSWORD (comentar quando adicionar REDIS_URL)

✅ .env.example
   - Railway como opção 1 (recomendado)
   - Docker como opção 2
   - Upstash como opção 3

✅ src/lib/redis/client.ts
   - Suporta REDIS_URL
   - Auto-detect Railway/Upstash
   - TLS habilitado

✅ src/lib/email/resend-client.ts
   - API key configurada
   - Templates prontos
   - Testes passando
```

---

## 🚀 ORDEM RECOMENDADA

1. **Agora:** Adicionar DNS records (10 min)
2. **Enquanto DNS propaga:** Criar Railway Redis (5 min)
3. **Quando DNS verificar:** Testar email (2 min)
4. **Quando Railway estiver pronto:** Atualizar .env.local + Vercel (2 min)
5. **Final:** Testar tudo em produção (5 min)

**Total:** ~25 minutos

---

## 📞 SE DER PROBLEMA

### DNS não verifica
```bash
# Espere mais tempo (pode demorar até 48h)
# Verifique se adicionou corretamente
nslookup -type=TXT resend._domainkey.garcezpalha.com

# Deve retornar o valor que você adicionou
```

### Railway não conecta
```bash
# Verifique REDIS_URL no .env.local
echo $REDIS_URL

# Teste conexão
npm test -- redis

# Ver logs
Railway Dashboard → Redis → Logs
```

### Email não envia
```bash
# 1. Domínio verificado?
https://resend.com/domains → deve estar ✅

# 2. API key correta?
echo $RESEND_API_KEY
# Deve começar com: re_

# 3. Testar envio direto
npm test -- resend
```

---

## 📋 GUIAS COMPLETOS

- [RESEND_DNS_SETUP.md](docs/RESEND_DNS_SETUP.md) - DNS configuration detalhada
- [RAILWAY_REDIS_SETUP.md](docs/RAILWAY_REDIS_SETUP.md) - Railway setup completo
- [REDIS_SETUP_GUIDE.md](docs/REDIS_SETUP_GUIDE.md) - Todas as opções de Redis
- [INFRASTRUCTURE_SETUP_REPORT.md](.manus/reports/INFRASTRUCTURE_SETUP_REPORT.md) - Relatório completo

---

## ✅ QUANDO TERMINAR

**Você terá:**
- ✅ Email transacional funcionando (@garcezpalha.com)
- ✅ Redis cache em produção (Railway - $5/mês)
- ✅ 200/200 testes passando
- ✅ Sistema production-ready

**Pode usar:**
```typescript
// Email
import { sendWelcomeEmail } from '@/lib/email/resend-client'
await sendWelcomeEmail('cliente@example.com', 'João')

// Cache
import { getCached } from '@/lib/redis/cache'
const data = await getCached('key', () => fetchData())
```

---

**Próximo passo:** Adicionar DNS records agora! 🚀
