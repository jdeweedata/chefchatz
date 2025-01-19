import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import type { Recipe } from '@/types/recipe'

export function useRealtimeRecipe(id: string) {
  const queryClient = useQueryClient()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const channel = supabase
      .channel(`recipe:${id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'recipes',
        filter: `id=eq.${id}`
      }, (payload) => {
        // Update React Query cache with new data
        queryClient.setQueryData(['recipes', id], payload.new as Recipe)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, queryClient, supabase])
} 