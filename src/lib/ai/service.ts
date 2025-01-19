import { openai, anthropic, RATE_LIMITS, AI_ERROR_MESSAGES, RETRY_CONFIG } from './config';
import { RateLimiter } from '../utils/rate-limiter';

// Initialize rate limiter
const rateLimiter = new RateLimiter(RATE_LIMITS.MAX_REQUESTS_PER_MINUTE);

// Helper for exponential backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AIService {
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    retryCount = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retryCount >= RETRY_CONFIG.MAX_RETRIES) {
        throw error;
      }

      const delay = Math.min(
        RETRY_CONFIG.INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
        RETRY_CONFIG.MAX_RETRY_DELAY
      );

      await sleep(delay);
      return this.retryWithBackoff(operation, retryCount + 1);
    }
  }

  async generateRecipe(prompt: string) {
    if (!rateLimiter.tryAcquire()) {
      throw new Error(AI_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    }

    return this.retryWithBackoff(async () => {
      try {
        const completion = await openai.chat.completions.create({
          messages: [{ role: 'user', content: prompt }],
          model: 'gpt-4-turbo-preview',
          max_tokens: RATE_LIMITS.MAX_TOKENS_PER_REQUEST,
        });

        return completion.choices[0].message.content;
      } catch (error: any) {
        if (error.code === 'rate_limit_exceeded') {
          throw new Error(AI_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        }
        throw new Error(AI_ERROR_MESSAGES.SERVICE_ERROR);
      }
    });
  }

  async generateCookingGuidance(recipe: string) {
    if (!rateLimiter.tryAcquire()) {
      throw new Error(AI_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
    }

    return this.retryWithBackoff(async () => {
      try {
        const message = await anthropic.messages.create({
          model: 'claude-3-opus-20240229',
          max_tokens: RATE_LIMITS.MAX_TOKENS_PER_REQUEST,
          messages: [
            {
              role: 'user',
              content: `Generate step-by-step cooking guidance for this recipe: ${recipe}`,
            },
          ],
        });

        const content = message.content[0];
        if ('text' in content) {
          return content.text;
        }
        throw new Error(AI_ERROR_MESSAGES.SERVICE_ERROR);
      } catch (error: any) {
        if (error.status === 429) {
          throw new Error(AI_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
        }
        throw new Error(AI_ERROR_MESSAGES.SERVICE_ERROR);
      }
    });
  }
}
