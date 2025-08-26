import fs from 'fs'
import { prisma } from '../lib/prisma'
import { parseProductCsv } from '../lib/csv'

async function main() {
  const csv = fs.readFileSync('data/products.csv', 'utf-8')
  const products = parseProductCsv(csv)
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
  console.log(`Ingested ${count} products`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
