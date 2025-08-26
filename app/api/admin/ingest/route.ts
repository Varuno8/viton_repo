import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseProductCsv, toDirectDriveUrl } from '@/lib/csv'

export async function POST(req: NextRequest) {
  const data = await req.json()
  let csvContent = ''
  if (data.url) {
    const url = toDirectDriveUrl(data.url)
    const res = await fetch(url)
    csvContent = await res.text()
  } else if (data.csv) {
    csvContent = data.csv
  } else {
    return NextResponse.json({ error: 'Missing csv' }, { status: 400 })
  }
  const products = parseProductCsv(csvContent)
  for (const p of products) {
    await prisma.product.upsert({
      where: { handle: p.handle },
      update: {
        title: p.title,
        description: p.description,
        brand: p.brand,
        category: p.category,
        price: p.price,
        imageUrls: p.imageUrls,
        colors: p.colors,
        sizes: p.sizes,
      },
      create: {
        handle: p.handle,
        title: p.title,
        description: p.description,
        brand: p.brand,
        category: p.category,
        price: p.price,
        imageUrls: p.imageUrls,
        colors: p.colors,
        sizes: p.sizes,
      }
    })
  }
  const count = await prisma.product.count()
  return NextResponse.json({ count })
}
