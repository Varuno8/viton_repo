import fs from 'fs';
import { prisma } from '../lib/prisma';
import { parseProductCsv } from '../lib/csv';

async function main() {
  const csvPath = process.argv[2] || 'data/wrogn_tshirts_min.csv';
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }
  
  const csv = fs.readFileSync(csvPath, 'utf-8');
  const products = parseProductCsv(csv);
  
  console.log(`Parsed ${products.length} products from CSV`);
  
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
  }
  
  const count = await prisma.product.count();
  console.log(`Ingested products. Total count: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });