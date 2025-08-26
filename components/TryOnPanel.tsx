'use client'
import { useState } from 'react'
import { ImageUploader } from './ImageUploader'

export function TryOnPanel({ productId }: { productId: string }) {
  const [urls, setUrls] = useState<string[]>([])
  const [status, setStatus] = useState('')
  const [result, setResult] = useState<string | null>(null)

  async function start() {
    const res = await fetch('/api/try-on', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userPhotoUrls: urls, options: {} })
    })
    if (!res.ok) return
    const { id } = await res.json()
    poll(id)
  }

  function poll(id: string) {
    const t = setInterval(async () => {
      const res = await fetch(`/api/try-on/status?id=${id}`)
      const data = await res.json()
      setStatus(data.status)
      if (data.status === 'DONE' || data.status === 'FAILED') {
        clearInterval(t)
        if (data.resultImageUrl) setResult(data.resultImageUrl)
      }
    }, 3000)
  }

  return (
    <div className="border p-4 mt-4">
      <ImageUploader onUploaded={setUrls} />
      <button onClick={start} className="mt-2 bg-blue-500 text-white px-4 py-2">Try On</button>
      {status && <p>Status: {status}</p>}
      {result && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={result} className="mt-2" />
      )}
    </div>
  )
}
