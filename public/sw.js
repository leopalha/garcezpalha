// Service Worker for Garcez Palha PWA
const CACHE_NAME = 'garcezpalha-v1'
const OFFLINE_URL = '/offline.html'

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/images/logo.png',
  '/images/og-image.jpg',
]

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching core assets')
      return cache.addAll(PRECACHE_ASSETS)
    })
  )
  // Activate immediately
  self.skipWaiting()
})

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  // Take control immediately
  self.clients.claim()
})

// Fetch event - network first, cache fallback strategy
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip API routes (always fetch fresh)
  if (request.url.includes('/api/')) {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!request.url.startsWith('http')) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response
        const responseClone = response.clone()

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
        }

        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // If it's a navigation request, show offline page
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL)
          }

          // Return a basic offline response for other requests
          return new Response('Offline', {
            status: 503,
            statusText: 'Service Unavailable',
          })
        })
      })
  )
})

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

console.log('[SW] Service Worker loaded')
