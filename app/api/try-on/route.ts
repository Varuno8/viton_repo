import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'
import { startTryOn } from '@/lib/fastapi'

export async function POST(req: NextRequest) {
  const session = await getAuthSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { productId, userPhotoUrls, options } = await req.json()
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
  const job = await prisma.tryOnJob.create({ data: { userId: session.user.id, productId, userPhotoUrls } })
  try {
    const res = await startTryOn(userPhotoUrls, product.imageUrls[0], options)
    await prisma.tryOnJob.update({ where: { id: job.id }, data: { externalJobId: res.job_id, status: 'RUNNING' } })
  } catch (e) {
    await prisma.tryOnJob.update({ where: { id: job.id }, data: { status: 'FAILED', error: String(e) } })
  }
  return NextResponse.json({ id: job.id })
}
