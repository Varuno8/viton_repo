import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchTryOnStatus } from '@/lib/fastapi'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const job = await prisma.tryOnJob.findUnique({ where: { id } })
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (job.externalJobId && job.status === 'RUNNING') {
    try {
      const res = await fetchTryOnStatus(job.externalJobId)
      if (res.status && res.status !== job.status) {
        await prisma.tryOnJob.update({ where: { id }, data: { status: res.status, resultImageUrl: res.result_image_url, error: res.error } })
      }
    } catch (e) {
      await prisma.tryOnJob.update({ where: { id }, data: { status: 'FAILED', error: String(e) } })
    }
  }
  const latest = await prisma.tryOnJob.findUnique({ where: { id } })
  return NextResponse.json(latest)
}
