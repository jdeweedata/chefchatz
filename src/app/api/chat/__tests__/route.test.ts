import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { POST } from '../route'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// Mock the dependencies
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: jest.fn(),
}))

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}))

jest.mock('@/lib/ai/openai', () => ({
  generateRecipe: jest.fn(),
}))

jest.mock('@/lib/ai/anthropic', () => ({
  getCookingGuidance: jest.fn(),
}))

describe('Chat API Route', () => {
  let mockSupabase: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockSupabase = {
      auth: {
        getSession: jest.fn(),
      },
    }
    ;(createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  it('should return 401 if user is not authenticated', async () => {
    // Setup
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: null } })

    // Execute
    const response = await POST(new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'recipe',
        params: { query: 'salmon salad' },
      }),
    }))

    // Assert
    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({ error: 'Unauthorized' })
  })

  it('should handle recipe generation requests', async () => {
    // Setup
    const mockSession = { user: { id: '123' } }
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } })
    const mockRecipe = 'Here is a delicious salmon salad recipe...'
    require('@/lib/ai/openai').generateRecipe.mockResolvedValue(mockRecipe)

    // Execute
    const response = await POST(new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'recipe',
        params: { query: 'salmon salad' },
      }),
    }))

    // Assert
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ response: mockRecipe })
  })

  it('should handle cooking guidance requests', async () => {
    // Setup
    const mockSession = { user: { id: '123' } }
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } })
    const mockGuidance = 'To cook the salmon perfectly...'
    require('@/lib/ai/anthropic').getCookingGuidance.mockResolvedValue(mockGuidance)

    // Execute
    const response = await POST(new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'guidance',
        params: {
          recipe: 'Salmon Salad',
          currentStep: 1,
          question: 'How do I know when the salmon is cooked?',
        },
      }),
    }))

    // Assert
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ response: mockGuidance })
  })

  it('should handle invalid request type', async () => {
    // Setup
    const mockSession = { user: { id: '123' } }
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } })

    // Execute
    const response = await POST(new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'invalid',
        params: {},
      }),
    }))

    // Assert
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Failed to process chat request' })
  })

  it('should handle AI service errors gracefully', async () => {
    // Setup
    const mockSession = { user: { id: '123' } }
    mockSupabase.auth.getSession.mockResolvedValue({ data: { session: mockSession } })
    require('@/lib/ai/openai').generateRecipe.mockRejectedValue(new Error('AI service error'))

    // Execute
    const response = await POST(new Request('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'recipe',
        params: { query: 'salmon salad' },
      }),
    }))

    // Assert
    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Failed to process chat request' })
  })
})
