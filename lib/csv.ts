import { parse } from 'csv-parse/sync'

// basic string helpers
const norm = (s?: string | null) => (s ?? '').trim()
const lc = (s?: string | null) => norm(s).toLowerCase()

function getAny(row: Record<string, any>, ...keys: string[]) {
  const entries = Object.entries(row)
  for (const alias of keys) {
    const a = lc(alias).replace(/[\s_-]+/g, '')
    for (const [k, v] of entries) {
      const normKey = lc(k).replace(/[\s_-]+/g, '')
      if (normKey === a || normKey.includes(a) || a.includes(normKey)) {
        if (v != null && String(v).trim() !== '') return String(v)
      }
    }
  }
  return ''
}

function findUrls(row: Record<string, any>) {
  const urls: string[] = []
  for (const v of Object.values(row)) {
    if (typeof v === 'string' && /^https?:\/\//i.test(v.trim())) {
      urls.push(v.trim())
    }
  }
  return urls
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

export function parseRs(s?: string) {
  if (!s) return null
  const num = s.replace(/[^\d.]/g, '')
  const val = parseFloat(num)
  return Number.isNaN(val) ? null : val
}

export function parseHMRow(row: Record<string, any>, index: number) {
  const productUrl = norm(row['bae9f4 href'])
  const image = norm(row['ecac7b src'])
  let title = norm(row['b8e2ea'])
  if (!title && productUrl) {
    try {
      title = decodeURIComponent(
        new URL(productUrl).pathname.split('/').filter(Boolean).pop() || ''
      ).replace(/[-_]/g, ' ')
    } catch {
      /* ignore */
    }
  }
  if (!title) title = `Untitled ${index + 1}`
  const handle = slugifyTitle(title)
  return {
    handle,
    title,
    shortDesc: '',
    description: '',
    brand: 'H&M',
    category: '',
    pattern: '',
    color: '',
    tags: '',
    skus: '',
    price: parseRs(row['c166ec']),
    priceMin: parseRs(row['c166ec 2']),
    priceMax: null,
    imageUrls: image || '',
    productUrl: productUrl || null,
  }
}

export function detectCsvParser(csv: string): 'default' | 'hm' {
  const firstLine = csv.split(/\r?\n/)[0].toLowerCase()
  return firstLine.includes('bae9f4 href') ? 'hm' : 'default'
}

export function toProductDraft(row: Record<string, any>, index: number) {
  const blob = parseKeyValueBlob(
    getAny(row, 'description', 'Description', 'desc', 'details', 'long_description')
  )

  const taglineVal = Object.values(row).find(v =>
    typeof v === 'string' && /save .+ to favourites/i.test(v)
  ) as string | undefined

  const allUrls = findUrls(row)

  let productUrl = getAny(row, 'product_url', 'url', 'link', 'href')
  if (!productUrl) {
    productUrl = allUrls.find(u => !/\.(jpe?g|png|gif|webp)(\?|$)/i.test(u)) || ''
  }

  let fromUrl = ''
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

  let title = norm(blob['title'] || getAny(row, 'title', 'name') || '')
  if (!title && taglineVal) {
    const m = taglineVal.match(/save (.+) to favourites/i)
    if (m) title = norm(m[1])
  }
  if (!title) {
    for (const v of Object.values(row)) {
      if (typeof v !== 'string') continue
      const t = norm(v)
      if (
        t &&
        !/^https?:/i.test(t) &&
        !/rs\.?/i.test(t) &&
        !/^[+\d]/.test(t)
      ) {
        title = t
        break
      }
    }
  }
  if (!title) title = fromUrl || `Untitled ${index + 1}`

  let images = splitMultiUrls(
    getAny(
      row,
      'image_url',
      'image_urls',
      'images',
      'image',
      'photos',
      'picture_urls',
      'src'
    )
  )
  if (images.length === 0) {
    images = allUrls.filter(u => /\.(jpe?g|png|gif|webp)(\?|$)/i.test(u))
  }

  const handle =
    norm(row.handle && String(row.handle)) || slugifyTitle(title)

  if (!title && !handle) {
    console.warn('Skipping row with empty title and handle', row)
    return null
  }

  const shortDesc = norm(
    blob['short description'] ||
      (taglineVal ? taglineVal.replace(/save|to favourites/gi, '').trim() : '')
  )
  const description = norm(blob['description'] || shortDesc)

  const draft = {
    handle,
    title,
    shortDesc,
    description,
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

export function parseProductCsv(csv: string, parser?: 'default' | 'hm') {
  const records = parse(csv, {
    columns: true,
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  })

  const mode = parser ?? detectCsvParser(csv)

  const products: NonNullable<ReturnType<typeof toProductDraft>>[] = []
  records.forEach((raw, i) => {
    const draft = mode === 'hm' ? parseHMRow(raw, i) : toProductDraft(raw, i)
    if (draft) products.push(draft)
  })
  return products
}

export { norm, lc, getAny, detectCsvParser }

