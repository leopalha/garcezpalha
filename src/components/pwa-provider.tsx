'use client'

// PWA Provider - Service Worker Registration
// Garcez Palha PWA - MANUS v7.0 (29/12/2025)

import { useEffect, useState } from 'react'
import { registerServiceWorker } from '@/lib/service-worker/register'
import { OfflineDetector } from '@/lib/pwa/offline-detector'

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    registerServiceWorker({
      onUpdate: (reg) => {
        console.log('[PWA] New version available')
        setRegistration(reg)
        setShowUpdatePrompt(true)
      },
      onSuccess: (reg) => {
        console.log('[PWA] Service Worker active')
      },
      onError: (error) => {
        console.error('[PWA] Registration error:', error)
      },
    })
  }, [])

  const handleUpdate = () => {
    if (registration?.waiting) {
      // Tell the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' })

      // Reload page when new SW activates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }

  const handleDismiss = () => {
    setShowUpdatePrompt(false)
  }

  return (
    <>
      {children}
      <OfflineDetector showNotification={true} />

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div
          className="fixed top-4 right-4 z-50 animate-slide-down"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-blue-600 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Nova versão disponível</h3>
                <p className="text-sm text-blue-100 mb-3">
                  Uma atualização do sistema está pronta. Recarregue para obter a versão mais recente.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-white text-blue-600 px-4 py-2 rounded font-medium text-sm hover:bg-blue-50 transition-colors"
                  >
                    Atualizar agora
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="text-blue-100 px-4 py-2 rounded font-medium text-sm hover:bg-blue-700 transition-colors"
                  >
                    Depois
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
