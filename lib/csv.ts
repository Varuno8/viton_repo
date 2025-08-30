import { parse } from 'csv-parse/sync'

// basic string helpers
const norm = (s?: string | null) => (s ?? '').trim()
const lc = (s?: string | null) => norm(s).toLowerCase()

function getAny(row: Record<string, any>, ...keys: string[]) {
  for (const k of keys) {
    const v =
      row[k] ??
      row[k?.toLowerCase?.()] ??
      row[k?.toUpperCase?.()]
    if (v != null && String(v).trim() !== '') return String(v)
  }
  return ''
}

export function splitMultiUrls(s?: string) {
  if (!s) return []
  const normalized = String(s).replace(/\|/g, ';')
  const pieces = normalized.split(';').flatMap(seg => seg.split(','))
  const urls = Array.from(
    new Set(
      pieces
        .map(x => x.trim())
        .filter(x => /^https?:\/\//i.test(x))
    )
  )
  return urls
}

export function parseKeyValueBlob(blob?: string) {
  const out: Record<string, string> = {}
  const s = (blob || '').replace(/\r?\n/g, ' ').trim()
  if (!s) return out
  for (const token of s.split(';')) {
    const t = token.trim()
    if (!t) continue
    const idx = t.indexOf(':')
    if (idx === -1) continue
    const key = t.slice(0, idx).trim().toLowerCase()
    const val = t.slice(idx + 1).trim()
    out[key] = val
  }
  return out
}

export function slugifyTitle(input?: string) {
  if (!input) return ''
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

export function toDirectDriveUrl(url: string) {
  const match = url.match(/\/file\/d\/([^/]+)\//)
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url
}

export function toProductDraft(row: Record<string, any>, index: number) {
  const blob = parseKeyValueBlob(
    getAny(row, 'description', 'Description', 'desc', 'details', 'long_description')
  )

  let fromUrl = ''
  const productUrl = getAny(row, 'product_url', 'url', 'link')
  if (!blob['title'] && productUrl) {
    try {
      const u = new URL(productUrl)
      fromUrl = decodeURIComponent(
        u.pathname
          .split('/')
          .filter(Boolean)
          .pop() || ''
      ).replace(/[-_]/g, ' ')
    } catch {
      /* ignore */
    }
  }

  const title =
    norm(blob['title'] || getAny(row, 'title', 'name') || fromUrl) ||
    `Untitled ${index + 1}`

  const images = splitMultiUrls(
    getAny(
      row,
      'image_url',
      'image_urls',
      'images',
      'image',
      'photos',
      'picture_urls'
    )
  )

  const handle =
    norm(row.handle && String(row.handle)) || slugifyTitle(title)

  if (!title && !handle) {
    console.warn('Skipping row with empty title and handle', row)
    return null
  }

  const draft = {
    handle,
    title,
    shortDesc: norm(blob['short description'] || ''),
    description: norm(blob['description'] || blob['short description'] || ''),
    brand: norm(blob['vendor'] || ''),
    category: norm(blob['product type'] || ''),
    pattern: norm(blob['pattern'] || ''),
    color: norm(blob['color'] || ''),
    tags: (blob['tags'] || '')
      .split(/[;,]+/)
      .map(s => norm(s))
      .filter(Boolean)
      .join(','),
    skus: (blob['skus'] || '')
      .split(/[;,]+/)
      .map(s => norm(s))
      .filter(Boolean)
      .join('|'),
    price: (() => {
      const v = parseFloat(blob['price'] || '')
      return isNaN(v) ? null : v
    })(),
    priceMin: (() => {
      const v = parseFloat(blob['price min'] || '')
      return isNaN(v) ? null : v
    })(),
    priceMax: (() => {
      const v = parseFloat(blob['price max'] || '')
      return isNaN(v) ? null : v
    })(),
    imageUrls: images.join('|'),
    productUrl: productUrl || null,
  }

  return draft
}

export function parseProductCsv(csv: string) {
  const records = parse(csv, {
    columns: true,
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  })

  const products: NonNullable<ReturnType<typeof toProductDraft>>[] = []
  records.forEach((raw, i) => {
    const draft = toProductDraft(raw, i)
    if (draft) products.push(draft)
  })
  return products
}

export { norm, lc, getAny }

