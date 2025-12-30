'use client'

// Offline Detector Component
// Garcez Palha PWA - MANUS v7.0 (29/12/2025)

import { useEffect, useState } from 'react'

interface OfflineDetectorProps {
  onOnline?: () => void
  onOffline?: () => void
  showNotification?: boolean
}

export function OfflineDetector({
  onOnline,
  onOffline,
  showNotification = true,
}: OfflineDetectorProps) {
  const [isOnline, setIsOnline] = useState(true)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      console.log('[Network] Back online')
      setIsOnline(true)
      setShowBanner(false)
      onOnline?.()
    }

    const handleOffline = () => {
      console.log('[Network] Gone offline')
      setIsOnline(false)
      setShowBanner(true)
      onOffline?.()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [onOnline, onOffline])

  if (!showNotification || !showBanner) {
    return null
  }

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-slide-up"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-amber-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
        <span className="font-medium">Você está offline</span>
        <button
          onClick={() => setShowBanner(false)}
          className="ml-2 hover:bg-amber-600 rounded p-1 transition-colors"
          aria-label="Fechar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

/**
 * Hook to detect online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
