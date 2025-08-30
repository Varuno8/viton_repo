'use client'
import { useActionState, useEffect, useState } from 'react'
import { ingestAction } from './actions'
import { api } from '@/lib/api'

const initialState = { count: null as number | null, error: null as string | null }

export default function AdminPage() {
  const [state, formAction] = useActionState(ingestAction, initialState)
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    api<{ count: number }>('/api/admin/products-count')
      .then(res => setCount(res.count))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (state.count !== null) {
      api<{ count: number }>('/api/admin/products-count')
        .then(res => setCount(res.count))
        .catch(() => {})
    }
  }, [state.count])

  return (
    <form action={formAction} className="space-y-4" encType="multipart/form-data">
      <h1 className="text-xl font-semibold">Admin</h1>
      <input name="url" type="url" placeholder="Google Drive CSV URL" className="w-full border p-2 rounded" />
      <input name="file" type="file" accept=".csv" className="w-full border p-2 rounded" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="replace" defaultChecked />
        Replace all products
      </label>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">Ingest</button>
      {count !== null && <p className="text-sm">Product count: {count}</p>}
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </form>
  )
}
