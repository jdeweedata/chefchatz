import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers'
import { Metadata } from 'next'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'ChefChatz - Your AI Cooking Assistant',
    template: '%s | ChefChatz',
  },
  description: 'Chat with AI to discover and create amazing recipes',
  keywords: ['cooking', 'recipes', 'AI', 'chat', 'food'],
  authors: [{ name: 'ChefChatz Team' }],
  creator: 'ChefChatz',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chefchatz.com',
    title: 'ChefChatz - Your AI Cooking Assistant',
    description: 'Chat with AI to discover and create amazing recipes',
    siteName: 'ChefChatz',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChefChatz - Your AI Cooking Assistant',
    description: 'Chat with AI to discover and create amazing recipes',
    creator: '@chefchatz',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen bg-background antialiased')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
