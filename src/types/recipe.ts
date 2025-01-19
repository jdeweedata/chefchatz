export interface Recipe {
  id: string
  userId: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  servings: number
  prepTime: number
  cookTime: number
  difficulty: 'easy' | 'medium' | 'hard'
  cuisine: string
  tags: string[]
  imageUrl?: string
  createdAt: string
  updatedAt: string
  isFavorite?: boolean
}

export interface RecipeInput {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  servings: number
  prepTime?: number
  cookTime?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine?: string
  tags?: string[]
  imageUrl?: string
}
