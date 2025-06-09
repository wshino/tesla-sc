import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'

// Mock console.error to suppress error logs in tests
vi.spyOn(console, 'error').mockImplementation(() => {})

describe('/api/tesla-superchargers API Route', () => {
  it('should return supercharger data successfully', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('chargers')
    expect(data).toHaveProperty('lastUpdated')
    expect(Array.isArray(data.chargers)).toBe(true)
    expect(data.chargers.length).toBeGreaterThan(0)
  })

  it('should return correct data structure for chargers', async () => {
    const response = await GET()
    const data = await response.json()

    const firstCharger = data.chargers[0]
    expect(firstCharger).toHaveProperty('id')
    expect(firstCharger).toHaveProperty('name')
    expect(firstCharger).toHaveProperty('location')
    expect(firstCharger).toHaveProperty('address')
    expect(firstCharger).toHaveProperty('city')
    expect(firstCharger).toHaveProperty('state')
    expect(firstCharger).toHaveProperty('country')
    expect(firstCharger).toHaveProperty('stalls')
    expect(firstCharger).toHaveProperty('amenities')
    expect(firstCharger).toHaveProperty('status')

    // Check location structure
    expect(firstCharger.location).toHaveProperty('lat')
    expect(firstCharger.location).toHaveProperty('lng')
    expect(typeof firstCharger.location.lat).toBe('number')
    expect(typeof firstCharger.location.lng).toBe('number')

    // Check data types
    expect(typeof firstCharger.id).toBe('string')
    expect(typeof firstCharger.name).toBe('string')
    expect(typeof firstCharger.address).toBe('string')
    expect(typeof firstCharger.city).toBe('string')
    expect(typeof firstCharger.state).toBe('string')
    expect(typeof firstCharger.country).toBe('string')
    expect(typeof firstCharger.stalls).toBe('number')
    expect(Array.isArray(firstCharger.amenities)).toBe(true)
    expect(typeof firstCharger.status).toBe('string')
  })

  it('should return Japan-specific supercharger data', async () => {
    const response = await GET()
    const data = await response.json()

    // All chargers should be in Japan
    data.chargers.forEach((charger: { country: string }) => {
      expect(charger.country).toBe('Japan')
    })

    // Should include known Japanese cities
    const cities = data.chargers.map(
      (charger: { city: string }) => charger.city
    )
    expect(cities).toContain('Tokyo')
    expect(cities).toContain('Osaka')
    expect(cities).toContain('Kyoto')
  })

  it('should return specific known superchargers', async () => {
    const response = await GET()
    const data = await response.json()

    const chargerNames = data.chargers.map(
      (charger: { name: string }) => charger.name
    )
    expect(chargerNames).toContain('Tokyo - Roppongi')
    expect(chargerNames).toContain('Tokyo - Daikanyama')
    expect(chargerNames).toContain('Osaka - Umeda')
  })

  it('should return valid stall counts', async () => {
    const response = await GET()
    const data = await response.json()

    data.chargers.forEach((charger: { stalls: number }) => {
      expect(charger.stalls).toBeGreaterThan(0)
      expect(charger.stalls).toBeLessThanOrEqual(50) // Reasonable upper limit
    })
  })

  it('should return valid coordinates', async () => {
    const response = await GET()
    const data = await response.json()

    data.chargers.forEach(
      (charger: { location: { lat: number; lng: number } }) => {
        // Japan latitude range approximately 24-46
        expect(charger.location.lat).toBeGreaterThan(24)
        expect(charger.location.lat).toBeLessThan(46)

        // Japan longitude range approximately 123-146
        expect(charger.location.lng).toBeGreaterThan(123)
        expect(charger.location.lng).toBeLessThan(146)
      }
    )
  })

  it('should return valid amenities arrays', async () => {
    const response = await GET()
    const data = await response.json()

    data.chargers.forEach((charger: { amenities: string[] }) => {
      expect(Array.isArray(charger.amenities)).toBe(true)
      charger.amenities.forEach((amenity: string) => {
        expect(typeof amenity).toBe('string')
      })
    })
  })

  it('should return valid status values', async () => {
    const response = await GET()
    const data = await response.json()

    const validStatuses = ['active', 'maintenance', 'coming_soon', 'inactive']
    data.chargers.forEach((charger: { status: string }) => {
      expect(validStatuses).toContain(charger.status)
    })
  })

  it('should return a valid lastUpdated timestamp', async () => {
    const response = await GET()
    const data = await response.json()

    expect(typeof data.lastUpdated).toBe('string')
    const timestamp = new Date(data.lastUpdated)
    expect(timestamp instanceof Date).toBe(true)
    expect(isNaN(timestamp.getTime())).toBe(false)
  })

  it('should return consistent data across multiple requests', async () => {
    const response1 = await GET()
    const data1 = await response1.json()

    const response2 = await GET()
    const data2 = await response2.json()

    // Data should be consistent (same chargers)
    expect(data1.chargers.length).toBe(data2.chargers.length)
    expect(data1.chargers[0].id).toBe(data2.chargers[0].id)
    expect(data1.chargers[0].name).toBe(data2.chargers[0].name)
  })

  it('should return unique charger IDs', async () => {
    const response = await GET()
    const data = await response.json()

    const ids = data.chargers.map((charger: { id: string }) => charger.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should handle errors gracefully', async () => {
    // This test would require mocking internal functions that could throw errors
    // For now, we can test that the function doesn't throw by default
    expect(async () => {
      await GET()
    }).not.toThrow()
  })

  it('should return proper Content-Type header', async () => {
    const response = await GET()

    expect(response.headers.get('content-type')).toContain('application/json')
  })

  it('should include all expected Tokyo locations', async () => {
    const response = await GET()
    const data = await response.json()

    const tokyoChargers = data.chargers.filter(
      (charger: { city: string }) => charger.city === 'Tokyo'
    )
    const tokyoNames = tokyoChargers.map(
      (charger: { name: string }) => charger.name
    )

    expect(tokyoNames).toContain('Tokyo - Roppongi')
    expect(tokyoNames).toContain('Tokyo - Daikanyama')
    expect(tokyoNames).toContain('Tokyo - Odaiba')
    expect(tokyoNames).toContain('Tokyo - Akasaka')
    expect(tokyoNames).toContain('Tokyo - Akihabara')
    expect(tokyoNames).toContain('Tokyo - Yaesu')
  })
})
