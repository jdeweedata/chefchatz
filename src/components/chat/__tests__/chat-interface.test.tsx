import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChatInterface } from '../chat-interface'

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}))

describe('ChatInterface', () => {
  const mockUserId = 'test-user'

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('renders chat interface', () => {
    render(<ChatInterface userId={mockUserId} />)
    expect(screen.getByTestId('chat-interface')).toBeInTheDocument()
    expect(screen.getByText('ChefChatz Assistant')).toBeInTheDocument()
  })

  it('handles message submission', async () => {
    const user = userEvent.setup()
    const message = 'How do I make pasta?'
    const mockResponse = { response: 'Here is a pasta recipe...' }

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    render(<ChatInterface userId={mockUserId} />)

    const input = screen.getByPlaceholderText(/ask about recipes/i)
    await user.type(input, message)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(input).toBeDisabled()
    await waitFor(() => {
      expect(screen.getByText(mockResponse.response)).toBeInTheDocument()
    })
    expect(input).not.toBeDisabled()
  })

  it('displays error message', async () => {
    const user = userEvent.setup()
    const message = 'Test message'
    const errorMessage = 'Failed to send message'

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: errorMessage }),
    })

    render(<ChatInterface userId={mockUserId} />)

    const input = screen.getByPlaceholderText(/ask about recipes/i)
    await user.type(input, message)
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  it('disables input while loading', async () => {
    const user = userEvent.setup()
    const message = 'Test message'

    global.fetch = vi.fn().mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<ChatInterface userId={mockUserId} />)

    const input = screen.getByPlaceholderText(/ask about recipes/i)
    await user.type(input, message)
    await user.click(screen.getByRole('button', { name: /send/i }))

    expect(input).toBeDisabled()
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled()
  })
})
