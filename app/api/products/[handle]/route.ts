import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { handle: params.handle },
      select: {
        handle: true,
        title: true,
        shortDesc: true,
        description: true,
        brand: true,
        category: true,
        pattern: true,
        color: true,
        price: true,
        priceMin: true,
        priceMax: true,
        productUrl: true,
        imageUrls: true,
        tags: true,
        skus: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const images = (product.imageUrls || '').split('|').filter(Boolean)
    const tags = (product.tags || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
    const skus = (product.skus || '').split('|').filter(Boolean)

    const result = {
      handle: product.handle,
      title: product.title,
      shortDesc: product.shortDesc,
      description: product.description,
      brand: product.brand,
      category: product.category,
      pattern: product.pattern,
      color: product.color,
      price: product.price,
      priceMin: product.priceMin,
      priceMax: product.priceMax,
      productUrl: product.productUrl,
      images,
      tags,
      skus,
    }

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}