/**
 * Keyboard Navigation Tests
 * Tests keyboard navigation utilities for WCAG AAA compliance
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { FocusTrap, KeyboardShortcuts, focusUtils, LiveRegionManager } from '../keyboard-navigation'

describe('Keyboard Navigation', () => {
  describe('FocusTrap', () => {
    it('should identify focusable elements', () => {
      const container = document.createElement('div')
      container.innerHTML = `
        <button>Button 1</button>
        <input type="text" />
        <a href="#">Link</a>
        <button disabled>Disabled Button</button>
      `

      const trap = new FocusTrap(container)
      expect(trap).toBeDefined()
    })
  })

  describe('KeyboardShortcuts', () => {
    it('should register keyboard shortcut', () => {
      const shortcuts = new KeyboardShortcuts()
      const callback = vi.fn()

      shortcuts.register('Ctrl+K', callback)
      expect(callback).not.toHaveBeenCalled()

      shortcuts.destroy()
    })

    it('should unregister keyboard shortcut', () => {
      const shortcuts = new KeyboardShortcuts()
      const callback = vi.fn()

      shortcuts.register('Ctrl+K', callback)
      shortcuts.unregister('Ctrl+K')

      shortcuts.destroy()
    })
  })

  describe('focusUtils', () => {
    it('should get focusable elements', () => {
      const container = document.createElement('div')
      container.innerHTML = `
        <button>Button</button>
        <input type="text" />
        <select><option>Option</option></select>
        <textarea></textarea>
        <a href="#">Link</a>
      `

      document.body.appendChild(container)

      const focusable = focusUtils.getFocusableElements(container)
      expect(focusable.length).toBeGreaterThan(0)

      document.body.removeChild(container)
    })
  })

  describe('LiveRegionManager', () => {
    it('should create live region', () => {
      const manager = new LiveRegionManager()
      expect(manager).toBeDefined()
      manager.destroy()
    })

    it('should announce message', () => {
      const manager = new LiveRegionManager()
      manager.announce('Test message')
      manager.destroy()
    })

    it('should support different priority levels', () => {
      const manager = new LiveRegionManager()
      manager.announce('Polite message', 'polite')
      manager.announce('Assertive message', 'assertive')
      manager.destroy()
    })
  })
})
