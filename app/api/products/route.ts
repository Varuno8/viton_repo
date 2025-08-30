import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''

    const where = q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { brand: { contains: q, mode: 'insensitive' as const } },
            { category: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        handle: true,
        title: true,
        shortDesc: true,
        brand: true,
        category: true,
        price: true,
        imageUrls: true,
      },
    })

    const result = products.map(p => ({
      handle: p.handle,
      title: p.title,
      shortDesc: p.shortDesc,
      brand: p.brand,
      category: p.category,
      price: p.price,
      firstImage: p.imageUrls?.split('|')[0] || null,
    }))

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}