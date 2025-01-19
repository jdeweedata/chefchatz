export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatResponse {
  response: string
  error?: string
}

export interface ChatRequest {
  type: 'recipe' | 'guidance'
  params: {
    query?: string
    recipe?: string
    currentStep?: number
    question?: string
  }
}
