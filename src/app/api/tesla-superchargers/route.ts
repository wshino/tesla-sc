import { NextResponse } from 'next/server'
import { Charger } from '@/types/charger'

// Japan Superchargers with updated data including Daikanyama
const JAPAN_SUPERCHARGERS: Charger[] = [
  {
    id: 'sc-tokyo-roppongi',
    name: 'Tokyo - Roppongi',
    location: { lat: 35.6627, lng: 139.7318 },
    address: '6-10-1 Roppongi, Minato-ku',
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    stalls: 6,
    amenities: ['restaurants', 'shopping', 'restrooms', 'convenience_store'],
    status: 'active',
  },
  {
    id: 'sc-tokyo-odaiba',
    name: 'Tokyo - Odaiba',
    location: { lat: 35.6269, lng: 139.7744 },
    address: '1-3-15 Ariake, Koto-ku',
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    stalls: 8,
    amenities: ['restaurants', 'shopping', 'restrooms', 'parking'],
    status: 'active',
  },
  {
    id: 'sc-tokyo-daikanyama',
    name: 'Tokyo - Daikanyama',
    location: { lat: 35.6485, lng: 139.7031 },
    address: '16-15 Sarugakucho, Shibuya-ku',
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    stalls: 4,
    amenities: ['restaurants', 'shopping', 'restrooms', 'coffee', 'parking'],
    status: 'active',
  },
  {
    id: 'sc-tokyo-akasaka',
    name: 'Tokyo - Akasaka',
    location: { lat: 35.6769, lng: 139.7298 },
    address: '1-12-33 Akasaka, Minato-ku',
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    stalls: 8,
    amenities: ['restaurants', 'shopping', 'restrooms', 'hotels'],
    status: 'active',
  },
  {
    id: 'sc-tokyo-akihabara',
    name: 'Tokyo - Akihabara',
    location: { lat: 35.7023, lng: 139.7745 },
    address: '1-18-3 Sotokanda, Chiyoda-ku',
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    stalls: 6,
    amenities: ['restaurants', 'shopping', 'restrooms', 'electronics'],
    status: 'active',
  },
  {
    id: 'sc-tokyo-yaesu',
    name: 'Tokyo - Yaesu',
    location: { lat: 35.6812, lng: 139.7671 },
    address: '2-1-1 Yaesu, Chuo-ku',
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    stalls: 10,
    amenities: ['restaurants', 'shopping', 'restrooms', 'parking'],
    status: 'active',
  },
  {
    id: 'sc-osaka-umeda',
    name: 'Osaka - Umeda',
    location: { lat: 34.7055, lng: 135.4983 },
    address: '3-1-3 Umeda, Kita-ku',
    city: 'Osaka',
    state: 'Osaka',
    country: 'Japan',
    stalls: 6,
    amenities: ['restaurants', 'shopping', 'restrooms', 'convenience_store'],
    status: 'active',
  },
  {
    id: 'sc-kyoto-station',
    name: 'Kyoto - Station',
    location: { lat: 34.9856, lng: 135.7585 },
    address: 'Higashishiokoji-cho, Shimogyo-ku',
    city: 'Kyoto',
    state: 'Kyoto',
    country: 'Japan',
    stalls: 4,
    amenities: ['restaurants', 'shopping', 'restrooms', 'convenience_store'],
    status: 'active',
  },
  {
    id: 'sc-yokohama-mm21',
    name: 'Yokohama - Minato Mirai',
    location: { lat: 35.4559, lng: 139.631 },
    address: '1-1-1 Minato Mirai, Nishi-ku',
    city: 'Yokohama',
    state: 'Kanagawa',
    country: 'Japan',
    stalls: 6,
    amenities: ['restaurants', 'shopping', 'restrooms', 'parking'],
    status: 'active',
  },
  {
    id: 'sc-nagoya-sakae',
    name: 'Nagoya - Sakae',
    location: { lat: 35.1709, lng: 136.9089 },
    address: '3-5-1 Sakae, Naka-ku',
    city: 'Nagoya',
    state: 'Aichi',
    country: 'Japan',
    stalls: 8,
    amenities: ['restaurants', 'shopping', 'restrooms', 'parking'],
    status: 'active',
  },
  {
    id: 'sc-kobe-sannomiya',
    name: 'Kobe - Sannomiya',
    location: { lat: 34.695, lng: 135.1955 },
    address: '1-5-1 Sannomiya-cho, Chuo-ku',
    city: 'Kobe',
    state: 'Hyogo',
    country: 'Japan',
    stalls: 6,
    amenities: ['restaurants', 'shopping', 'restrooms', 'parking'],
    status: 'active',
  },
  {
    id: 'sc-fukuoka-tenjin',
    name: 'Fukuoka - Tenjin',
    location: { lat: 33.5919, lng: 130.3989 },
    address: '1-11-11 Tenjin, Chuo-ku',
    city: 'Fukuoka',
    state: 'Fukuoka',
    country: 'Japan',
    stalls: 6,
    amenities: ['restaurants', 'shopping', 'restrooms', 'parking'],
    status: 'active',
  },
]

export async function GET() {
  try {
    // In a real implementation, this could fetch from Tesla's API
    // For now, return our comprehensive Japan supercharger data
    return NextResponse.json({
      chargers: JAPAN_SUPERCHARGERS,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching Tesla superchargers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch supercharger data' },
      { status: 500 }
    )
  }
}

