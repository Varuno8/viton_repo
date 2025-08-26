'use client'
import Link from 'next/link'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/nextjs'
import { ThemeToggle } from './ThemeToggle'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-bold text-lg">Viton</Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/try-on/history">History</Link>
          <Link href="/account">Account</Link>
          <Link href="/admin">Admin</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-1 text-sm border border-white/20 rounded-xl hover:bg-white/10">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-3 py-1 text-sm rounded-xl bg-accent text-black">Sign up</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
