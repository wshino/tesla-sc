import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
const PLACES_API_BASE = 'https://maps.googleapis.com/maps/api/place'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const radius = searchParams.get('radius') || '400'
    const type = searchParams.get('type')
    const keyword = searchParams.get('keyword')

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Missing required parameters: lat, lng' },
        { status: 400 }
      )
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured' },
        { status: 500 }
      )
    }

    const params = new URLSearchParams({
      location: `${lat},${lng}`,
      radius,
      key: GOOGLE_MAPS_API_KEY,
    })

    if (type) {
      params.append('type', type)
    }

    if (keyword) {
      params.append('keyword', keyword)
    }

    const response = await fetch(
      `${PLACES_API_BASE}/nearbysearch/json?${params}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch nearby places from Google')
    }

    const data = await response.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status)
      return NextResponse.json(
        { error: `Google Places API error: ${data.status}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      results: data.results || [],
      status: data.status,
    })
  } catch (error) {
    console.error('Error in places API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch nearby places' },
      { status: 500 }
    )
  }
}
