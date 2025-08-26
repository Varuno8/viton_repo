import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchTryOnStatus } from '@/lib/fastapi'

const BASE = process.env.NEXT_PUBLIC_FASTAPI_BASE_URL || 'http://localhost:8000'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  // Check if job exists in DB
  const job = await prisma.tryOnJob.findUnique({ where: { id } })

  if (job) {
    if (job.externalJobId && job.status === 'RUNNING') {
      try {
        const res = await fetchTryOnStatus(job.externalJobId)
        if (res.status && res.status !== job.status) {
          await prisma.tryOnJob.update({
            where: { id },
            data: {
              status: res.status,
              resultImageUrl: res.result_image_url,
              error: res.error,
            },
          })
        }
      } catch (e) {
        await prisma.tryOnJob.update({
          where: { id },
          data: { status: 'FAILED', error: String(e) },
        })
      }
    }
    const latest = await prisma.tryOnJob.findUnique({ where: { id } })
    return NextResponse.json(latest)
  }

  // Fallback: if job not in DB, call FastAPI directly (Codex behavior)
  const res = await fetch(`${BASE}/try-on/${id}`)
  if (!res.ok) {
    return NextResponse.json({ error: 'fastapi error' }, { status: 500 })
  }
  const data = await res.json()
  return NextResponse.json({
    status: data.status,
    resultImageUrl: data.result_image_url,
    error: data.error,
  })
}
