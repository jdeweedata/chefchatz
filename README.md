# ChefChatz

An AI-powered cooking assistant that helps you discover, save, and perfect recipes.

## Features

- AI-powered recipe generation
- Step-by-step cooking guidance
- Personal recipe storage
- Smart recipe search
- Mobile-friendly interface

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- OpenAI
- Anthropic Claude
- Vercel

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/jdeweedata/chefchatz.git
cd chefchatz
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Fill in your environment variables
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

```bash
# Run unit tests
pnpm test

# Run e2e tests
pnpm test:e2e

# Run test coverage
pnpm test:coverage
```

## Contributing

1. Create a new branch following the naming convention:
   - `feature/*` for new features
   - `fix/*` for bug fixes
   - `docs/*` for documentation
   - `style/*` for styling changes
   - `refactor/*` for code refactoring
   - `test/*` for adding tests

2. Make your changes and commit using conventional commits:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation
   - `style:` for styling changes
   - `refactor:` for code refactoring
   - `test:` for adding tests

3. Create a pull request to the `main` branch

## License

MIT
