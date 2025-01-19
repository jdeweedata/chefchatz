import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRecipeProgress } from '../use-recipe-progress'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Mock Supabase client
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(),
}))

describe('useRecipeProgress', () => {
  const mockRecipeId = 'test-recipe'
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn(),
    upsert: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClientComponentClient as vi.Mock).mockReturnValue(mockSupabase)
  })

  it('loads saved progress on mount', async () => {
    const savedProgress = {
      current_step: 2,
      completed_steps: [0, 1],
      start_time: '2025-01-19T16:00:00Z',
    }

    mockSupabase.single.mockResolvedValue({ data: savedProgress })

    const { result } = renderHook(() => useRecipeProgress(mockRecipeId))

    // Wait for initial load
    await act(async () => {
      await Promise.resolve()
    })

    expect(result.current.progress.currentStep).toBe(2)
    expect(result.current.progress.completedSteps).toEqual([0, 1])
    expect(result.current.progress.startTime).toBe('2025-01-19T16:00:00Z')
  })

  it('starts cooking session correctly', async () => {
    mockSupabase.single.mockResolvedValue({ data: null })
    mockSupabase.upsert.mockResolvedValue({ data: null })

    const { result } = renderHook(() => useRecipeProgress(mockRecipeId))

    await act(async () => {
      await Promise.resolve()
      result.current.startCooking()
    })

    expect(result.current.progress.startTime).toBeDefined()
    expect(mockSupabase.upsert).toHaveBeenCalled()
  })

  it('updates step completion correctly', async () => {
    mockSupabase.single.mockResolvedValue({ data: null })
    mockSupabase.upsert.mockResolvedValue({ data: null })

    const { result } = renderHook(() => useRecipeProgress(mockRecipeId))

    await act(async () => {
      await Promise.resolve()
      result.current.toggleStepCompletion(0)
    })

    expect(result.current.progress.completedSteps).toContain(0)

    await act(async () => {
      result.current.toggleStepCompletion(0)
    })

    expect(result.current.progress.completedSteps).not.toContain(0)
  })

  it('completes cooking session correctly', async () => {
    mockSupabase.single.mockResolvedValue({ data: null })
    mockSupabase.upsert.mockResolvedValue({ data: null })

    const { result } = renderHook(() => useRecipeProgress(mockRecipeId))

    await act(async () => {
      await Promise.resolve()
      result.current.startCooking()
      result.current.completeCooking()
    })

    expect(result.current.progress.endTime).toBeDefined()
    expect(mockSupabase.upsert).toHaveBeenCalledTimes(2)
  })

  it('handles errors gracefully', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation()
    mockSupabase.single.mockRejectedValue(new Error('Test error'))

    renderHook(() => useRecipeProgress(mockRecipeId))

    await act(async () => {
      await Promise.resolve()
    })

    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})
