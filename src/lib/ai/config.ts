import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Rate limiting configuration
export const RATE_LIMITS = {
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_TOKENS_PER_REQUEST: 4000,
};

// Error messages
export const AI_ERROR_MESSAGES = {
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again in a minute.',
  INVALID_REQUEST: 'Invalid request. Please check your input and try again.',
  SERVICE_ERROR: 'AI service is temporarily unavailable. Please try again later.',
  TOKEN_LIMIT_EXCEEDED: 'Request exceeds maximum token limit.',
};

// Retry configuration
export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY: 1000,
  MAX_RETRY_DELAY: 5000,
};
