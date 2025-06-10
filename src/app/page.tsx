'use client'

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useGeolocation } from '@/hooks/useGeolocation'
import { findNearestChargers } from '@/lib/chargers'
import { Charger } from '@/types/charger'
import CurrentLocationButton from '@/components/CurrentLocationButton'
import ChargerList from '@/components/ChargerList'
import SearchFilter, { FilterOptions } from '@/components/SearchFilter'
import { useTeslaSuperchargers } from '@/hooks/useTeslaSuperchargers'
import { useFavorites } from '@/hooks/useFavorites'
import { NearbyPlaces } from '@/components/NearbyPlaces'
import { MobileBottomSheet } from '@/components/MobileBottomSheet'
import FavoritesList from '@/components/FavoritesList'

// Dynamic import for Map component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
})

export default function Home() {
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    amenities: [],
    country: '',
    minStalls: 0,
    favoritesOnly: false,
  })

  const {
    position: location,
    error: geoError,
    getCurrentPosition,
  } = useGeolocation({
    autoGetPosition: true,
  })
  const { chargers: allChargers, loading: chargersLoading } =
    useTeslaSuperchargers()
  const { isFavorite } = useFavorites()
  const [displayChargers, setDisplayChargers] = useState<Charger[]>([])

  // Get location on mount
  useEffect(() => {
    getCurrentPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Get unique countries and amenities for filters
  const availableCountries = useMemo(() => {
    const countries = new Set(allChargers.map((c) => c.country))
    return Array.from(countries).sort()
  }, [allChargers])

  const availableAmenities = useMemo(() => {
    const amenities = new Set(allChargers.flatMap((c) => c.amenities))
    return Array.from(amenities).sort()
  }, [allChargers])

  // Filter and search chargers
  const filteredChargers = useMemo(() => {
    let filtered = [...allChargers]

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (charger) =>
          charger.name.toLowerCase().includes(query) ||
          charger.city.toLowerCase().includes(query) ||
          charger.address.toLowerCase().includes(query)
      )
    }

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter((charger) =>
        filters.status.includes(charger.status)
      )
    }

    // Apply country filter
    if (filters.country) {
      filtered = filtered.filter(
        (charger) => charger.country === filters.country
      )
    }

    // Apply amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter((charger) =>
        filters.amenities.some((amenity) => charger.amenities.includes(amenity))
      )
    }

    // Apply minimum stalls filter
    if (filters.minStalls > 0) {
      filtered = filtered.filter(
        (charger) => charger.stalls >= filters.minStalls
      )
    }

    // Apply favorites only filter
    if (filters.favoritesOnly) {
      filtered = filtered.filter((charger) => isFavorite(charger.id))
    }

    // Sort by distance if location is available
    if (location) {
      return findNearestChargers(
        location.latitude,
        location.longitude,
        filtered.length,
        filtered
      )
    }

    return filtered
  }, [allChargers, searchQuery, filters, location, isFavorite])

  // Update display chargers when filtered chargers change
  useEffect(() => {
    setDisplayChargers(filteredChargers)
  }, [filteredChargers])

  const handleChargerSelect = (charger: Charger) => {
    setSelectedCharger(charger)
    setShowNearbyPlaces(true)
    setShowFavorites(false)
    // Close sidebar on mobile when selecting a charger
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main className="relative flex h-screen">
      {/* Mobile Header */}
      <div className="absolute left-0 right-0 top-0 z-40 bg-white p-4 shadow-md md:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Tesla SC Finder</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => getCurrentPosition()}
              className="rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700"
              title="Get current location"
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-lg bg-gray-100 p-2.5"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden flex-col bg-white shadow-lg md:flex md:w-96">
        {/* Header with location button */}
        <div className="border-b p-4">
          <h1 className="mb-4 text-2xl font-bold">Tesla Supercharger Finder</h1>
          <div className="flex gap-2">
            <CurrentLocationButton
              onLocationReceived={(latitude, longitude) => {
                console.log('Location received:', { latitude, longitude })
              }}
              onError={(error) => {
                console.error('Location error:', error)
              }}
            />
            <button
              onClick={() => setShowFavorites(true)}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
            >
              <svg
                className="h-5 w-5 text-red-500"
                fill="currentColor"
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
              <span className="text-sm font-medium">Favorites</span>
            </button>
          </div>
          {geoError && (
            <p className="mt-2 text-sm text-red-600">{geoError.message}</p>
          )}
        </div>

        {/* Search and Filter */}
        <SearchFilter
          onSearchChange={setSearchQuery}
          onFilterChange={setFilters}
          availableCountries={availableCountries}
          availableAmenities={availableAmenities}
        />

        {/* Charger list */}
        <div className="flex-1 overflow-hidden">
          {chargersLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Loading chargers...
                </p>
              </div>
            </div>
          ) : (
            <ChargerList
              chargers={displayChargers}
              onChargerSelect={handleChargerSelect}
              selectedChargerId={selectedCharger?.id}
              userLocation={location || undefined}
            />
          )}
        </div>
      </div>

      {/* Map */}
      <div className="relative z-0 flex-1 pt-16 md:pt-0">
        <LeafletMap
          chargers={displayChargers}
          userLocation={location || undefined}
          onChargerClick={handleChargerSelect}
        />
      </div>

      {/* Mobile Bottom Sheet */}
      <MobileBottomSheet
        chargers={displayChargers}
        selectedCharger={selectedCharger}
        userLocation={location || undefined}
        onChargerSelect={handleChargerSelect}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Nearby Places Modal */}
      {showNearbyPlaces && selectedCharger && (
        <NearbyPlaces
          charger={selectedCharger}
          onClose={() => setShowNearbyPlaces(false)}
        />
      )}

      {/* Favorites Modal */}
      {showFavorites && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 h-[600px] w-full max-w-md rounded-lg bg-white shadow-xl">
            <FavoritesList
              onChargerSelect={(charger) => {
                handleChargerSelect(charger)
                setShowFavorites(false)
              }}
              onClose={() => setShowFavorites(false)}
            />
          </div>
        </div>
      )}
    </main>
  )
}
