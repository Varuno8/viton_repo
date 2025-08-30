import { prisma } from './prisma'
import { parseProductCsv, toDirectDriveUrl } from './csv'

export async function ingestCsvContent(csv: string, replace = true) {
  const products = parseProductCsv(csv)

  products.slice(0, 5).forEach(p => {
    const imageCount = (p.imageUrls || '').split('|').filter(Boolean).length
    console.log({ title: p.title, imageCount, hasDesc: !!p.description })
  })

  await prisma.$transaction(async tx => {
    if (replace) {
      await tx.product.deleteMany()
    }
    for (const p of products) {
      await tx.product.upsert({
        where: { handle: p.handle },
        update: p,
        create: p,
      })
    }
  })

  return products.length
}

export async function ingestCsvFromUrl(url: string, replace = true) {
  const direct = toDirectDriveUrl(url)
  const res = await fetch(direct)
  if (!res.ok) throw new Error('Failed to fetch CSV from URL')
  const csv = await res.text()
  return ingestCsvContent(csv, replace)
}
