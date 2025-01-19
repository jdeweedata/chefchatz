import OpenAI from 'openai'
import { Recipe } from '@/types/recipe'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const SYSTEM_PROMPT = `You are a knowledgeable chef assistant. When asked to create a recipe, always respond in this format:

Recipe: [Recipe Name]
Servings: [Number of Servings]

Ingredients:
- [Ingredient 1 with quantity]
- [Ingredient 2 with quantity]
- [etc...]

Instructions:
1. [First step]
2. [Second step]
3. [etc...]

Tips:
- [Optional cooking tips or variations]`

export async function generateRecipe(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // Using the fast, affordable model optimized for focused tasks
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    return response
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw error
  }
}
