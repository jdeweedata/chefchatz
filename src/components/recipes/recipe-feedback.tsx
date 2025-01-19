import { useState } from 'react'
import { Star, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import type { Recipe } from '@/types/recipe'

export interface RecipeFeedback {
  rating: number
  comments: string
  photos?: File[]
}

interface RecipeFeedbackProps {
  recipe: Recipe
  onSubmit: (feedback: RecipeFeedback) => void
}

export function RecipeFeedback({ recipe, onSubmit }: RecipeFeedbackProps) {
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const [photos, setPhotos] = useState<File[]>([])
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      toast({
        title: 'Please select a rating',
        description: 'A rating is required to submit feedback.',
        variant: 'destructive',
      })
      return
    }

    onSubmit({ rating, comments, photos })
    setRating(0)
    setComments('')
    setPhotos([])
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="p-1 hover:text-primary transition-colors"
            >
              <Star
                className={rating >= value ? 'fill-primary text-primary' : ''}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comments" className="block text-sm font-medium mb-2">
          Comments
        </label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Share your experience with this recipe..."
          className="h-32"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Photos</label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('photo-upload')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Photos
          </Button>
          {photos.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {photos.length} photo{photos.length !== 1 && 's'} selected
            </span>
          )}
        </div>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Feedback
      </Button>
    </form>
  )
} 