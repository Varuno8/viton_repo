import { prisma } from './prisma';
import { isHMHeaders, parseHMRow, toProductDraft } from './csv';
import { parse } from 'csv-parse/sync';

export async function ingestCsvContent(csv: string, replace = true) {
  const rows: any[] = parse(csv, { columns: true, skip_empty_lines: true, bom: true });
  if (!rows.length) return 0;
  const hm = isHMHeaders(Object.keys(rows[0]));

  await prisma.$transaction(async tx => {
    if (replace) {
      await tx.product.deleteMany();
    }
    for (let i = 0; i < rows.length; i++) {
      const draft = hm ? parseHMRow(rows[i]) : toProductDraft(rows[i], i);
      if (!draft) continue;
      await tx.product.upsert({
        where: { handle: draft.handle },
        update: { ...draft, updatedAt: new Date() },
        create: { ...draft },
      });
    }
  });

  return rows.length;
}

export async function ingestCsvFromUrl(url: string, replace = true) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch CSV from URL');
  const csv = await res.text();
  return ingestCsvContent(csv, replace);
}
