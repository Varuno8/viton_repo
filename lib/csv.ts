import { z } from 'zod';

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

export function toProductDraft(row: any) {
  const blob = parseKeyValueBlob(row.description || '');
  const title = blob.title || row.title || 'Untitled';
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
