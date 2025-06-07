import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header Component', () => {
  it('renders the header with title', () => {
    render(<Header />)
    const title = screen.getByText('Tesla Supercharger Finder')
    expect(title).toBeInTheDocument()
  })

  it('has the correct styling classes', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('w-full', 'bg-white', 'shadow-sm')
  })
})
