/**
 * Calculate the distance between two coordinates using the Haversine formula
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

/**
 * Convert degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert kilometers to miles
 * @param km - Distance in kilometers
 * @returns Distance in miles
 */
export function kmToMiles(km: number): number {
  return km * 0.621371
}

export type DistanceUnit = 'km' | 'miles'

/**
 * Format distance for display with appropriate unit
 * @param distanceKm - Distance in kilometers
 * @param unit - Unit to display (km or miles)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted distance string
 */
export function formatDistance(
  distanceKm: number,
  unit: DistanceUnit,
  decimals: number = 1
): string {
  if (unit === 'miles') {
    const miles = kmToMiles(distanceKm)
    return `${miles.toFixed(decimals)} mi`
  }
  return `${distanceKm.toFixed(decimals)} km`
}

/**
 * Get the user's preferred distance unit based on their locale
 * @param locale - User's locale (e.g., 'en-US', 'en-GB', 'ja-JP')
 * @returns Preferred distance unit
 */
export function getUserPreferredDistanceUnit(
  locale: string = typeof navigator !== 'undefined'
    ? navigator.language
    : 'en-US'
): DistanceUnit {
  // Countries that primarily use miles
  const milesCountries = ['US', 'GB', 'MM', 'LR']

  // Extract country code from locale (e.g., 'en-US' -> 'US')
  const countryCode = locale.split('-')[1] || locale.toUpperCase()

  return milesCountries.includes(countryCode) ? 'miles' : 'km'
}

/**
 * Calculate and format distance between two coordinates
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @param unit - Distance unit (optional, defaults to user's locale preference)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted distance string
 */
export function getFormattedDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit?: DistanceUnit,
  decimals: number = 1
): string {
  const distanceKm = calculateDistance(lat1, lon1, lat2, lon2)
  const displayUnit = unit || getUserPreferredDistanceUnit()
  return formatDistance(distanceKm, displayUnit, decimals)
}

/**
 * Calculate walking time based on distance
 * @param distanceKm - Distance in kilometers
 * @param walkingSpeedKmh - Average walking speed in km/h (default: 4.5 km/h)
 * @returns Walking time in minutes
 */
export function calculateWalkingTime(
  distanceKm: number,
  walkingSpeedKmh: number = 4.5
): number {
  return Math.round((distanceKm / walkingSpeedKmh) * 60)
}

/**
 * Format walking time for display
 * @param minutes - Walking time in minutes
 * @returns Formatted walking time string
 */
export function formatWalkingTime(minutes: number): string {
  if (minutes < 1) {
    return 'Less than 1 min'
  } else if (minutes === 1) {
    return '1 min walk'
  } else if (minutes < 60) {
    return `${minutes} min walk`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} walk`
    }
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes} min walk`
  }
}

/**
 * Get walking time and distance between two coordinates
 * @param lat1 - Latitude of the first point
 * @param lon1 - Longitude of the first point
 * @param lat2 - Latitude of the second point
 * @param lon2 - Longitude of the second point
 * @returns Object with distance in meters and walking time string
 */
export function getWalkingInfo(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): { distanceMeters: number; walkingTime: string } {
  const distanceKm = calculateDistance(lat1, lon1, lat2, lon2)
  const distanceMeters = Math.round(distanceKm * 1000)
  const walkingMinutes = calculateWalkingTime(distanceKm)
  const walkingTime = formatWalkingTime(walkingMinutes)
  
  return {
    distanceMeters,
    walkingTime,
  }
}
