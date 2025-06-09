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
  const [favorites, setFavorites] = useState<FavoriteCharger[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites)
        if (Array.isArray(parsed)) {
          setFavorites(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error)
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
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
