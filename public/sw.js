// Service Worker for Garcez Palha PWA
// Version: 1.1.0 - Enhanced with advanced caching strategies
// Updated by: MANUS v7.0 (29/12/2025)

const CACHE_VERSION = 'v1-1'
const CACHE_NAMES = {
  static: `garcez-palha-static-${CACHE_VERSION}`,
  images: `garcez-palha-images-${CACHE_VERSION}`,
  api: `garcez-palha-api-${CACHE_VERSION}`,
  runtime: `garcez-palha-runtime-${CACHE_VERSION}`,
}

const OFFLINE_URL = '/offline.html'

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
]

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker v' + CACHE_VERSION)

  event.waitUntil(
    caches.open(CACHE_NAMES.static).then((cache) => {
      console.log('[SW] Precaching core assets')
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker v' + CACHE_VERSION)

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !Object.values(CACHE_NAMES).includes(name))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  // Take control immediately
  return self.clients.claim()
})

// Fetch event - Advanced cache strategies
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Network Only: Auth & Payments
  if (url.pathname.startsWith('/api/auth') ||
      url.pathname.startsWith('/api/payment') ||
      url.pathname.startsWith('/api/webhooks')) {
    event.respondWith(networkOnly(request))
    return
  }

  // Network First: API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Stale While Revalidate: Images
  if (/\.(png|jpg|jpeg|webp|svg|ico)$/.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(request))
    return
  }

  // Cache First: Static assets
  if (url.pathname.startsWith('/_next/static/') ||
      url.pathname.startsWith('/fonts/') ||
      url.pathname.startsWith('/icons/')) {
    event.respondWith(cacheFirst(request))
    return
  }

  // Default: Network First for HTML pages
  event.respondWith(networkFirst(request))
})

// Cache Strategy: Network Only
async function networkOnly(request) {
  return fetch(request)
}

// Cache Strategy: Network First
async function networkFirst(request) {
  try {
    const response = await fetch(request)

    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAMES.api)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url)

    const cached = await caches.match(request)

    if (cached) {
      return cached
    }

    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL)
    }

    throw error
  }
}

// Cache Strategy: Cache First
async function cacheFirst(request) {
  const cached = await caches.match(request)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)

    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAMES.static)
      cache.put(request, response.clone())
    }

    return response
  } catch (error) {
    console.log('[SW] Cache and network failed:', request.url)
    throw error
  }
}

// Cache Strategy: Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request)

  const fetchPromise = fetch(request).then(async (response) => {
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAMES.images)
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => null)

  return cached || fetchPromise
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form') {
    event.waitUntil(syncContactForm())
  }
})

async function syncContactForm() {
  // Get queued form submissions from IndexedDB
  // This would sync when back online
  console.log('[SW] Syncing contact form submissions')
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return

  const data = event.data.json()
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/images/logo.png',
    badge: '/images/badge.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: [
      {
        action: 'open',
        title: 'Abrir',
      },
      {
        action: 'close',
        title: 'Fechar',
      },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Garcez Palha', options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/'
    event.waitUntil(clients.openWindow(url))
  }
})

// Message Event (for communication with app)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'CLIENTS_CLAIM') {
    self.clients.claim()
  }
})

console.log('[SW] Service Worker v' + CACHE_VERSION + ' loaded successfully')
