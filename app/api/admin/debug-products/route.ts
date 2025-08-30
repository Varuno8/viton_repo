import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rows = await prisma.product.findMany({
    take: 5,
    select: {
      handle: true,
      title: true,
      shortDesc: true,
      imageUrls: true,
      productUrl: true,
    },
  })
  return NextResponse.json(rows, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

