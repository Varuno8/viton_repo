import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { saveBuffer } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const session = await getAuthSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const form = await req.formData()
  const files = form.getAll('files') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'No files' }, { status: 400 })
  }
  if (files.length > 3) {
    return NextResponse.json({ error: 'Too many files' }, { status: 400 })
  }

  const urls: string[] = []

  for (const file of files) {
    if (file.size > 8_000_000) {
      // skip files over 8MB
      continue
    }
    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.type.split('/')[1] || 'jpg'
    const url = await saveBuffer(buffer, session.user.id, ext)
    urls.push(url)
  }

  return NextResponse.json({ urls })
}
