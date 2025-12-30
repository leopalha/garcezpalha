// Service Worker Registration Helper
// Garcez Palha PWA - MANUS v7.0 (29/12/2025)

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: Error) => void
}

/**
 * Register Service Worker for PWA functionality
 * Call this from layout.tsx or _app.tsx
 */
export async function registerServiceWorker(
  config: ServiceWorkerConfig = {}
): Promise<ServiceWorkerRegistration | null> {
  // Check if browser supports Service Worker
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('[SW] Service Worker not supported in this browser')
    return null
  }

  // Only register in production or when explicitly enabled
  if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_ENABLE_SW) {
    console.log('[SW] Service Worker disabled in development')
    return null
  }

  try {
    // Wait for page load to avoid impacting initial render
    if (document.readyState === 'loading') {
      await new Promise((resolve) => {
        window.addEventListener('load', resolve, { once: true })
      })
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    })

    console.log('[SW] Service Worker registered successfully:', registration.scope)

    // Handle updates
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing

      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New service worker available
          console.log('[SW] New version available')
          config.onUpdate?.(registration)
        }

        if (newWorker.state === 'activated') {
          console.log('[SW] Service Worker activated')
          config.onSuccess?.(registration)
        }
      })
    })

    // Check for existing SW
    if (registration.active) {
      config.onSuccess?.(registration)
    }

    // Periodic update check (every 1 hour)
    setInterval(() => {
      registration.update().catch((error) => {
        console.error('[SW] Update check failed:', error)
      })
    }, 60 * 60 * 1000)

    return registration
  } catch (error) {
    console.error('[SW] Service Worker registration failed:', error)
    config.onError?.(error as Error)
    return null
  }
}

/**
 * Unregister Service Worker
 * Use for debugging or when disabling PWA
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()

    if (registration) {
      const success = await registration.unregister()
      console.log('[SW] Service Worker unregistered:', success)
      return success
    }

    return false
  } catch (error) {
    console.error('[SW] Unregister failed:', error)
    return false
  }
}

/**
 * Send message to Service Worker
 */
export function sendMessageToSW(message: { type: string; payload?: unknown }): void {
  if (!navigator.serviceWorker.controller) {
    console.warn('[SW] No active Service Worker to send message to')
    return
  }

  navigator.serviceWorker.controller.postMessage(message)
}

/**
 * Request Service Worker to skip waiting
 * Use when showing update notification
 */
export function skipWaiting(): void {
  sendMessageToSW({ type: 'SKIP_WAITING' })
}

/**
 * Request Service Worker to claim clients
 */
export function claimClients(): void {
  sendMessageToSW({ type: 'CLIENTS_CLAIM' })
}
