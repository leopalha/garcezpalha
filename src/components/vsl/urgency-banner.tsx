'use client'

import { useState, useEffect } from 'react'
import { Clock, Flame, AlertCircle, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UrgencyBannerProps {
  countdown?: boolean
  countdownMinutes?: number
  message?: string
  discount?: string
  onCTA?: () => void
  ctaText?: string
}

export function UrgencyBanner({
  countdown = true,
  countdownMinutes = 30,
  message = 'Oferta por Tempo Limitado',
  discount = '10% OFF',
  onCTA,
  ctaText = 'Garantir Desconto Agora',
}: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState(countdownMinutes * 60)

  useEffect(() => {
    if (!countdown) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 animate-pulse" />
              <span className="font-bold text-lg">{message}</span>
            </div>
            {discount && (
              <div className="bg-yellow-400 text-orange-900 px-3 py-1 rounded-full text-sm font-bold">
                {discount}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {countdown && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5" />
                <div className="flex items-center gap-1">
                  <span className="font-mono text-2xl font-bold">
                    {String(minutes).padStart(2, '0')}
                  </span>
                  <span className="font-bold">:</span>
                  <span className="font-mono text-2xl font-bold">
                    {String(seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}

            {onCTA && (
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-lg"
                onClick={onCTA}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                {ctaText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Animated Progress Bar */}
      {countdown && (
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-yellow-400 transition-all duration-1000 ease-linear"
            style={{
              width: `${(timeLeft / (countdownMinutes * 60)) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  )
}

interface FloatingUrgencyProps {
  show?: boolean
  message?: string
  onCTA?: () => void
}

export function FloatingUrgency({
  show = true,
  message = '🔥 5 pessoas visualizando esta oferta agora',
  onCTA,
}: FloatingUrgencyProps) {
  const [visible, setVisible] = useState(show)

  useEffect(() => {
    setVisible(show)
  }, [show])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => setVisible(false)}
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
        {onCTA && (
          <Button
            size="sm"
            className="w-full mt-3 bg-white text-orange-600 hover:bg-gray-100 font-bold"
            onClick={onCTA}
          >
            Garantir Minha Vaga
          </Button>
        )}
      </div>
    </div>
  )
}
