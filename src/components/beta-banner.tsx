'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export function BetaBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Verificar se usuário já dismissou o banner
    const dismissed = localStorage.getItem('beta-banner-dismissed')
    if (!dismissed) {
      setIsVisible(true)
    } else {
      setIsDismissed(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    localStorage.setItem('beta-banner-dismissed', 'true')
  }

  if (isDismissed || !isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-2 flex-1">
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-md">
              BETA
            </span>
            <p className="text-amber-900 dark:text-amber-100 text-xs md:text-sm">
              <span className="font-medium">Plataforma em fase de testes.</span>
              <span className="hidden sm:inline ml-1">
                Algumas funcionalidades podem estar em desenvolvimento.
              </span>
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 p-1 hover:bg-amber-100 dark:hover:bg-amber-900 rounded-md transition-colors"
            aria-label="Dispensar aviso"
          >
            <X className="h-4 w-4 text-amber-700 dark:text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  )
}
