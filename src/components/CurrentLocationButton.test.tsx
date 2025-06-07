import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CurrentLocationButton } from './CurrentLocationButton'

// Mock the useGeolocation hook
vi.mock('@/hooks/useGeolocation', () => ({
  useGeolocation: vi.fn(() => ({
    position: null,
    loading: false,
    error: null,
    permissionState: null,
    getCurrentPosition: vi.fn(),
  })),
}))

import { useGeolocation } from '@/hooks/useGeolocation'

describe('CurrentLocationButton', () => {
  const mockGetCurrentPosition = vi.fn()
  const mockOnLocationReceived = vi.fn()
  const mockOnError = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGeolocation).mockReturnValue({
      position: null,
      loading: false,
      error: null,
      permissionState: null,
      getCurrentPosition: mockGetCurrentPosition,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render with default props', () => {
    render(<CurrentLocationButton />)

    const button = screen.getByRole('button', { name: 'Use Current Location' })
    expect(button).toBeInTheDocument()
    expect(button).not.toBeDisabled()
    expect(button).not.toHaveClass('loading')
    expect(button).not.toHaveClass('error')
  })

  it('should render with custom button text', () => {
    render(<CurrentLocationButton buttonText="Get My Location" />)

    const button = screen.getByRole('button', { name: 'Get My Location' })
    expect(button).toBeInTheDocument()
  })

  it('should call getCurrentPosition when clicked', () => {
    render(<CurrentLocationButton />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockGetCurrentPosition).toHaveBeenCalledTimes(1)
  })

  it('should show loading state', () => {
    vi.mocked(useGeolocation).mockReturnValue({
      position: null,
      loading: true,
      error: null,
      permissionState: null,
      getCurrentPosition: mockGetCurrentPosition,
    })

    render(<CurrentLocationButton loadingText="Finding location..." />)

    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(button).toHaveClass('loading')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText('Finding location...')).toBeInTheDocument()

    // Check for spinner
    const spinner = button.querySelector('svg.animate-spin')
    expect(spinner).toBeInTheDocument()
  })

  it('should call onLocationReceived when position is obtained', async () => {
    const { rerender } = render(
      <CurrentLocationButton onLocationReceived={mockOnLocationReceived} />
    )

    // Simulate position update
    vi.mocked(useGeolocation).mockReturnValue({
      position: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        timestamp: Date.now(),
      },
      loading: false,
      error: null,
      permissionState: null,
      getCurrentPosition: mockGetCurrentPosition,
    })

    rerender(
      <CurrentLocationButton onLocationReceived={mockOnLocationReceived} />
    )

    await waitFor(() => {
      expect(mockOnLocationReceived).toHaveBeenCalledWith(37.7749, -122.4194)
    })
  })

  it('should display error message for permission denied', () => {
    vi.mocked(useGeolocation).mockReturnValue({
      position: null,
      loading: false,
      error: { code: 1, message: 'User denied Geolocation' },
      permissionState: null,
      getCurrentPosition: mockGetCurrentPosition,
    })

    render(<CurrentLocationButton />)

    const errorMessage = screen.getByRole('alert')
    expect(errorMessage).toHaveTextContent(
      'Location permission denied. Please enable location access in your browser settings.'
    )
    expect(errorMessage).toHaveClass('error-message')
  })

  it('should display error message for position unavailable', () => {
    vi.mocked(useGeolocation).mockReturnValue({
      position: null,
      loading: false,
      error: { code: 2, message: 'Position unavailable' },
      permissionState: null,
      getCurrentPosition: mockGetCurrentPosition,
    })

    render(<CurrentLocationButton />)

    const errorMessage = screen.getByRole('alert')
    expect(errorMessage).toHaveTextContent(
      'Location information is unavailable.'
    )
  })

  it('should display error message for timeout', () => {
    vi.mocked(useGeolocation).mockReturnValue({
      position: null,
      loading: false,
      error: { code: 3, message: 'Timeout' },
      permissionState: null,
      getCurrentPosition: mockGetCurrentPosition,
    })

    render(<CurrentLocationButton />)

    const errorMessage = screen.getByRole('alert')
    expect(errorMessage).toHaveTextContent(
      'Location request timed out. Please try again.'
    )
  })

  it('should display custom error messages', () => {
    vi.mocked(useGeolocation).mockReturnValue({
      position: null,
      loading: false,
      error: { code: 1, message: 'User denied Geolocation' },
      permissionState: null,
      getCurrentPosition: mockGetCurrentPosition,
    })

    render(
      <CurrentLocationButton
        errorMessages={{
          denied: 'Custom permission denied message',
        }}
      />
    )

    const errorMessage = screen.getByRole('alert')
    expect(errorMessage).toHaveTextContent('Custom permission denied message')
  })

  it('should call onError when error occurs', async () => {
    const { rerender } = render(<CurrentLocationButton onError={mockOnError} />)

    const error = { code: 1, message: 'User denied Geolocation' }

    vi.mocked(useGeolocation).mockReturnValue({
      position: null,
      loading: false,
      error,
      permissionState: null,
      getCurrentPosition: mockGetCurrentPosition,
    })

    rerender(<CurrentLocationButton onError={mockOnError} />)

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(error)
    })
  })

  it('should display permission denied warning when permission state is denied', () => {
    vi.mocked(useGeolocation).mockReturnValue({
      position: null,
      loading: false,
      error: null,
      permissionState: 'denied',
      getCurrentPosition: mockGetCurrentPosition,
    })

    render(<CurrentLocationButton />)

    const warningMessage = screen.getByRole('alert')
    expect(warningMessage).toHaveTextContent(
      'Location access is currently blocked. Click the button to try again.'
    )
    expect(warningMessage).toHaveClass('permission-denied-message')
  })

  it('should apply custom className', () => {
    render(<CurrentLocationButton className="custom-button-class" />)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('current-location-button')
    expect(button).toHaveClass('custom-button-class')
  })

  it('should render location icon when not loading', () => {
    render(<CurrentLocationButton />)

    const button = screen.getByRole('button')
    const locationIcon = button.querySelector('svg:not(.animate-spin)')
    expect(locationIcon).toBeInTheDocument()
    expect(locationIcon).toHaveAttribute('viewBox', '0 0 24 24')
  })
})
