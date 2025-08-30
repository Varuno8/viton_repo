import './globals.css'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { SiteHeader } from '@/components/SiteHeader'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const year = new Date().getFullYear()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <div className="min-h-screen flex flex-col bg-app-gradient">
            <SiteHeader />
            <main className="flex-1 container py-6">{children}</main>
            <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md text-center text-sm text-zinc-400 py-6">
              © {year} Viton
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
