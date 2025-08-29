import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { csvRowSchema, toProductDraft } from '@/lib/csv';
import { parse } from 'csv-parse';
import { Readable } from 'stream';

function driveUrl(url: string): string {
  const match = url.match(/\/file\/d\/([^/]+)\//);
  return match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : url;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let stream: Readable;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      const file = form.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      const buf = Buffer.from(await file.arrayBuffer());
      stream = Readable.from(buf);
    } else {
      const body = await req.json().catch(() => null);
      const url = body?.url;
      if (!url) {
        return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
      }
      const res = await fetch(driveUrl(url));
      if (!res.ok) {
        return NextResponse.json({ error: 'Failed to fetch CSV from URL' }, { status: 400 });
      }
      const text = await res.text();
      stream = Readable.from(text);
    }

    const parser = stream.pipe(
      parse({ columns: true, relax_column_count: true, skip_empty_lines: true, trim: true })
    );

    let ingestedCount = 0;
    for await (const raw of parser) {
      const parsed = csvRowSchema.safeParse(raw);
      if (!parsed.success) {
        console.error('Invalid row', parsed.error.message);
        continue;
      }
      const draft = toProductDraft(parsed.data);
      await prisma.product.upsert({
        where: { handle: draft.handle },
        update: draft,
        create: draft,
      });
      ingestedCount++;
    }

    return NextResponse.json({ ingestedCount });
  } catch (err) {
    console.error('Ingest error', err);
    return NextResponse.json({ error: 'Failed to ingest CSV' }, { status: 500 });
  }
}
