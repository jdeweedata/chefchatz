# ChefChatz

An AI-powered cooking companion that helps you discover, create, and perfect recipes.

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Supabase (Auth & Database)
- OpenAI & Anthropic AI
- Tailwind CSS
- Radix UI Components
- Jest & Cypress for testing

## Prerequisites

- Node.js >= 18
- pnpm package manager
- Supabase account
- OpenAI API key
- Anthropic API key

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chefchatz.git
cd chefchatz
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with the following:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
chefchatz/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── shared/      # Shared components
│   ├── lib/             # Utility functions
│   │   ├── supabase/    # Supabase client & helpers
│   │   └── utils/       # General utilities
│   └── types/           # TypeScript types
├── public/              # Static assets
└── docs/               # Documentation
```

## Development Workflow

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the project structure
3. Run tests:
```bash
pnpm test        # Run Jest tests
pnpm cypress     # Run Cypress tests
```

4. Create a pull request

## Database Schema

### Profiles Table
- id (UUID, references auth.users)
- username (TEXT, unique)
- dietary_preferences (JSONB)
- created_at (TIMESTAMP)

### Recipes Table
- id (UUID)
- user_id (UUID, references auth.users)
- title (TEXT)
- ingredients (JSONB)
- instructions (JSONB)
- created_at (TIMESTAMP)

## Performance Standards

- File size < 300 lines
- Function size < 30 lines
- Load time < 3 seconds
- Optimized memory usage
- Minimized network calls

## License

MIT
# chefchatz
