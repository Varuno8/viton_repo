import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseProductCsv, toDirectDriveUrl } from '@/lib/csv';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type');
    let csvContent: string;
    
    if (contentType?.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      
      csvContent = await file.text();
    } else {
      const body = await req.json();
      const { url } = body;
      
      if (!url) {
        return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
      }
      
      const directUrl = toDirectDriveUrl(url);
      const response = await fetch(directUrl);
      
      if (!response.ok) {
        return NextResponse.json({ error: 'Failed to fetch CSV from URL' }, { status: 400 });
      }
      
      csvContent = await response.text();
    }
    
    const products = parseProductCsv(csvContent);
    let ingestedCount = 0;
    
    for (const productData of products) {
      await prisma.product.upsert({
        where: { handle: productData.handle },
        update: {
          title: productData.title,
          shortDesc: productData.shortDesc,
          description: productData.description,
          brand: productData.brand,
          category: productData.category,
          pattern: productData.pattern,
          color: productData.color,
          tags: productData.tags,
          skus: productData.skus,
          price: productData.price,
          priceMin: productData.priceMin,
          priceMax: productData.priceMax,
          imageUrls: productData.imageUrls,
          productUrl: productData.productUrl,
        },
        create: {
          handle: productData.handle,
          title: productData.title,
          shortDesc: productData.shortDesc,
          description: productData.description,
          brand: productData.brand,
          category: productData.category,
          pattern: productData.pattern,
          color: productData.color,
          tags: productData.tags,
          skus: productData.skus,
          price: productData.price,
          priceMin: productData.priceMin,
          priceMax: productData.priceMax,
          imageUrls: productData.imageUrls,
          productUrl: productData.productUrl,
        },
      });
      ingestedCount++;
    }
    
    return NextResponse.json({ ingestedCount });
  } catch (error) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      { error: 'Failed to ingest CSV' }, 
      { status: 500 }
    );
  }
}