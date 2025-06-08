import React, { useEffect, useState } from 'react'
import {
  searchNearbyPlaces,
  formatPlaceType,
  getRatingStars,
  getPriceLevel,
  type Place,
  PLACE_TYPES,
} from '@/lib/google-places'
import { Charger } from '@/types/charger'
import { getWalkingInfo } from '@/lib/location'

interface NearbyPlacesProps {
  charger: Charger
  onClose: () => void
}

export const NearbyPlaces: React.FC<NearbyPlacesProps> = ({
  charger,
  onClose,
}) => {
  const [places, setPlaces] = useState<Place[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      setLoading(true)
      try {
        const results = await searchNearbyPlaces({
          location: charger.location,
          radius: 400, // 400m radius (about 5 minutes walk)
          type: selectedType || undefined,
        })
        
        // Sort results by distance from the charger
        const sortedResults = results.sort((a, b) => {
          const distA = getWalkingInfo(
            charger.location.lat,
            charger.location.lng,
            a.geometry.location.lat,
            a.geometry.location.lng
          ).distanceMeters
          
          const distB = getWalkingInfo(
            charger.location.lat,
            charger.location.lng,
            b.geometry.location.lat,
            b.geometry.location.lng
          ).distanceMeters
          
          return distA - distB
        })
        
        setPlaces(sortedResults)
      } catch (error) {
        console.error('Error fetching nearby places:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNearbyPlaces()
  }, [charger, selectedType])

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-50 md:p-4">
      <div className="flex flex-col h-full w-full bg-white shadow-xl md:max-h-[90vh] md:w-full md:max-w-4xl md:rounded-lg z-[1001]">
        <div className="flex-shrink-0 border-b p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h2 className="text-lg font-bold text-gray-900 md:text-2xl">
                Nearby Places
              </h2>
              <p className="mt-1 text-sm text-gray-600 md:text-base">{charger.name}</p>
              <p className="mt-0.5 text-xs text-gray-500 md:text-sm">Within 400m radius</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5 md:h-6 md:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="mt-3 md:mt-4 flex overflow-x-auto gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
            <button
              onClick={() => setSelectedType('')}
              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors md:px-4 md:py-2 ${
                selectedType === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {Object.entries(PLACE_TYPES).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedType(value)}
                className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors md:px-4 md:py-2 ${
                  selectedType === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {formatPlaceType(value)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <div className="mx-auto h-10 w-10 md:h-12 md:w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-3 text-sm text-gray-600 md:text-base">Loading nearby places...</p>
            </div>
          ) : places.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No places found nearby
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 p-4 md:gap-4 md:p-6 md:grid-cols-2">
              {places.map((place) => (
                <div
                  key={place.place_id}
                  onClick={() => setSelectedPlace(place)}
                  className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-lg hover:border-blue-300"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {place.name}
                    </h3>
                    <span className="flex-shrink-0 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                      {getWalkingInfo(
                        charger.location.lat,
                        charger.location.lng,
                        place.geometry.location.lat,
                        place.geometry.location.lng
                      ).walkingTime}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{place.vicinity}</p>

                  <div className="mt-2 flex items-center gap-4 text-sm">
                    {place.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">
                          {getRatingStars(place.rating)}
                        </span>
                        <span className="text-gray-600">
                          {place.rating} ({place.user_ratings_total})
                        </span>
                      </div>
                    )}
                    {place.price_level && (
                      <span className="text-gray-600">
                        {getPriceLevel(place.price_level)}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {place.types.slice(0, 3).map((type) => (
                      <span
                        key={type}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                      >
                        {formatPlaceType(type)}
                      </span>
                    ))}
                  </div>

                  {place.opening_hours && (
                    <div className="mt-2">
                      <span
                        className={`text-sm font-medium ${
                          place.opening_hours.open_now
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {place.opening_hours.open_now ? 'Open Now' : 'Closed'}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-blue-600">
                    Click for details
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Place Details Modal */}
      {selectedPlace && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedPlace.name}
              </h3>
              <button
                onClick={() => setSelectedPlace(null)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-600">{selectedPlace.vicinity}</p>

            {/* Rating and Price */}
            <div className="mt-4 flex items-center gap-4">
              {selectedPlace.rating && (
                <div className="flex items-center gap-1">
                  <span className="text-lg text-yellow-500">
                    {getRatingStars(selectedPlace.rating)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedPlace.rating} ({selectedPlace.user_ratings_total} reviews)
                  </span>
                </div>
              )}
              {selectedPlace.price_level && (
                <span className="text-lg text-gray-600">
                  {getPriceLevel(selectedPlace.price_level)}
                </span>
              )}
            </div>

            {/* Opening Hours */}
            {selectedPlace.opening_hours && (
              <div className="mt-4">
                <span
                  className={`text-lg font-medium ${
                    selectedPlace.opening_hours.open_now
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedPlace.opening_hours.open_now ? '✓ Open Now' : '✗ Closed'}
                </span>
              </div>
            )}

            {/* Categories */}
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">Categories:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPlace.types.map((type) => (
                  <span
                    key={type}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                  >
                    {formatPlaceType(type)}
                  </span>
                ))}
              </div>
            </div>

            {/* Distance from Charger */}
            <div className="mt-4 rounded bg-blue-50 p-3">
              <p className="text-sm font-medium text-blue-800">
                Distance from {charger.name}
              </p>
              {(() => {
                const walkingInfo = getWalkingInfo(
                  charger.location.lat,
                  charger.location.lng,
                  selectedPlace.geometry.location.lat,
                  selectedPlace.geometry.location.lng
                )
                return (
                  <div className="mt-1 space-y-1">
                    <p className="text-lg font-semibold text-blue-900">
                      {walkingInfo.walkingTime}
                    </p>
                    <p className="text-sm text-blue-700">
                      {walkingInfo.distanceMeters} meters
                    </p>
                  </div>
                )
              })()}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedPlace.name)}&query_place_id=${selectedPlace.place_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
              >
                View in Google Maps
              </a>
              <button
                onClick={() => setSelectedPlace(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
