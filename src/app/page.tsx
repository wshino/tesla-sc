import dynamic from 'next/dynamic'
import { getMapboxToken } from '@/lib/mapbox'

// Dynamically import Map component to avoid SSR issues with Mapbox GL
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div>Loading map...</div>,
})

export default function Home() {
  let mapboxToken: string

  try {
    mapboxToken = getMapboxToken()
  } catch (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Map Error</h1>
          <p className="text-gray-600">
            Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="relative h-screen w-full">
      <Map mapboxToken={mapboxToken} />
    </main>
  )
}
