import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchFilter from './SearchFilter'

describe('SearchFilter Component', () => {
  const mockOnSearchChange = vi.fn()
  const mockOnFilterChange = vi.fn()

  const defaultProps = {
    onSearchChange: mockOnSearchChange,
    onFilterChange: mockOnFilterChange,
    availableCountries: ['USA', 'Japan', 'Canada'],
    availableAmenities: [
      'restaurants',
      'shopping',
      'restrooms',
      'wifi',
      'hotels',
      'parking',
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should render search input', () => {
    render(<SearchFilter {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(
      'Search by name, city, or address...'
    )
    expect(searchInput).toBeInTheDocument()
  })

  it('should handle search input with debounce', async () => {
    render(<SearchFilter {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(
      'Search by name, city, or address...'
    )
    fireEvent.change(searchInput, { target: { value: 'San Francisco' } })

    // Should not call immediately
    expect(mockOnSearchChange).not.toHaveBeenCalled()

    // Wait for debounce (300ms)
    vi.advanceTimersByTime(300)

    expect(mockOnSearchChange).toHaveBeenCalledWith('San Francisco')
  })

  it('should clear search input', async () => {
    render(<SearchFilter {...defaultProps} />)

    const searchInput = screen.getByPlaceholderText(
      'Search by name, city, or address...'
    )
    fireEvent.change(searchInput, { target: { value: 'Test' } })

    // Wait for input value to be set
    expect(searchInput).toHaveValue('Test')

    // Find the X button by its structure (last child of input parent)
    const inputContainer = searchInput.parentElement!
    const clearButton = inputContainer.querySelector('button')
    expect(clearButton).toBeInTheDocument()

    fireEvent.click(clearButton!)
    expect(searchInput).toHaveValue('')

    // Should trigger search with empty string after debounce
    vi.advanceTimersByTime(300)
    expect(mockOnSearchChange).toHaveBeenCalledWith('')
  })

  it('should toggle filter panel', () => {
    render(<SearchFilter {...defaultProps} />)

    // Filter options should not be visible initially
    expect(screen.queryByText('Status')).not.toBeInTheDocument()

    // Click filter toggle button
    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    // Filter options should now be visible
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByText('Amenities')).toBeInTheDocument()
  })

  it('should display active filter count', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    // Select a status
    const activeButton = screen.getByText('active')
    fireEvent.click(activeButton)

    // Select a country
    const countrySelect = screen.getByDisplayValue('All Countries')
    fireEvent.change(countrySelect, { target: { value: 'USA' } })

    // Filter count should be displayed immediately
    const filterCount = screen.getByText('2')
    expect(filterCount).toBeInTheDocument()
  })

  it('should handle status filter toggle', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    const activeButton = screen.getByText('active')
    const maintenanceButton = screen.getByText('maintenance')

    // Click active status
    fireEvent.click(activeButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ['active'],
        amenities: [],
        country: '',
        minStalls: 0,
      })
    )

    // Click maintenance status
    fireEvent.click(maintenanceButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ['active', 'maintenance'],
      })
    )

    // Click active again to deselect
    fireEvent.click(activeButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        status: ['maintenance'],
      })
    )
  })

  it('should handle country filter', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    const countrySelect = screen.getByDisplayValue('All Countries')
    fireEvent.change(countrySelect, { target: { value: 'Japan' } })

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        country: 'Japan',
      })
    )
  })

  it('should handle amenity filter toggle', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    const restaurantsButton = screen.getByText('restaurants')
    const wifiButton = screen.getByText('wifi')

    // Select restaurants
    fireEvent.click(restaurantsButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amenities: ['restaurants'],
      })
    )

    // Select wifi
    fireEvent.click(wifiButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amenities: ['restaurants', 'wifi'],
      })
    )

    // Deselect restaurants
    fireEvent.click(restaurantsButton)

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        amenities: ['wifi'],
      })
    )
  })

  it('should handle minimum stalls filter', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    // Find the range input by type
    const minStallsInput = screen.getByRole('slider')
    expect(minStallsInput).toHaveAttribute('type', 'range')
    expect(minStallsInput).toHaveAttribute('min', '0')
    expect(minStallsInput).toHaveAttribute('max', '24')

    // Change the value
    fireEvent.change(minStallsInput, { target: { value: '10' } })

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        minStalls: 10,
      })
    )
  })

  it('should clear all filters', async () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    // Set some filters
    const activeButton = screen.getByText('active')
    fireEvent.click(activeButton)

    const countrySelect = screen.getByDisplayValue('All Countries')
    fireEvent.change(countrySelect, { target: { value: 'USA' } })

    const searchInput = screen.getByPlaceholderText(
      'Search by name, city, or address...'
    )
    fireEvent.change(searchInput, { target: { value: 'Test' } })

    // Click clear filters button
    const clearButton = screen.getByText('Clear All Filters')
    fireEvent.click(clearButton)

    // All filters should be reset
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: [],
      amenities: [],
      country: '',
      minStalls: 0,
    })

    expect(searchInput).toHaveValue('')
  })

  it('should show selected filter styles', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    const activeButton = screen.getByText('active')

    // Check initial style
    expect(activeButton).toHaveClass('bg-gray-200', 'text-gray-700')

    // Click to select
    fireEvent.click(activeButton)

    // Check selected style
    expect(activeButton).toHaveClass('bg-blue-600', 'text-white')
  })

  it('should handle filter changes on mount', () => {
    render(<SearchFilter {...defaultProps} />)

    // Initial filter state should be notified
    expect(mockOnFilterChange).toHaveBeenCalledWith({
      status: [],
      amenities: [],
      country: '',
      minStalls: 0,
    })
  })

  it('should display all available countries', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    const countrySelect = screen.getByDisplayValue('All Countries')
    fireEvent.click(countrySelect)

    expect(screen.getByText('USA')).toBeInTheDocument()
    expect(screen.getByText('Japan')).toBeInTheDocument()
    expect(screen.getByText('Canada')).toBeInTheDocument()
  })

  it('should display limited amenities (max 6)', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    fireEvent.click(filterButton)

    // Should only show first 6 amenities
    const amenityButtons = screen.getAllByRole('button', {
      name: /restaurants|shopping|restrooms|wifi|hotels|parking/i,
    })

    // Filter out other buttons (clear, filter toggle, etc.)
    const actualAmenityButtons = amenityButtons.filter((button) =>
      defaultProps.availableAmenities.includes(button.textContent || '')
    )

    expect(actualAmenityButtons).toHaveLength(6)
  })

  it('should handle filter panel chevron rotation', () => {
    render(<SearchFilter {...defaultProps} />)

    const filterButton = screen.getByText('Filters')
    // Get the parent button and find the chevron SVG (has transform class)
    const buttonElement = filterButton.closest('button')
    const chevron = buttonElement?.querySelector('svg.transform')

    // Initial state - not rotated
    expect(chevron).toBeInTheDocument()
    expect(chevron).not.toHaveClass('rotate-180')

    // Click to open
    fireEvent.click(filterButton)
    expect(chevron).toHaveClass('rotate-180')

    // Click to close
    fireEvent.click(filterButton)
    expect(chevron).not.toHaveClass('rotate-180')
  })
})
