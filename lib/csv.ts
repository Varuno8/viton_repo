// CSV parsing helpers for product ingestion

export const norm = (s?: string | null) => (s ?? '').trim();
export const lc = (s?: string | null) => norm(s).toLowerCase();

export function parseRs(s?: string | null) {
  if (!s) return null;
  const num = String(s).replace(/[^\d.]/g, '');
  const n = parseFloat(num);
  return Number.isFinite(n) ? n : null;
}

export function splitMultiUrls(s?: string | null) {
  if (!s) return [];
  const normalized = String(s).replace(/\|/g, ';');
  const pieces = normalized.split(';').flatMap(seg => seg.split(','));
  const urls = Array.from(
    new Set(
      pieces
        .map(x => x.trim())
        .filter(x => /^https?:\/\//i.test(x))
    )
  );
  return urls;
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'untitled';
}

export function parseKeyValueBlob(blob?: string) {
  const out: Record<string, string> = {};
  const s = (blob || '').replace(/\r?\n/g, ' ').trim();
  if (!s) return out;
  for (const token of s.split(';')) {
    const t = token.trim();
    if (!t) continue;
    const idx = t.indexOf(':');
    if (idx === -1) continue;
    const key = t.slice(0, idx).trim().toLowerCase();
    const val = t.slice(idx + 1).trim();
    out[key] = val;
  }
  return out;
}

export function getAny(row: Record<string, any>, ...keys: string[]) {
  for (const k of keys) {
    const v =
      row[k] ??
      row[k?.toLowerCase?.()] ??
      row[k?.toUpperCase?.()];
    if (v != null && String(v).trim() !== '') return String(v);
  }
  return '';
}

function findUrls(row: Record<string, any>) {
  const urls: string[] = [];
  for (const v of Object.values(row)) {
    if (typeof v === 'string' && /^https?:\/\//i.test(v.trim())) {
      urls.push(v.trim());
    }
  }
  return urls;
}

export function toProductDraft(row: Record<string, any>, index: number) {
  const blob = parseKeyValueBlob(
    getAny(row, 'description', 'Description', 'desc', 'details', 'long_description')
  );

  const taglineVal = Object.values(row).find(v =>
    typeof v === 'string' && /save .+ to favourites/i.test(v)
  ) as string | undefined;

  const allUrls = findUrls(row);

  let productUrl = getAny(row, 'product_url', 'url', 'link', 'href');
  if (!productUrl) {
    productUrl = allUrls.find(u => !/\.(jpe?g|png|gif|webp)(\?|$)/i.test(u)) || '';
  }

  let fromUrl = '';
  if (!blob['title'] && productUrl) {
    try {
      const u = new URL(productUrl);
      fromUrl = decodeURIComponent(
        u.pathname
          .split('/')
          .filter(Boolean)
          .pop() || ''
      ).replace(/[-_]/g, ' ');
    } catch {
      /* ignore */
    }
  }

  let title = norm(blob['title'] || getAny(row, 'title', 'name') || '');
  if (!title && taglineVal) {
    const m = taglineVal.match(/save (.+) to favourites/i);
    if (m) title = norm(m[1]);
  }
  if (!title) {
    for (const v of Object.values(row)) {
      if (typeof v !== 'string') continue;
      const t = norm(v);
      if (
        t &&
        !/^https?:/i.test(t) &&
        !/rs\.?/i.test(t) &&
        !/^[+\d]/.test(t)
      ) {
        title = t;
        break;
      }
    }
  }
  if (!title) title = fromUrl || `Untitled ${index + 1}`;

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
  );
  if (images.length === 0) {
    images = allUrls.filter(u => /\.(jpe?g|png|gif|webp)(\?|$)/i.test(u));
  }

  const handle = norm(row.handle && String(row.handle)) || slugifyTitle(title);

  if (!title && !handle) {
    console.warn('Skipping row with empty title and handle', row);
    return null;
  }

  const shortDesc = norm(
    blob['short description'] ||
      (taglineVal ? taglineVal.replace(/save|to favourites/gi, '').trim() : '')
  );
  const description = norm(blob['description'] || shortDesc);

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
      const v = parseFloat(blob['price'] || '');
      return isNaN(v) ? null : v;
    })(),
    priceMin: (() => {
      const v = parseFloat(blob['price min'] || '');
      return isNaN(v) ? null : v;
    })(),
    priceMax: (() => {
      const v = parseFloat(blob['price max'] || '');
      return isNaN(v) ? null : v;
    })(),
    imageUrls: images.join('|'),
    productUrl: productUrl || null,
  };

  return draft;
}

export function isHMHeaders(headers: string[]) {
  const set = new Set(headers.map(h => h.trim().toLowerCase()));
  return set.has('bae9f4 href') && set.has('ecac7b src') && set.has('b8e2ea');
}

export function parseHMRow(row: Record<string, any>) {
  const productUrl = norm(row['bae9f4 href']);
  const imageUrl = norm(row['ecac7b src']);
  const title = norm(row['b8e2ea']) || 'Untitled';
  const price = parseRs(row['c166ec']);
  const member = parseRs(row['c166ec 2']);

  return {
    handle: slugifyTitle(title),
    title,
    brand: 'H&M',
    category: '',
    shortDesc: '',
    description: '',
    pattern: '',
    color: '',
    price,
    priceMin: member,
    priceMax: null,
    tags: '',
    skus: '',
    imageUrls: imageUrl || '',
    productUrl: productUrl || null,
  };
}

