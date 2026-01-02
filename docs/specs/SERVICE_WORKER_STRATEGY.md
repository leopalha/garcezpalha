# 🔄 SERVICE WORKER STRATEGY - GARCEZ PALHA

**Data:** 29/12/2025
**Versão:** 1.0.0
**Status:** P2 - Planejamento Completo
**Executor:** MANUS v7.0

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Objetivos](#objetivos)
3. [Arquitetura](#arquitetura)
4. [Cache Strategy](#cache-strategy)
5. [Background Sync](#background-sync)
6. [Push Notifications](#push-notifications)
7. [Offline Functionality](#offline-functionality)
8. [Implementação](#implementação)
9. [Testing](#testing)
10. [Deployment](#deployment)

---

## 🎯 VISÃO GERAL

### O que é Service Worker?

Service Worker é um script JavaScript que roda em background, separado da página web, permitindo funcionalidades que não precisam de interação direta:

- **Offline-first**: App funciona sem internet
- **Background Sync**: Sincroniza dados quando conectar
- **Push Notifications**: Notificações mesmo com app fechado
- **Cache Inteligente**: Assets e dados em cache

### Por que implementar?

**Benefícios de Negócio:**
- ✅ +40% engajamento (PWA vs site normal)
- ✅ +20% conversão mobile (funciona offline)
- ✅ -70% bounce rate (carregamento instantâneo)
- ✅ +15% retention (push notifications)

**Benefícios Técnicos:**
- ✅ Performance: Cache automático de assets
- ✅ Resiliência: App funciona offline
- ✅ UX: Carregamento instantâneo
- ✅ SEO: Google ranking melhor para PWAs

---

## 🎯 OBJETIVOS

### Fase 1 (P2 - Implementação Básica)
**Tempo estimado:** 8 horas
**Prioridade:** Alta

- [ ] Cache de assets estáticos (JS, CSS, imagens)
- [ ] Offline fallback page
- [ ] Background sync para formulários
- [ ] Manifest.json para PWA
- [ ] Service Worker básico

### Fase 2 (P3 - Features Avançadas)
**Tempo estimado:** 12 horas
**Prioridade:** Média

- [ ] Push notifications
- [ ] Sync avançado (conversas, leads)
- [ ] Precaching inteligente
- [ ] Update notifications
- [ ] Analytics offline

### Fase 3 (Futuro - Otimizações)
**Tempo estimado:** 8 horas
**Prioridade:** Baixa

- [ ] Workbox integration
- [ ] Advanced caching strategies
- [ ] Background fetch para downloads
- [ ] Periodic background sync
- [ ] Share target API

---

## 🏗️ ARQUITETURA

### Estrutura de Arquivos

```
public/
├── sw.js                          # Service Worker principal
├── offline.html                   # Página offline fallback
└── manifest.json                  # PWA manifest

src/
├── lib/
│   ├── service-worker/
│   │   ├── register.ts           # Registro do SW
│   │   ├── cache-strategies.ts   # Estratégias de cache
│   │   ├── background-sync.ts    # Background sync
│   │   ├── push-notifications.ts # Push notifications
│   │   └── utils.ts              # Utilitários SW
│   └── pwa/
│       ├── install-prompt.tsx    # Prompt de instalação
│       └── update-notification.tsx # Notificação de update

app/
└── layout.tsx                     # Registrar SW aqui
```

### Service Worker Lifecycle

```typescript
// Ciclo de vida do Service Worker
type ServiceWorkerState =
  | 'installing'   // Instalando pela primeira vez
  | 'installed'    // Instalado, aguardando ativação
  | 'activating'   // Ativando
  | 'activated'    // Ativo e controlando páginas
  | 'redundant'    // Substituído por nova versão

// Events
interface ServiceWorkerEvents {
  install: Event         // Primeira instalação
  activate: Event        // Ativação (limpar caches antigos)
  fetch: FetchEvent      // Interceptar requests
  sync: SyncEvent        // Background sync
  push: PushEvent        // Push notification
  message: MessageEvent  // Comunicação com app
}
```

### Cache Structure

```typescript
// Estrutura de caches
const CACHE_NAMES = {
  static: 'garcez-palha-static-v1',      // HTML, CSS, JS
  images: 'garcez-palha-images-v1',      // Imagens, logos
  api: 'garcez-palha-api-v1',            // Respostas API
  runtime: 'garcez-palha-runtime-v1',    // Runtime cache
} as const

// Cache sizes (quotas)
const CACHE_QUOTAS = {
  static: 50 * 1024 * 1024,   // 50 MB
  images: 100 * 1024 * 1024,  // 100 MB
  api: 10 * 1024 * 1024,      // 10 MB
  runtime: 20 * 1024 * 1024,  // 20 MB
} as const
```

---

## 💾 CACHE STRATEGY

### 1. Network First (API Calls)

**Quando usar:** Dados que mudam frequentemente (chat, leads)

```typescript
// Cache Strategy: Network First
async function networkFirst(request: Request): Promise<Response> {
  try {
    // 1. Tentar buscar da rede primeiro
    const response = await fetch(request)

    // 2. Se sucesso, atualizar cache
    const cache = await caches.open(CACHE_NAMES.api)
    await cache.put(request, response.clone())

    return response
  } catch (error) {
    // 3. Se falhar, buscar do cache
    const cached = await caches.match(request)

    if (cached) {
      return cached
    }

    // 4. Se não tem cache, retornar offline page
    return caches.match('/offline.html')!
  }
}

// Aplicar em rotas API
const API_ROUTES = [
  '/api/chat',
  '/api/leads',
  '/api/conversations',
  '/api/agents',
]
```

### 2. Cache First (Static Assets)

**Quando usar:** Assets que não mudam (JS, CSS, imagens)

```typescript
// Cache Strategy: Cache First
async function cacheFirst(request: Request): Promise<Response> {
  // 1. Buscar do cache primeiro
  const cached = await caches.match(request)

  if (cached) {
    return cached
  }

  // 2. Se não tem cache, buscar da rede
  try {
    const response = await fetch(request)

    // 3. Salvar no cache para próxima vez
    const cache = await caches.open(CACHE_NAMES.static)
    await cache.put(request, response.clone())

    return response
  } catch (error) {
    // 4. Se falhar, retornar offline page
    return caches.match('/offline.html')!
  }
}

// Aplicar em static assets
const STATIC_ASSETS = [
  '/_next/static/',
  '/brasao-512.webp',
  '/fonts/',
  '/icons/',
]
```

### 3. Stale While Revalidate (Imagens)

**Quando usar:** Conteúdo que pode estar desatualizado temporariamente

```typescript
// Cache Strategy: Stale While Revalidate
async function staleWhileRevalidate(request: Request): Promise<Response> {
  // 1. Buscar do cache imediatamente
  const cached = await caches.match(request)

  // 2. Em paralelo, atualizar cache da rede (background)
  const fetchPromise = fetch(request).then(async (response) => {
    const cache = await caches.open(CACHE_NAMES.images)
    await cache.put(request, response.clone())
    return response
  })

  // 3. Retornar cache se existe, senão esperar network
  return cached || fetchPromise
}

// Aplicar em imagens
const IMAGE_ROUTES = [
  /\.png$/,
  /\.jpg$/,
  /\.jpeg$/,
  /\.webp$/,
  /\.svg$/,
]
```

### 4. Network Only (Auth)

**Quando usar:** Dados sensíveis que não podem ser cached

```typescript
// Cache Strategy: Network Only
async function networkOnly(request: Request): Promise<Response> {
  // Sempre buscar da rede, nunca cachear
  return fetch(request)
}

// Aplicar em rotas sensíveis
const NETWORK_ONLY_ROUTES = [
  '/api/auth/',
  '/api/payment/',
  '/api/webhooks/',
]
```

### Routing Strategy

```typescript
// public/sw.js
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event
  const url = new URL(request.url)

  // Network Only: Auth & Payments
  if (url.pathname.startsWith('/api/auth') ||
      url.pathname.startsWith('/api/payment')) {
    event.respondWith(networkOnly(request))
    return
  }

  // Network First: API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Stale While Revalidate: Images
  if (/\.(png|jpg|jpeg|webp|svg)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Cache First: Static assets
  if (url.pathname.startsWith('/_next/static/') ||
      url.pathname.startsWith('/fonts/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Default: Network First
  event.respondWith(networkFirst(request))
})
```

---

## 🔄 BACKGROUND SYNC

### Use Cases

**1. Formulários de Contato**
- Usuário preenche formulário offline
- SW armazena dados localmente
- Quando reconectar, envia automaticamente

**2. Lead Qualification**
- Usuário responde perguntas offline
- SW guarda respostas
- Sincroniza com servidor quando online

**3. Chat Messages**
- Usuário envia mensagem offline
- SW enfileira mensagem
- Envia quando conectar

### Implementação

```typescript
// src/lib/service-worker/background-sync.ts

interface SyncData {
  id: string
  type: 'form' | 'lead' | 'chat'
  data: unknown
  timestamp: number
  retries: number
}

// Registrar sync
export async function registerSync(data: SyncData): Promise<void> {
  // 1. Salvar dados no IndexedDB
  await saveToIndexedDB('sync-queue', data)

  // 2. Registrar sync tag
  const registration = await navigator.serviceWorker.ready
  await registration.sync.register(`sync-${data.type}-${data.id}`)
}

// Service Worker: public/sw.js
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag.startsWith('sync-form')) {
    event.waitUntil(syncForms())
  }

  if (event.tag.startsWith('sync-lead')) {
    event.waitUntil(syncLeads())
  }

  if (event.tag.startsWith('sync-chat')) {
    event.waitUntil(syncChat())
  }
})

async function syncForms(): Promise<void> {
  // 1. Buscar forms pendentes no IndexedDB
  const forms = await getFromIndexedDB('sync-queue', { type: 'form' })

  for (const form of forms) {
    try {
      // 2. Enviar para API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.data),
      })

      if (response.ok) {
        // 3. Remover da fila se sucesso
        await removeFromIndexedDB('sync-queue', form.id)

        // 4. Notificar usuário
        await self.registration.showNotification('Formulário enviado!', {
          body: 'Seu formulário foi enviado com sucesso.',
          icon: '/icons/icon-192x192.png',
        })
      } else {
        // 5. Incrementar retries
        form.retries += 1
        await saveToIndexedDB('sync-queue', form)
      }
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }
}
```

### IndexedDB Helper

```typescript
// src/lib/service-worker/indexeddb.ts

const DB_NAME = 'garcez-palha-sync'
const DB_VERSION = 1

export async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      // Create stores
      if (!db.objectStoreNames.contains('sync-queue')) {
        db.createObjectStore('sync-queue', { keyPath: 'id' })
      }
    }
  })
}

export async function saveToIndexedDB(
  storeName: string,
  data: SyncData
): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(storeName, 'readwrite')
  const store = tx.objectStore(storeName)

  await store.put(data)
  await tx.complete
}

export async function getFromIndexedDB(
  storeName: string,
  filter?: { type: string }
): Promise<SyncData[]> {
  const db = await openDB()
  const tx = db.transaction(storeName, 'readonly')
  const store = tx.objectStore(storeName)

  const all = await store.getAll()

  if (filter) {
    return all.filter(item => item.type === filter.type)
  }

  return all
}
```

---

## 🔔 PUSH NOTIFICATIONS

### Use Cases

**1. Lead Notifications**
- Novo lead qualificado
- Lead respondeu mensagem
- Lead agendou consulta

**2. Status Updates**
- Pagamento confirmado
- Documento aprovado
- Processo atualizado

**3. Marketing**
- Promoções especiais
- Novos serviços
- Blog posts

### Implementação

```typescript
// src/lib/service-worker/push-notifications.ts

// 1. Solicitar permissão
export async function requestNotificationPermission(): Promise<boolean> {
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// 2. Subscribir para push notifications
export async function subscribeToPush(): Promise<PushSubscription | null> {
  try {
    const registration = await navigator.serviceWorker.ready

    // Gerar VAPID keys no servidor
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    })

    // 3. Enviar subscription para servidor
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    })

    return subscription
  } catch (error) {
    console.error('Push subscription failed:', error)
    return null
  }
}

// Service Worker: public/sw.js
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() ?? {}

  const options: NotificationOptions = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.url,
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close()

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data)
    )
  }
})
```

### Server-side (API Route)

```typescript
// app/api/push/subscribe/route.ts
import webpush from 'web-push'

// Configurar VAPID keys
webpush.setVapidDetails(
  'mailto:leonardo@garcezpalha.com.br',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function POST(request: Request) {
  const subscription = await request.json()

  // Salvar subscription no banco
  await db.insert({
    table: 'push_subscriptions',
    data: {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      user_id: session.user.id,
    },
  })

  return Response.json({ success: true })
}

// app/api/push/send/route.ts
export async function POST(request: Request) {
  const { userId, title, body, url } = await request.json()

  // Buscar subscriptions do usuário
  const subscriptions = await db.query({
    table: 'push_subscriptions',
    where: { user_id: userId },
  })

  // Enviar notificação para todas subscriptions
  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys,
        },
        JSON.stringify({ title, body, url })
      )
    )
  )

  return Response.json({ sent: results.length })
}
```

---

## 📴 OFFLINE FUNCTIONALITY

### Offline Page

```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - Garcez Palha</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
      color: white;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 500px;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .logo {
      width: 120px;
      height: 120px;
      margin-bottom: 2rem;
    }
    .retry-btn {
      background: white;
      color: #1e3a8a;
      border: none;
      padding: 12px 32px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .retry-btn:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="/brasao-512.webp" alt="Garcez Palha" class="logo">
    <h1>Você está offline</h1>
    <p>
      Não foi possível conectar ao servidor.
      Verifique sua conexão com a internet e tente novamente.
    </p>
    <button class="retry-btn" onclick="location.reload()">
      Tentar Novamente
    </button>
  </div>
</body>
</html>
```

### Offline Detection

```typescript
// src/lib/pwa/offline-detector.tsx
'use client'

import { useEffect, useState } from 'react'

export function OfflineDetector() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black py-2 px-4 text-center z-50">
      ⚠️ Você está offline. Algumas funcionalidades podem estar limitadas.
    </div>
  )
}
```

---

## 🚀 IMPLEMENTAÇÃO

### Passo 1: Manifest.json

```json
// public/manifest.json
{
  "name": "Garcez Palha - Advocacia Digital",
  "short_name": "Garcez Palha",
  "description": "Escritório de advocacia digital especializado em soluções jurídicas automatizadas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1e3a8a",
  "theme_color": "#1e3a8a",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "categories": ["business", "law", "productivity"],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png"
    },
    {
      "src": "/screenshots/chat.png",
      "sizes": "1280x720",
      "type": "image/png"
    }
  ]
}
```

### Passo 2: Service Worker Registration

```typescript
// src/lib/service-worker/register.ts
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('SW registered:', registration.scope)

    // Check for updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available
          showUpdateNotification()
        }
      })
    })

    return registration
  } catch (error) {
    console.error('SW registration failed:', error)
    return null
  }
}

function showUpdateNotification() {
  if (!confirm('Nova versão disponível! Atualizar agora?')) {
    return
  }

  // Reload to activate new SW
  window.location.reload()
}
```

### Passo 3: Add to Layout

```typescript
// app/layout.tsx
'use client'

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/service-worker/register'
import { OfflineDetector } from '@/lib/pwa/offline-detector'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()
  }, [])

  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e3a8a" />

        {/* iOS PWA tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body>
        <OfflineDetector />
        {children}
      </body>
    </html>
  )
}
```

### Passo 4: Service Worker Implementation

```javascript
// public/sw.js
const CACHE_VERSION = 'v1'
const CACHE_NAMES = {
  static: `garcez-palha-static-${CACHE_VERSION}`,
  images: `garcez-palha-images-${CACHE_VERSION}`,
  api: `garcez-palha-api-${CACHE_VERSION}`,
  runtime: `garcez-palha-runtime-${CACHE_VERSION}`,
}

const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/brasao-512.webp',
  '/manifest.json',
]

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )

  // Activate immediately
  self.skipWaiting()
})

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !Object.values(CACHE_NAMES).includes(name))
          .map((name) => caches.delete(name))
      )
    })
  )

  // Take control immediately
  return self.clients.claim()
})

// Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Network Only: Auth & Payments
  if (url.pathname.startsWith('/api/auth') ||
      url.pathname.startsWith('/api/payment')) {
    event.respondWith(fetch(request))
    return
  }

  // Network First: API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Stale While Revalidate: Images
  if (/\.(png|jpg|jpeg|webp|svg)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Cache First: Static assets
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Default: Network First
  event.respondWith(networkFirst(request))
})

// Helper functions
async function networkFirst(request) {
  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAMES.api)
    await cache.put(request, response.clone())
    return response
  } catch (error) {
    const cached = await caches.match(request)
    return cached || caches.match('/offline.html')
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached

  try {
    const response = await fetch(request)
    const cache = await caches.open(CACHE_NAMES.static)
    await cache.put(request, response.clone())
    return response
  } catch (error) {
    return caches.match('/offline.html')
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request).then(async (response) => {
    const cache = await caches.open(CACHE_NAMES.images)
    await cache.put(request, response.clone())
    return response
  })

  return cached || fetchPromise
}
```

---

## 🧪 TESTING

### Manual Testing

```bash
# 1. Build production
npm run build

# 2. Serve localmente
npx serve out

# 3. Testar offline
# Chrome DevTools > Application > Service Workers > Offline checkbox

# 4. Verificar caches
# Chrome DevTools > Application > Cache Storage

# 5. Testar push notifications
# Chrome DevTools > Application > Service Workers > Push
```

### Automated Testing

```typescript
// tests/service-worker.test.ts
import { test, expect } from '@playwright/test'

test.describe('Service Worker', () => {
  test('should register service worker', async ({ page }) => {
    await page.goto('/')

    const swStatus = await page.evaluate(async () => {
      const registration = await navigator.serviceWorker.ready
      return registration.active?.state
    })

    expect(swStatus).toBe('activated')
  })

  test('should cache static assets', async ({ page, context }) => {
    await page.goto('/')

    // Go offline
    await context.setOffline(true)

    // Should still load from cache
    await page.reload()
    const title = await page.title()
    expect(title).toContain('Garcez Palha')
  })

  test('should show offline page for uncached routes', async ({ page, context }) => {
    await page.goto('/')

    // Go offline
    await context.setOffline(true)

    // Navigate to uncached route
    await page.goto('/some-uncached-route')
    const content = await page.textContent('h1')
    expect(content).toContain('Você está offline')
  })
})
```

---

## 🚀 DEPLOYMENT

### Vercel Deployment

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // existing config
})
```

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

### Generate VAPID Keys

```bash
npm install -g web-push
web-push generate-vapid-keys
```

---

## 📊 MÉTRICAS DE SUCESSO

### KPIs

| Métrica | Antes | Meta | Medição |
|---------|-------|------|---------|
| Install Rate | 0% | 15% | PWA installs/visits |
| Offline Usage | 0% | 5% | Offline sessions |
| Push CTR | 0% | 10% | Clicks/notifications |
| Cache Hit Rate | 0% | 80% | Cached/total requests |
| Page Load (repeat) | 2s | 0.5s | Lighthouse |

### Monitoring

```typescript
// Track PWA metrics
export function trackPWAMetrics() {
  // Install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()

    analytics.track('pwa_install_prompt_shown')

    e.userChoice.then((choice) => {
      analytics.track('pwa_install_prompt_result', {
        outcome: choice.outcome, // 'accepted' or 'dismissed'
      })
    })
  })

  // App installed
  window.addEventListener('appinstalled', () => {
    analytics.track('pwa_installed')
  })

  // Service Worker updates
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    analytics.track('sw_updated')
  })
}
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1 (P2 - 8h)
- [ ] Criar `public/manifest.json`
- [ ] Criar `public/sw.js` com cache strategies
- [ ] Criar `public/offline.html`
- [ ] Gerar ícones PWA (72px até 512px)
- [ ] Implementar SW registration em layout.tsx
- [ ] Implementar OfflineDetector component
- [ ] Testar em Chrome/Safari/Firefox
- [ ] Deploy e validar em produção

### Fase 2 (P3 - 12h)
- [ ] Gerar VAPID keys
- [ ] Implementar push notification subscription
- [ ] Criar API routes para push (`/api/push/subscribe`, `/api/push/send`)
- [ ] Implementar Background Sync
- [ ] Criar IndexedDB helpers
- [ ] Adicionar InstallPrompt component
- [ ] Implementar UpdateNotification
- [ ] Configurar analytics tracking

### Validação
- [ ] Lighthouse PWA score > 90
- [ ] Funciona offline
- [ ] Cache hit rate > 80%
- [ ] Push notifications funcionando
- [ ] Background sync testado
- [ ] Compatível iOS/Android
- [ ] Documentação completa

---

## 📚 RECURSOS

### Documentação
- [MDN Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Google PWA Guide](https://web.dev/progressive-web-apps/)
- [Workbox](https://developers.google.com/web/tools/workbox)

### Ferramentas
- [PWA Builder](https://www.pwabuilder.com/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

---

**Documento criado por:** MANUS v7.0
**Data:** 29/12/2025
**Status:** ✅ Completo
**Próximo:** Implementar Fase 1 (P2)
