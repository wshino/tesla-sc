'use client'

import { Charger } from '@/types/charger'
import { formatDistance } from '@/lib/location'

/**
 * Props for the ChargerList component
 */
interface ChargerListProps {
  /** Array of Tesla Supercharger locations to display */
  chargers: Charger[]
  /** Callback function when a charger is selected */
  onChargerSelect: (charger: Charger) => void
  /** ID of the currently selected charger for highlighting */
  selectedChargerId?: string
  /** User's current location for distance calculations */
  userLocation?: { latitude: number; longitude: number }
}

/**
 * ChargerList Component
 * 
 * Displays a scrollable list of Tesla Supercharger locations with:
 * - Distance from user's current location (if available)
 * - Number of charging stalls
 * - Available amenities
 * - Operational status
 * 
 * @example
 * ```tsx
 * <ChargerList
 *   chargers={superchargerData}
 *   onChargerSelect={handleChargerSelection}
 *   selectedChargerId={selectedId}
 *   userLocation={currentLocation}
 * />
 * ```
 */
export default function ChargerList({
  chargers,
  onChargerSelect,
  selectedChargerId,
  userLocation,
}: ChargerListProps) {
  // Calculate distances if user location is available
  const chargersWithDistance = chargers.map((charger) => ({
    ...charger,
    distance: userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          charger.location.lat,
          charger.location.lng
        )
      : null,
  }))

  // Sort by distance if available
  const sortedChargers = [...chargersWithDistance].sort((a, b) => {
    if (a.distance === null || b.distance === null) return 0
    return a.distance - b.distance
  })

  return (
    <div className="h-full overflow-y-auto">
      <div className="border-b p-3 sm:p-4">
        <h2 className="text-lg font-semibold sm:text-xl">
          Nearby Superchargers
        </h2>
        <p className="mt-1 text-xs text-gray-600 sm:text-sm">
          {chargers.length} locations found
        </p>
        <p className="mt-1 text-xs text-blue-600 sm:text-sm">
          Click a charger to see nearby entertainment spots
        </p>
      </div>

      <div className="divide-y">
        {sortedChargers.map((charger) => (
          <div
            key={charger.id}
            onClick={() => onChargerSelect(charger)}
            className={`cursor-pointer p-3 transition-colors hover:bg-gray-50 sm:p-4 ${
              selectedChargerId === charger.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-semibold sm:text-base">
                  {charger.name}
                </h3>
                <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                  {charger.address}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    {charger.stalls} stalls
                  </span>

                  {charger.distance !== null &&
                    charger.distance !== undefined && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {formatDistance(charger.distance, 'km')}
                      </span>
                    )}
                </div>

                {charger.amenities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {charger.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] sm:text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-4">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    charger.status === 'operational'
                      ? 'bg-green-500'
                      : 'bg-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Simple distance calculation function (should import from location utils)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
