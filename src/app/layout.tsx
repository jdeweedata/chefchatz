import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/shared/header'
import { Footer } from '@/components/shared/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChefChatz',
  description: 'Your AI-powered cooking companion',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}
