import { NextRequest } from 'next/server'
import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
  limit?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (req: NextRequest, limit?: number) => {
      const token = req.ip || 'anonymous'
      const tokenCount = (tokenCache.get(token) as number[]) || [0]
      const [currentUsage, timestamp] = tokenCount
      const now = Date.now()

      if (now - timestamp > options?.interval!) {
        tokenCache.set(token, [1, now])
        return {
          isLimited: false,
          remaining: (limit || options?.limit || 10) - 1,
        }
      }

      if (currentUsage >= (limit || options?.limit || 10)) {
        return {
          isLimited: true,
          remaining: 0,
        }
      }

      tokenCache.set(token, [currentUsage + 1, timestamp])
      return {
        isLimited: false,
        remaining: (limit || options?.limit || 10) - currentUsage - 1,
      }
    },
  }
}
