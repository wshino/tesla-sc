'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useGeolocation } from '@/hooks/useGeolocation'
import { loadAllChargers, findNearestChargers } from '@/lib/chargers'
import { Charger } from '@/types/charger'
import CurrentLocationButton from '@/components/CurrentLocationButton'
import ChargerList from '@/components/ChargerList'

// Dynamic import for Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-gray-100" />,
})

export default function Home() {
  const [chargers, setChargers] = useState<Charger[]>([])
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)
  const [mapboxToken, setMapboxToken] = useState<string>('')
  const { position: location, error: geoError } = useGeolocation()

  // Load chargers on mount
  useEffect(() => {
    const loadChargers = async () => {
      const allChargers = await loadAllChargers()
      setChargers(allChargers)
    }
    loadChargers()
  }, [])

  // Get Mapbox token
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    if (!token) {
      console.error(
        'Mapbox token not found. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file'
      )
    } else {
      setMapboxToken(token)
    }
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

  if (!mapboxToken) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Configuration Required</h1>
          <p className="text-gray-600">
            Please add your Mapbox token to the .env.local file:
          </p>
          <pre className="mt-2 rounded bg-gray-100 p-2">
            NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here
          </pre>
        </div>
      </div>
    )
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
        <Map
          mapboxToken={mapboxToken}
          chargers={chargers}
          userLocation={location || undefined}
          onChargerClick={handleChargerSelect}
        />
      </div>
    </main>
  )
}
