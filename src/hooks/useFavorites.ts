import { useState, useEffect, useCallback } from 'react'
import { Charger } from '../types/charger'

type FavoriteCharger = Pick<
  Charger,
  'id' | 'name' | 'address' | 'city' | 'country'
>

interface UseFavoritesReturn {
  favorites: FavoriteCharger[]
  addFavorite: (charger: Charger) => void
  removeFavorite: (chargerId: string) => void
  isFavorite: (chargerId: string) => boolean
  clearFavorites: () => void
}

const FAVORITES_STORAGE_KEY = 'tesla-sc-favorites'

export const useFavorites = (): UseFavoritesReturn => {
  // Initialize state with a function to avoid SSR issues
  const [favorites, setFavorites] = useState<FavoriteCharger[]>(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      return []
    }
    
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
      console.log('Initial load from localStorage:', storedFavorites)
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites)
        if (Array.isArray(parsed)) {
          return parsed
        }
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error)
    }
    return []
  })

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    // Skip if running on server
    if (typeof window === 'undefined') {
      return
    }
    
    try {
      console.log('Saving favorites to localStorage:', favorites)
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error)
    }
  }, [favorites])

  const addFavorite = useCallback((charger: Charger) => {
    setFavorites((prev) => {
      // Check if already favorited
      if (prev.some((fav) => fav.id === charger.id)) {
        return prev
      }

      // Extract only necessary properties to minimize storage
      const favoriteCharger: FavoriteCharger = {
        id: charger.id,
        name: charger.name,
        address: charger.address,
        city: charger.city,
        country: charger.country,
      }

      return [...prev, favoriteCharger]
    })
  }, [])

  const removeFavorite = useCallback((chargerId: string) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== chargerId))
  }, [])

  const isFavorite = useCallback(
    (chargerId: string) => {
      return favorites.some((fav) => fav.id === chargerId)
    },
    [favorites]
  )

  const clearFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    clearFavorites,
  }
}
