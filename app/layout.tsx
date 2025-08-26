import './globals.css'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { SiteHeader } from '@/components/SiteHeader'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="max-w-4xl mx-auto p-4">
          <SiteHeader />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
