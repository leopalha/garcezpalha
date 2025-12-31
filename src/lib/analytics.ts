// Analytics tracking utility for Garcez Palha
// Supports Google Analytics 4, custom events, and server-side tracking

type EventCategory =
  | 'page_view'
  | 'lead'
  | 'referral'
  | 'payment'
  | 'chat'
  | 'engagement'
  | 'error'
  | 'conversion'

interface AnalyticsEvent {
  category: EventCategory
  action: string
  label?: string
  value?: number
  metadata?: Record<string, unknown>
}

interface PageViewEvent {
  path: string
  title?: string
  referrer?: string
  searchParams?: Record<string, string>
}

interface ConversionEvent {
  type: 'lead' | 'payment' | 'referral' | 'signup'
  value?: number
  currency?: string
  transactionId?: string
}

// Google Analytics 4 gtag function type
declare global {
  interface Window {
    gtag?: (
      command: 'set' | 'config' | 'event' | 'js',
      targetId: string | Date,
      params?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

class Analytics {
  private isProduction: boolean
  private ga4Id: string | null
  private debugMode: boolean

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production'
    this.ga4Id = process.env.NEXT_PUBLIC_GA4_ID || null
    this.debugMode = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true'
  }

  // Initialize GA4
  init() {
    if (typeof window === 'undefined') return
    if (!this.ga4Id) {
      this.log('GA4 ID not configured')
      return
    }

    // Load GA4 script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.ga4Id}`
    script.async = true
    document.head.appendChild(script)

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }
    window.gtag('js', new Date().toISOString())
    window.gtag('config', this.ga4Id, {
      page_path: window.location.pathname,
      debug_mode: this.debugMode,
    })

    this.log('Analytics initialized')
  }

  // Track page view
  trackPageView(event: PageViewEvent) {
    this.log('Page view:', event)

    if (typeof window === 'undefined') return

    // GA4 tracking
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: event.path,
        page_title: event.title,
        page_referrer: event.referrer,
      })
    }

    // Custom tracking
    this.trackEvent({
      category: 'page_view',
      action: 'view',
      label: event.path,
      metadata: {
        title: event.title,
        referrer: event.referrer,
        searchParams: event.searchParams,
      },
    })
  }

  // Track custom event
  trackEvent(event: AnalyticsEvent) {
    this.log('Event:', event)

    if (typeof window === 'undefined') return

    // GA4 event
    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      })
    }

    // Send to custom analytics endpoint if needed
    if (this.isProduction) {
      this.sendToServer(event).catch((err) => {
        this.log('Failed to send event to server:', err)
      })
    }
  }

  // Track conversion
  trackConversion(conversion: ConversionEvent) {
    this.log('Conversion:', conversion)

    if (typeof window === 'undefined') return

    // GA4 conversion
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: `${this.ga4Id}/${conversion.type}`,
        value: conversion.value,
        currency: conversion.currency || 'BRL',
        transaction_id: conversion.transactionId,
      })
    }

    // Track as custom event
    this.trackEvent({
      category: 'conversion',
      action: conversion.type,
      value: conversion.value,
      metadata: {
        currency: conversion.currency,
        transactionId: conversion.transactionId,
      },
    })
  }

  // Track lead capture
  trackLead(leadData: {
    source: string
    service?: string
    value?: number
  }) {
    this.trackEvent({
      category: 'lead',
      action: 'capture',
      label: leadData.source,
      value: leadData.value,
      metadata: {
        service: leadData.service,
      },
    })

    this.trackConversion({
      type: 'lead',
      value: leadData.value || 0,
    })
  }

  // Track referral
  trackReferral(referralData: {
    partnerId?: string
    service: string
    potentialValue?: number
  }) {
    this.trackEvent({
      category: 'referral',
      action: 'create',
      label: referralData.service,
      value: referralData.potentialValue,
      metadata: {
        partnerId: referralData.partnerId,
      },
    })

    this.trackConversion({
      type: 'referral',
      value: referralData.potentialValue,
    })
  }

  // Track payment
  trackPayment(paymentData: {
    method: 'stripe' | 'pix'
    amount: number
    currency?: string
    transactionId: string
  }) {
    this.trackEvent({
      category: 'payment',
      action: paymentData.method,
      value: paymentData.amount,
      metadata: {
        currency: paymentData.currency || 'BRL',
        transactionId: paymentData.transactionId,
      },
    })

    this.trackConversion({
      type: 'payment',
      value: paymentData.amount,
      currency: paymentData.currency || 'BRL',
      transactionId: paymentData.transactionId,
    })
  }

  // Track chat interaction
  trackChat(action: 'start' | 'message' | 'end', metadata?: Record<string, unknown>) {
    this.trackEvent({
      category: 'chat',
      action,
      metadata,
    })
  }

  // Track user engagement
  trackEngagement(action: string, metadata?: Record<string, unknown>) {
    this.trackEvent({
      category: 'engagement',
      action,
      metadata,
    })
  }

  // Track error
  trackError(error: {
    message: string
    stack?: string
    context?: string
    severity?: 'low' | 'medium' | 'high' | 'critical'
  }) {
    this.trackEvent({
      category: 'error',
      action: error.severity || 'medium',
      label: error.message,
      metadata: {
        stack: error.stack,
        context: error.context,
      },
    })
  }

  // Track button click
  trackClick(buttonName: string, metadata?: Record<string, unknown>) {
    this.trackEvent({
      category: 'engagement',
      action: 'click',
      label: buttonName,
      metadata,
    })
  }

  // Track form submission
  trackFormSubmission(formName: string, success: boolean, metadata?: Record<string, unknown>) {
    this.trackEvent({
      category: 'engagement',
      action: success ? 'form_success' : 'form_error',
      label: formName,
      metadata,
    })
  }

  // Track scroll depth
  trackScrollDepth(percentage: number, pagePath: string) {
    if (percentage % 25 === 0) {
      // Track at 25%, 50%, 75%, 100%
      this.trackEvent({
        category: 'engagement',
        action: 'scroll',
        label: pagePath,
        value: percentage,
      })
    }
  }

  // Track time on page
  trackTimeOnPage(seconds: number, pagePath: string) {
    const milestones = [30, 60, 120, 300, 600] // 30s, 1m, 2m, 5m, 10m
    if (milestones.includes(seconds)) {
      this.trackEvent({
        category: 'engagement',
        action: 'time_on_page',
        label: pagePath,
        value: seconds,
      })
    }
  }

  // Set user properties
  setUserProperties(properties: Record<string, unknown>) {
    if (typeof window === 'undefined') return

    if (window.gtag) {
      window.gtag('set', 'user_properties', properties)
    }

    this.log('User properties set:', properties)
  }

  // Set user ID
  setUserId(userId: string) {
    if (typeof window === 'undefined') return

    if (window.gtag) {
      window.gtag('config', this.ga4Id || '', { user_id: userId })
    }

    this.log('User ID set:', userId)
  }

  // Private: Send event to server
  private async sendToServer(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error('Failed to send analytics event:', error)
    }
  }

  // Private: Debug logging
  private log(...args: unknown[]) {
    if (this.debugMode || !this.isProduction) {
      console.log('[Analytics]', ...args)
    }
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Export types
export type { AnalyticsEvent, PageViewEvent, ConversionEvent }

// React hook for analytics
export function useAnalytics() {
  return analytics
}

// HOC for automatic page view tracking
// Note: This HOC should be used in .tsx files. Import React there.
export function withPageTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  pageName: string
) {
  return function WithPageTracking(props: P) {
    if (typeof window !== 'undefined') {
      analytics.trackPageView({
        path: window.location.pathname,
        title: pageName,
        referrer: document.referrer,
      })
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const React = require('react')
    return React.createElement(WrappedComponent, props)
  }
}

// Utility for tracking UTM parameters
export function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}

  const params = new URLSearchParams(window.location.search)
  const utmParams: Record<string, string> = {}

  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
  utmKeys.forEach((key) => {
    const value = params.get(key)
    if (value) {
      utmParams[key] = value
    }
  })

  return utmParams
}

// Save UTM params to session storage for attribution
export function saveUTMParams() {
  if (typeof window === 'undefined') return

  const utmParams = getUTMParams()
  if (Object.keys(utmParams).length > 0) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmParams))
    analytics.setUserProperties(utmParams)
  }
}

// Get saved UTM params
export function getSavedUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}

  const saved = sessionStorage.getItem('utm_params')
  return saved ? JSON.parse(saved) : {}
}
