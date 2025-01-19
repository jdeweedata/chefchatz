// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    }
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    }
  },
}))

// Mock Supabase
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
    },
  })),
}))
