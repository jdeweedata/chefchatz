import { LRUCache } from 'lru-cache'
import type { Recipe } from '@/types/recipe'

const CACHE_SIZE = 100
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

interface CacheOptions {
  max: number
  ttl: number
}

class RecipeCache {
  private cache: LRUCache<string, Recipe>
  private static instance: RecipeCache

  private constructor(options: CacheOptions) {
    this.cache = new LRUCache<string, Recipe>({
      max: options.max,
      ttl: options.ttl,
    })
  }

  static getInstance(): RecipeCache {
    if (!RecipeCache.instance) {
      RecipeCache.instance = new RecipeCache({
        max: CACHE_SIZE,
        ttl: CACHE_TTL,
      })
    }
    return RecipeCache.instance
  }

  async get(id: string): Promise<Recipe | undefined> {
    const cached = this.cache.get(id)
    if (cached) {
      return cached
    }

    // Try to get from IndexedDB if not in memory
    try {
      const db = await this.openDB()
      const recipe = await this.getFromDB(db, id)
      if (recipe) {
        this.cache.set(id, recipe)
      }
      return recipe
    } catch (error) {
      console.error('Error getting recipe from IndexedDB:', error)
      return undefined
    }
  }

  async set(recipe: Recipe): Promise<void> {
    this.cache.set(recipe.id, recipe)
    try {
      const db = await this.openDB()
      await this.setInDB(db, recipe)
    } catch (error) {
      console.error('Error saving recipe to IndexedDB:', error)
    }
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('RecipeCache', 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('recipes')) {
          db.createObjectStore('recipes', { keyPath: 'id' })
        }
      }
    })
  }

  private async getFromDB(db: IDBDatabase, id: string): Promise<Recipe | undefined> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['recipes'], 'readonly')
      const store = transaction.objectStore('recipes')
      const request = store.get(id)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
    })
  }

  private async setInDB(db: IDBDatabase, recipe: Recipe): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['recipes'], 'readwrite')
      const store = transaction.objectStore('recipes')
      const request = store.put(recipe)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

export const recipeCache = RecipeCache.getInstance() 