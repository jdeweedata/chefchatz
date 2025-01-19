interface RateLimitInfo {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

const rateLimitMap = new Map<string, { count: number; reset: number }>()

export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  window: number = 60000
): Promise<RateLimitInfo> {
  const now = Date.now()
  const windowStart = now - window

  // Clean up expired entries
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.reset < windowStart) {
      rateLimitMap.delete(key)
    }
  }

  const current = rateLimitMap.get(identifier) || { count: 0, reset: now + window }

  if (current.reset < now) {
    current.count = 0
    current.reset = now + window
  }

  const remaining = limit - current.count

  if (remaining > 0) {
    current.count++
    rateLimitMap.set(identifier, current)
    return {
      success: true,
      limit,
      remaining: remaining - 1,
      reset: current.reset,
    }
  }

  return {
    success: false,
    limit,
    remaining: 0,
    reset: current.reset,
  }
}
