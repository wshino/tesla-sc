'use client'

import { useFavorites } from '@/hooks/useFavorites'
import { useTeslaSuperchargers } from '@/hooks/useTeslaSuperchargers'
import { Charger } from '@/types/charger'

interface FavoritesListProps {
  onChargerSelect?: (charger: Charger) => void
  onClose?: () => void
}

export default function FavoritesList({
  onChargerSelect,
  onClose,
}: FavoritesListProps) {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()
  const { chargers: allChargers } = useTeslaSuperchargers()

  // Get full charger data for favorites
  const favoriteChargers = favorites
    .map((fav) => allChargers.find((charger) => charger.id === fav.id))
    .filter((charger): charger is Charger => charger !== undefined)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Favorite Chargers</h2>
          {onClose && (
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
          )}
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {favorites.length} favorite{favorites.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {favorites.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center p-8">
            <svg
              className="mb-4 h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <p className="text-center text-gray-500">
              No favorite chargers yet.
              <br />
              Tap the heart icon on any charger to save it.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {favoriteChargers.map((charger) => (
              <div
                key={charger.id}
                className="p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => onChargerSelect?.(charger)}
                  >
                    <h3 className="text-sm font-semibold">{charger.name}</h3>
                    <p className="mt-1 text-xs text-gray-600">
                      {charger.address}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      {charger.city}, {charger.country}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-xs">
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
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          charger.status === 'active'
                            ? 'bg-green-500'
                            : 'bg-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeFavorite(charger.id)}
                    className="ml-4 rounded-full p-2 text-red-500 transition-colors hover:bg-red-50"
                    aria-label="Remove from favorites"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {favorites.length > 0 && (
        <div className="border-t p-4">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all favorites?')) {
                clearFavorites()
              }
            }}
            className="w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            Clear All Favorites
          </button>
        </div>
      )}
    </div>
  )
}
