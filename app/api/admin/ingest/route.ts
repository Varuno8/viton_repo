import { NextRequest, NextResponse } from 'next/server'
import { ingestCsvContent, ingestCsvFromUrl } from '@/lib/admin'

export async function POST(req: NextRequest) {
  const data = await req.json()
  if (data.url) {
    const count = await ingestCsvFromUrl(data.url)
    return NextResponse.json({ count })
  }
  if (data.csv) {
    const count = await ingestCsvContent(data.csv)
    return NextResponse.json({ count })
  }
  return NextResponse.json({ error: 'Missing csv' }, { status: 400 })
}
