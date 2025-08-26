'use client'
import Link from 'next/link'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'

export function SiteHeader() {
  const provider = process.env.NEXT_PUBLIC_AUTH_PROVIDER
  return (
    <header className="flex items-center justify-between mb-4">
      <Link href="/" className="font-bold text-lg">Viton</Link>
      <nav className="flex gap-4 text-sm">
        <Link href="/products">Products</Link>
        <Link href="/try-on/history">History</Link>
        <Link href="/account">Account</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      {provider === 'clerk' ? (
        <div className="flex gap-2">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link href="/auth/signin">Sign In</Link>
          <Link href="/auth/signup">Sign Up</Link>
        </div>
      )}
    </header>
  )
}
