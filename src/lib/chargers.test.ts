import { describe, it, expect } from 'vitest'
import {
  loadAllChargers,
  findNearestChargers,
  filterChargersByAmenities,
  getChargersByStatus,
  getChargersByCountry,
  getChargerById,
} from './chargers'

describe('Charger Utilities', () => {
  describe('loadAllChargers', () => {
    it('should load all chargers from JSON data', () => {
      const chargers = loadAllChargers()
      expect(chargers).toBeDefined()
      expect(Array.isArray(chargers)).toBe(true)
      expect(chargers.length).toBeGreaterThan(0)
      expect(chargers.length).toBe(23) // We have 23 chargers in our data (including Daikanyama)
    })

    it('should have valid charger structure', () => {
      const chargers = loadAllChargers()
      const firstCharger = chargers[0]

      expect(firstCharger).toHaveProperty('id')
      expect(firstCharger).toHaveProperty('name')
      expect(firstCharger).toHaveProperty('location')
      expect(firstCharger.location).toHaveProperty('lat')
      expect(firstCharger.location).toHaveProperty('lng')
      expect(firstCharger).toHaveProperty('address')
      expect(firstCharger).toHaveProperty('city')
      expect(firstCharger).toHaveProperty('state')
      expect(firstCharger).toHaveProperty('country')
      expect(firstCharger).toHaveProperty('stalls')
      expect(firstCharger).toHaveProperty('amenities')
      expect(firstCharger).toHaveProperty('status')
    })
  })

  describe('findNearestChargers', () => {
    it('should find nearest chargers to given coordinates', () => {
      // Coordinates near Los Angeles
      const lat = 34.0522
      const lng = -118.2437

      const nearestChargers = findNearestChargers(lat, lng, 3)

      expect(nearestChargers).toHaveLength(3)
      expect(nearestChargers[0]).toHaveProperty('distance')

      // Check that results are sorted by distance
      for (let i = 1; i < nearestChargers.length; i++) {
        expect(nearestChargers[i].distance).toBeGreaterThanOrEqual(
          nearestChargers[i - 1].distance
        )
      }
    })

    it('should return default 5 chargers when limit not specified', () => {
      const nearestChargers = findNearestChargers(35.6762, 139.6503) // Tokyo coordinates
      expect(nearestChargers).toHaveLength(5)
    })

    it('should handle edge case with more limit than available chargers', () => {
      const nearestChargers = findNearestChargers(35.6762, 139.6503, 100)
      const totalChargers = loadAllChargers().length
      expect(nearestChargers).toHaveLength(totalChargers)
    })

    it('should use provided chargers array if given', () => {
      const customChargers = [
        {
          id: 'test-1',
          name: 'Test Charger 1',
          location: { lat: 34.0522, lng: -118.2437 },
          address: 'Test Address 1',
          city: 'Los Angeles',
          state: 'CA',
          country: 'USA',
          stalls: 10,
          amenities: [],
          status: 'active' as const,
        },
        {
          id: 'test-2',
          name: 'Test Charger 2',
          location: { lat: 35.0522, lng: -118.2437 },
          address: 'Test Address 2',
          city: 'Test City',
          state: 'CA',
          country: 'USA',
          stalls: 5,
          amenities: [],
          status: 'active' as const,
        },
      ]

      const result = findNearestChargers(34.0522, -118.2437, 5, customChargers)

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('Test Charger 1')
      expect(result[0].distance).toBe(0)
    })
  })

  describe('filterChargersByAmenities', () => {
    it('should filter chargers by single amenity', () => {
      const chargersWithWifi = filterChargersByAmenities(['wifi'])

      expect(chargersWithWifi.length).toBeGreaterThan(0)
      chargersWithWifi.forEach((charger) => {
        expect(charger.amenities).toContain('wifi')
      })
    })

    it('should filter chargers by multiple amenities (match any)', () => {
      const chargers = filterChargersByAmenities(['wifi', 'hotels'], false)

      expect(chargers.length).toBeGreaterThan(0)
      chargers.forEach((charger) => {
        const hasWifi = charger.amenities.includes('wifi')
        const hasHotels = charger.amenities.includes('hotels')
        expect(hasWifi || hasHotels).toBe(true)
      })
    })

    it('should filter chargers by multiple amenities (match all)', () => {
      const chargers = filterChargersByAmenities(
        ['restaurants', 'restrooms'],
        true
      )

      expect(chargers.length).toBeGreaterThan(0)
      chargers.forEach((charger) => {
        expect(charger.amenities).toContain('restaurants')
        expect(charger.amenities).toContain('restrooms')
      })
    })

    it('should return all chargers when amenities array is empty', () => {
      const chargers = filterChargersByAmenities([])
      const allChargers = loadAllChargers()
      expect(chargers).toHaveLength(allChargers.length)
    })
  })

  describe('getChargersByStatus', () => {
    it('should filter chargers by active status', () => {
      const activeChargers = getChargersByStatus('active')

      expect(activeChargers.length).toBeGreaterThan(0)
      activeChargers.forEach((charger) => {
        expect(charger.status).toBe('active')
      })
    })

    it('should filter chargers by maintenance status', () => {
      const maintenanceChargers = getChargersByStatus('maintenance')

      // We have at least one charger in maintenance
      expect(maintenanceChargers.length).toBeGreaterThanOrEqual(1)
      maintenanceChargers.forEach((charger) => {
        expect(charger.status).toBe('maintenance')
      })
    })

    it('should return empty array for non-existent status', () => {
      const comingSoonChargers = getChargersByStatus('coming_soon')
      expect(comingSoonChargers).toHaveLength(0)
    })
  })

  describe('getChargersByCountry', () => {
    it('should filter chargers by USA', () => {
      const usaChargers = getChargersByCountry('USA')

      expect(usaChargers.length).toBeGreaterThan(0)
      usaChargers.forEach((charger) => {
        expect(charger.country).toBe('USA')
      })
    })

    it('should filter chargers by Japan', () => {
      const japanChargers = getChargersByCountry('Japan')

      expect(japanChargers.length).toBeGreaterThan(0)
      japanChargers.forEach((charger) => {
        expect(charger.country).toBe('Japan')
      })
    })

    it('should return empty array for non-existent country', () => {
      const nonExistentChargers = getChargersByCountry('NonExistentCountry')
      expect(nonExistentChargers).toHaveLength(0)
    })
  })

  describe('getChargerById', () => {
    it('should return charger by valid ID', () => {
      const charger = getChargerById('sc-001')

      expect(charger).toBeDefined()
      expect(charger?.id).toBe('sc-001')
      expect(charger?.name).toBe('Los Angeles - Hawthorne')
    })

    it('should return undefined for non-existent ID', () => {
      const charger = getChargerById('non-existent-id')
      expect(charger).toBeUndefined()
    })
  })
})
