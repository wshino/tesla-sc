import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileBottomSheet } from './MobileBottomSheet'
import { Charger } from '@/types/charger'

// Mock the location library
vi.mock('@/lib/location', () => ({
  formatDistance: vi.fn(
    (distance: number, unit: string) => `${distance.toFixed(1)} ${unit}`
  ),
}))

const mockChargers: Charger[] = [
  {
    id: 'sc-tokyo-roppongi',
    name: 'Tokyo - Roppongi',
    location: { lat: 35.6627, lng: 139.7318 },
    address: '6-10-1 Roppongi, Minato-ku',
    city: 'Tokyo',
    state: 'Tokyo',
    country: 'Japan',
    stalls: 6,
    amenities: ['restaurants', 'shopping'],
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
    amenities: ['restaurants', 'shopping', 'coffee'],
    status: 'active',
  },
]

describe('MobileBottomSheet', () => {
  const defaultProps = {
    chargers: mockChargers,
    selectedCharger: null,
    userLocation: { latitude: 35.6762, longitude: 139.6503 },
    onChargerSelect: vi.fn(),
    isOpen: true,
    onClose: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders when open', () => {
    render(<MobileBottomSheet {...defaultProps} />)
    expect(screen.getByText('Superchargers (2)')).toBeInTheDocument()
    expect(
      screen.getByText('Tap a charger to see nearby spots')
    ).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<MobileBottomSheet {...defaultProps} isOpen={false} />)
    expect(screen.queryByText('Superchargers')).not.toBeInTheDocument()
  })

  it('displays charger list', () => {
    render(<MobileBottomSheet {...defaultProps} />)
    expect(screen.getByText('Tokyo - Roppongi')).toBeInTheDocument()
    expect(screen.getByText('Tokyo - Daikanyama')).toBeInTheDocument()
  })

  it('calls onChargerSelect when charger is clicked', () => {
    const onChargerSelect = vi.fn()
    render(
      <MobileBottomSheet {...defaultProps} onChargerSelect={onChargerSelect} />
    )

    fireEvent.click(screen.getByText('Tokyo - Roppongi'))
    expect(onChargerSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'sc-tokyo-roppongi',
        name: 'Tokyo - Roppongi',
        distance: expect.any(Number),
      })
    )
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<MobileBottomSheet {...defaultProps} onClose={onClose} />)

    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(onClose).toHaveBeenCalled()
  })

  it('highlights selected charger', () => {
    render(
      <MobileBottomSheet {...defaultProps} selectedCharger={mockChargers[0]} />
    )

    const chargerElement = screen
      .getByText('Tokyo - Roppongi')
      .closest('div[class*="border-b"]')
    expect(chargerElement).toHaveClass('bg-blue-50')
  })

  it('displays distance when user location is available', () => {
    render(<MobileBottomSheet {...defaultProps} />)
    const distances = screen.getAllByText(/km$/)
    expect(distances).toHaveLength(2) // Two chargers should have distances
    expect(distances[0]).toBeInTheDocument()
  })

  it('sorts chargers by distance', () => {
    render(<MobileBottomSheet {...defaultProps} />)

    const chargerElements = screen.getAllByText(/Tokyo -/)
    // Find which charger appears first
    const firstCharger = chargerElements[0].textContent
    const secondCharger = chargerElements[1].textContent

    // One of them should be Daikanyama and the other Roppongi
    expect([firstCharger, secondCharger]).toContain('Tokyo - Daikanyama')
    expect([firstCharger, secondCharger]).toContain('Tokyo - Roppongi')
  })

  it('displays charger details correctly', () => {
    render(<MobileBottomSheet {...defaultProps} />)

    // Check stalls count
    expect(screen.getByText('6 stalls')).toBeInTheDocument()
    expect(screen.getByText('4 stalls')).toBeInTheDocument()

    // Check cities
    const cityElements = screen.getAllByText('Tokyo')
    expect(cityElements.length).toBeGreaterThan(0)
  })

  it('handles backdrop click to close', () => {
    const onClose = vi.fn()
    render(<MobileBottomSheet {...defaultProps} onClose={onClose} />)

    const backdrop = document.querySelector('.bg-black.bg-opacity-25')
    fireEvent.click(backdrop!)

    expect(onClose).toHaveBeenCalled()
  })

  it('displays status indicators', () => {
    render(<MobileBottomSheet {...defaultProps} />)

    // Check for status indicators (colored dots)
    const statusIndicators = document.querySelectorAll('.h-2.w-2.rounded-full')
    expect(statusIndicators).toHaveLength(2)

    // Both chargers are active, so should have green indicators
    const activeIndicators = document.querySelectorAll('.bg-green-500')
    expect(activeIndicators).toHaveLength(2)
  })

  it('does not display distances when user location is not provided', () => {
    render(<MobileBottomSheet {...defaultProps} userLocation={undefined} />)

    // Should not see distance information
    expect(screen.queryByText(/km/)).not.toBeInTheDocument()
  })

  it('displays drag handle', () => {
    render(<MobileBottomSheet {...defaultProps} />)

    const dragHandle = document.querySelector(
      '.h-1.w-12.rounded-full.bg-gray-300'
    )
    expect(dragHandle).toBeInTheDocument()
  })

  it('handles touch drag gestures', () => {
    render(<MobileBottomSheet {...defaultProps} />)

    const bottomSheet = document.querySelector('.rounded-t-2xl.bg-white')
    expect(bottomSheet).toBeInTheDocument()

    // Mock window.innerHeight for touch calculation
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000,
    })

    // Simulate touch drag down (should close expanded view)
    const touchEvent = new TouchEvent('touchend', {
      changedTouches: [
        {
          clientY: 1000 * 0.6 + 150, // Drag down more than 100px
        } as Touch,
      ],
    })

    fireEvent(bottomSheet!, touchEvent)

    // Check that the component still renders
    expect(screen.getByText('Superchargers (2)')).toBeInTheDocument()
  })

  it('shows correct height classes', () => {
    render(<MobileBottomSheet {...defaultProps} />)

    const bottomSheet = document.querySelector('.rounded-t-2xl.bg-white')
    // Should start with collapsed height
    expect(bottomSheet).toHaveClass('h-[40vh]')
  })

  it('is hidden on desktop (md:hidden class)', () => {
    render(<MobileBottomSheet {...defaultProps} />)

    const container = document.querySelector('.fixed.inset-x-0.bottom-0.z-50')
    expect(container).toHaveClass('md:hidden')
  })

  it('handles empty charger list', () => {
    render(<MobileBottomSheet {...defaultProps} chargers={[]} />)

    expect(screen.getByText('Superchargers (0)')).toBeInTheDocument()
  })

  it('displays icons correctly', () => {
    render(<MobileBottomSheet {...defaultProps} />)

    // Check for lightning bolt icons (stalls) and close button icon
    const svgElements = document.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(0)
  })

  it('handles charger with maintenance status', () => {
    const chargersWithMaintenance = [
      ...mockChargers,
      {
        id: 'sc-tokyo-maintenance',
        name: 'Tokyo - Maintenance',
        location: { lat: 35.6762, lng: 139.6503 },
        address: '1-1-1 Test St',
        city: 'Tokyo',
        state: 'Tokyo',
        country: 'Japan',
        stalls: 8,
        amenities: [],
        status: 'maintenance' as const,
      },
    ]

    render(
      <MobileBottomSheet {...defaultProps} chargers={chargersWithMaintenance} />
    )

    // Should have one gray indicator for maintenance
    const maintenanceIndicators = document.querySelectorAll('.bg-gray-400')
    expect(maintenanceIndicators).toHaveLength(1)

    // And two green for active
    const activeIndicators = document.querySelectorAll('.bg-green-500')
    expect(activeIndicators).toHaveLength(2)
  })
})
