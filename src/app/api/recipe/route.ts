import { NextRequest, NextResponse } from 'next/server'
import { generateRecipe } from '@/lib/ai/openai'
import { checkRateLimit } from '@/lib/utils/rate-limit'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const rateLimiter = await checkRateLimit(ip)
    
    if (!rateLimiter.success) {
      return new NextResponse(JSON.stringify({
        error: 'Too many requests',
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': rateLimiter.limit.toString(),
          'X-RateLimit-Remaining': rateLimiter.remaining.toString(),
          'X-RateLimit-Reset': rateLimiter.reset.toString(),
        },
      })
    }

    const body = await req.json()
    const recipe = await generateRecipe(body)

    return NextResponse.json({ recipe })
  } catch (error) {
    console.error('Recipe generation error:', error)
    return new NextResponse(JSON.stringify({
      error: 'Failed to generate recipe',
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
