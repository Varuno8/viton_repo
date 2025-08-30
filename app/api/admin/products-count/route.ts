import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const count = await prisma.product.count();
  return NextResponse.json({ count }, { headers: { 'Cache-Control': 'no-store' } });
}
