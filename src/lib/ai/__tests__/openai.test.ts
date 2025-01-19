import { describe, it, expect, vi } from 'vitest'
import { generateRecipe } from '../openai'

vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockImplementation(async () => ({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    title: 'Test Recipe',
                    description: 'A test recipe',
                    ingredients: ['ingredient 1'],
                    instructions: ['Step 1'],
                    servings: 4,
                    prep_time: 15,
                    cook_time: 15,
                    difficulty: 'medium',
                    cuisine: 'Test',
                    tags: ['test']
                  })
                }
              }
            ]
          }))
        }
      }
    }))
  }
})

describe('OpenAI Recipe Generation', () => {
  const mockOpenAI = {
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  }

  beforeEach(() => {
    mockOpenAI.chat.completions.create.mockReset()
  })

  it('generates a recipe with the given parameters', async () => {
    const mockResponse = {
      title: 'Test Recipe',
      description: 'A test recipe',
      ingredients: ['ingredient 1'],
      instructions: ['Step 1'],
      servings: 4,
      prep_time: 15,
      cook_time: 15,
      difficulty: 'medium',
      cuisine: 'Test',
      tags: ['test']
    }

    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify(mockResponse)
          }
        }
      ]
    })

    const result = await generateRecipe('test recipe')
    expect(result).toEqual(mockResponse)
  })

  it('handles invalid JSON response', async () => {
    mockOpenAI.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: 'invalid json'
          }
        }
      ]
    })

    await expect(generateRecipe('test recipe'))
      .rejects.toThrow('Failed to parse recipe')
  })

  it('handles API errors gracefully', async () => {
    mockOpenAI.chat.completions.create.mockRejectedValueOnce(
      new Error('API Error')
    )

    await expect(generateRecipe('test recipe'))
      .rejects.toThrow('Failed to generate recipe')
  })
})
