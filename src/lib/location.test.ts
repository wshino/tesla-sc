import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  calculateDistance,
  kmToMiles,
  formatDistance,
  getUserPreferredDistanceUnit,
  getFormattedDistance,
} from './location'

describe('location utilities', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points correctly', () => {
      // Distance between San Francisco and Los Angeles (approximately 559 km)
      const distance = calculateDistance(37.7749, -122.4194, 34.0522, -118.2437)
      expect(distance).toBeCloseTo(559.12, 0)
    })

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(37.7749, -122.4194, 37.7749, -122.4194)
      expect(distance).toBe(0)
    })

    it('should calculate distance across hemispheres', () => {
      // Distance between New York and Sydney (approximately 15989 km)
      const distance = calculateDistance(40.7128, -74.006, -33.8688, 151.2093)
      expect(distance).toBeCloseTo(15989, 0)
    })
  })

  describe('kmToMiles', () => {
    it('should convert kilometers to miles correctly', () => {
      expect(kmToMiles(1)).toBeCloseTo(0.621371, 6)
      expect(kmToMiles(10)).toBeCloseTo(6.21371, 5)
      expect(kmToMiles(100)).toBeCloseTo(62.1371, 4)
    })

    it('should handle zero', () => {
      expect(kmToMiles(0)).toBe(0)
    })
  })

  describe('formatDistance', () => {
    it('should format distance in kilometers', () => {
      expect(formatDistance(10.567, 'km')).toBe('10.6 km')
      expect(formatDistance(10.567, 'km', 2)).toBe('10.57 km')
      expect(formatDistance(10.567, 'km', 0)).toBe('11 km')
    })

    it('should format distance in miles', () => {
      expect(formatDistance(10, 'miles')).toBe('6.2 mi')
      expect(formatDistance(10, 'miles', 2)).toBe('6.21 mi')
      expect(formatDistance(10, 'miles', 0)).toBe('6 mi')
    })

    it('should use default decimal places', () => {
      expect(formatDistance(10.567, 'km')).toBe('10.6 km')
      expect(formatDistance(10.567, 'miles')).toBe('6.6 mi')
    })
  })

  describe('getUserPreferredDistanceUnit', () => {
    let originalNavigator: typeof navigator

    beforeEach(() => {
      originalNavigator = global.navigator
    })

    afterEach(() => {
      global.navigator = originalNavigator
    })

    it('should return miles for US locale', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'en-US' },
        writable: true,
      })
      expect(getUserPreferredDistanceUnit()).toBe('miles')
    })

    it('should return miles for UK locale', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'en-GB' },
        writable: true,
      })
      expect(getUserPreferredDistanceUnit()).toBe('miles')
    })

    it('should return km for Japanese locale', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'ja-JP' },
        writable: true,
      })
      expect(getUserPreferredDistanceUnit()).toBe('km')
    })

    it('should return km for French locale', () => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'fr-FR' },
        writable: true,
      })
      expect(getUserPreferredDistanceUnit()).toBe('km')
    })

    it('should handle locale without country code', () => {
      expect(getUserPreferredDistanceUnit('en')).toBe('km')
      expect(getUserPreferredDistanceUnit('US')).toBe('miles')
    })

    it('should handle custom locale parameter', () => {
      expect(getUserPreferredDistanceUnit('en-US')).toBe('miles')
      expect(getUserPreferredDistanceUnit('de-DE')).toBe('km')
    })

    it('should default to en-US when navigator is undefined', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
      })
      expect(getUserPreferredDistanceUnit()).toBe('miles')
    })
  })

  describe('getFormattedDistance', () => {
    beforeEach(() => {
      Object.defineProperty(global, 'navigator', {
        value: { language: 'en-US' },
        writable: true,
      })
    })

    it('should calculate and format distance with default unit', () => {
      // Distance between two points in San Francisco (approximately 1.3 km)
      const result = getFormattedDistance(
        37.7749,
        -122.4194,
        37.7849,
        -122.4094
      )
      expect(result).toMatch(/^\d+\.\d mi$/)
    })

    it('should calculate and format distance with specified unit', () => {
      const result = getFormattedDistance(
        37.7749,
        -122.4194,
        37.7849,
        -122.4094,
        'km'
      )
      expect(result).toMatch(/^\d+\.\d km$/)
    })

    it('should respect decimal places parameter', () => {
      const result = getFormattedDistance(
        37.7749,
        -122.4194,
        37.7849,
        -122.4094,
        'km',
        3
      )
      expect(result).toMatch(/^\d+\.\d{3} km$/)
    })

    it('should handle zero distance', () => {
      const result = getFormattedDistance(
        37.7749,
        -122.4194,
        37.7749,
        -122.4194,
        'km'
      )
      expect(result).toBe('0.0 km')
    })
  })
})
