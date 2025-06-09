'use client'

import { useState, useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Charger } from '@/types/charger'

// Fix Leaflet default marker icons
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  })
}

/**
 * Props for the LeafletMap component
 */
interface LeafletMapProps {
  /** Array of Tesla Supercharger locations to display as markers */
  chargers?: Charger[]
  /** User's current location for centering the map and showing location marker */
  userLocation?: { latitude: number; longitude: number }
  /** Callback function when a charger marker is clicked */
  onChargerClick?: (charger: Charger) => void
}

/**
 * LeafletMap Component
 * 
 * Interactive map component using Leaflet to display:
 * - Tesla Supercharger locations as custom markers
 * - User's current location with pulsing animation
 * - Popup information for each charger
 * - Selected charger details panel
 * 
 * Features:
 * - No API key required (uses OpenStreetMap)
 * - Custom Tesla-themed markers
 * - Responsive design
 * - Click interactions
 * 
 * @example
 * ```tsx
 * <LeafletMap
 *   chargers={superchargerLocations}
 *   userLocation={currentLocation}
 *   onChargerClick={handleChargerSelection}
 * />
 * ```
 */
const LeafletMap: React.FC<LeafletMapProps> = ({
  chargers = [],
  userLocation,
  onChargerClick,
}) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const userMarkerRef = useRef<L.Marker | null>(null)
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null)

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Default center (San Francisco)
    const defaultCenter: [number, number] = [37.7749, -122.4194]
    const center: [number, number] = userLocation
      ? [userLocation.latitude, userLocation.longitude]
      : defaultCenter

    // Initialize map if not already created
    if (!mapRef.current) {
      mapRef.current = L.map('leaflet-map').setView(
        center,
        userLocation ? 13 : 10
      )

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update map center when user location changes
  useEffect(() => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView(
        [userLocation.latitude, userLocation.longitude],
        13
      )

      // Remove old user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove()
      }

      // Add user location marker
      const userLocationIcon = L.divIcon({
        html: `
          <div class="user-location-marker">
            <div class="pulse-ring"></div>
            <div class="dot"></div>
          </div>
        `,
        className: '',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      userMarkerRef.current = L.marker(
        [userLocation.latitude, userLocation.longitude],
        {
          icon: userLocationIcon,
        }
      )
        .bindPopup('Your current location')
        .addTo(mapRef.current)
    }
  }, [userLocation])

  // Add charger markers
  useEffect(() => {
    if (!mapRef.current) return

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    // Custom icon for Tesla Supercharger
    const superchargerIcon = L.divIcon({
      html: `
        <svg width="30" height="40" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12zm0 16c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z" fill="#E31937"/>
          <path d="M13 8h-2l-1 3h2v5l3-6h-2z" fill="white"/>
        </svg>
      `,
      className: 'supercharger-marker',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40],
    })

    // Add new markers
    chargers.forEach((charger) => {
      const marker = L.marker([charger.location.lat, charger.location.lng], {
        icon: superchargerIcon,
      })
        .bindPopup(
          `
          <div class="p-2">
            <h3 class="font-semibold">${charger.name}</h3>
            <p class="text-sm text-gray-600">${charger.address}</p>
            <div class="mt-2 space-y-1">
              <p class="text-sm">
                <span class="font-medium">Stalls:</span> ${charger.stalls}
              </p>
              <p class="text-sm">
                <span class="font-medium">Status:</span>
                <span class="ml-1 ${charger.status === 'operational' ? 'text-green-600' : 'text-gray-600'}">
                  ${charger.status}
                </span>
              </p>
            </div>
          </div>
        `
        )
        .on('click', () => {
          setSelectedCharger(charger)
          onChargerClick?.(charger)
        })
        .addTo(mapRef.current!)

      markersRef.current.push(marker)
    })
  }, [chargers, onChargerClick])

  return (
    <>
      <style jsx global>{`
        .supercharger-marker {
          background: none;
          border: none;
        }
        .user-location-marker {
          position: relative;
          width: 20px;
          height: 20px;
        }
        .user-location-marker .dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 12px;
          height: 12px;
          background-color: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .user-location-marker .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 20px;
          height: 20px;
          background-color: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }
        /* Leaflet popup styles */
        .leaflet-popup-content-wrapper {
          border-radius: 0.5rem;
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        .leaflet-popup-content {
          margin: 0 !important;
          font-family: inherit;
        }
      `}</style>

      <div className="relative h-full w-full">
        <div id="leaflet-map" className="h-full w-full" />

        {/* Selected charger info */}
        {selectedCharger && (
          <div className="absolute bottom-4 left-4 z-[1000] max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <button
              onClick={() => setSelectedCharger(null)}
              className="float-right text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold">{selectedCharger.name}</h3>
            <p className="mt-1 text-sm text-gray-600">
              {selectedCharger.address}
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">Stalls:</span>{' '}
                {selectedCharger.stalls}
              </p>
              <p className="text-sm">
                <span className="font-medium">Status:</span>
                <span
                  className={`ml-1 ${selectedCharger.status === 'operational' ? 'text-green-600' : 'text-gray-600'}`}
                >
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
    </>
  )
}

export default LeafletMap
