import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })
})
