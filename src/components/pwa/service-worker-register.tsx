'use client'

import { useEffect, useState } from 'react'

interface UpdateAvailableEvent extends Event {
  detail: { waiting: ServiceWorker }
}

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registerServiceWorker()
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      })

      setRegistration(reg)

      // Check for updates
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New update available
              setUpdateAvailable(true)
              window.dispatchEvent(
                new CustomEvent('swUpdateAvailable', {
                  detail: { waiting: newWorker },
                }) as UpdateAvailableEvent
              )
            }
          })
        }
      })

      // Handle controller change (new service worker activated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        // Reload the page when new service worker takes over
        window.location.reload()
      })

      console.log('[PWA] Service Worker registered successfully')
    } catch (error) {
      console.error('[PWA] Service Worker registration failed:', error)
    }
  }

  const updateServiceWorker = () => {
    if (registration?.waiting) {
      // Tell the waiting service worker to take over
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  if (!updateAvailable) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-primary text-primary-foreground p-4 rounded-lg shadow-lg max-w-sm">
        <h4 className="font-semibold mb-2">Atualização Disponível</h4>
        <p className="text-sm mb-3">
          Uma nova versão do site está disponível. Atualize para obter as últimas melhorias.
        </p>
        <div className="flex gap-2">
          <button
            onClick={updateServiceWorker}
            className="bg-white text-primary px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Atualizar Agora
          </button>
          <button
            onClick={() => setUpdateAvailable(false)}
            className="text-primary-foreground/70 hover:text-primary-foreground px-4 py-2 text-sm"
          >
            Depois
          </button>
        </div>
      </div>
    </div>
  )
}
