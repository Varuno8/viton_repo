import { NextRequest, NextResponse } from 'next/server'
import { parseProductCsv } from '@/lib/csv'
import { toDirectDriveUrl } from '@/lib/drive'
import { getProducts, saveProducts } from '@/lib/products'

export async function POST(req: NextRequest) {
  const data = await req.json()
  let csvContent = ''
  if (data.url) {
    const direct = toDirectDriveUrl(data.url)
    if (!direct) return NextResponse.json({ error: 'Invalid url' }, { status: 400 })
    const res = await fetch(direct)
    csvContent = await res.text()
  } else if (data.csv) {
    csvContent = data.csv
  } else {
    return NextResponse.json({ error: 'Missing csv' }, { status: 400 })
  }
  const newProducts = parseProductCsv(csvContent)
  const existing = await getProducts()
  const map = new Map(existing.map(p => [p.handle, p]))
  newProducts.forEach(p => map.set(p.handle, p))
  const merged = Array.from(map.values())
  await saveProducts(merged)
  return NextResponse.json({ count: merged.length })
}
