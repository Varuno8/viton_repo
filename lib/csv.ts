import { parse } from 'csv-parse/sync'

export function toDirectDriveUrl(input: string): string {
  const match = input.match(/\/file\/d\/([^/]+)\//)
  if (match) return `https://drive.google.com/uc?export=download&id=${match[1]}`
  return input
}

export function parseProductCsv(csv: string) {
  const rows = parse(csv, { columns: true, skip_empty_lines: true }) as any[]
  return rows.map(r => ({
    id: r.id,
    handle: r.handle,
    title: r.title,
    description: r.description,
    brand: r.brand,
    category: r.category,
    price: parseFloat(r.price || '0'),
    imageUrls: r.image_urls ? r.image_urls.split('|').map((s: string) => s.trim()) : [],
    colors: r.colors ? r.colors.split('|').map((s: string) => s.trim()) : [],
    sizes: r.sizes ? r.sizes.split('|').map((s: string) => s.trim()) : [],
  }))
}
