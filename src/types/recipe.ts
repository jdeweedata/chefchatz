export interface Recipe {
  id: string
  user_id: string
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  servings: number
  prep_time: number
  cook_time: number
  difficulty: 'easy' | 'medium' | 'hard'
  cuisine: string
  tags: string[]
  image_url?: string
  created_at: string
  updated_at: string
  is_favorite?: boolean
}

export interface RecipeInput {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  servings: number
  prep_time?: number
  cook_time?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  cuisine?: string
  tags?: string[]
  image_url?: string
}
