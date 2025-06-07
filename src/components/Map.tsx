'use client'

import Map, { NavigationControl } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapComponentProps {
  mapboxToken: string
}

const MapComponent: React.FC<MapComponentProps> = ({ mapboxToken }) => {
  return (
    <Map
      initialViewState={{
        latitude: 37.7749, // San Francisco default location
        longitude: -122.4194,
        zoom: 10,
      }}
      mapboxAccessToken={mapboxToken}
      style={{ width: '100%', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
    >
      <NavigationControl />
    </Map>
  )
}

export default MapComponent
