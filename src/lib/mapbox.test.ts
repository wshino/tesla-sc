import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getMapboxToken } from './mapbox'

describe('mapbox utilities', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('getMapboxToken', () => {
    it('returns token when NEXT_PUBLIC_MAPBOX_TOKEN is set', () => {
      const testToken = 'pk.test123'
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN = testToken

      const result = getMapboxToken()

      expect(result).toBe(testToken)
    })

    it('throws error when NEXT_PUBLIC_MAPBOX_TOKEN is not set', () => {
      delete process.env.NEXT_PUBLIC_MAPBOX_TOKEN

      expect(() => getMapboxToken()).toThrow(
        'Mapbox token is not defined. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.'
      )
    })

    it('throws error when NEXT_PUBLIC_MAPBOX_TOKEN is empty string', () => {
      process.env.NEXT_PUBLIC_MAPBOX_TOKEN = ''

      expect(() => getMapboxToken()).toThrow(
        'Mapbox token is not defined. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.'
      )
    })
  })
})
