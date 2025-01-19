declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      NEXT_PUBLIC_GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      ADMIN_EMAIL: string
    }
  }
}
