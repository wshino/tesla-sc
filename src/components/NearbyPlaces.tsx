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

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      setLoading(true)
      try {
        const results = await searchNearbyPlaces({
          location: charger.location,
          radius: 400, // 400m radius (about 5 minutes walk)
          type: selectedType || undefined,
        })
        setPlaces(results)
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
      <div className="h-full w-full overflow-hidden bg-white shadow-xl md:max-h-[90vh] md:w-full md:max-w-4xl md:rounded-lg z-[1001]">
        <div className="border-b p-4 md:p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h2 className="text-lg font-bold text-gray-900 md:text-2xl">
                Nearby Places
              </h2>
              <p className="mt-1 text-sm text-gray-600 md:text-base">{charger.name}</p>
              <p className="mt-0.5 text-xs text-gray-500 md:text-sm">Within 5 min walk</p>
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

        <div className="flex-1 overflow-y-auto">
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
                  className="rounded-lg border p-4 transition-shadow hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {place.name}
                  </h3>
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
