import React from 'react'
import { render } from '@testing-library/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

interface WrapperProps {
  children: React.ReactNode
}

export function TestWrapper({ children }: WrapperProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}

export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: TestWrapper })
}

// Mock recipe data
export const mockRecipe = {
  id: '123',
  title: 'Test Recipe',
  description: 'A test recipe',
  ingredients: ['ingredient 1', 'ingredient 2'],
  instructions: ['step 1', 'step 2'],
  prep_time: 10,
  cook_time: 20,
  servings: 4,
  difficulty: 'medium',
  cuisine: 'test',
  user_id: 'test-user',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_favorite: false,
}

// Mock user data
export const mockUser = {
  id: 'test-user',
  email: 'test@example.com',
  name: 'Test User',
  dietary_preferences: {
    restrictions: ['vegetarian'],
    allergies: ['nuts'],
    preferences: ['spicy'],
  },
  cooking_level: 'intermediate',
  created_at: new Date().toISOString(),
}
