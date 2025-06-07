'use client'

import React from 'react'
import { useGeolocation } from '@/hooks/useGeolocation'

export interface CurrentLocationButtonProps {
  onLocationReceived?: (latitude: number, longitude: number) => void
  onError?: (error: { code: number; message: string }) => void
  className?: string
  loadingText?: string
  buttonText?: string
  errorMessages?: {
    denied?: string
    unavailable?: string
    timeout?: string
    default?: string
  }
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onLocationReceived,
  onError,
  className = '',
  loadingText = 'Getting location...',
  buttonText = 'Use Current Location',
  errorMessages = {
    denied:
      'Location permission denied. Please enable location access in your browser settings.',
    unavailable: 'Location information is unavailable.',
    timeout: 'Location request timed out. Please try again.',
    default: 'An error occurred while getting your location.',
  },
}) => {
  const { position, loading, error, permissionState, getCurrentPosition } =
    useGeolocation()

  React.useEffect(() => {
    if (position && onLocationReceived) {
      onLocationReceived(position.latitude, position.longitude)
    }
  }, [position, onLocationReceived])

  React.useEffect(() => {
    if (error && onError) {
      onError(error)
    }
  }, [error, onError])

  const handleClick = () => {
    getCurrentPosition()
  }

  const getErrorMessage = () => {
    if (!error) return null

    switch (error.code) {
      case 1: // PERMISSION_DENIED
        return errorMessages.denied
      case 2: // POSITION_UNAVAILABLE
        return errorMessages.unavailable
      case 3: // TIMEOUT
        return errorMessages.timeout
      default:
        return errorMessages.default
    }
  }

  const errorMessage = getErrorMessage()

  return (
    <div className="current-location-button-container">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`current-location-button ${className} ${
          loading ? 'loading' : ''
        } ${error ? 'error' : ''}`}
        aria-label={buttonText}
        aria-busy={loading}
        aria-disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="-ml-1 mr-3 inline h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {loadingText}
          </>
        ) : (
          <>
            <svg
              className="mr-2 inline h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
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
            {buttonText}
          </>
        )}
      </button>
      {errorMessage && (
        <div
          className="error-message mt-2 text-sm text-red-600"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </div>
      )}
      {permissionState === 'denied' && !error && (
        <div
          className="permission-denied-message mt-2 text-sm text-yellow-600"
          role="alert"
          aria-live="polite"
        >
          Location access is currently blocked. Click the button to try again.
        </div>
      )}
    </div>
  )
}

export default CurrentLocationButton
