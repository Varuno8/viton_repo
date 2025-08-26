import { NextRequest, NextResponse } from 'next/server'
import { getAuthSession } from '@/lib/auth'
import { saveBuffer } from '@/lib/storage'

export async function POST(req: NextRequest) {
  const session = await getAuthSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const arrayBuffer = await req.arrayBuffer()
  const contentType = req.headers.get('content-type') || 'image/jpeg'
  const ext = contentType.split('/')[1]
  const url = await saveBuffer(Buffer.from(arrayBuffer), session.user.id, ext)
  return NextResponse.json({ url })
}
