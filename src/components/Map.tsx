'use client'

import { useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Charger } from '@/types/charger'

interface MapComponentProps {
  mapboxToken: string
  chargers?: Charger[]
  userLocation?: { latitude: number; longitude: number }
  onChargerClick?: (charger: Charger) => void
}

const MapComponent: React.FC<MapComponentProps> = ({
  mapboxToken,
  chargers = [],
  userLocation,
  onChargerClick,
}) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)

  useEffect(() => {
    if (!mapboxToken) return

    mapboxgl.accessToken = mapboxToken

    const mapInstance = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLocation?.longitude || -122.4194, userLocation?.latitude || 37.7749],
      zoom: userLocation ? 13 : 10,
    })

    // Add navigation controls
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right')

    setMap(mapInstance)

    return () => {
      mapInstance.remove()
    }
  }, [mapboxToken])

  // Update map center when user location changes
  useEffect(() => {
    if (map && userLocation) {
      map.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 13,
      })

      // Add or update user location marker
      const marker = new mapboxgl.Marker({ color: '#3B82F6' })
        .setLngLat([userLocation.longitude, userLocation.latitude])
        .addTo(map)

      return () => {
        marker.remove()
      }
    }
  }, [map, userLocation])

  // Add charger markers
  useEffect(() => {
    if (!map) return

    const markers: mapboxgl.Marker[] = []

    chargers.forEach((charger) => {
      const el = document.createElement('div')
      el.className = 'marker'
      el.innerHTML = `
        <svg width="30" height="40" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12zm0 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" fill="#E31937"/>
          <path d="M13 8h-2l-1 3h2v5l3-6h-2z" fill="white"/>
        </svg>
      `
      el.style.cursor = 'pointer'
      el.style.transform = 'translate(-50%, -100%)'

      el.addEventListener('click', () => {
        setSelectedCharger(charger)
        onChargerClick?.(charger)
      })

      const marker = new mapboxgl.Marker(el)
        .setLngLat([charger.location.lng, charger.location.lat])
        .addTo(map)

      markers.push(marker)
    })

    return () => {
      markers.forEach(marker => marker.remove())
    }
  }, [map, chargers, onChargerClick])

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full" />
      
      {/* Selected charger popup */}
      {selectedCharger && (
        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-sm z-10">
          <button
            onClick={() => setSelectedCharger(null)}
            className="float-right text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
          <h3 className="text-lg font-semibold">{selectedCharger.name}</h3>
          <p className="mt-1 text-sm text-gray-600">{selectedCharger.address}</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              <span className="font-medium">Stalls:</span> {selectedCharger.stalls}
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span>
              <span className={`ml-1 ${selectedCharger.status === 'operational' ? 'text-green-600' : 'text-gray-600'}`}>
                {selectedCharger.status}
              </span>
            </p>
            {selectedCharger.amenities.length > 0 && (
              <div className="text-sm">
                <span className="font-medium">Amenities:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedCharger.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="rounded-full bg-gray-100 px-2 py-0.5 text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                  {selectedCharger.amenities.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{selectedCharger.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MapComponent