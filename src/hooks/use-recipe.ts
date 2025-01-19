import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { recipeCache } from '@/lib/cache/recipe-cache'
import { useRealtimeRecipe } from './use-realtime-recipe'
import type { Recipe } from '@/types/recipe'
import type { Database } from '@/types/supabase'

export function useRecipe(id: string) {
  const supabase = createClientComponentClient<Database>()
  const queryClient = useQueryClient()

  // Enable real-time updates
  useRealtimeRecipe(id)

  // Query with cache support
  const { data: recipe, isLoading, error } = useQuery({
    queryKey: ['recipes', id],
    queryFn: async () => {
      // Try cache first
      const cached = await recipeCache.get(id)
      if (cached) {
        return cached
      }

      // Fetch from API if not in cache
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      if (!data) throw new Error('Recipe not found')

      // Cache the result
      await recipeCache.set(data)
      return data as Recipe
    },
  })

  // Mutation for updating recipe
  const { mutate: updateRecipe } = useMutation({
    mutationFn: async (updates: Partial<Recipe>) => {
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Recipe
    },
    onSuccess: (updatedRecipe) => {
      queryClient.setQueryData(['recipes', id], updatedRecipe)
      recipeCache.set(updatedRecipe)
    },
  })

  return {
    recipe,
    isLoading,
    error,
    updateRecipe,
  }
} 