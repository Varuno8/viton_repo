import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { splitPipe, splitComma } from '@/lib/helpers';

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
      imageUrls: splitPipe(product.imageUrls),
      tags: splitComma(product.tags),
      skus: splitPipe(product.skus),
    };
    
    return NextResponse.json(productWithArrays);
  } catch (error) {
    console.error('Product API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' }, 
      { status: 500 }
    );
  }
}