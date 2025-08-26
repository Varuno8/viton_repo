import { parse } from 'csv-parse/sync';

export function parseKeyValueBlob(blob: string): Record<string, string> {
  const result: Record<string, string> = {};
  
  if (!blob) return result;
  
  const pairs = blob.split(';').map(s => s.trim()).filter(Boolean);
  
  for (const pair of pairs) {
    const colonIndex = pair.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = pair.substring(0, colonIndex).trim();
    const value = pair.substring(colonIndex + 1).trim();
    
    if (!key || !value) continue;
    
    // Normalize keys to camelCase
    const normalizedKey = normalizeKey(key);
    result[normalizedKey] = value;
  }
  
  return result;
}

function normalizeKey(key: string): string {
  const keyMap: Record<string, string> = {
    'title': 'title',
    'short description': 'shortDescription',
    'description': 'description',
    'pattern': 'pattern',
    'color': 'color',
    'product type': 'productType',
    'vendor': 'vendor',
    'tags': 'tags',
    'skus': 'skus',
    'price min': 'priceMin',
    'price max': 'priceMax',
    'price': 'price'
  };
  
  const normalized = key.toLowerCase().trim();
  return keyMap[normalized] || normalized.replace(/\s+/g, '');
}

export function splitSemicolonUrls(s?: string): string[] {
  if (!s) return [];
  
  const urls = s.split(';')
    .map(url => url.trim())
    .filter(Boolean);
  
  // Dedupe
  return [...new Set(urls)];
}

export function slugifyTitle(s?: string): string {
  if (!s) return '';
  
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

export function toProductDraft(row: any) {
  const blob = parseKeyValueBlob(row.description || '');
  const imageUrls = splitSemicolonUrls(row.image_url);
  
  return {
    handle: row.handle || slugifyTitle(blob.title || row.title),
    title: blob.title || row.title || '',
    shortDesc: blob.shortDescription || '',
    description: blob.description || row.description || '',
    brand: blob.vendor || row.vendor || '',
    category: blob.productType || row.product_type || '',
    pattern: blob.pattern || '',
    color: blob.color || '',
    tags: blob.tags || '',
    skus: blob.skus || '',
    price: parseFloat(blob.price || row.price || '0') || null,
    priceMin: parseFloat(blob.priceMin || '0') || null,
    priceMax: parseFloat(blob.priceMax || '0') || null,
    imageUrls: imageUrls.join('|'),
    productUrl: row.product_url || ''
  };
}

export function toDirectDriveUrl(input: string): string {
  const match = input.match(/\/file\/d\/([^/]+)\//);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return input;
}

export function parseProductCsv(csv: string) {
  const rows = parse(csv, { 
    columns: true, 
    skip_empty_lines: true,
    trim: true
  }) as any[];
  
  return rows.map(toProductDraft);
}