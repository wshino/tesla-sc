import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { GET } from './route'

// Mock console.error to suppress error logs in tests
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

describe('/api/places/nearby API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    consoleSpy.mockClear()
  })

  const createMockRequest = (searchParams: Record<string, string>) => {
    const url = new URL('http://localhost/api/places/nearby')
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })

    return new NextRequest(url)
  }

  it('should return error for missing lat parameter', async () => {
    const request = createMockRequest({ lng: '139.7' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required parameters: lat, lng')
  })

  it('should return error for missing lng parameter', async () => {
    const request = createMockRequest({ lat: '35.6' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required parameters: lat, lng')
  })

  it('should return error for missing both lat and lng parameters', async () => {
    const request = createMockRequest({})
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required parameters: lat, lng')
  })

  it('should return error when API key is not configured', async () => {
    // Ensure API key is not set
    delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

    const request = createMockRequest({ lat: '35.6', lng: '139.7' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Google Maps API key not configured')
  })

  it('should parse search parameters correctly', async () => {
    // Test that the function can parse parameters without actually calling the API
    const request = createMockRequest({
      lat: '35.6762',
      lng: '139.6503',
      radius: '500',
      type: 'restaurant',
      keyword: 'ramen',
    })

    // Since we don't have an API key, this will fail at the API key check
    const response = await GET(request)

    // But we can verify that it got past the parameter parsing
    expect(response.status).toBe(500) // Should fail at API key check, not parameter parsing
    const data = await response.json()
    expect(data.error).toBe('Google Maps API key not configured')
  })

  it('should handle invalid coordinates gracefully', async () => {
    const request = createMockRequest({ lat: 'invalid', lng: 'invalid' })

    // Even with invalid coordinates, should fail at API key check first
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Google Maps API key not configured')
  })

  it('should return proper Content-Type header for error responses', async () => {
    const request = createMockRequest({ lat: '35.6', lng: '139.7' })
    const response = await GET(request)

    expect(response.headers.get('content-type')).toContain('application/json')
  })

  it('should handle missing optional parameters', async () => {
    // Test with only required parameters
    const request = createMockRequest({ lat: '35.6', lng: '139.7' })

    const response = await GET(request)
    const data = await response.json()

    // Should fail at API key check
    expect(response.status).toBe(500)
    expect(data.error).toBe('Google Maps API key not configured')
  })

  it('should validate required parameters before checking API key', async () => {
    // Test that parameter validation happens first
    const request = createMockRequest({})
    const response = await GET(request)
    const data = await response.json()

    // Should fail at parameter validation, not API key check
    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required parameters: lat, lng')
  })

  it('should handle empty parameter values', async () => {
    const request = createMockRequest({ lat: '', lng: '' })
    const response = await GET(request)
    const data = await response.json()

    // Empty strings are falsy, so should be treated as missing
    expect(response.status).toBe(400)
    expect(data.error).toBe('Missing required parameters: lat, lng')
  })

  it('should handle URL search params correctly', async () => {
    // Test with various parameter combinations
    const request = createMockRequest({
      lat: '35.6762',
      lng: '139.6503',
      radius: '1000', // Only some optional params
    })

    const response = await GET(request)
    const data = await response.json()

    // Should get past parameter parsing
    expect(response.status).toBe(500) // API key error
    expect(data.error).toBe('Google Maps API key not configured')
  })
})
