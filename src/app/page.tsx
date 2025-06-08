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
import { NearbyPlaces } from '@/components/NearbyPlaces'

// Dynamic import for Map component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
})

export default function Home() {
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    amenities: [],
    country: '',
    minStalls: 0,
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
  }, [allChargers, searchQuery, filters, location])

  // Update display chargers when filtered chargers change
  useEffect(() => {
    setDisplayChargers(filteredChargers)
  }, [filteredChargers])

  const handleChargerSelect = (charger: Charger) => {
    setSelectedCharger(charger)
    setShowNearbyPlaces(true)
  }

  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <main className="relative flex h-screen">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-lg md:hidden"
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
            d={sidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`absolute z-40 flex h-full w-full transform flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:w-96 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} `}
      >
        {/* Header with location button */}
        <div className="border-b p-4">
          <h1 className="mb-4 text-2xl font-bold">Tesla Supercharger Finder</h1>
          <CurrentLocationButton
            onLocationReceived={(latitude, longitude) => {
              console.log('Location received:', { latitude, longitude })
            }}
            onError={(error) => {
              console.error('Location error:', error)
            }}
          />
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
      <div className="relative flex-1">
        {/* Mobile overlay when sidebar is open */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-30 bg-black bg-opacity-50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <LeafletMap
          chargers={displayChargers}
          userLocation={location || undefined}
          onChargerClick={handleChargerSelect}
        />
      </div>

      {/* Nearby Places Modal */}
      {showNearbyPlaces && selectedCharger && (
        <NearbyPlaces
          charger={selectedCharger}
          onClose={() => setShowNearbyPlaces(false)}
        />
      )}
    </main>
  )
}
