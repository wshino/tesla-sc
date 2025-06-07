import { useState, useEffect } from 'react'
import { Charger } from '@/types/charger'
import { fetchTeslaSuperchargers } from '@/lib/tesla-api'

interface UseTeslaSuperchargersReturn {
  chargers: Charger[]
  loading: boolean
  error: Error | null
  refetch: () => void
}

export function useTeslaSuperchargers(): UseTeslaSuperchargersReturn {
  const [chargers, setChargers] = useState<Charger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchChargers = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await fetchTeslaSuperchargers()
      setChargers(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch chargers'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChargers()
  }, [])

  return {
    chargers,
    loading,
    error,
    refetch: fetchChargers,
  }
}