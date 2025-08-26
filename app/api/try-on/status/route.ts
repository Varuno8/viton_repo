import { NextRequest, NextResponse } from 'next/server'

const BASE = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const res = await fetch(`${BASE}/try-on/${id}`)
  if (!res.ok) return NextResponse.json({ error: 'fastapi error' }, { status: 500 })
  const data = await res.json()
  return NextResponse.json({ status: data.status, resultImageUrl: data.result_image_url, error: data.error })
}
