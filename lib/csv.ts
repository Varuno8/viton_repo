import { z } from 'zod';
import { parse } from 'csv-parse/sync';

export function parseKeyValueBlob(blob: string): Record<string, string> {
  const result: Record<string, string> = {};
  if (!blob) return result;

  const tokens = blob.split(';').map(t => t.trim()).filter(Boolean);
  for (const token of tokens) {
    const idx = token.indexOf(':');
    if (idx === -1) continue;
    const key = token.slice(0, idx).trim().toLowerCase();
    const value = token.slice(idx + 1).trim();
    if (!key) continue;
    const normalized = key
      .replace(/\s+([a-z])/g, (_, c) => c.toUpperCase())
      .replace(/\s+/g, '');
    const camel = camelCaseMap[normalized] ?? normalized;
    result[camel] = value;
  }
  return result;
}

const camelCaseMap: Record<string, string> = {
  title: 'title',
  shortDescription: 'shortDescription',
  description: 'description',
  pattern: 'pattern',
  color: 'color',
  productType: 'productType',
  vendor: 'vendor',
  tags: 'tags',
  skus: 'skus',
  priceMin: 'priceMin',
  priceMax: 'priceMax',
  price: 'price',
};

export function splitSemicolonUrls(s?: string): string[] {
  if (!s) return [];
  const urls = s
    .split(';')
    .map(u => u.trim())
    .filter(u => /^https?:\/\//.test(u));
  return Array.from(new Set(urls));
}

export function slugifyTitle(input?: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

export function toDirectDriveUrl(url: string) {
  const match = url.match(/\/file\/d\/([^/]+)\//);
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url;
}

export function normalizeCsvRow(raw: any) {
  return {
    ...raw,
    description: raw.description ?? raw.Description ?? '',
    image_url: raw.image_url ?? raw.image_urls ?? raw.images ?? '',
    product_url: raw.product_url ?? raw.url ?? null,
  };
}

export function toProductDraft(row: any, index: number) {
  const blob = parseKeyValueBlob(row.description || '');
  let title = blob.title || row.title;

  if (!title && row.product_url) {
    try {
      const url = new URL(row.product_url);
      title = decodeURIComponent(url.pathname.split('/').filter(Boolean).pop() || '')
        .replace(/[-_]/g, ' ');
    } catch {
      /* ignore */
    }
  }
  if (!title) title = `Untitled ${index + 1}`;

  const handle = row.handle ?? slugifyTitle(title);

  const tags = (blob.tags || '')
    .split(/[,;]+/)
    .map((t: string) => t.trim())
    .filter(Boolean)
    .join(',');

  const skus = (blob.skus || '')
    .split(/[,;]+/)
    .map((s: string) => s.trim())
    .filter(Boolean)
    .join('|');

  const price = parseFloat(blob.price ?? row.price);
  const priceMin = parseFloat(blob.priceMin ?? row.priceMin);
  const priceMax = parseFloat(blob.priceMax ?? row.priceMax);

  return {
    handle,
    title,
    shortDesc: blob.shortDescription || null,
    description: blob.description || null,
    brand: blob.vendor || null,
    category: blob.productType || null,
    pattern: blob.pattern || null,
    color: blob.color || null,
    tags: tags || null,
    skus: skus || null,
    price: isNaN(price) ? null : price,
    priceMin: isNaN(priceMin) ? null : priceMin,
    priceMax: isNaN(priceMax) ? null : priceMax,
    imageUrls: splitSemicolonUrls(row.image_url).join('|'),
    productUrl: row.product_url || null,
  };
}

export const csvRowSchema = z.object({
  handle: z.string().optional(),
  description: z.string().optional().default(''),
  image_url: z.string().optional().default(''),
  product_url: z.string().optional().nullable(),
}).passthrough();

export function parseProductCsv(csv: string) {
  const records = parse(csv, {
    columns: true,
    relax_column_count: true,
    skip_empty_lines: true,
    trim: true,
  });
  const products = [] as ReturnType<typeof toProductDraft>[];
  records.forEach((raw, i) => {
    const normalized = normalizeCsvRow(raw);
    const parsed = csvRowSchema.safeParse(normalized);
    if (!parsed.success) return;
    products.push(toProductDraft(parsed.data, i));
  });
  return products;
}
