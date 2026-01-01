/**
 * Monitoring & Observability Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  PerformanceTimer,
  trackError,
  trackApiCall,
  trackUserAction,
  trackConversion,
} from '../observability'

describe('PerformanceTimer', () => {
  it('should measure duration', () => {
    const timer = new PerformanceTimer('test-operation')
    const duration = timer.end()

    expect(duration).toBeGreaterThanOrEqual(0)
    expect(typeof duration).toBe('number')
  })

  it('should track metric name', () => {
    const timer = new PerformanceTimer('api-call')
    expect(timer).toBeDefined()
  })
})

describe('trackError', () => {
  it('should track error without throwing', () => {
    const error = new Error('Test error')
    expect(() => trackError(error)).not.toThrow()
  })

  it('should track error with context', () => {
    const error = new Error('API failed')
    const context = { endpoint: '/api/test', statusCode: 500 }
    expect(() => trackError(error, context)).not.toThrow()
  })
})

describe('trackApiCall', () => {
  it('should track successful API call', () => {
    expect(() => {
      trackApiCall('/api/test', 150, 200, { records: 10 })
    }).not.toThrow()
  })

  it('should track failed API call', () => {
    expect(() => {
      trackApiCall('/api/test', 250, 500)
    }).not.toThrow()
  })

  it('should track slow API call', () => {
    const consoleSpy = vi.spyOn(console, 'warn')
    trackApiCall('/api/slow', 1500, 200)
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should alert on 500 errors', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    trackApiCall('/api/error', 100, 500)
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})

describe('trackUserAction', () => {
  it('should track user action', () => {
    expect(() => {
      trackUserAction('button_clicked', { buttonId: 'submit' })
    }).not.toThrow()
  })

  it('should track page view', () => {
    expect(() => {
      trackUserAction('page_view', { page: '/dashboard' })
    }).not.toThrow()
  })
})

describe('trackConversion', () => {
  it('should track conversion with value', () => {
    expect(() => {
      trackConversion('purchase', 10000, { productId: 'prod-123' })
    }).not.toThrow()
  })

  it('should track conversion without value', () => {
    expect(() => {
      trackConversion('signup', undefined, { source: 'website' })
    }).not.toThrow()
  })
})
