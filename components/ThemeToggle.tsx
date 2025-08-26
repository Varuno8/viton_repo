'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
  const [dark, setDark] = useState(true)
  useEffect(() => {
    const root = window.document.documentElement
    dark ? root.classList.add('dark') : root.classList.remove('dark')
  }, [dark])
  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setDark(!dark)}
      className="p-2 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
