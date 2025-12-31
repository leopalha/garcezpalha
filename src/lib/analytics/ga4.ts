/**
 * Google Analytics 4 Integration
 * P0-D7-001: GA4 Configuration
 */

export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || ''

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'set' | 'js',
      targetId: string | Date,
      params?: Record<string, unknown>
    ) => void
    dataLayer?: unknown[]
  }
}

// Initialize GA4 script
export function initGA4(): void {
  if (typeof window === 'undefined') return
  if (!GA4_ID) {
    console.warn('[GA4] Missing NEXT_PUBLIC_GA4_ID - Analytics disabled')
    return
  }

  // Load GA4 script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  script.async = true
  document.head.appendChild(script)

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag = gtag as typeof window.gtag

  // Configure GA4
  gtag('js', new Date())
  gtag('config', GA4_ID, {
    page_path: window.location.pathname,
    send_page_view: false, // We'll send manually for SPA behavior
  })

  console.log('[GA4] Initialized:', GA4_ID)
}

// Track page view
export function trackPageView(path: string, title?: string): void {
  if (!window.gtag) return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  })
}

// Track custom event
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!window.gtag) return

  window.gtag('event', eventName, params)
}

// Track conversion event
export function trackConversion(
  type: 'lead' | 'signup' | 'purchase' | 'checkout_start',
  params?: {
    value?: number
    currency?: string
    transaction_id?: string
    items?: unknown[]
  }
): void {
  if (!window.gtag) return

  const eventMap = {
    lead: 'generate_lead',
    signup: 'sign_up',
    purchase: 'purchase',
    checkout_start: 'begin_checkout',
  }

  window.gtag('event', eventMap[type], {
    currency: params?.currency || 'BRL',
    value: params?.value || 0,
    transaction_id: params?.transaction_id,
    items: params?.items,
  })
}

// Track user properties
export function setUserProperties(properties: Record<string, unknown>): void {
  if (!window.gtag) return

  window.gtag('set', 'user_properties', properties)
}
