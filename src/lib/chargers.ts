import type { Charger } from '../types/charger'
import chargersData from '../data/superchargers.json'

/**
 * Load all chargers from the JSON data
 * @returns Array of all chargers
 */
export function loadAllChargers(): Charger[] {
  return chargersData as Charger[]
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

/**
 * Convert degrees to radians
 * @param degrees Degrees to convert
 * @returns Radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Find nearest chargers given coordinates
 * @param lat Latitude
 * @param lng Longitude
 * @param limit Maximum number of chargers to return (default: 5)
 * @param chargers Optional array of chargers to search from (defaults to all chargers)
 * @returns Array of nearest chargers with distance
 */
export function findNearestChargers(
  lat: number,
  lng: number,
  limit: number = 5,
  chargers?: Charger[]
): Array<Charger & { distance: number }> {
  const chargersToSearch = chargers || loadAllChargers()

  const chargersWithDistance = chargersToSearch.map((charger) => ({
    ...charger,
    distance: calculateDistance(
      lat,
      lng,
      charger.location.lat,
      charger.location.lng
    ),
  }))

  // Sort by distance and return the nearest ones
  return chargersWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}

/**
 * Filter chargers by amenities
 * @param amenities Array of amenities to filter by
 * @param matchAll If true, charger must have all amenities. If false, any amenity match is sufficient
 * @returns Array of chargers matching the amenity criteria
 */
export function filterChargersByAmenities(
  amenities: string[],
  matchAll: boolean = false
): Charger[] {
  const chargers = loadAllChargers()

  if (amenities.length === 0) {
    return chargers
  }

  return chargers.filter((charger) => {
    if (matchAll) {
      // Charger must have all specified amenities
      return amenities.every((amenity) => charger.amenities.includes(amenity))
    } else {
      // Charger must have at least one of the specified amenities
      return amenities.some((amenity) => charger.amenities.includes(amenity))
    }
  })
}

/**
 * Get chargers by status
 * @param status Status to filter by
 * @returns Array of chargers with the specified status
 */
export function getChargersByStatus(status: Charger['status']): Charger[] {
  const chargers = loadAllChargers()
  return chargers.filter((charger) => charger.status === status)
}

/**
 * Get chargers by country
 * @param country Country to filter by
 * @returns Array of chargers in the specified country
 */
export function getChargersByCountry(country: string): Charger[] {
  const chargers = loadAllChargers()
  return chargers.filter((charger) => charger.country === country)
}

/**
 * Get charger by ID
 * @param id Charger ID
 * @returns Charger or undefined if not found
 */
export function getChargerById(id: string): Charger | undefined {
  const chargers = loadAllChargers()
  return chargers.find((charger) => charger.id === id)
}
