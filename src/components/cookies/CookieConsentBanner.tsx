/**
 * Cookie Consent Banner
 * P1-004: LGPD and GDPR Compliance
 *
 * Features:
 * - Essential cookies (required for functionality)
 * - Analytics cookies (GA4, Vercel Analytics)
 * - Marketing cookies (future use)
 * - Granular consent controls
 * - localStorage persistence
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { X, Cookie, Settings } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export interface CookieConsent {
  essential: boolean // Always true
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const CONSENT_KEY = 'cookie-consent'
const CONSENT_VERSION = 1

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    essential: true, // Always enabled
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
  })

  useEffect(() => {
    // Check if consent already given
    const savedConsent = localStorage.getItem(CONSENT_KEY)

    if (!savedConsent) {
      // Show banner after 2 seconds delay
      const timer = setTimeout(() => setShowBanner(true), 2000)
      return () => clearTimeout(timer)
    } else {
      try {
        const parsed = JSON.parse(savedConsent)

        // Check if consent is still valid (version matches)
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed.consent)
          applyConsent(parsed.consent)
        } else {
          // Version mismatch, ask for consent again
          setShowBanner(true)
        }
      } catch {
        setShowBanner(true)
      }
    }
  }, [])

  const applyConsent = (consent: CookieConsent) => {
    // Essential cookies are always enabled
    // Analytics cookies (GA4, Vercel Analytics)
    if (consent.analytics) {
      enableAnalytics()
    } else {
      disableAnalytics()
    }

    // Marketing cookies (future use)
    if (consent.marketing) {
      enableMarketing()
    } else {
      disableMarketing()
    }
  }

  const enableAnalytics = () => {
    // Enable GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      })
    }

    // Vercel Analytics is always enabled by default
    console.log('[Cookies] Analytics enabled')
  }

  const disableAnalytics = () => {
    // Disable GA4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
      })
    }

    console.log('[Cookies] Analytics disabled')
  }

  const enableMarketing = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      })
    }

    console.log('[Cookies] Marketing enabled')
  }

  const disableMarketing = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
    }

    console.log('[Cookies] Marketing disabled')
  }

  const saveConsent = (newConsent: CookieConsent) => {
    const consentData = {
      version: CONSENT_VERSION,
      consent: newConsent,
      timestamp: Date.now(),
    }

    localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData))
    applyConsent(newConsent)
    setConsent(newConsent)
    setShowBanner(false)
  }

  const acceptAll = () => {
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    })
  }

  const acceptSelected = () => {
    saveConsent(consent)
  }

  const rejectNonEssential = () => {
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    })
  }

  if (!showBanner) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
      >
        <Card className="max-w-6xl mx-auto p-6 shadow-2xl border-2">
          <div className="flex items-start gap-4">
            <Cookie className="w-8 h-8 text-primary flex-shrink-0 mt-1" />

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">
                  🍪 Usamos cookies para melhorar sua experiência
                </h3>
                <p className="text-sm text-muted-foreground">
                  Utilizamos cookies essenciais para o funcionamento do site e cookies opcionais para
                  análise e personalização. Você pode escolher quais cookies aceitar.
                </p>
              </div>

              {!showDetails && (
                <div className="flex flex-wrap gap-3">
                  <Button onClick={acceptAll} size="sm">
                    Aceitar Todos
                  </Button>
                  <Button onClick={rejectNonEssential} variant="outline" size="sm">
                    Apenas Essenciais
                  </Button>
                  <Button
                    onClick={() => setShowDetails(true)}
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Personalizar
                  </Button>
                </div>
              )}

              {showDetails && (
                <div className="space-y-4 border-t pt-4">
                  <div className="space-y-3">
                    {/* Essential Cookies */}
                    <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <Checkbox
                        id="essential"
                        checked={true}
                        disabled
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label htmlFor="essential" className="font-semibold cursor-not-allowed">
                          Cookies Essenciais (Obrigatórios)
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Necessários para autenticação, segurança e funcionalidades básicas do site.
                          Não podem ser desativados.
                        </p>
                      </div>
                    </div>

                    {/* Analytics Cookies */}
                    <div className="flex items-start gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                      <Checkbox
                        id="analytics"
                        checked={consent.analytics}
                        onCheckedChange={(checked) =>
                          setConsent((prev) => ({ ...prev, analytics: checked as boolean }))
                        }
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label htmlFor="analytics" className="font-semibold cursor-pointer">
                          Cookies de Análise
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Google Analytics 4 e Vercel Analytics para entender como você usa o site
                          e melhorar a experiência. Dados anônimos.
                        </p>
                      </div>
                    </div>

                    {/* Marketing Cookies */}
                    <div className="flex items-start gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                      <Checkbox
                        id="marketing"
                        checked={consent.marketing}
                        onCheckedChange={(checked) =>
                          setConsent((prev) => ({ ...prev, marketing: checked as boolean }))
                        }
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label htmlFor="marketing" className="font-semibold cursor-pointer">
                          Cookies de Marketing
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Futuramente utilizados para personalizar anúncios e campanhas de marketing.
                          Atualmente não utilizamos.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button onClick={acceptSelected} size="sm">
                      Salvar Preferências
                    </Button>
                    <Button onClick={acceptAll} variant="outline" size="sm">
                      Aceitar Todos
                    </Button>
                    <Button onClick={rejectNonEssential} variant="outline" size="sm">
                      Rejeitar Opcionais
                    </Button>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Ao continuar navegando, você concorda com nossa{' '}
                <Link href="/privacidade" className="underline hover:text-foreground">
                  Política de Privacidade
                </Link>{' '}
                e{' '}
                <Link href="/cookies" className="underline hover:text-foreground">
                  Política de Cookies
                </Link>
                .
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={rejectNonEssential}
              className="flex-shrink-0"
              aria-label="Fechar banner"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Hook to check cookie consent status
 */
export function useCookieConsent(): CookieConsent | null {
  const [consent, setConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_KEY)
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent)
        if (parsed.version === CONSENT_VERSION) {
          setConsent(parsed.consent)
        }
      } catch {
        setConsent(null)
      }
    }
  }, [])

  return consent
}

/**
 * Function to reset cookie consent (for settings page)
 */
export function resetCookieConsent(): void {
  localStorage.removeItem(CONSENT_KEY)
  window.location.reload()
}
