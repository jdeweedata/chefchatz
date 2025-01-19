'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

type CookingLevel = 'beginner' | 'intermediate' | 'advanced'
type DietaryRestriction = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free' | 'halal' | 'kosher'
type Cuisine = 'italian' | 'japanese' | 'mexican' | 'indian' | 'french' | 'chinese' | 'mediterranean'

interface OnboardingState {
  cookingLevel: CookingLevel | null
  dietaryRestrictions: DietaryRestriction[]
  favoriteCuisines: Cuisine[]
  cookingGoals: string[]
  timePreference: number
}

export function OnboardingFlow() {
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()
  const [step, setStep] = useState(0)
  const [state, setState] = useState<OnboardingState>({
    cookingLevel: null,
    dietaryRestrictions: [],
    favoriteCuisines: [],
    cookingGoals: [],
    timePreference: 30,
  })

  const handleCookingLevel = (level: CookingLevel) => {
    setState(prev => ({ ...prev, cookingLevel: level }))
    setStep(1)
  }

  const handleDietaryRestrictions = (restriction: DietaryRestriction) => {
    setState(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction],
    }))
  }

  const handleCuisines = (cuisine: Cuisine) => {
    setState(prev => ({
      ...prev,
      favoriteCuisines: prev.favoriteCuisines.includes(cuisine)
        ? prev.favoriteCuisines.filter(c => c !== cuisine)
        : [...prev.favoriteCuisines, cuisine],
    }))
  }

  const handleTimePreference = (time: number) => {
    setState(prev => ({ ...prev, timePreference: time }))
  }

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      await supabase.from('profiles').upsert({
        id: user.id,
        cooking_level: state.cookingLevel,
        dietary_preferences: {
          restrictions: state.dietaryRestrictions,
          cuisines: state.favoriteCuisines,
          time_preference: state.timePreference,
        },
        updated_at: new Date().toISOString(),
      })

      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving preferences:', error)
    }
  }

  const steps = [
    // Step 1: Cooking Level
    <Card key="cooking-level" className="p-6">
      <h2 className="text-2xl font-bold">What's your cooking experience?</h2>
      <p className="mt-2 text-muted-foreground">
        This helps us tailor recipes to your skill level
      </p>
      <div className="mt-6 grid gap-4">
        {(['beginner', 'intermediate', 'advanced'] as CookingLevel[]).map(level => (
          <Button
            key={level}
            variant={state.cookingLevel === level ? 'default' : 'outline'}
            className="justify-start"
            onClick={() => handleCookingLevel(level)}
          >
            <span className="capitalize">{level}</span>
          </Button>
        ))}
      </div>
    </Card>,

    // Step 2: Dietary Restrictions
    <Card key="dietary" className="p-6">
      <h2 className="text-2xl font-bold">Any dietary restrictions?</h2>
      <p className="mt-2 text-muted-foreground">
        Select all that apply
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher'] as DietaryRestriction[]).map(restriction => (
          <Button
            key={restriction}
            variant={state.dietaryRestrictions.includes(restriction) ? 'default' : 'outline'}
            onClick={() => handleDietaryRestrictions(restriction)}
          >
            <span className="capitalize">{restriction}</span>
          </Button>
        ))}
      </div>
      <Button
        className="mt-6 w-full"
        onClick={() => setStep(2)}
      >
        Continue
      </Button>
    </Card>,

    // Step 3: Favorite Cuisines
    <Card key="cuisines" className="p-6">
      <h2 className="text-2xl font-bold">What cuisines do you enjoy?</h2>
      <p className="mt-2 text-muted-foreground">
        Pick your favorites
      </p>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {(['italian', 'japanese', 'mexican', 'indian', 'french', 'chinese', 'mediterranean'] as Cuisine[]).map(cuisine => (
          <Button
            key={cuisine}
            variant={state.favoriteCuisines.includes(cuisine) ? 'default' : 'outline'}
            onClick={() => handleCuisines(cuisine)}
          >
            <span className="capitalize">{cuisine}</span>
          </Button>
        ))}
      </div>
      <Button
        className="mt-6 w-full"
        onClick={handleSubmit}
      >
        Complete Setup
      </Button>
    </Card>,
  ]

  return (
    <div className="mx-auto max-w-md space-y-6 p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Welcome to ChefChatz</h1>
        <p className="text-muted-foreground">
          Let's personalize your cooking experience
        </p>
      </div>
      {steps[step]}
    </div>
  )
}
