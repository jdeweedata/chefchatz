import '@testing-library/jest-dom'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}))

// Mock Supabase client
vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
    },
  })),
  createRouteHandlerClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
  })),
}))

// Mock environment variables
process.env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'test-anon-key',
  OPENAI_API_KEY: 'test-openai-key',
  ANTHROPIC_API_KEY: 'test-anthropic-key',
}
