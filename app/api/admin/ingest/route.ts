import { NextRequest, NextResponse } from 'next/server';
import { ingestCsvContent } from '@/lib/admin';
import { detectCsvParser } from '@/lib/csv';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let count: number;
    let replace = true;

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      replace = form.get('replace') !== null;
      const file = form.get('file') as File | null;
      const url = (form.get('url') as string | null)?.trim();
      if (file && file.size > 0) {
        const text = await file.text();
        const parser = detectCsvParser(text);
        count = await ingestCsvContent(text, replace, parser);
      } else if (url) {
        const res = await fetch(url);
        if (!res.ok) {
          return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
        }
        const text = await res.text();
        const parser = detectCsvParser(text);
        count = await ingestCsvContent(text, replace, parser);
      } else {
        return NextResponse.json({ error: 'No file or URL provided' }, { status: 400 });
      }
    } else {
      const body = await req.json().catch(() => null);
      if (!body) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
      }
      replace = body.replace !== false;
      if (body.csv) {
        const parser = detectCsvParser(body.csv);
        count = await ingestCsvContent(body.csv, replace, parser);
      } else if (body.url) {
        const res = await fetch(body.url);
        if (!res.ok) {
          return NextResponse.json({ error: 'Failed to fetch URL' }, { status: 400 });
        }
        const text = await res.text();
        const parser = detectCsvParser(text);
        count = await ingestCsvContent(text, replace, parser);
      } else {
        return NextResponse.json({ error: 'No CSV or URL provided' }, { status: 400 });
      }
    }

    return NextResponse.json({ ingestedCount: count }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    console.error('Ingest error', err);
    return NextResponse.json({ error: 'Failed to ingest CSV' }, { status: 500 });
  }
}
