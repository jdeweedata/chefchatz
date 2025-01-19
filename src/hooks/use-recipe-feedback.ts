import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/components/ui/use-toast'
import type { Recipe } from '@/types/recipe'
import type { RecipeFeedback } from '@/components/recipes/recipe-feedback'

type RecipeQueryKey = ['recipe', string]

export function useRecipeFeedback(recipe: Recipe) {
  const supabase = createClientComponentClient()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const uploadPhotos = async (photos: File[]) => {
    const photoUrls = await Promise.all(
      photos.map(async (photo) => {
        const fileName = `${crypto.randomUUID()}-${photo.name}`
        const { data, error } = await supabase.storage
          .from('recipe-photos')
          .upload(fileName, photo)

        if (error) throw error
        return data.path
      })
    )
    return photoUrls
  }

  return useMutation({
    mutationFn: async (feedback: RecipeFeedback) => {
      let photoUrls: string[] = []
      
      if (feedback.photos?.length) {
        photoUrls = await uploadPhotos(feedback.photos)
      }

      const { error } = await supabase
        .from('recipe_feedback')
        .insert({
          recipe_id: recipe.id,
          rating: feedback.rating,
          comments: feedback.comments,
          photo_urls: photoUrls
        })

      if (error) throw error

      return { success: true }
    },
    onSuccess: () => {
      const queryKey: RecipeQueryKey = ['recipe', recipe.id]
      queryClient.invalidateQueries({ queryKey })
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback!'
      })
    },
    onError: (error) => {
      console.error('Error submitting feedback:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive'
      })
    }
  })
} 