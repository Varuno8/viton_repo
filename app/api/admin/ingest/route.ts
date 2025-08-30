import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isHMHeaders, parseHMRow, toProductDraft } from '@/lib/csv';
import { parse } from 'csv-parse/sync';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const form = await req.formData();
  const replaceAll = form.get('replace') !== null || form.get('replaceAll') === 'true';
  const file = form.get('file') as File | null;
  const url = (form.get('url') as string | null) ?? null;

  let csvBuffer: Buffer;
  if (file && file.size > 0) {
    csvBuffer = Buffer.from(await file.arrayBuffer());
  } else if (url) {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return NextResponse.json({ error: 'Failed to fetch CSV' }, { status: 400 });
    csvBuffer = Buffer.from(await r.arrayBuffer());
  } else {
    return NextResponse.json({ error: 'Provide file or url' }, { status: 400 });
  }

  const rows: any[] = parse(csvBuffer, { columns: true, skip_empty_lines: true, bom: true });
  if (!rows.length) return NextResponse.json({ ingestedCount: 0 }, { headers: { 'Cache-Control': 'no-store' } });

  const headers = Object.keys(rows[0]);
  const hm = isHMHeaders(headers);

  if (replaceAll) {
    await prisma.product.deleteMany({});
  }

  let count = 0;
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const draft = hm ? parseHMRow(row) : toProductDraft(row, i);
    if (!draft) continue;
    await prisma.product.upsert({
      where: { handle: draft.handle },
      update: { ...draft, updatedAt: new Date() },
      create: { ...draft },
    });
    count++;
  }

  return NextResponse.json(
    { ingestedCount: count },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
