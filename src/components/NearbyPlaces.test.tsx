import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NearbyPlaces } from './NearbyPlaces'
import { Charger } from '@/types/charger'
import * as googlePlacesLib from '@/lib/google-places'

// Mock the google-places library
vi.mock('@/lib/google-places', () => ({
  searchNearbyPlaces: vi.fn(),
  formatPlaceType: vi.fn((type) => {
    if (typeof type !== 'string') return ''
    const typeMap: Record<string, string> = {
      restaurant: 'Restaurant',
      cafe: 'Cafe',
      shopping_mall: 'Shopping',
      parking: 'Parking',
      lodging: 'Hotel',
      tourist_attraction: 'Entertainment',
      convenience_store: 'Convenience Store',
      gas_station: 'Gas Station',
    }
    return typeMap[type] || type.replace(/_/g, ' ')
  }),
  getRatingStars: vi.fn((rating) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5 ? 1 : 0
    const emptyStars = 5 - fullStars - halfStar
    return (
      '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars)
    )
  }),
  getPriceLevel: vi.fn((level) => '¥'.repeat(level)),
  PLACE_TYPES: {
    RESTAURANT: 'restaurant',
    CAFE: 'cafe',
    SHOPPING: 'shopping_mall',
    PARKING: 'parking',
    HOTEL: 'lodging',
    ENTERTAINMENT: 'tourist_attraction',
    CONVENIENCE_STORE: 'convenience_store',
    GAS_STATION: 'gas_station',
  },
}))

// Mock the location library
vi.mock('@/lib/location', () => ({
  getWalkingInfo: vi.fn((lat1, lng1, lat2, lng2) => ({
    distanceMeters:
      Math.abs(lat2 - lat1) * 111000 + Math.abs(lng2 - lng1) * 111000,
    walkingTimeMinutes: 5,
  })),
}))

