/**
 * User Behavior Tracker
 *
 * Tracks user behavior on the website for lead scoring
 * Sends events to /api/marketing/track endpoint
 */

export interface UserEvent {
  type: 'page_view' | 'scroll' | 'click' | 'form_focus' | 'time_on_page' | 'exit_intent'
  page: string
  timestamp: number
  data?: Record<string, any>
}

export interface UserSession {
  sessionId: string
  userId?: string
  events: UserEvent[]
  startTime: number
  lastActivity: number
}

class UserTracker {
  private session: UserSession
  private trackingEnabled: boolean = false
  private apiEndpoint: string = '/api/marketing/track'
  private flushInterval: number = 30000 // 30 seconds
  private flushTimer?: NodeJS.Timeout

  constructor() {
    this.session = this.initSession()
  }

  /**
   * Initialize tracking session
   */
  private initSession(): UserSession {
    // Try to get existing session from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('_user_session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Check if session is still valid (< 30 minutes old)
          if (Date.now() - parsed.lastActivity < 30 * 60 * 1000) {
            return {
              ...parsed,
              lastActivity: Date.now(),
            }
          }
        } catch (e) {
          // Invalid session, create new
        }
      }
    }

    // Create new session
    return {
      sessionId: this.generateSessionId(),
      events: [],
      startTime: Date.now(),
      lastActivity: Date.now(),
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Start tracking
   */
  public start() {
    if (typeof window === 'undefined') {
      return // Server-side, don't track
    }

    this.trackingEnabled = true

    // Track initial page view
    this.trackPageView(window.location.pathname)

    // Setup event listeners
    this.setupListeners()

    // Start periodic flush
    this.flushTimer = setInterval(() => {
      this.flush()
    }, this.flushInterval)

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush()
    })
  }

  /**
   * Stop tracking
   */
  public stop() {
    this.trackingEnabled = false
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
    }
    this.flush()
  }

  /**
   * Setup event listeners
   */
  private setupListeners() {
    if (typeof window === 'undefined') return

    // Track scroll depth
    let maxScrollDepth = 0
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      )
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth
        if (scrollDepth >= 25 && scrollDepth % 25 === 0) {
          this.track({
            type: 'scroll',
            page: window.location.pathname,
            timestamp: Date.now(),
            data: { depth: scrollDepth },
          })
        }
      }
    })

    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const isButton = target.tagName === 'BUTTON'
      const isLink = target.tagName === 'A'
      const hasCTA = target.closest('[data-cta]')

      if (isButton || isLink || hasCTA) {
        this.track({
          type: 'click',
          page: window.location.pathname,
          timestamp: Date.now(),
          data: {
            element: target.tagName,
            text: target.textContent?.substring(0, 50),
            href: isLink ? (target as HTMLAnchorElement).href : undefined,
          },
        })
      }
    })

    // Track form interactions
    document.addEventListener('focus', (e) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        this.track({
          type: 'form_focus',
          page: window.location.pathname,
          timestamp: Date.now(),
          data: {
            field: (target as HTMLInputElement).name || (target as HTMLInputElement).id,
          },
        })
      }
    }, true)

    // Track time on page
    let timeOnPage = 0
    const timeInterval = setInterval(() => {
      timeOnPage += 10 // 10 seconds
      if (timeOnPage % 30 === 0) { // Every 30 seconds
        this.track({
          type: 'time_on_page',
          page: window.location.pathname,
          timestamp: Date.now(),
          data: { seconds: timeOnPage },
        })
      }
    }, 10000)

    // Clear interval on unload
    window.addEventListener('beforeunload', () => {
      clearInterval(timeInterval)
    })

    // Track exit intent
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 0) { // Mouse left from top
        this.track({
          type: 'exit_intent',
          page: window.location.pathname,
          timestamp: Date.now(),
          data: { timeOnPage },
        })
      }
    })
  }

  /**
   * Track page view
   */
  public trackPageView(page: string) {
    this.track({
      type: 'page_view',
      page,
      timestamp: Date.now(),
      data: {
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      },
    })
  }

  /**
   * Track custom event
   */
  public track(event: UserEvent) {
    if (!this.trackingEnabled) return

    this.session.events.push(event)
    this.session.lastActivity = Date.now()

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('_user_session', JSON.stringify(this.session))
      } catch (e) {
        // localStorage full or disabled
      }
    }

    // Auto-flush if too many events
    if (this.session.events.length >= 50) {
      this.flush()
    }
  }

  /**
   * Flush events to server
   */
  public async flush() {
    if (this.session.events.length === 0) return

    const events = [...this.session.events]
    this.session.events = []

    try {
      await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.session.sessionId,
          userId: this.session.userId,
          events,
        }),
      })
    } catch (error) {
      console.error('Failed to flush user tracking events:', error)
      // Re-add events if failed (max 100 events)
      this.session.events = [...events, ...this.session.events].slice(0, 100)
    }
  }

  /**
   * Set user ID (after lead conversion)
   */
  public setUserId(userId: string) {
    this.session.userId = userId
    if (typeof window !== 'undefined') {
      localStorage.setItem('_user_session', JSON.stringify(this.session))
    }
  }

  /**
   * Get session data
   */
  public getSession(): UserSession {
    return { ...this.session }
  }

  /**
   * Calculate engagement score
   */
  public calculateEngagementScore(): number {
    const events = this.session.events
    const duration = (Date.now() - this.session.startTime) / 1000 // seconds

    let score = 0

    // Page views (max 20 points)
    const pageViews = events.filter(e => e.type === 'page_view').length
    score += Math.min(pageViews * 4, 20)

    // Scroll depth (max 15 points)
    const scrollEvents = events.filter(e => e.type === 'scroll')
    const maxScroll = Math.max(...scrollEvents.map(e => e.data?.depth || 0), 0)
    score += (maxScroll / 100) * 15

    // Clicks (max 20 points)
    const clicks = events.filter(e => e.type === 'click').length
    score += Math.min(clicks * 2, 20)

    // Form interactions (max 25 points)
    const formFocus = events.filter(e => e.type === 'form_focus').length
    score += Math.min(formFocus * 5, 25)

    // Time on site (max 20 points)
    const timeScore = Math.min(duration / 60, 10) * 2 // 1 minute = 2 points
    score += timeScore

    return Math.round(Math.min(score, 100))
  }
}

// Singleton instance
let trackerInstance: UserTracker | null = null

export function getUserTracker(): UserTracker {
  if (!trackerInstance) {
    trackerInstance = new UserTracker()
  }
  return trackerInstance
}

// Auto-start tracking in browser
if (typeof window !== 'undefined') {
  const tracker = getUserTracker()
  tracker.start()
}
