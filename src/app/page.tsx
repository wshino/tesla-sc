'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useGeolocation } from '@/hooks/useGeolocation'
import { loadAllChargers, findNearestChargers } from '@/lib/chargers'
import { Charger } from '@/types/charger'
import CurrentLocationButton from '@/components/CurrentLocationButton'
import ChargerList from '@/components/ChargerList'

// Dynamic import for Map component to avoid SSR issues
const LeafletMap = dynamic(() => import('@/components/LeafletMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
})

export default function Home() {
  const [chargers, setChargers] = useState<Charger[]>([])
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)
  const { position: location, error: geoError } = useGeolocation()

  // Load chargers on mount
  useEffect(() => {
    const loadChargers = async () => {
      const allChargers = await loadAllChargers()
      setChargers(allChargers)
    }
    loadChargers()
  }, [])

  // Find nearest chargers when location changes
  useEffect(() => {
    if (location) {
      const nearest = findNearestChargers(
        location.latitude,
        location.longitude,
        10 // Show top 10 nearest
      )
      setChargers(nearest)
    }
  }, [location])

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
          <ChargerList
            chargers={chargers}
            onChargerSelect={handleChargerSelect}
            selectedChargerId={selectedCharger?.id}
            userLocation={location || undefined}
          />
        </div>
      </div>

      {/* Map */}
      <div className="relative flex-1">
        <LeafletMap
          chargers={chargers}
          userLocation={location || undefined}
          onChargerClick={handleChargerSelect}
        />
      </div>
    </main>
  )
}
