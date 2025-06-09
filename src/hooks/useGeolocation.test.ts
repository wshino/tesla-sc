import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useGeolocation } from './useGeolocation'

describe('useGeolocation', () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
  }

  const mockPermissions = {
    query: vi.fn(),
  }

  beforeEach(() => {
    // Mock navigator.geolocation
    Object.defineProperty(global.navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
      configurable: true,
    })

    // Mock navigator.permissions
    Object.defineProperty(global.navigator, 'permissions', {
      value: mockPermissions,
      writable: true,
      configurable: true,
    })

    // Reset mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return initial state', () => {
    // Mock permissions.query to return a promise
    mockPermissions.query.mockResolvedValue({
      state: 'prompt' as PermissionState,
      addEventListener: vi.fn(),
    })

    const { result } = renderHook(() => useGeolocation())

    expect(result.current.position).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.permissionState).toBeNull()
    expect(typeof result.current.getCurrentPosition).toBe('function')
  })

  it('should get current position successfully', async () => {
    // Mock permissions.query to return a promise
    mockPermissions.query.mockResolvedValue({
      state: 'granted' as PermissionState,
      addEventListener: vi.fn(),
    })

    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
      },
      timestamp: Date.now(),
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      // Call success callback synchronously
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation())

    act(() => {
      result.current.getCurrentPosition()
    })

    // After act, loading should be false because getCurrentPosition calls success synchronously in our mock
    expect(result.current.loading).toBe(false)
    expect(result.current.position).toEqual({
      latitude: mockPosition.coords.latitude,
      longitude: mockPosition.coords.longitude,
      accuracy: mockPosition.coords.accuracy,
      timestamp: mockPosition.timestamp,
    })
    expect(result.current.error).toBeNull()
  })

  it('should handle geolocation error', async () => {
    // Mock permissions.query to return a promise
    mockPermissions.query.mockResolvedValue({
      state: 'denied' as PermissionState,
      addEventListener: vi.fn(),
    })

    const mockError = {
      code: 1,
      message: 'User denied Geolocation',
    }

    mockGeolocation.getCurrentPosition.mockImplementation((_success, error) => {
      // Call error callback synchronously
      error(mockError)
    })

    const { result } = renderHook(() => useGeolocation())

    act(() => {
      result.current.getCurrentPosition()
    })

    // After act, loading should be false because getCurrentPosition calls error synchronously in our mock
    expect(result.current.loading).toBe(false)
    expect(result.current.position).toBeNull()
    expect(result.current.error).toEqual({
      code: mockError.code,
      message: mockError.message,
    })
  })

  it('should handle geolocation not supported', async () => {
    // Create a new navigator without geolocation
    const navigatorWithoutGeo = {
      ...global.navigator,
      geolocation: undefined,
      permissions: undefined,
    }

    Object.defineProperty(global, 'navigator', {
      value: navigatorWithoutGeo,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useGeolocation())

    // Wait for the useEffect to run
    await waitFor(() => {
      expect(result.current.error).toEqual({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      })
    })

    act(() => {
      result.current.getCurrentPosition()
    })

    expect(result.current.error).toEqual({
      code: 0,
      message: 'Geolocation is not supported by your browser',
    })
  })

  it('should query permission state', async () => {
    const mockPermissionStatus = {
      state: 'granted' as PermissionState,
      addEventListener: vi.fn(),
    }

    mockPermissions.query.mockResolvedValue(mockPermissionStatus)

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.permissionState).toBe('granted')
    })

    expect(mockPermissions.query).toHaveBeenCalledWith({
      name: 'geolocation',
    })
  })

  it('should handle permission state changes', async () => {
    let changeCallback: (() => void) | null = null
    const mockPermissionStatus = {
      state: 'prompt' as PermissionState,
      addEventListener: vi.fn((event, callback) => {
        if (event === 'change') {
          changeCallback = callback
        }
      }),
    }

    mockPermissions.query.mockResolvedValue(mockPermissionStatus)

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(result.current.permissionState).toBe('prompt')
    })

    // Simulate permission state change
    act(() => {
      mockPermissionStatus.state = 'granted'
      if (changeCallback) {
        changeCallback()
      }
    })

    await waitFor(() => {
      expect(result.current.permissionState).toBe('granted')
    })
  })

  it('should use custom options', async () => {
    // Mock permissions.query to return a promise
    mockPermissions.query.mockResolvedValue({
      state: 'granted' as PermissionState,
      addEventListener: vi.fn(),
    })

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 1000,
    }

    const mockPosition = {
      coords: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
      },
      timestamp: Date.now(),
    }

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition)
    })

    const { result } = renderHook(() => useGeolocation(options))

    act(() => {
      result.current.getCurrentPosition()
    })

    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledWith(
        expect.any(Function),
        expect.any(Function),
        options
      )
    })
  })

  it('should handle permission query error gracefully', async () => {
    mockPermissions.query.mockRejectedValue(new Error('Permission API error'))

    const consoleWarnSpy = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => {})

    const { result } = renderHook(() => useGeolocation())

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to query geolocation permission:',
        expect.any(Error)
      )
    })

    expect(result.current.permissionState).toBeNull()

    consoleWarnSpy.mockRestore()
  })
})
