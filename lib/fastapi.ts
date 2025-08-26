const BASE = process.env.FASTAPI_BASE_URL || 'http://localhost:8000'

export async function startTryOn(user_photo_urls: string[], garment_image_url: string, options: any) {
  const res = await fetch(`${BASE}/try-on`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_photo_urls, garment_image_url, options }),
  })
  if (!res.ok) throw new Error('fastapi start failed')
  return res.json()
}

export async function fetchTryOnStatus(jobId: string) {
  const res = await fetch(`${BASE}/try-on/${jobId}`)
  if (!res.ok) throw new Error('fastapi status failed')
  return res.json()
}
