'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { analytics, saveUTMParams, getUTMParams } from '@/lib/analytics'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Initialize analytics on mount
  useEffect(() => {
    analytics.init()
    saveUTMParams()
  }, [])

  // Track page views on route change
  useEffect(() => {
    const searchParamsObj: Record<string, string> = {}
    searchParams.forEach((value, key) => {
      searchParamsObj[key] = value
    })

    analytics.trackPageView({
      path: pathname,
      title: document.title,
      referrer: document.referrer,
      searchParams: searchParamsObj,
    })

    // Track UTM parameters
    const utmParams = getUTMParams()
    if (Object.keys(utmParams).length > 0) {
      analytics.setUserProperties(utmParams)
    }
  }, [pathname, searchParams])

  // Track scroll depth
  useEffect(() => {
    let maxScroll = 0

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((window.scrollY / scrollHeight) * 100)

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        analytics.trackScrollDepth(scrollPercent, pathname)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Track time on page
  useEffect(() => {
    const startTime = Date.now()
    const intervals = [30, 60, 120, 300, 600]
    const timeouts: NodeJS.Timeout[] = []

    intervals.forEach((seconds) => {
      const timeout = setTimeout(() => {
        analytics.trackTimeOnPage(seconds, pathname)
      }, seconds * 1000)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
      const timeOnPage = Math.round((Date.now() - startTime) / 1000)
      analytics.trackEngagement('page_exit', {
        timeOnPage,
        path: pathname,
      })
    }
  }, [pathname])

  // Track unhandled errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      analytics.trackError({
        message: event.message,
        stack: event.error?.stack,
        context: `${pathname} - Line ${event.lineno}:${event.colno}`,
        severity: 'high',
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      analytics.trackError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        context: pathname,
        severity: 'medium',
      })
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [pathname])

  return <>{children}</>
}
