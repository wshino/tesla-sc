import { useState, useEffect, useCallback } from 'react'

export interface GeolocationPosition {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface GeolocationError {
  code: number
  message: string
}

export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
  autoGetPosition?: boolean
}

export interface UseGeolocationReturn {
  position: GeolocationPosition | null
  loading: boolean
  error: GeolocationError | null
  permissionState: PermissionState | null
  getCurrentPosition: () => void
}

export const useGeolocation = (
  options: UseGeolocationOptions = {}
): UseGeolocationReturn => {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [permissionState, setPermissionState] =
    useState<PermissionState | null>(null)

  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    autoGetPosition = false,
  } = options

  // Check permission state
  useEffect(() => {
    if (!('geolocation' in navigator) || !navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      })
      return
    }

    if ('permissions' in navigator && navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((result) => {
          setPermissionState(result.state)
          result.addEventListener('change', () => {
            setPermissionState(result.state)
          })
        })
        .catch((err) => {
          console.warn('Failed to query geolocation permission:', err)
        })
    }
  }, [])

  const getCurrentPosition = useCallback(() => {
    if (!('geolocation' in navigator) || !navigator.geolocation) {
      setError({
        code: 0,
        message: 'Geolocation is not supported by your browser',
      })
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        })
        setLoading(false)
        setError(null)
      },
      (error) => {
        setError({
          code: error.code,
          message: error.message,
        })
        setLoading(false)
        setPosition(null)
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    )
  }, [enableHighAccuracy, timeout, maximumAge])

  // Auto get position on mount if enabled
  useEffect(() => {
    if (autoGetPosition && permissionState !== 'denied') {
      getCurrentPosition()
    }
  }, [autoGetPosition, permissionState, getCurrentPosition])

  return {
    position,
    loading,
    error,
    permissionState,
    getCurrentPosition,
  }
}
