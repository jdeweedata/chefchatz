import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeCard } from '../recipe-card'

describe('RecipeCard', () => {
  const mockRecipe = {
    id: '123',
    userId: 'user123',
    title: 'Test Recipe',
    description: 'A test recipe',
    ingredients: ['ingredient 1'],
    instructions: ['Step 1', 'Step 2'],
    servings: 4,
    prepTime: 15,
    cookTime: 15,
    difficulty: 'medium' as const,
    cuisine: 'Test',
    tags: ['test'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    isFavorite: false
  }

  it('displays recipe information', () => {
    render(
      <RecipeCard
        recipe={mockRecipe}
        onSave={vi.fn()}
        onStart={vi.fn()}
      />
    )

    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
    expect(screen.getByText('30m')).toBeInTheDocument()
    expect(screen.getByText('4 servings')).toBeInTheDocument()
  })

  it('calls onSave when save button is clicked', async () => {
    const onSave = vi.fn()
    render(
      <RecipeCard
        recipe={mockRecipe}
        onSave={onSave}
        onStart={vi.fn()}
      />
    )

    const saveButton = screen.getByRole('button', { name: /save recipe/i })
    await userEvent.click(saveButton)

    expect(onSave).toHaveBeenCalledWith(mockRecipe)
  })

  it('calls onStart when start button is clicked', async () => {
    const onStart = vi.fn()
    render(
      <RecipeCard
        recipe={mockRecipe}
        onSave={vi.fn()}
        onStart={onStart}
      />
    )

    const startButton = screen.getByRole('button', { name: /start cooking/i })
    await userEvent.click(startButton)

    expect(onStart).toHaveBeenCalledWith(mockRecipe)
  })
})
