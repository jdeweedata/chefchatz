import { generateRecipe, RecipeGenerationParams } from '../openai'

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
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
                    protein: '20',
                    carbs: '30',
                    fat: '10',
                  },
                }),
              },
            },
          ],
        }),
      },
    },
  }))
})

describe('OpenAI Recipe Generation', () => {
  it('should generate a recipe with given parameters', async () => {
    const params: RecipeGenerationParams = {
      ingredients: ['chicken', 'rice'],
      dietary: ['gluten-free'],
      cuisine: 'Asian',
      difficulty: 'medium',
    }

    const recipe = await generateRecipe(params)
    const parsedRecipe = JSON.parse(recipe!)

    expect(parsedRecipe).toHaveProperty('title')
    expect(parsedRecipe).toHaveProperty('ingredients')
    expect(parsedRecipe).toHaveProperty('instructions')
    expect(parsedRecipe).toHaveProperty('nutritionalInfo')
  })
})