describe('NearbyPlaces Component', () => {
  const mockCharger: Charger = {
    id: '1',
    name: 'Test Supercharger',
    address: '123 Test St, San Francisco, CA',
    location: {
      lat: 37.7749,
      lng: -122.4194,
    },
    stalls: 8,
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    status: 'active',
    amenities: ['restrooms', 'wifi'],
  }

  const mockPlaces: googlePlacesLib.Place[] = [
    {
      place_id: '1',
      name: 'Test Restaurant',
      vicinity: '100 Main St',
      geometry: {
        location: {
          lat: 37.775,
          lng: -122.4195,
        },
      },
      types: ['restaurant', 'food'],
      rating: 4.5,
      user_ratings_total: 100,
      price_level: 2,
      opening_hours: {
        open_now: true,
      },
      photos: [],
    },
    {
      place_id: '2',
      name: 'Test Cafe',
      vicinity: '200 Market St',
      geometry: {
        location: {
          lat: 37.7751,
          lng: -122.4196,
        },
      },
      types: ['cafe', 'food'],
      rating: 4.0,
      user_ratings_total: 50,
      price_level: 1,
      opening_hours: {
        open_now: false,
      },
      photos: [],
    },
  ]

  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render loading state initially', () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockImplementation(
      () => new Promise(() => {}) // Never resolves to keep loading state
    )

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    expect(screen.getByText('Nearby Places')).toBeInTheDocument()
    expect(screen.getByText('Test Supercharger')).toBeInTheDocument()
    expect(screen.getByText('Within 400m radius')).toBeInTheDocument()
    expect(screen.getByText('Loading nearby places...')).toBeInTheDocument()
  })

  it('should fetch and display nearby places', async () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue(mockPlaces)

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
      expect(screen.getByText('Test Cafe')).toBeInTheDocument()
    })

    expect(screen.getByText('100 Main St')).toBeInTheDocument()
    expect(screen.getByText('200 Market St')).toBeInTheDocument()
    expect(screen.getByText('Open Now')).toBeInTheDocument()
    expect(screen.getByText('Closed')).toBeInTheDocument()
  })

  it('should display category filter buttons', async () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue(mockPlaces)

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument()
    })

    // Check filter buttons exist - there might be multiple elements with these texts
    const restaurantButtons = screen.getAllByText('Restaurant')
    expect(restaurantButtons.length).toBeGreaterThan(0)

    const cafeButtons = screen.getAllByText('Cafe')
    expect(cafeButtons.length).toBeGreaterThan(0)

    const shoppingButtons = screen.getAllByText('Shopping')
    expect(shoppingButtons.length).toBeGreaterThan(0)
  })

  it('should filter places by category', async () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue(mockPlaces)

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    })

    // Find the filter button specifically (not the place type label)
    const restaurantButtons = screen.getAllByText('Restaurant')
    const filterButton = restaurantButtons.find(
      (button) => button.tagName === 'BUTTON'
    )!

    fireEvent.click(filterButton)

    await waitFor(() => {
      expect(googlePlacesLib.searchNearbyPlaces).toHaveBeenCalledWith({
        location: mockCharger.location,
        radius: 400,
        type: 'restaurant',
      })
    })
  })

  it('should handle close button', () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue(mockPlaces)

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    const closeButton = screen.getAllByRole('button')[0] // First button is close
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should display place details when clicked', async () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue(mockPlaces)

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    })

    // Click on a place
    const placeCard = screen.getByText('Test Restaurant').closest('div')!
    fireEvent.click(placeCard)

    // Check details modal
    await waitFor(() => {
      // Multiple elements might have the same text
      const mainStElements = screen.getAllByText('100 Main St')
      expect(mainStElements.length).toBeGreaterThan(0)

      // Multiple star ratings might be displayed
      const starRatings = screen.getAllByText('★★★★☆')
      expect(starRatings.length).toBeGreaterThan(0)

      expect(screen.getByText('4.5 (100 reviews)')).toBeInTheDocument()

      // Multiple price levels might be displayed
      const priceLevels = screen.getAllByText('¥¥')
      expect(priceLevels.length).toBeGreaterThan(0)

      expect(screen.getByText('✓ Open Now')).toBeInTheDocument()
    })
  })

  it('should close place details modal', async () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue(mockPlaces)

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    })

    // Click on a place
    const placeCard = screen.getByText('Test Restaurant').closest('div')!
    fireEvent.click(placeCard)

    await waitFor(() => {
      expect(screen.getByText('4.5 (100 reviews)')).toBeInTheDocument()
    })

    // Close details modal
    const closeButtons = screen.getAllByRole('button')
    const detailsCloseButton = closeButtons[closeButtons.length - 1] // Last button is details close
    fireEvent.click(detailsCloseButton)

    await waitFor(() => {
      expect(screen.queryByText('4.5 (100 reviews)')).not.toBeInTheDocument()
    })
  })

  it('should handle empty results', async () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue([])

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('No places found nearby')).toBeInTheDocument()
    })
  })

  it('should handle API error', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockRejectedValue(
      new Error('API Error')
    )

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('No places found nearby')).toBeInTheDocument()
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching nearby places:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('should display Google Maps link for directions', async () => {
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue(mockPlaces)

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument()
    })

    // Click on a place to see details
    const placeCard = screen.getByText('Test Restaurant').closest('div')!
    fireEvent.click(placeCard)

    await waitFor(() => {
      const directionsLink = screen.getByText('View in Google Maps')
      expect(directionsLink).toBeInTheDocument()
      expect(directionsLink).toHaveAttribute(
        'href',
        expect.stringContaining('google.com/maps')
      )
      expect(directionsLink).toHaveAttribute('target', '_blank')
    })
  })

  it('should sort places by distance', async () => {
    const unsortedPlaces = [
      {
        ...mockPlaces[1],
        geometry: { location: { lat: 37.78, lng: -122.42 } },
      }, // Far
      {
        ...mockPlaces[0],
        geometry: { location: { lat: 37.775, lng: -122.4195 } },
      }, // Near
    ]
    vi.mocked(googlePlacesLib.searchNearbyPlaces).mockResolvedValue(
      unsortedPlaces
    )

    render(<NearbyPlaces charger={mockCharger} onClose={mockOnClose} />)

    await waitFor(() => {
      const placeNames = screen.getAllByText(/Test (Restaurant|Cafe)/)
      expect(placeNames[0]).toHaveTextContent('Test Restaurant') // Closer one first
      expect(placeNames[1]).toHaveTextContent('Test Cafe') // Farther one second
    })
  })
})
