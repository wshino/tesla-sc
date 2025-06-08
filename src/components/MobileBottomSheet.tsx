import React, { useState } from 'react'
import { Charger } from '@/types/charger'
import { formatDistance } from '@/lib/location'

interface MobileBottomSheetProps {
  chargers: Charger[]
  selectedCharger: Charger | null
  userLocation?: { latitude: number; longitude: number }
  onChargerSelect: (charger: Charger) => void
  isOpen: boolean
  onClose: () => void
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  chargers,
  selectedCharger,
  userLocation,
  onChargerSelect,
  isOpen,
  onClose,
}) => {
  const [expandedView, setExpandedView] = useState(false)

  // Calculate distances if user location is available
  const chargersWithDistance = chargers.map((charger) => ({
    ...charger,
    distance: userLocation
      ? calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          charger.location.lat,
          charger.location.lng
        )
      : null,
  }))

  // Sort by distance if available
  const sortedChargers = [...chargersWithDistance].sort((a, b) => {
    if (a.distance === null || b.distance === null) return 0
    return a.distance - b.distance
  })

  const handleDragEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0]
    const dragDistance = touch.clientY - window.innerHeight * 0.6

    if (dragDistance > 100) {
      setExpandedView(false)
    } else if (dragDistance < -100) {
      setExpandedView(true)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />

      {/* Bottom Sheet */}
      <div
        className={`relative rounded-t-2xl bg-white shadow-2xl transition-all duration-300 ${
          expandedView ? 'h-[85vh]' : 'h-[40vh]'
        }`}
        onTouchEnd={handleDragEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pb-2 pt-3">
          <div className="h-1 w-12 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="border-b px-4 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Superchargers ({chargers.length})
            </h2>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="close"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-xs text-blue-600">
            Tap a charger to see nearby spots
          </p>
        </div>

        {/* Charger List */}
        <div
          className="overflow-y-auto"
          style={{ height: 'calc(100% - 80px)' }}
        >
          {sortedChargers.map((charger) => (
            <div
              key={charger.id}
              onClick={() => onChargerSelect(charger)}
              className={`border-b p-4 active:bg-gray-50 ${
                selectedCharger?.id === charger.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-medium">{charger.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{charger.city}</p>

                  <div className="mt-2 flex items-center gap-3 text-sm">
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

                    {charger.distance !== null &&
                      charger.distance !== undefined && (
                        <span className="font-medium text-blue-600">
                          {formatDistance(charger.distance, 'km')}
                        </span>
                      )}
                  </div>
                </div>

                <div className="ml-3">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      charger.status === 'active'
                        ? 'bg-green-500'
                        : 'bg-gray-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simple distance calculation function
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
