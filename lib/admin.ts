import { prisma } from './prisma'
import { parseProductCsv, toDirectDriveUrl } from './csv'

export async function ingestCsvContent(csv: string) {
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
      },
    })
  }
  return prisma.product.count()
}

export async function ingestCsvFromUrl(url: string) {
  const direct = toDirectDriveUrl(url)
  if (!direct) throw new Error('Invalid url')
  const res = await fetch(direct)
  const csv = await res.text()
  return ingestCsvContent(csv)
}
