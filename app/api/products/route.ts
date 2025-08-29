import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    
    const where = q ? {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { brand: { contains: q, mode: 'insensitive' as const } },
        { category: { contains: q, mode: 'insensitive' as const } },
      ]
    } : {};
    
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    
    const productsWithFirstImage = products.map(product => ({
      ...product,
      firstImage: product.imageUrls.split('|')[0] || null,
    }));
    
    return NextResponse.json(productsWithFirstImage);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}