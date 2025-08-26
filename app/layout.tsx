import './globals.css'
import type { ReactNode } from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { SiteHeader } from '@/components/SiteHeader'

export default function RootLayout({ children }: { children: ReactNode }) {
  const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER
  const body = (
    <body className="max-w-4xl mx-auto p-4">
      <SiteHeader />
      {children}
    </body>
  )
  if (provider === 'clerk') {
    return (
      <ClerkProvider>
        <html lang="en">{body}</html>
      </ClerkProvider>
    )
  }
  return <html lang="en">{body}</html>
}
