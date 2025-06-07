import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from './page'

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
  default: (fn: () => Promise<unknown>) => {
    const Component = () => <div data-testid="map-component">Map Component</div>
    Component.displayName = 'DynamicComponent'
    return Component
  },
}))

// Mock hooks and libraries
vi.mock('@/hooks/useGeolocation', () => ({
  useGeolocation: () => ({
    position: null,
    error: null,
    loading: false,
    permissionState: null,
    getCurrentPosition: vi.fn(),
  }),
}))

vi.mock('@/lib/chargers', () => ({
  loadAllChargers: vi.fn(() => Promise.resolve([])),
  findNearestChargers: vi.fn(() => []),
}))

vi.mock('@/components/CurrentLocationButton', () => ({
  default: () => <button>Use Current Location</button>,
}))

vi.mock('@/components/ChargerList', () => ({
  default: () => <div>Charger List</div>,
}))

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders map when token is available', async () => {
    // Mock environment variable
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN = 'test-token'

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByTestId('map-component')).toBeInTheDocument()
      expect(screen.getByText('Tesla Supercharger Finder')).toBeInTheDocument()
      expect(screen.getByText('Use Current Location')).toBeInTheDocument()
      expect(screen.getByText('Charger List')).toBeInTheDocument()
    })
  })

  it('renders error message when token is not available', async () => {
    // Remove environment variable
    delete process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Configuration Required')).toBeInTheDocument()
      expect(
        screen.getByText('Please add your Mapbox token to the .env.local file:')
      ).toBeInTheDocument()
      expect(
        screen.getByText('NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here')
      ).toBeInTheDocument()
    })
  })
})