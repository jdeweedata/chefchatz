export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          cooking_level: 'beginner' | 'intermediate' | 'advanced'
          dietary_preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          cooking_level?: 'beginner' | 'intermediate' | 'advanced'
          dietary_preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cooking_level?: 'beginner' | 'intermediate' | 'advanced'
          dietary_preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      recipes: {
        Row: {
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
        }
        Insert: {
          id?: string
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
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          ingredients?: string[]
          instructions?: string[]
          servings?: number
          prep_time?: number
          cook_time?: number
          difficulty?: 'easy' | 'medium' | 'hard'
          cuisine?: string
          tags?: string[]
          image_url?: string
          created_at?: string
          updated_at?: string
        }
      }
      recipe_feedback: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          rating: number
          comments: string
          photo_urls?: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          rating: number
          comments: string
          photo_urls?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          rating?: number
          comments?: string
          photo_urls?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      recipe_progress: {
        Row: {
          id: string
          recipe_id: string
          user_id: string
          current_step: number
          completed_steps: number[]
          start_time?: string
          end_time?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recipe_id: string
          user_id: string
          current_step: number
          completed_steps: number[]
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recipe_id?: string
          user_id?: string
          current_step?: number
          completed_steps?: number[]
          start_time?: string
          end_time?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
} 