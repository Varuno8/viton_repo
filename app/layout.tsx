import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  const provider = process.env.AUTH_PROVIDER
  const body = <body className="max-w-4xl mx-auto p-4">{children}</body>
  if (provider === 'clerk') {
    return (
      <ClerkProvider>
        <html lang="en">{body}</html>
      </ClerkProvider>
    )
  }
  return <html lang="en">{body}</html>
}
