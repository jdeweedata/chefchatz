import { LRUCache } from 'lru-cache'
import type { Recipe } from '@/types/recipe'

interface CacheOptions {
  max: number
  ttl: number
}

class RecipeCache {
  private cache: LRUCache<string, Recipe>

  constructor(options: CacheOptions = { max: 100, ttl: 1000 * 60 * 5 }) {
    this.cache = new LRUCache({
      max: options.max,
      ttl: options.ttl,
    })
  }

  get(id: string): Recipe | undefined {
    return this.cache.get(id)
  }

  set(id: string, recipe: Recipe): void {
    this.cache.set(id, recipe)
  }

  has(id: string): boolean {
    return this.cache.has(id)
  }

  delete(id: string): void {
    this.cache.delete(id)
  }

  clear(): void {
    this.cache.clear()
  }

  getMultiple(ids: string[]): (Recipe | undefined)[] {
    return ids.map(id => this.get(id))
  }

  setMultiple(recipes: Recipe[]): void {
    recipes.forEach(recipe => this.set(recipe.id, recipe))
  }
}

// Create a singleton instance
export const recipeCache = new RecipeCache()

// Create a response cache for API responses
const responseCache = new LRUCache<string, Response>({
  max: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
})

export function getCachedResponse(key: string): Response | undefined {
  return responseCache.get(key)
}

export function setCachedResponse(key: string, response: Response): void {
  responseCache.set(key, response)
}

// Helper function to generate cache keys
export function generateCacheKey(path: string, params?: Record<string, string>): string {
  if (!params) return path
  const sortedParams = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return `${path}?${sortedParams}`
} 