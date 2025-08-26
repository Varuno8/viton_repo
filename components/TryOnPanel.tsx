'use client'
import { useState } from 'react'
import { ImageUploader } from './ImageUploader'
import { ResultModal } from './ResultModal'
import { Product } from '@/lib/products'
import { addHistory } from '@/lib/history'

export function TryOnPanel({ product }: { product: Product }) {
  const [urls, setUrls] = useState<string[]>([])
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [size, setSize] = useState(product.sizes[0] || '')
  const [color, setColor] = useState(product.colors[0] || '')

  async function start() {
    const res = await fetch('/api/try-on', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: product.id,
        userPhotoUrls: urls,
        size,
        color,
        garmentImageUrl: product.imageUrls[0],
      }),
    })
    if (!res.ok) return
    const { job_id } = await res.json()
    setStatus('PENDING')
    poll(job_id)
  }

  function poll(id: string) {
    const t = setInterval(async () => {
      const res = await fetch(`/api/try-on/status?id=${id}`)
      if (!res.ok) return
      const data = await res.json()
      setStatus(data.status)
      if (data.status === 'DONE' || data.status === 'FAILED') {
        clearInterval(t)
        setResult(data.resultImageUrl || null)
        addHistory({
          id,
          productId: product.id,
          status: data.status,
          resultImageUrl: data.resultImageUrl,
          createdAt: new Date().toISOString(),
        })
      }
    }, 3000)
  }

  return (
    <div className="border p-4 mt-4 space-y-2">
      <div className="flex gap-2">
        {product.colors.length > 0 && (
          <select value={color} onChange={e => setColor(e.target.value)} className="border p-1">
            {product.colors.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        )}
        {product.sizes.length > 0 && (
          <select value={size} onChange={e => setSize(e.target.value)} className="border p-1">
            {product.sizes.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}
      </div>
      <ImageUploader onUploaded={setUrls} />
      <button
        onClick={start}
        disabled={!urls.length}
        className="mt-2 bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
      >
        Try On
      </button>
      {status && <p>Status: {status}</p>}
      <ResultModal imageUrl={result} onClose={() => setResult(null)} />
    </div>
  )
}
