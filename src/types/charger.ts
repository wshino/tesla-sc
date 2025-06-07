export interface Charger {
  id: string
  name: string
  location: {
    lat: number
    lng: number
  }
  address: string
  city: string
  state: string
  country: string
  stalls: number
  amenities: string[]
  status: 'operational' | 'active' | 'maintenance' | 'coming_soon'
}

export type ChargerAmenity =
  | 'restaurants'
  | 'shopping'
  | 'restrooms'
  | 'wifi'
  | 'hotels'
  | 'parking'
  | 'ev_charging'
  | 'coffee'
  | 'convenience_store'
  | 'gas_station'
