import { NextRequest, NextResponse } from 'next/server'
import { getProducts } from '@/lib/products'

const BASE = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000'

export async function POST(req: NextRequest) {
  const { productId, userPhotoUrls, size, color, garmentImageUrl } = await req.json()
  let gUrl = garmentImageUrl
  if (!gUrl) {
    const products = await getProducts()
    const prod = products.find(p => p.id === productId)
    gUrl = prod?.imageUrls[0]
  }
  const res = await fetch(`${BASE}/try-on`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_photo_urls: userPhotoUrls,
      garment_image_url: gUrl,
      options: { size, color },
    }),
  })
  if (!res.ok) return NextResponse.json({ error: 'fastapi error' }, { status: 500 })
  const data = await res.json()
  return NextResponse.json({ job_id: data.job_id })
}
