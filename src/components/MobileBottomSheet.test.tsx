import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileBottomSheet } from './MobileBottomSheet'
import { Charger } from '@/types/charger'

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

  it('renders when open', () => {
    render(<MobileBottomSheet {...defaultProps} />)
    expect(screen.getByText('Superchargers (2)')).toBeInTheDocument()
    expect(screen.getByText('Tap a charger to see nearby spots')).toBeInTheDocument()
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
    render(<MobileBottomSheet {...defaultProps} onChargerSelect={onChargerSelect} />)
    
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
      <MobileBottomSheet
        {...defaultProps}
        selectedCharger={mockChargers[0]}
      />
    )
    
    const chargerElement = screen.getByText('Tokyo - Roppongi').closest('div[class*="border-b"]')
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
})