import { NextRequest, NextResponse } from 'next/server';
import { ingestCsvContent, ingestCsvFromUrl } from '@/lib/admin';

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
        count = await ingestCsvContent(text, replace);
      } else if (url) {
        count = await ingestCsvFromUrl(url, replace);
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
        count = await ingestCsvContent(body.csv, replace);
      } else if (body.url) {
        count = await ingestCsvFromUrl(body.url, replace);
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
