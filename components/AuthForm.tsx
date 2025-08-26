'use client'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

export function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget as any
    const email = form.email.value
    const password = form.password.value
    if (mode === 'signup') {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name.value, email, password })
      })
      if (!res.ok) { setError('Sign up failed'); return }
    }
    const result = await signIn('credentials', { email, password, redirect: true, callbackUrl: '/' })
    if ((result as any)?.error) setError('Sign in failed')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2 max-w-xs">
      {mode === 'signup' && <input name="name" placeholder="Name" className="border p-2" />}
      <input name="email" type="email" placeholder="Email" className="border p-2" />
      <input name="password" type="password" placeholder="Password" className="border p-2" />
      <button type="submit" className="bg-black text-white p-2">
        {mode === 'signup' ? 'Sign up' : 'Sign in'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}
