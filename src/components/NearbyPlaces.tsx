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
          radius: 1500, // 1.5km radius
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="border-b p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Nearby Places - {charger.name}
              </h2>
              <p className="mt-1 text-gray-600">{charger.address}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
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

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
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
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
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

        <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading nearby places...</p>
            </div>
          ) : places.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              No places found nearby
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
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
