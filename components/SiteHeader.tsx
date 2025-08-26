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
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SiteHeader() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = query.trim()
    if (q) router.push(`/products?q=${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="font-bold text-lg">Viton</Link>
        <form onSubmit={onSearch} className="hidden md:block flex-1">
          <input
            type="search"
            placeholder="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl bg-white/10 px-3 py-1 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </form>
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
