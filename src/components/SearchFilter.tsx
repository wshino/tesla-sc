'use client'

import { useState, useEffect } from 'react'

interface SearchFilterProps {
  onSearchChange: (query: string) => void
  onFilterChange: (filters: FilterOptions) => void
  availableCountries: string[]
  availableAmenities: string[]
}

export interface FilterOptions {
  status: string[]
  amenities: string[]
  country: string
  minStalls: number
  favoritesOnly: boolean
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  onSearchChange,
  onFilterChange,
  availableCountries,
  availableAmenities,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    amenities: [],
    country: '',
    minStalls: 0,
    favoritesOnly: false,
  })
  const [showFilters, setShowFilters] = useState(false)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, onSearchChange])

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  const handleStatusToggle = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const clearFilters = () => {
    setFilters({
      status: [],
      amenities: [],
      country: '',
      minStalls: 0,
      favoritesOnly: false,
    })
    setSearchQuery('')
  }

  const activeFilterCount =
    filters.status.length +
    filters.amenities.length +
    (filters.country ? 1 : 0) +
    (filters.minStalls > 0 ? 1 : 0) +
    (filters.favoritesOnly ? 1 : 0)

  return (
    <div className="border-b bg-white p-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, city, or address..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 pr-10 focus:border-blue-500 focus:outline-none"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Toggle Button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="mt-3 flex w-full items-center justify-between rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        <span className="flex items-center">
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
              {activeFilterCount}
            </span>
          )}
        </span>
        <svg
          className={`h-4 w-4 transform transition-transform ${
            showFilters ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Filter Options */}
      {showFilters && (
        <div className="mt-4 space-y-4">
          {/* Status Filter */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Status</h3>
            <div className="flex flex-wrap gap-2">
              {['active', 'maintenance', 'coming_soon'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusToggle(status)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    filters.status.includes(status)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">Country</h3>
            <select
              value={filters.country}
              onChange={(e) =>
                setFilters({ ...filters, country: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Countries</option>
              {availableCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Amenities Filter */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Amenities
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {availableAmenities.slice(0, 6).map((amenity) => (
                <button
                  key={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    filters.amenities.includes(amenity)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {amenity.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Stalls Filter */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-gray-700">
              Minimum Stalls: {filters.minStalls || 'Any'}
            </h3>
            <input
              type="range"
              min="0"
              max="24"
              step="2"
              value={filters.minStalls}
              onChange={(e) =>
                setFilters({ ...filters, minStalls: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Any</span>
              <span>12</span>
              <span>24+</span>
            </div>
          </div>

          {/* Favorites Only Filter */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.favoritesOnly}
                onChange={(e) =>
                  setFilters({ ...filters, favoritesOnly: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Show Favorites Only
              </span>
            </label>
          </div>

          {/* Clear Filters Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchFilter
