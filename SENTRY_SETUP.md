# 🔍 SENTRY SETUP GUIDE

**Tempo estimado:** 10 minutos
**Objetivo:** Configurar error tracking em produção

---

## 📋 PRÉ-REQUISITOS

- ✅ Conta Sentry (gratuita): https://sentry.io/signup/
- ✅ Projeto Next.js
- ✅ Vercel deployment (ou similar)

---

## 🚀 PASSO 1: Criar Projeto no Sentry (3 min)

1. **Acessar:** https://sentry.io/signup/
2. **Criar conta** (ou fazer login)
3. **Criar novo projeto:**
   - Platform: `Next.js`
   - Alert frequency: `On every new issue`
   - Project name: `garcezpalha-platform`
   - Team: `garcezpalha` (ou default)

4. **Copiar DSN:**
   - Após criar projeto, você verá algo como:
   ```
   https://abc123@o123456.ingest.sentry.io/123456
   ```
   - **GUARDAR ESSE DSN** (vai precisar no passo 2)

---

## 🔧 PASSO 2: Configurar Variáveis de Ambiente (2 min)

### Local (Development)

Adicionar no arquivo `.env.local`:

```bash
# Sentry Error Tracking
SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456
NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/123456

# Opcional: Auth token para source maps
SENTRY_AUTH_TOKEN=seu_auth_token_aqui
```

**Onde encontrar Auth Token:**
1. Sentry Dashboard → Settings → Auth Tokens
2. Create New Token
3. Scopes: `project:read`, `project:releases`, `org:read`
4. Copiar token

### Production (Vercel)

1. **Acessar:** Vercel Dashboard → Seu Projeto → Settings → Environment Variables

2. **Adicionar variáveis:**

| Nome | Valor | Environments |
|------|-------|--------------|
| `SENTRY_DSN` | `https://abc123@...` | Production, Preview |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://abc123@...` | Production, Preview |
| `SENTRY_AUTH_TOKEN` | `seu_token` | Production |

3. **Redeploy** para aplicar

---

## 📦 PASSO 3: Instalar SDK (já feito)

```bash
# Já executado automaticamente
npm install --save @sentry/nextjs
```

Arquivos de configuração criados:
- ✅ `sentry.client.config.ts` - Client-side tracking
- ✅ `sentry.server.config.ts` - Server-side tracking
- ✅ `sentry.edge.config.ts` - Edge runtime tracking

---

## 🔨 PASSO 4: Configurar next.config.js (2 min)

Abrir `next.config.js` e adicionar Sentry:

```javascript
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... suas configurações existentes ...
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,
  org: "garcezpalha", // Seu org name no Sentry
  project: "garcezpalha-platform", // Seu project name

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
};

// Wrap config with Sentry
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

**IMPORTANTE:** Substitua `"garcezpalha"` e `"garcezpalha-platform"` pelos nomes corretos do seu Sentry.

---

## ✅ PASSO 5: Testar Integração (3 min)

### Teste Local

1. **Restart servidor:**
   ```bash
   npm run dev
   ```

2. **Criar erro de teste:**

   Criar arquivo `src/app/test-sentry/page.tsx`:
   ```tsx
   'use client'

   export default function TestSentryPage() {
     return (
       <div className="p-8">
         <h1>Test Sentry</h1>
         <button
           onClick={() => {
             throw new Error('Test Sentry Error - Client Side');
           }}
           className="px-4 py-2 bg-red-500 text-white rounded"
         >
           Trigger Error
         </button>
       </div>
     )
   }
   ```

3. **Acessar:** `http://localhost:3000/test-sentry`

4. **Clicar no botão** "Trigger Error"

5. **Verificar console:**
   - Em dev, verá: `Sentry event: {...}` (não envia)
   - Em prod, erro será enviado ao Sentry

### Teste Production

1. **Fazer deploy:**
   ```bash
   git add .
   git commit -m "feat: Add Sentry error tracking"
   git push
   ```

2. **Aguardar deploy no Vercel** (~2 min)

3. **Acessar:** `https://seudominio.com/test-sentry`

4. **Clicar no botão** "Trigger Error"

5. **Verificar Sentry Dashboard:**
   - Ir em: Issues
   - Deve aparecer: "Test Sentry Error - Client Side"
   - Stack trace completo
   - User context
   - Browser info

---

## 📊 PASSO 6: Configurar Alertas (opcional)

1. **Sentry Dashboard → Alerts → Create Alert**

2. **Alert Rule:**
   - When: `An issue is first seen`
   - Then: `Send a notification to email`
   - Email: `seu@email.com`

3. **Salvar**

4. **Configurar Slack (opcional):**
   - Settings → Integrations → Slack
   - Conectar workspace
   - Escolher canal (#alerts)

---

## 🎯 VERIFICAÇÃO FINAL

**Sistema está configurado corretamente se:**

✅ Variáveis de ambiente setadas (local + Vercel)
✅ Arquivos Sentry config criados
✅ next.config.js atualizado
✅ Erro de teste aparece no Sentry Dashboard
✅ Stack trace é legível (com source maps)
✅ Alertas chegam por email

**Problemas comuns:**

❌ **"DSN not found"**
- Verificar SENTRY_DSN e NEXT_PUBLIC_SENTRY_DSN em .env.local

❌ **"Erro não aparece no dashboard"**
- Verificar se está em production (dev não envia)
- Aguardar 1-2 minutos para processar
- Verificar filtros em Issues

❌ **"Source maps não funcionam"**
- Verificar SENTRY_AUTH_TOKEN
- Verificar org/project names no next.config.js
- Rebuildar e fazer redeploy

---

## 📈 MONITORAMENTO CONTÍNUO

### Performance Monitoring

Para trackear performance (opcional):

```typescript
// sentry.client.config.ts
Sentry.init({
  // ... config existente

  // Performance Monitoring
  tracesSampleRate: 1.0, // 100% em dev, 0.1 em prod

  integrations: [
    new Sentry.BrowserTracing({
      tracingOrigins: ["localhost", "garcezpalha.com.br"],
    }),
  ],
});
```

### Custom Error Tracking

```typescript
import * as Sentry from '@sentry/nextjs';

// Capturar erro customizado
try {
  // código que pode falhar
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      section: 'payment',
    },
    extra: {
      userId: user.id,
      amount: 1000,
    },
  });
}

// Capturar mensagem
Sentry.captureMessage('Payment completed', 'info');

// Set user context
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

---

## 🗑️ LIMPEZA (Após Testes)

Após validar funcionamento, **remover** página de teste:

```bash
rm src/app/test-sentry/page.tsx
```

E fazer commit:

```bash
git add .
git commit -m "chore: Remove Sentry test page"
git push
```

---

## 📚 RECURSOS

- **Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/
- **Dashboard:** https://sentry.io/organizations/garcezpalha/issues/
- **Performance:** https://sentry.io/organizations/garcezpalha/performance/
- **Releases:** https://docs.sentry.io/product/releases/

---

## ✅ CONCLUSÃO

Agora você tem:
✅ Error tracking em produção
✅ Alertas automáticos
✅ Stack traces completos
✅ User context
✅ Performance monitoring (opcional)

**Próximo passo:**
- Monitorar erros reais em produção
- Configurar alertas no Slack
- Analisar performance de rotas críticas

---

**Criado por:** MANUS v7.0 DevOps
**Tempo total:** ~10 minutos
**Status:** ⏳ Aguardando execução manual
