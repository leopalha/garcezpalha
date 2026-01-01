/**
 * Analytics Hook
 * Simplifies tracking across components
 */

import { useCallback } from 'react'
import { metricsTracker } from '@/lib/analytics/metrics-tracker'
import type { OnboardingMetrics, ChatMetrics, CheckoutMetrics } from '@/lib/analytics/metrics-tracker'

export function useAnalytics() {
  const trackOnboarding = useCallback((metrics: OnboardingMetrics) => {
    metricsTracker.trackOnboarding(metrics)
  }, [])

  const trackChat = useCallback((metrics: ChatMetrics) => {
    metricsTracker.trackChatUsage(metrics)
  }, [])

  const trackCheckout = useCallback((metrics: CheckoutMetrics) => {
    metricsTracker.trackCheckout(metrics)
  }, [])

  const trackPayment = useCallback((
    success: boolean,
    amount: number,
    method: string,
    transactionId?: string
  ) => {
    metricsTracker.trackPayment(success, amount, method, transactionId)
  }, [])

  return {
    trackOnboarding,
    trackChat,
    trackCheckout,
    trackPayment,
  }
}
