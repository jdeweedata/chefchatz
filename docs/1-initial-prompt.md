# ChefChatz Initial Setup Requirements

## Core Setup Requirements

1. Development Environment
   - Node.js >= 18
   - pnpm package manager
   - TypeScript 5.0+
   - Next.js 13+ with App Router
   - Supabase project

2. Dependencies Installation
```bash
# Core dependencies
pnpm add next@latest react@latest react-dom@latest
pnpm add typescript @types/react @types/node

# Supabase integration
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs @supabase/ssr

# AI and Chat
pnpm add openai anthropic-sdk

# UI Components
pnpm add @radix-ui/react-* @shadcn/ui
pnpm add tailwindcss postcss autoprefixer
pnpm add lucide-react

# Development
pnpm add -D eslint prettier jest cypress
```

3. Project Structure
```
chefchatz/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── providers.tsx
│   ├── components/
│   │   ├── ui/
│   │   └── shared/
│   ├── lib/
│   │   ├── supabase/
│   │   └── utils/
│   └── types/
├── public/
│   └── brand/
└── docs/
```

## Implementation Steps

1. Environment Configuration
```typescript
// .env.local
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
```

2. Initial Codebase
```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// src/app/providers.tsx
'use client'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

3. Database Schema
```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Base tables
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  dietary_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.recipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT,
  ingredients JSONB,
  instructions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

## Verification Requirements

### Development Environment
- [ ] Node.js and pnpm installed
- [ ] Next.js project created
- [ ] TypeScript configured
- [ ] Supabase project setup
- [ ] Environment variables set

### Dependencies
- [ ] All packages installed
- [ ] Build succeeding
- [ ] TypeScript compiling
- [ ] Tailwind configured
- [ ] ESLint/Prettier setup

### Database
- [ ] Supabase connected
- [ ] Schemas created
- [ ] Policies configured
- [ ] Migrations working
- [ ] Types generated

### AI Integration
- [ ] OpenAI configured
- [ ] Anthropic configured
- [ ] Test endpoints working
- [ ] Rate limiting set
- [ ] Error handling implemented

## Completion Checklist
```typescript
interface SetupVerification {
  environment: boolean;
  dependencies: boolean;
  database: boolean;
  ai: boolean;
  documentation: boolean;
}

const verifySetup = async (): Promise<SetupVerification> => {
  // Implement verification logic
  return {
    environment: true,
    dependencies: true,
    database: true,
    ai: true,
    documentation: true
  };
};
```

NO PROCEEDING until all items verified complete.