export type Message = {
  role: 'user' | 'assistant'
  content: string
}

export type ChatType = 'recipe' | 'guidance'

export interface RecipeMessage {
  type: 'recipe'
  message: string
}

export interface GuidanceMessage {
  type: 'guidance'
  recipe: string
  currentStep: number
  question: string
}
