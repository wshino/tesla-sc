/**
 * Google Places API integration for nearby facilities
 */

export interface Place {
  place_id: string
  name: string
  vicinity: string
  types: string[]
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  rating?: number
  user_ratings_total?: number
  price_level?: number
  opening_hours?: {
    open_now: boolean
  }
}

export interface NearbySearchParams {
  location: { lat: number; lng: number }
  radius: number
  type?: string
  keyword?: string
}


/**
 * Search for nearby places using Google Places API
 */
export async function searchNearbyPlaces({
  location,
  radius = 1000,
  type,
  keyword,
}: NearbySearchParams): Promise<Place[]> {
  const params = new URLSearchParams({
    lat: location.lat.toString(),
    lng: location.lng.toString(),
    radius: radius.toString(),
  })

  if (type) {
    params.append('type', type)
  }

  if (keyword) {
    params.append('keyword', keyword)
  }

  try {
    const response = await fetch(`/api/places/nearby?${params}`)

    if (!response.ok) {
      throw new Error('Failed to fetch nearby places')
    }

    const data = await response.json()

    return data.results || []
  } catch (error) {
    console.error('Error searching nearby places:', error)
    return []
  }
}

/**
 * Get place types for filtering
 */
export const PLACE_TYPES = {
  RESTAURANT: 'restaurant',
  CAFE: 'cafe',
  SHOPPING: 'shopping_mall',
  PARKING: 'parking',
  HOTEL: 'lodging',
  ENTERTAINMENT: 'tourist_attraction',
  CONVENIENCE_STORE: 'convenience_store',
  GAS_STATION: 'gas_station',
} as const

/**
 * Format place type for display
 */
export function formatPlaceType(type: string): string {
  const typeMap: Record<string, string> = {
    restaurant: 'Restaurant',
    cafe: 'Cafe',
    shopping_mall: 'Shopping',
    parking: 'Parking',
    lodging: 'Hotel',
    tourist_attraction: 'Entertainment',
    convenience_store: 'Convenience Store',
    gas_station: 'Gas Station',
  }

  return (
    typeMap[type] ||
    type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  )
}

/**
 * Get rating stars display
 */
export function getRatingStars(rating: number): string {
  const fullStars = Math.floor(rating)
  const halfStar = rating % 1 >= 0.5 ? 1 : 0
  const emptyStars = 5 - fullStars - halfStar

  return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars)
}

/**
 * Get price level display
 */
export function getPriceLevel(priceLevel?: number): string {
  if (!priceLevel) return ''
  return '¥'.repeat(priceLevel)
}
