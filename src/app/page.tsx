'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useGeolocation } from '@/hooks/useGeolocation'
import { findNearestChargers } from '@/lib/chargers'
import { Charger } from '@/types/charger'
import CurrentLocationButton from '@/components/CurrentLocationButton'
import ChargerList from '@/components/ChargerList'
import { useTeslaSuperchargers } from '@/hooks/useTeslaSuperchargers'

// Dynamic import for Map component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
})

export default function Home() {
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)
  const { position: location, error: geoError, getCurrentPosition } = useGeolocation({
    autoGetPosition: true,
  })
  const { chargers: allChargers, loading: chargersLoading } = useTeslaSuperchargers()
  const [displayChargers, setDisplayChargers] = useState<Charger[]>([])

  // Get location on mount
  useEffect(() => {
    getCurrentPosition()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set initial chargers when loaded
  useEffect(() => {
    if (allChargers.length > 0 && displayChargers.length === 0) {
      setDisplayChargers(allChargers)
    }
  }, [allChargers, displayChargers.length])

  // Find nearest chargers when location changes
  useEffect(() => {
    if (location && allChargers.length > 0) {
      const nearest = findNearestChargers(
        location.latitude,
        location.longitude,
        10, // Show top 10 nearest
        allChargers
      )
      setDisplayChargers(nearest)
    }
  }, [location, allChargers])

  const handleChargerSelect = (charger: Charger) => {
    setSelectedCharger(charger)
  }

  return (
    <main className="flex h-screen">
      {/* Sidebar */}
      <div className="z-10 flex w-96 flex-col bg-white shadow-lg">
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

        {/* Charger list */}
        <div className="flex-1 overflow-hidden">
          {chargersLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-600">Loading chargers...</p>
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
        <LeafletMap
          chargers={displayChargers}
          userLocation={location || undefined}
          onChargerClick={handleChargerSelect}
        />
      </div>
    </main>
  )
}
