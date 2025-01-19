import Anthropic from '@anthropic-ai/sdk'

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('ANTHROPIC_API_KEY is not set in environment variables')
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface CookingGuidanceParams {
  recipe: string
  currentStep: number
  question?: string
}

export async function getCookingGuidance(params: CookingGuidanceParams) {
  try {
    const { recipe, currentStep, question } = params

    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: generatePrompt(params),
        },
      ],
    })

    if (!message.content || !message.content.length) {
      throw new Error('Empty response from Anthropic API')
    }

    const content = message.content[0]
    if (!content || !('text' in content)) {
      throw new Error('Unexpected response format from Anthropic API')
    }

    return content.text
  } catch (error) {
    console.error('Error getting cooking guidance:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to get cooking guidance')
  }
}

function generatePrompt(params: CookingGuidanceParams): string {
  const { recipe, currentStep, question } = params
  
  let prompt = `You are a helpful cooking assistant. `
  
  if (question) {
    prompt += `The user is asking about step ${currentStep} of this recipe:\n\n${recipe}\n\nTheir question is: ${question}\n\n`
    prompt += `Please provide a helpful, clear answer focusing on their specific question.`
  } else {
    prompt += `The user is on step ${currentStep} of this recipe:\n\n${recipe}\n\n`
    prompt += `Please provide guidance for this step, including any tips, warnings, or things to watch out for.`
  }
  
  return prompt
}
