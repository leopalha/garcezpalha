/**
 * Critical Metrics Tracker
 * P0-D7-003: Track critical user journey metrics
 */

import { trackEvent, trackConversion } from './ga4'

export interface OnboardingMetrics {
  step: number
  totalSteps: number
  timeSpent: number
  completed: boolean
}

export interface ChatMetrics {
  messageCount: number
  sessionDuration: number
  assistantUsed: string
  userSatisfaction?: number
}

export interface CheckoutMetrics {
  step: 'initiate' | 'payment' | 'complete' | 'abandon'
  productId: string
  amount: number
  paymentMethod?: string
}

export interface SessionMetrics {
  sessionId: string
  duration: number
  pageViews: number
  bounceRate: boolean
  returnVisitor: boolean
}

class MetricsTracker {
  private sessionStart: number = Date.now()
  private pageViewCount: number = 0
  private sessionId: string = ''

  constructor() {
    if (typeof window !== 'undefined') {
      this.sessionId = this.getOrCreateSessionId()
      this.sessionStart = Date.now()
      this.trackSessionStart()
    }
  }

  private getOrCreateSessionId(): string {
    const existingId = sessionStorage.getItem('session_id')
    if (existingId) return existingId

    const newId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem('session_id', newId)
    return newId
  }

  private trackSessionStart(): void {
    trackEvent('session_start', {
      session_id: this.sessionId,
      timestamp: this.sessionStart,
    })
  }

  // 1. Onboarding Completion Tracking
  trackOnboarding(metrics: OnboardingMetrics): void {
    trackEvent('onboarding_progress', {
      step: metrics.step,
      total_steps: metrics.totalSteps,
      time_spent: metrics.timeSpent,
      completed: metrics.completed,
      completion_rate: (metrics.step / metrics.totalSteps) * 100,
    })

    if (metrics.completed) {
      trackConversion('signup', {
        value: 0,
      })
      trackEvent('onboarding_complete', {
        total_time: metrics.timeSpent,
        total_steps: metrics.totalSteps,
      })
    }
  }

  // 2. Chat IA Usage Metrics
  trackChatUsage(metrics: ChatMetrics): void {
    trackEvent('chat_interaction', {
      message_count: metrics.messageCount,
      session_duration: metrics.sessionDuration,
      assistant: metrics.assistantUsed,
      satisfaction: metrics.userSatisfaction,
    })

    // Track engagement milestones
    if (metrics.messageCount === 1) {
      trackEvent('chat_first_message', {
        assistant: metrics.assistantUsed,
      })
    }

    if (metrics.messageCount === 5) {
      trackEvent('chat_engaged_user', {
        assistant: metrics.assistantUsed,
        duration: metrics.sessionDuration,
      })
    }

    if (metrics.messageCount >= 10) {
      trackEvent('chat_power_user', {
        assistant: metrics.assistantUsed,
        duration: metrics.sessionDuration,
      })
    }
  }

  // 3. Checkout Funnel Tracking
  trackCheckout(metrics: CheckoutMetrics): void {
    const eventMap = {
      initiate: 'begin_checkout',
      payment: 'add_payment_info',
      complete: 'purchase',
      abandon: 'checkout_abandon',
    }

    const eventName = eventMap[metrics.step]

    if (metrics.step === 'initiate') {
      trackConversion('checkout_start', {
        value: metrics.amount,
        currency: 'BRL',
        items: [
          {
            item_id: metrics.productId,
            item_name: metrics.productId,
            price: metrics.amount,
          },
        ],
      })
    }

    if (metrics.step === 'complete') {
      trackConversion('purchase', {
        value: metrics.amount,
        currency: 'BRL',
        transaction_id: `txn_${Date.now()}`,
        items: [
          {
            item_id: metrics.productId,
            item_name: metrics.productId,
            price: metrics.amount,
          },
        ],
      })
    }

    trackEvent(eventName, {
      product_id: metrics.productId,
      amount: metrics.amount,
      payment_method: metrics.paymentMethod,
      step: metrics.step,
    })
  }

  // 4. Payment Completion Tracking
  trackPayment(
    success: boolean,
    amount: number,
    method: string,
    transactionId?: string
  ): void {
    if (success) {
      trackEvent('payment_success', {
        amount,
        method,
        transaction_id: transactionId,
        currency: 'BRL',
      })
    } else {
      trackEvent('payment_failed', {
        amount,
        method,
        currency: 'BRL',
      })
    }
  }

  // 5. Bounce Rate Calculation
  trackBounce(): void {
    this.pageViewCount++

    // If user navigates to another page, not a bounce
    if (this.pageViewCount > 1) {
      trackEvent('not_bounced', {
        session_id: this.sessionId,
        page_views: this.pageViewCount,
      })
    }
  }

  // 6. Session Duration Tracking
  trackSessionDuration(): number {
    const duration = Math.round((Date.now() - this.sessionStart) / 1000)

    // Track engagement milestones
    if (duration === 30) {
      trackEvent('session_30s', { session_id: this.sessionId })
    } else if (duration === 60) {
      trackEvent('session_1min', { session_id: this.sessionId })
    } else if (duration === 120) {
      trackEvent('session_2min', { session_id: this.sessionId })
    } else if (duration === 300) {
      trackEvent('session_5min', { session_id: this.sessionId })
    }

    return duration
  }

  // 7. Return Visitor Tracking
  trackReturnVisitor(): boolean {
    const hasVisited = localStorage.getItem('has_visited')
    const isReturn = hasVisited === 'true'

    if (!hasVisited) {
      localStorage.setItem('has_visited', 'true')
      localStorage.setItem('first_visit', new Date().toISOString())
      trackEvent('first_visit', {
        session_id: this.sessionId,
      })
    } else {
      const firstVisit = localStorage.getItem('first_visit')
      trackEvent('return_visit', {
        session_id: this.sessionId,
        first_visit: firstVisit,
      })
    }

    return isReturn
  }

  // End session tracking
  endSession(): void {
    const duration = this.trackSessionDuration()
    const isBounce = this.pageViewCount <= 1
    const isReturn = this.trackReturnVisitor()

    trackEvent('session_end', {
      session_id: this.sessionId,
      duration,
      page_views: this.pageViewCount,
      bounced: isBounce,
      return_visitor: isReturn,
    })
  }
}

// Singleton instance
export const metricsTracker = new MetricsTracker()

// Auto-track session end on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    metricsTracker.endSession()
  })
}
