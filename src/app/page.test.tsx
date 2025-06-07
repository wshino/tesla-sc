import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from './page'

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />)
    const heading = screen.getByText('Tesla Supercharger Finder')
    expect(heading).toBeInTheDocument()
  })
})