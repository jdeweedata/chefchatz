import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home Page', () => {
  it('renders welcome message', () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', {
      name: /welcome to chefchatz/i,
    })
    const subtitle = screen.getByText(/your ai-powered cooking companion/i)
    
    expect(heading).toBeInTheDocument()
    expect(subtitle).toBeInTheDocument()
  })
})
