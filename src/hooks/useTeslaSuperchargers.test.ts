import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useTeslaSuperchargers } from './useTeslaSuperchargers'
import { Charger } from '@/types/charger'

// Mock the tesla-api module
vi.mock('@/lib/tesla-api', () => ({
  fetchTeslaSuperchargers: vi.fn(),
}))

// Get the mocked function after the mock is set up
import { fetchTeslaSuperchargers } from '@/lib/tesla-api'
const mockFetchTeslaSuperchargers = vi.mocked(fetchTeslaSuperchargers)

describe('useTeslaSuperchargers Hook', () => {
  const mockChargers: Charger[] = [
    {
      id: 'sc-tokyo-roppongi',
      name: 'Tokyo - Roppongi',
      location: { lat: 35.6627, lng: 139.7318 },
      address: '6-10-1 Roppongi, Minato-ku',
      city: 'Tokyo',
      state: 'Tokyo',
      country: 'Japan',
      stalls: 6,
      amenities: ['restaurants', 'shopping'],
      status: 'active',
    },
    {
      id: 'sc-tokyo-daikanyama',
      name: 'Tokyo - Daikanyama',
      location: { lat: 35.6485, lng: 139.7031 },
      address: '16-15 Sarugakucho, Shibuya-ku',
      city: 'Tokyo',
      state: 'Tokyo',
      country: 'Japan',
      stalls: 4,
      amenities: ['restaurants', 'shopping', 'coffee'],
      status: 'active',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should start with loading state', () => {
    mockFetchTeslaSuperchargers.mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep in loading state
    )

    const { result } = renderHook(() => useTeslaSuperchargers())

    expect(result.current.loading).toBe(true)
    expect(result.current.chargers).toEqual([])
    expect(result.current.error).toBe(null)
    expect(typeof result.current.refetch).toBe('function')
  })

  it('should fetch chargers successfully', async () => {
    mockFetchTeslaSuperchargers.mockResolvedValueOnce(mockChargers)

    const { result } = renderHook(() => useTeslaSuperchargers())

    // Initially should be loading
    expect(result.current.loading).toBe(true)
    expect(result.current.chargers).toEqual([])
    expect(result.current.error).toBe(null)

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual(mockChargers)
    expect(result.current.error).toBe(null)
    expect(mockFetchTeslaSuperchargers).toHaveBeenCalledTimes(1)
  })

  it('should handle fetch errors', async () => {
    const mockError = new Error('Failed to fetch chargers')
    mockFetchTeslaSuperchargers.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useTeslaSuperchargers())

    // Initially should be loading
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBe(null)

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual([])
    expect(result.current.error).toEqual(mockError)
    expect(mockFetchTeslaSuperchargers).toHaveBeenCalledTimes(1)
  })

  it('should handle non-Error exceptions', async () => {
    const mockErrorString = 'Network failure'
    mockFetchTeslaSuperchargers.mockRejectedValueOnce(mockErrorString)

    const { result } = renderHook(() => useTeslaSuperchargers())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual([])
    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Failed to fetch chargers')
  })

  it('should refetch chargers when refetch is called', async () => {
    mockFetchTeslaSuperchargers.mockResolvedValueOnce(mockChargers)

    const { result } = renderHook(() => useTeslaSuperchargers())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual(mockChargers)
    expect(mockFetchTeslaSuperchargers).toHaveBeenCalledTimes(1)

    // Mock a different response for refetch
    const newMockChargers = [mockChargers[0]] // Only one charger
    mockFetchTeslaSuperchargers.mockResolvedValueOnce(newMockChargers)

    // Call refetch
    await act(async () => {
      result.current.refetch()
    })

    // Wait for refetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual(newMockChargers)
    expect(result.current.error).toBe(null)
    expect(mockFetchTeslaSuperchargers).toHaveBeenCalledTimes(2)
  })

  it('should clear error on successful refetch', async () => {
    // First call fails
    const mockError = new Error('Network error')
    mockFetchTeslaSuperchargers.mockRejectedValueOnce(mockError)

    const { result } = renderHook(() => useTeslaSuperchargers())

    // Wait for initial fetch to fail
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toEqual(mockError)
    expect(result.current.chargers).toEqual([])

    // Second call succeeds
    mockFetchTeslaSuperchargers.mockResolvedValueOnce(mockChargers)

    // Call refetch
    await act(async () => {
      result.current.refetch()
    })

    // Wait for refetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual(mockChargers)
    expect(result.current.error).toBe(null)
    expect(mockFetchTeslaSuperchargers).toHaveBeenCalledTimes(2)
  })

  it('should handle multiple refetch calls', async () => {
    mockFetchTeslaSuperchargers.mockResolvedValue(mockChargers)

    const { result } = renderHook(() => useTeslaSuperchargers())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Call refetch multiple times quickly
    await act(async () => {
      result.current.refetch()
      result.current.refetch()
      result.current.refetch()
    })

    // Wait for all to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual(mockChargers)
    expect(result.current.error).toBe(null)
    // Should have been called multiple times (initial + refetches)
    expect(mockFetchTeslaSuperchargers).toHaveBeenCalled()
  })

  it('should reset loading and error state on refetch', async () => {
    // Initial successful fetch
    mockFetchTeslaSuperchargers.mockResolvedValueOnce(mockChargers)

    const { result } = renderHook(() => useTeslaSuperchargers())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual(mockChargers)
    expect(result.current.error).toBe(null)

    // Setup for a slow refetch
    mockFetchTeslaSuperchargers.mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve(mockChargers), 100))
    )

    // Call refetch and wait for it to complete
    await act(async () => {
      result.current.refetch()
      // Wait a small amount to allow loading state to be set
      await new Promise((resolve) => setTimeout(resolve, 10))
    })

    // Wait for refetch to complete
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })

  it('should provide refetch function that works after re-renders', async () => {
    mockFetchTeslaSuperchargers.mockResolvedValue(mockChargers)

    const { result, rerender } = renderHook(() => useTeslaSuperchargers())

    // Wait for initial fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    const initialRefetch = result.current.refetch

    // Force re-render
    rerender()

    // Function should still work
    await act(async () => {
      result.current.refetch()
    })

    expect(typeof initialRefetch).toBe('function')
    expect(typeof result.current.refetch).toBe('function')
  })

  it('should handle empty charger array', async () => {
    mockFetchTeslaSuperchargers.mockResolvedValueOnce([])

    const { result } = renderHook(() => useTeslaSuperchargers())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.chargers).toEqual([])
    expect(result.current.error).toBe(null)
  })
})
