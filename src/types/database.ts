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
          username: string | null
          dietary_preferences: Json | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          dietary_preferences?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          dietary_preferences?: Json | null
          created_at?: string
        }
      }
      recipes: {
        Row: {
          id: string
          user_id: string
          title: string | null
          ingredients: Json | null
          instructions: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          ingredients?: Json | null
          instructions?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          ingredients?: Json | null
          instructions?: Json | null
          created_at?: string
        }
      }
    }
  }
}
