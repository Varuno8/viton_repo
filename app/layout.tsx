import './globals.css'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { SiteHeader } from '@/components/SiteHeader'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col bg-app-gradient">
            <SiteHeader />
            <main className="flex-1 container py-6">{children}</main>
            <footer className="border-t border-white/10 text-center text-sm text-zinc-400 py-6">
              © {new Date().getFullYear()} Viton
            </footer>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
