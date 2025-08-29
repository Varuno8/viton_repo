import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { handle: params.handle }
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    const productWithArrays = {
      ...product,
      imageUrls: product.imageUrls.split('|').filter(Boolean),
      tags: product.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? [],
      skus: product.skus?.split('|').filter(Boolean) ?? [],
    };
    
    return NextResponse.json(productWithArrays, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('Product API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' }, 
      { status: 500 }
    );
  }
}