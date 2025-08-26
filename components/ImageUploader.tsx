'use client'
import { useState } from 'react'

export function ImageUploader({ onUploaded }: { onUploaded: (urls: string[]) => void }) {
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 3)
    if (!files.length) return
    setPreviews(files.map(f => URL.createObjectURL(f)))
    const fd = new FormData()
    files.forEach(f => fd.append('files', f))
    setLoading(true)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      onUploaded(data.urls)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input type="file" accept="image/*" multiple onChange={handleChange} disabled={loading} />
      {previews.length > 0 && (
        <div className="flex gap-2 mt-2">
          {previews.map((u) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={u} src={u} className="w-16 h-16 object-cover rounded" alt="preview" />
          ))}
        </div>
      )}
    </div>
  )
}
