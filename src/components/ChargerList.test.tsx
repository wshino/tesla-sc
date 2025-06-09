import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ChargerList from './ChargerList'
import { Charger } from '@/types/charger'

// Mock formatDistance
vi.mock('@/lib/location', () => ({
  formatDistance: (distance: number) => `${distance.toFixed(1)} km`,
}))

describe('ChargerList Component', () => {
  const mockChargers: Charger[] = [
    {
      id: '1',
      name: 'Test Supercharger 1',
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
    },
    {
      id: '2',
      name: 'Test Supercharger 2',
      address: '456 Test Ave, San Francisco, CA',
      location: {
        lat: 37.7849,
        lng: -122.4094,
      },
      stalls: 12,
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
      status: 'active',
      amenities: ['restaurants', 'shopping'],
    },
    {
      id: '3',
      name: 'Test Supercharger 3',
      address: '789 Test Blvd, Oakland, CA',
      location: {
        lat: 37.8044,
        lng: -122.2712,
      },
      stalls: 16,
      city: 'Oakland',
      state: 'CA',
      country: 'USA',
      status: 'operational',
      amenities: ['hotels', 'parking'],
    },
  ]

  const mockUserLocation = {
    latitude: 37.7749,
    longitude: -122.4194,
  }

  const mockOnChargerSelect = vi.fn()

  it('should render charger list', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
      />
    )

    expect(screen.getByText('Nearby Superchargers')).toBeInTheDocument()
    expect(screen.getByText('3 locations found')).toBeInTheDocument()
    expect(
      screen.getByText('Click a charger to see nearby entertainment spots')
    ).toBeInTheDocument()

    // Check all chargers are rendered
    expect(screen.getByText('Test Supercharger 1')).toBeInTheDocument()
    expect(screen.getByText('Test Supercharger 2')).toBeInTheDocument()
    expect(screen.getByText('Test Supercharger 3')).toBeInTheDocument()
  })

  it('should display charger details', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
      />
    )

    // Check addresses
    expect(
      screen.getByText('123 Test St, San Francisco, CA')
    ).toBeInTheDocument()
    expect(
      screen.getByText('456 Test Ave, San Francisco, CA')
    ).toBeInTheDocument()
    expect(screen.getByText('789 Test Blvd, Oakland, CA')).toBeInTheDocument()

    // Check stalls
    expect(screen.getByText('8 stalls')).toBeInTheDocument()
    expect(screen.getByText('12 stalls')).toBeInTheDocument()
    expect(screen.getByText('16 stalls')).toBeInTheDocument()
  })

  it('should handle charger selection', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
      />
    )

    const charger1 = screen.getByText('Test Supercharger 1').closest('div')!
      .parentElement!.parentElement!
    fireEvent.click(charger1)

    expect(mockOnChargerSelect).toHaveBeenCalledWith({
      ...mockChargers[0],
      distance: null,
    })
  })

  it('should highlight selected charger', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
        selectedChargerId="2"
      />
    )

    const charger2 = screen.getByText('Test Supercharger 2').closest('div')!
      .parentElement!.parentElement!
    expect(charger2).toHaveClass('bg-blue-50')

    // Other chargers should not be highlighted
    const charger1 = screen.getByText('Test Supercharger 1').closest('div')!
      .parentElement!.parentElement!
    expect(charger1).not.toHaveClass('bg-blue-50')
  })

  it('should sort chargers by distance when user location is provided', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
        userLocation={mockUserLocation}
      />
    )

    const chargerElements = screen
      .getAllByText(/Test Supercharger/)
      .map((el) => el.textContent)

    // First charger should be the closest (same location as user)
    expect(chargerElements[0]).toBe('Test Supercharger 1')
    // Second should be Test Supercharger 2 (closer than 3)
    expect(chargerElements[1]).toBe('Test Supercharger 2')
    // Third should be Test Supercharger 3 (farthest)
    expect(chargerElements[2]).toBe('Test Supercharger 3')
  })

  it('should display distance when user location is provided', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
        userLocation={mockUserLocation}
      />
    )

    // Check that distance is displayed
    // The first charger has the same location as user, so distance is 0.0 km
    expect(screen.getByText('0.0 km')).toBeInTheDocument()
    // Other chargers should have positive distances
    const distanceElements = screen.getAllByText(/\d+\.\d+ km/)
    expect(distanceElements.length).toBeGreaterThan(0)
  })

  it('should handle empty charger list', () => {
    render(
      <ChargerList
        chargers={[]}
        onChargerSelect={mockOnChargerSelect}
        userLocation={mockUserLocation}
      />
    )

    expect(screen.getByText('0 locations found')).toBeInTheDocument()
  })

  it('should display amenities', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
      />
    )

    // Check amenities are rendered as individual tags
    expect(screen.getByText('restrooms')).toBeInTheDocument()
    expect(screen.getByText('wifi')).toBeInTheDocument()
    expect(screen.getByText('restaurants')).toBeInTheDocument()
    expect(screen.getByText('shopping')).toBeInTheDocument()
    expect(screen.getByText('hotels')).toBeInTheDocument()
    expect(screen.getByText('parking')).toBeInTheDocument()
  })

  it('should handle hover state', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
      />
    )

    const charger1 = screen.getByText('Test Supercharger 1').closest('div')!
      .parentElement!.parentElement!

    // Check hover class is present
    expect(charger1).toHaveClass('hover:bg-gray-50')
  })

  it('should be responsive', () => {
    render(
      <ChargerList
        chargers={mockChargers}
        onChargerSelect={mockOnChargerSelect}
      />
    )

    // Check responsive classes
    const title = screen.getByText('Nearby Superchargers')
    expect(title).toHaveClass('text-lg', 'sm:text-xl')

    const subtitle = screen.getByText('3 locations found')
    expect(subtitle).toHaveClass('text-xs', 'sm:text-sm')
  })
})
