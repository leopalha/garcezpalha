/**
 * Keyboard Navigation Utilities
 * Provides keyboard navigation helpers for WCAG 2.1 AAA compliance
 */

/**
 * Focus trap for modals and dialogs
 * Keeps keyboard focus within the trap container
 */
export class FocusTrap {
  private container: HTMLElement
  private focusableElements: HTMLElement[]
  private firstFocusable: HTMLElement | null = null
  private lastFocusable: HTMLElement | null = null

  constructor(container: HTMLElement) {
    this.container = container
    this.focusableElements = this.getFocusableElements()
    this.firstFocusable = this.focusableElements[0] || null
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null
  }

  private getFocusableElements(): HTMLElement[] {
    const selector = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(',')

    return Array.from(this.container.querySelectorAll(selector)) as HTMLElement[]
  }

  public activate(): void {
    this.container.addEventListener('keydown', this.handleKeyDown)
    this.firstFocusable?.focus()
  }

  public deactivate(): void {
    this.container.removeEventListener('keydown', this.handleKeyDown)
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== 'Tab') return

    // Shift + Tab (backward)
    if (e.shiftKey) {
      if (document.activeElement === this.firstFocusable) {
        e.preventDefault()
        this.lastFocusable?.focus()
      }
    }
    // Tab (forward)
    else {
      if (document.activeElement === this.lastFocusable) {
        e.preventDefault()
        this.firstFocusable?.focus()
      }
    }
  }
}

/**
 * Keyboard shortcuts manager
 */
export class KeyboardShortcuts {
  private shortcuts: Map<string, () => void> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', this.handleKeyDown)
    }
  }

  public register(key: string, callback: () => void): void {
    this.shortcuts.set(key, callback)
  }

  public unregister(key: string): void {
    this.shortcuts.delete(key)
  }

  private handleKeyDown = (e: KeyboardEvent): void => {
    const key = this.getKeyString(e)
    const callback = this.shortcuts.get(key)

    if (callback) {
      e.preventDefault()
      callback()
    }
  }

  private getKeyString(e: KeyboardEvent): string {
    const parts: string[] = []

    if (e.ctrlKey) parts.push('Ctrl')
    if (e.altKey) parts.push('Alt')
    if (e.shiftKey) parts.push('Shift')
    if (e.metaKey) parts.push('Meta')

    parts.push(e.key)

    return parts.join('+')
  }

  public destroy(): void {
    if (typeof window !== 'undefined') {
      document.removeEventListener('keydown', this.handleKeyDown)
    }
    this.shortcuts.clear()
  }
}

/**
 * Skip links for keyboard navigation
 * Allows users to skip to main content
 */
export function createSkipLinks(): HTMLElement {
  const skipLinks = document.createElement('div')
  skipLinks.className = 'skip-links'
  skipLinks.setAttribute('role', 'navigation')
  skipLinks.setAttribute('aria-label', 'Skip links')

  const links = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#footer', text: 'Skip to footer' },
  ]

  links.forEach(({ href, text }) => {
    const link = document.createElement('a')
    link.href = href
    link.textContent = text
    link.className = 'skip-link'
    skipLinks.appendChild(link)
  })

  return skipLinks
}

/**
 * Announce to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Set focus to element and scroll into view
   */
  setFocus(element: HTMLElement | null): void {
    if (!element) return

    element.focus()
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  },

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container: HTMLElement = document.body): HTMLElement[] {
    const selector = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',')

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[]
  },

  /**
   * Get next focusable element
   */
  getNextFocusable(current: HTMLElement): HTMLElement | null {
    const focusable = this.getFocusableElements()
    const currentIndex = focusable.indexOf(current)

    if (currentIndex === -1 || currentIndex === focusable.length - 1) {
      return focusable[0] || null
    }

    return focusable[currentIndex + 1] || null
  },

  /**
   * Get previous focusable element
   */
  getPreviousFocusable(current: HTMLElement): HTMLElement | null {
    const focusable = this.getFocusableElements()
    const currentIndex = focusable.indexOf(current)

    if (currentIndex === -1 || currentIndex === 0) {
      return focusable[focusable.length - 1] || null
    }

    return focusable[currentIndex - 1] || null
  },
}

/**
 * ARIA live region manager
 */
export class LiveRegionManager {
  private region: HTMLElement | null = null

  constructor() {
    if (typeof document !== 'undefined') {
      this.createLiveRegion()
    }
  }

  private createLiveRegion(): void {
    this.region = document.createElement('div')
    this.region.setAttribute('role', 'region')
    this.region.setAttribute('aria-live', 'polite')
    this.region.setAttribute('aria-atomic', 'true')
    this.region.className = 'sr-only'
    document.body.appendChild(this.region)
  }

  public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.region) return

    this.region.setAttribute('aria-live', priority)
    this.region.textContent = message

    // Clear after announcement
    setTimeout(() => {
      if (this.region) {
        this.region.textContent = ''
      }
    }, 1000)
  }

  public destroy(): void {
    if (this.region && this.region.parentNode) {
      this.region.parentNode.removeChild(this.region)
      this.region = null
    }
  }
}
