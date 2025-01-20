import '@testing-library/jest-dom'
import { 
  expect,
  beforeEach,
  afterEach,
  vi,
  type TestContext,
  type Suite,
  type HookFunction
} from 'vitest'
import { loadEnvConfig } from '@next/env'

declare global {
  var expect: typeof expect
  var beforeEach: HookFunction
  var afterEach: HookFunction
  // Use any for vi to avoid circular reference
  var vi: any
}

// Make Vitest globals available
globalThis.expect = expect
globalThis.vi = vi
globalThis.beforeEach = beforeEach as HookFunction
globalThis.afterEach = afterEach as HookFunction

// Load environment variables
loadEnvConfig(process.cwd())

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn()
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    has: vi.fn(),
    forEach: vi.fn(),
    entries: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    toString: vi.fn()
  })
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
    set: vi.fn(),
    delete: vi.fn()
  }),
  headers: () => ({
    get: vi.fn(),
    has: vi.fn(),
    entries: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    forEach: vi.fn(),
    append: vi.fn(),
    delete: vi.fn(),
    set: vi.fn()
  })
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