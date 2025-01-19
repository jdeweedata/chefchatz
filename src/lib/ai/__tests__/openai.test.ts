import { describe, it, expect, vi } from 'vitest'
import { generateRecipe, RecipeGenerationParams } from '../openai'

// Mock OpenAI
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    title: 'Test Recipe',
                    servings: '4',
                    prepTime: '30',
                    cookTime: '45',
                    difficulty: 'medium',
                    ingredients: [
                      {
                        item: 'test ingredient',
                        amount: '1',
                        unit: 'cup',
                      },
                    ],
                    instructions: [
                      {
                        step: 1,
                        description: 'Test instruction',
                      },
                    ],
                    nutritionalInfo: {
                      calories: '300',
                      protein: '10g',
                      carbs: '30g',
                      fat: '15g',
                    },
                  }),
                },
              },
            ],
          }),
        },
      },
    })),
  }
})

describe('OpenAI Recipe Generation', () => {
  it('generates a recipe with the given parameters', async () => {
    const params: RecipeGenerationParams = {
      ingredients: ['chicken', 'rice'],
      dietary: ['gluten-free'],
      cuisine: 'Asian',
      difficulty: 'medium',
    }

    const recipe = await generateRecipe(params)

    expect(recipe).toEqual({
      title: 'Test Recipe',
      servings: '4',
      prepTime: '30',
      cookTime: '45',
      difficulty: 'medium',
      ingredients: [
        {
          item: 'test ingredient',
          amount: '1',
          unit: 'cup',
        },
      ],
      instructions: [
        {
          step: 1,
          description: 'Test instruction',
        },
      ],
      nutritionalInfo: {
        calories: '300',
        protein: '10g',
        carbs: '30g',
        fat: '15g',
      },
    })
  })
})
