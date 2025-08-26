'use client'
import { useEffect, useState, useTransition } from 'react'
import { api } from '@/lib/api'
import { ingestAction } from './actions'

export default function AdminPage() {
  const [url, setUrl] = useState('')
  const [count, setCount] = useState<number | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    api<any[]>('/api/products')
      .then(p => setCount(p.length))
      .catch(() => {})
  }, [])

  function ingest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      const c = await ingestAction(url)
      setCount(c)
    })
  }

  return (
    <form onSubmit={ingest} className="space-y-2">
      <h1 className="text-xl mb-4">Admin</h1>
      <input
        name="url"
        className="border p-2 w-full"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="CSV URL"
      />
      <button
        type="submit"
        disabled={pending}
        className="bg-green-600 text-white px-4 py-2 mt-2 disabled:opacity-50"
      >
        {pending ? 'Ingesting...' : 'Ingest'}
      </button>
      {count !== null && <p className="mt-2">Product count: {count}</p>}
    </form>
  )
}
