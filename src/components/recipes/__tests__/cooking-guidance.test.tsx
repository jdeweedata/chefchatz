import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CookingGuidance } from '../cooking-guidance'

describe('CookingGuidance', () => {
  const mockRecipe = {
    title: 'Test Recipe',
    instructions: [
      { description: 'Preheat oven' },
      { description: 'Mix ingredients' },
      { description: 'Bake for 30 minutes' }
    ]
  }

  const mockOnComplete = vi.fn()
  const mockOnExit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders recipe instructions', () => {
    render(
      <CookingGuidance
        recipe={mockRecipe}
        onComplete={mockOnComplete}
        onExit={mockOnExit}
      />
    )

    expect(screen.getByText('Preheat oven')).toBeInTheDocument()
  })

  it('navigates through steps', () => {
    render(
      <CookingGuidance
        recipe={mockRecipe}
        onComplete={mockOnComplete}
        onExit={mockOnExit}
      />
    )

    const nextButton = screen.getByRole('button', { name: 'Next' })
    fireEvent.click(nextButton)

    expect(screen.getByText('Mix ingredients')).toBeInTheDocument()

    const prevButton = screen.getByRole('button', { name: 'Previous' })
    fireEvent.click(prevButton)

    expect(screen.getByText('Preheat oven')).toBeInTheDocument()
  })

  it('shows progress', async () => {
    render(
      <CookingGuidance 
        recipe={mockRecipe}
        onComplete={vi.fn()}
        onExit={vi.fn()}
      />
    )

    const completeButton = screen.getByRole('button', { name: 'Mark as Complete' })
    await userEvent.click(completeButton)
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('calls onComplete when finishing recipe', async () => {
    const onComplete = vi.fn()
    render(
      <CookingGuidance 
        recipe={mockRecipe}
        onComplete={onComplete}
        onExit={vi.fn()}
      />
    )

    // Complete all steps
    for (let i = 0; i < mockRecipe.instructions.length; i++) {
      const completeButton = screen.getByRole('button', { name: 'Mark as Complete' })
      await userEvent.click(completeButton)
      
      if (i < mockRecipe.instructions.length - 1) {
        const nextButton = screen.getByRole('button', { name: 'Next' })
        await userEvent.click(nextButton)
      }
    }

    expect(onComplete).toHaveBeenCalled()
  })

  it('calls onExit when exit button is clicked', () => {
    render(
      <CookingGuidance
        recipe={mockRecipe}
        onComplete={mockOnComplete}
        onExit={mockOnExit}
      />
    )

    const exitButton = screen.getByRole('button', { name: 'Exit' })
    fireEvent.click(exitButton)

    expect(mockOnExit).toHaveBeenCalled()
  })
})
