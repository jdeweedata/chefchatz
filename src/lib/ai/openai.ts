import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface RecipeGenerationParams {
  ingredients?: string[]
  dietary?: string[]
  cuisine?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export async function generateRecipe(params: RecipeGenerationParams) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional chef who specializes in creating recipes.',
        },
        {
          role: 'user',
          content: generatePrompt(params),
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0].message.content
  } catch (error) {
    console.error('Error generating recipe:', error)
    throw new Error('Failed to generate recipe')
  }
}

function generatePrompt(params: RecipeGenerationParams): string {
  const {
    ingredients = [],
    dietary = [],
    cuisine = 'any',
    difficulty = 'medium',
  } = params

  return `Create a detailed recipe with the following specifications:
${ingredients.length ? `\nIngredients to use: ${ingredients.join(', ')}` : ''}
${dietary.length ? `\nDietary requirements: ${dietary.join(', ')}` : ''}
Cuisine type: ${cuisine}
Difficulty level: ${difficulty}

Please provide the recipe in the following JSON format:
{
  "title": "Recipe Name",
  "servings": "Number of servings",
  "prepTime": "Preparation time in minutes",
  "cookTime": "Cooking time in minutes",
  "difficulty": "easy/medium/hard",
  "ingredients": [
    { "item": "ingredient name", "amount": "amount", "unit": "measurement unit" }
  ],
  "instructions": [
    { "step": 1, "description": "step description" }
  ],
  "nutritionalInfo": {
    "calories": "per serving",
    "protein": "in grams",
    "carbs": "in grams",
    "fat": "in grams"
  }
}`
}
