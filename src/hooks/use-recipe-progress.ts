'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Recipe } from '@/types/recipe'
import type { Database } from '@/types/supabase'

interface RecipeProgress {
  recipeId: string
  currentStep: number
  completedSteps: number[]
  startTime?: string
  endTime?: string
}

export function useRecipeProgress(recipeId: string) {
  const [progress, setProgress] = useState<RecipeProgress>({
    recipeId,
    currentStep: 0,
    completedSteps: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  // Load saved progress
  useEffect(() => {
    async function loadProgress() {
      try {
        const { data: savedProgress } = await supabase
          .from('recipe_progress')
          .select('*')
          .eq('recipe_id', recipeId)
          .single()

        if (savedProgress) {
          setProgress({
            recipeId,
            currentStep: savedProgress.current_step,
            completedSteps: savedProgress.completed_steps,
            startTime: savedProgress.start_time,
            endTime: savedProgress.end_time,
          })
        }
      } catch (error) {
        console.error('Error loading recipe progress:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [recipeId, supabase])

  // Save progress updates
  const updateProgress = async (updates: Partial<RecipeProgress>) => {
    const updatedProgress = { ...progress, ...updates }
    setProgress(updatedProgress)

    try {
      await supabase.from('recipe_progress').upsert({
        recipe_id: recipeId,
        current_step: updatedProgress.currentStep,
        completed_steps: updatedProgress.completedSteps,
        start_time: updatedProgress.startTime,
        end_time: updatedProgress.endTime,
        updated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Error saving recipe progress:', error)
    }
  }

  const startCooking = () => {
    if (!progress.startTime) {
      updateProgress({ startTime: new Date().toISOString() })
    }
  }

  const completeCooking = () => {
    updateProgress({
      endTime: new Date().toISOString(),
    })
  }

  const setCurrentStep = (step: number) => {
    updateProgress({ currentStep: step })
  }

  const toggleStepCompletion = (step: number) => {
    const newCompletedSteps = progress.completedSteps.includes(step)
      ? progress.completedSteps.filter(s => s !== step)
      : [...progress.completedSteps, step]

    updateProgress({ completedSteps: newCompletedSteps })
  }

  return {
    progress,
    isLoading,
    startCooking,
    completeCooking,
    setCurrentStep,
    toggleStepCompletion,
  }
}
