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
  return (
    <header className="flex items-center justify-between mb-4">
      <Link href="/" className="font-bold text-lg">Viton</Link>
      <nav className="flex gap-4 text-sm">
        <Link href="/products">Products</Link>
        <Link href="/try-on/history">History</Link>
        <Link href="/account">Account</Link>
        <Link href="/admin">Admin</Link>
      </nav>
      <div className="flex gap-2">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  )
}
