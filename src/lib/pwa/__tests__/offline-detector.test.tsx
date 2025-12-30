// OfflineDetector Component - Unit Tests
// Garcez Palha - MANUS v7.0 (29/12/2025)

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { OfflineDetector, useOnlineStatus } from '../offline-detector'
import { renderHook, act } from '@testing-library/react'

describe('OfflineDetector', () => {
  let onlineGetter: jest.SpyInstance
  let addEventListenerSpy: jest.SpyInstance
  let removeEventListenerSpy: jest.SpyInstance

  beforeEach(() => {
    // Mock navigator.onLine
    onlineGetter = jest.spyOn(navigator, 'onLine', 'get')
    onlineGetter.mockReturnValue(true)

    // Spy on addEventListener/removeEventListener
    addEventListenerSpy = jest.spyOn(window, 'addEventListener')
    removeEventListenerSpy = jest.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    onlineGetter.mockRestore()
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
    jest.clearAllMocks()
  })

  it('should not show banner when online', () => {
    render(<OfflineDetector showNotification={true} />)

    expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
  })

  it('should show banner when going offline', async () => {
    onlineGetter.mockReturnValue(false)

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
    onlineGetter.mockReturnValue(false)
    const { rerender } = render(<OfflineDetector showNotification={true} />)

    // Go offline
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    await waitFor(() => {
      expect(screen.getByText('Você está offline')).toBeInTheDocument()
    })

    // Go back online
    onlineGetter.mockReturnValue(true)
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    await waitFor(() => {
      expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
    })
  })

  it('should call onOnline callback when going online', async () => {
    const onOnline = jest.fn()
    onlineGetter.mockReturnValue(false)

    render(<OfflineDetector showNotification={true} onOnline={onOnline} />)

    // Go online
    onlineGetter.mockReturnValue(true)
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    await waitFor(() => {
      expect(onOnline).toHaveBeenCalled()
    })
  })

  it('should call onOffline callback when going offline', async () => {
    const onOffline = jest.fn()
    onlineGetter.mockReturnValue(true)

    render(<OfflineDetector showNotification={true} onOffline={onOffline} />)

    // Go offline
    onlineGetter.mockReturnValue(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    await waitFor(() => {
      expect(onOffline).toHaveBeenCalled()
    })
  })

  it('should hide banner when close button is clicked', async () => {
    onlineGetter.mockReturnValue(false)
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
    onlineGetter.mockReturnValue(false)
    render(<OfflineDetector showNotification={false} />)

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(screen.queryByText('Você está offline')).not.toBeInTheDocument()
  })

  it('should register event listeners on mount', () => {
    render(<OfflineDetector showNotification={true} />)

    expect(addEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(addEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should cleanup event listeners on unmount', () => {
    const { unmount } = render(<OfflineDetector showNotification={true} />)

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function))
    expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function))
  })
})

describe('useOnlineStatus', () => {
  let onlineGetter: jest.SpyInstance

  beforeEach(() => {
    onlineGetter = jest.spyOn(navigator, 'onLine', 'get')
    onlineGetter.mockReturnValue(true)
  })

  afterEach(() => {
    onlineGetter.mockRestore()
  })

  it('should return initial online status', () => {
    const { result } = renderHook(() => useOnlineStatus())

    expect(result.current).toBe(true)
  })

  it('should update status when going offline', () => {
    const { result } = renderHook(() => useOnlineStatus())

    onlineGetter.mockReturnValue(false)
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current).toBe(false)
  })

  it('should update status when going back online', () => {
    onlineGetter.mockReturnValue(false)
    const { result } = renderHook(() => useOnlineStatus())

    onlineGetter.mockReturnValue(true)
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current).toBe(true)
  })
})
