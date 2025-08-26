'use client'
import { useEffect } from 'react'

export function ResultModal({ imageUrl, onClose }: { imageUrl: string | null; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  if (!imageUrl) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 max-w-lg">
        <button onClick={onClose} className="mb-2">Close</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="Result" className="max-w-full" />
      </div>
    </div>
  )
}
