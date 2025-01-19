export interface DietaryPreferences {
  restrictions: string[]  // e.g., 'vegetarian', 'vegan', 'halal'
  allergies: string[]    // e.g., 'nuts', 'dairy', 'shellfish'
  preferences: string[]  // e.g., 'spicy', 'low-carb', 'mediterranean'
}

export type CookingLevel = 'beginner' | 'intermediate' | 'advanced'

export interface UserProfile {
  id: string
  email: string
  username?: string
  name?: string
  dietary_preferences?: DietaryPreferences
  cooking_level?: CookingLevel
  created_at: string
  updated_at?: string
  avatar_url?: string
}

export interface AuthError {
  code: string
  message: string
  status: number
}

export interface AuthResponse {
  data: {
    user?: UserProfile
    session?: any
  } | null
  error: AuthError | null
}

export interface AuthFormState {
  email: string
  password: string
  isLoading: boolean
  error: string | null
  message: string | null
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirm {
  password: string
  token: string
}
