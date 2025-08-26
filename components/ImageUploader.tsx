'use client'
import { useState } from 'react'

export function ImageUploader({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const [urls, setUrls] = useState<string[]>([])

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 3)
    const uploaded: string[] = []

    for (const file of files) {
      const buffer = await file.arrayBuffer()
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'content-type': file.type },
        body: buffer,
      })
      if (res.ok) {
        const data = await res.json()
        uploaded.push(data.url)
      }
    }

    setUrls(uploaded)
    onUploaded(uploaded)
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleChange} />
      <div className="flex gap-2 mt-2">
        {urls.map(u => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={u} src={u} className="w-16 h-16 object-cover" />
        ))}
      </div>
    </div>
  )
}
