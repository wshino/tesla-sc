import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useFavorites } from './useFavorites'
import { Charger } from '../types/charger'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

const mockCharger: Charger = {
  id: '1',
  name: 'Tesla Supercharger Tokyo',
  address: '123 Main St',
  city: 'Tokyo',
  country: 'Japan',
  location: {
    lat: 35.6762,
    lng: 139.6503,
  },
  stalls: 10,
  power: 250,
  status: 'operational',
  amenities: [],
}

const mockCharger2: Charger = {
  id: '2',
  name: 'Tesla Supercharger Osaka',
  address: '456 Second St',
  city: 'Osaka',
  country: 'Japan',
  location: {
    lat: 34.6937,
    lng: 135.5023,
  },
  stalls: 8,
  power: 250,
  status: 'operational',
  amenities: [],
}

describe('useFavorites', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with empty favorites', () => {
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])
    expect(localStorageMock.getItem).toHaveBeenCalledWith('tesla-sc-favorites')
  })

  it('should load favorites from localStorage on mount', () => {
    const storedFavorites = [
      {
        id: '1',
        name: 'Tesla Supercharger Tokyo',
        address: '123 Main St',
        city: 'Tokyo',
        country: 'Japan',
      },
    ]

    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedFavorites))

    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual(storedFavorites)
  })

  it('should handle invalid localStorage data gracefully', () => {
    localStorageMock.getItem.mockReturnValue('invalid json')

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { result } = renderHook(() => useFavorites())

    expect(result.current.favorites).toEqual([])
    expect(consoleSpy).toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should add a favorite charger', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite(mockCharger)
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0]).toEqual({
      id: '1',
      name: 'Tesla Supercharger Tokyo',
      address: '123 Main St',
      city: 'Tokyo',
      country: 'Japan',
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'tesla-sc-favorites',
      JSON.stringify(result.current.favorites)
    )
  })

  it('should not add duplicate favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite(mockCharger)
    })

    act(() => {
      result.current.addFavorite(mockCharger)
    })

    expect(result.current.favorites).toHaveLength(1)
  })

  it('should remove a favorite charger', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite(mockCharger)
      result.current.addFavorite(mockCharger2)
    })

    expect(result.current.favorites).toHaveLength(2)

    act(() => {
      result.current.removeFavorite('1')
    })

    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0].id).toBe('2')
  })

  it('should check if a charger is favorited', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite(mockCharger)
    })

    expect(result.current.isFavorite('1')).toBe(true)
    expect(result.current.isFavorite('2')).toBe(false)
  })

  it('should clear all favorites', () => {
    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite(mockCharger)
      result.current.addFavorite(mockCharger2)
    })

    expect(result.current.favorites).toHaveLength(2)

    act(() => {
      result.current.clearFavorites()
    })

    expect(result.current.favorites).toHaveLength(0)
    expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
      'tesla-sc-favorites',
      '[]'
    )
  })

  it('should handle localStorage errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })

    const { result } = renderHook(() => useFavorites())

    act(() => {
      result.current.addFavorite(mockCharger)
    })

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save favorites to localStorage:',
      expect.any(Error)
    )

    consoleSpy.mockRestore()
  })
})
