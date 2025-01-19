import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import rateLimit from '@/lib/rate-limit'

// Create a limiter for different endpoints
const authLimiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max number of unique tokens per interval
})

const apiLimiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 1000,
})

export async function rateLimitMiddleware(
  req: NextRequest,
  matcher: 'auth' | 'api'
) {
  const limiter = matcher === 'auth' ? authLimiter : apiLimiter
  const limit = matcher === 'auth' ? 5 : 60 // 5 auth requests or 60 API requests per minute

  try {
    const { isLimited, remaining } = await limiter.check(req, limit)
    
    // Set rate limit headers
    const res = new NextResponse(
      isLimited ? JSON.stringify({ error: 'Too many requests' }) : null,
      {
        status: isLimited ? 429 : 200,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': (Date.now() + 60000).toString(),
        },
      }
    )

    if (isLimited) {
      return res
    }

    return null
  } catch {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
