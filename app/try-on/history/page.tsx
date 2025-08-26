import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'
import { StatusBadge } from '@/components/StatusBadge'

export default async function HistoryPage() {
  const session = await getAuthSession()
  if (!session?.user) return <div>Please sign in</div>
  const jobs = await prisma.tryOnJob.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div>
      <h1 className="text-xl mb-4">Try-On History</h1>
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job.id} className="flex items-center gap-2">
            <StatusBadge status={job.status} />
            {job.resultImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={job.resultImageUrl} className="w-40 h-40 object-cover" />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
