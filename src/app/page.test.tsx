import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

// Mock the mapbox module
vi.mock('@/lib/mapbox', () => ({
  getMapboxToken: vi.fn(),
}))

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
  default: (_fn: () => Promise<unknown>) => {
    const Component = () => <div data-testid="map-component">Map Component</div>
    Component.displayName = 'DynamicMap'
    return Component
  },
}))

import { getMapboxToken } from '@/lib/mapbox'

describe('Home Page', () => {
  it('renders map when token is available', () => {
    vi.mocked(getMapboxToken).mockReturnValue('test-token')

    render(<Home />)
    const map = screen.getByTestId('map-component')
    expect(map).toBeInTheDocument()
  })

  it('renders error message when token is not available', () => {
    vi.mocked(getMapboxToken).mockImplementation(() => {
      throw new Error('Token not found')
    })

    render(<Home />)
    const errorHeading = screen.getByText('Map Error')
    const errorMessage = screen.getByText(
      'Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables.'
    )

    expect(errorHeading).toBeInTheDocument()
    expect(errorMessage).toBeInTheDocument()
  })
})
