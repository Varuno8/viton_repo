import './globals.css'
import type { ReactNode } from 'react'
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { SiteHeader } from '@/components/SiteHeader'

export default function RootLayout({ children }: { children: ReactNode }) {
  const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER || process.env.AUTH_PROVIDER

  const clerkHeader =
    provider === 'clerk' ? (
      <header className="flex gap-2 mb-4">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    ) : null

  const body = (
    <body className="max-w-4xl mx-auto p-4">
      <SiteHeader />
      {clerkHeader}
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
