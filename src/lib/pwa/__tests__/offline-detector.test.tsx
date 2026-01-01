// OfflineDetector Component - Unit Tests
// Garcez Palha - MANUS v7.0 (29/12/2025)

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OfflineDetector, useOnlineStatus } from '../offline-detector'
import { renderHook, act } from '@testing-library/react'
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest'

describe('OfflineDetector', () => {
  let originalOnLine: boolean

  beforeEach(() => {
    // Save original value
    originalOnLine = navigator.onLine

    // Mock navigator.onLine as writable property
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true
    })
  })

  afterEach(() => {
    // Restore original value
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: originalOnLine
    })

    vi.clearAllMocks()
  })

  it('should not show banner when online', () => {
    render(<OfflineDetector showNotification={true} />)

    expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
  })

  it('should show banner when going offline', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false
    })

    render(<OfflineDetector showNotification={true} />)

    // Trigger offline event
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    await waitFor(() => {
      expect(screen.getByText('Você está offline')).toBeInTheDocument()
    })
  })

  it('should hide banner when going back online', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false
    })
    const { rerender } = render(<OfflineDetector showNotification={true} />)

    // Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    await waitFor(() => {
      expect(screen.getByText('Você está offline')).toBeInTheDocument()
    })

    // Go back online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true
    })
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    await waitFor(() => {
      expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
    })
  })

  it('should call onOnline callback when going online', async () => {
    const onOnline = vi.fn()

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false
    })

    render(<OfflineDetector showNotification={true} onOnline={onOnline} />)

    // Go online
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true
    })
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    await waitFor(() => {
      expect(onOnline).toHaveBeenCalled()
    })
  })

  it('should call onOffline callback when going offline', async () => {
    const onOffline = vi.fn()

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true
    })

    render(<OfflineDetector showNotification={true} onOffline={onOffline} />)

    // Go offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false
    })
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    await waitFor(() => {
      expect(onOffline).toHaveBeenCalled()
    })
  })

  it('should hide banner when close button is clicked', async () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false
    })
    render(<OfflineDetector showNotification={true} />)

    // Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    await waitFor(() => {
      expect(screen.getByText('Você está offline')).toBeInTheDocument()
    })

    // Click close button
    const closeButton = screen.getByLabelText('Fechar')
    fireEvent.click(closeButton)

    await waitFor(() => {
      expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
    })
  })

  it('should not show banner when showNotification is false', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false
    })
    render(<OfflineDetector showNotification={false} />)

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
  })

  it('should register event listeners on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    render(<OfflineDetector showNotification={true} />)

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))

    addEventListenerSpy.mockRestore()
  })

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = render(<OfflineDetector showNotification={true} />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })
})

describe('useOnlineStatus', () => {
  let originalOnLine: boolean

  beforeEach(() => {
    originalOnLine = navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: originalOnLine
    })
  })

  it('should return initial online status', () => {
    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(true)
  })

  it('should update status when going offline', () => {
    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(true)

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false
    })
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current).toBe(false)
  })

  it('should update status when going back online', () => {
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: false
    })
    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(false)

    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      configurable: true,
      value: true
    })
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current).toBe(true)
  })
})
