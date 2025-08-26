'use client'
import { useState } from 'react'

export default function AdminPage() {
  const [url, setUrl] = useState('')
  const [count, setCount] = useState<number | null>(null)
  async function ingest() {
    const res = await fetch('/api/admin/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })
    if (res.ok) {
      const data = await res.json()
      setCount(data.count)
    }
  }
  return (
    <div>
      <h1 className="text-xl mb-4">Admin</h1>
      <input className="border p-2 w-full" value={url} onChange={e => setUrl(e.target.value)} placeholder="CSV URL" />
      <button onClick={ingest} className="bg-green-600 text-white px-4 py-2 mt-2">Ingest</button>
      {count !== null && <p className="mt-2">Product count: {count}</p>}
    </div>
  )
}
