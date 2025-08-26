'use client'
import { useEffect, useState } from 'react'
import { getHistory, HistoryItem } from '@/lib/history'
import { StatusBadge } from '@/components/StatusBadge'

export default function HistoryPage() {
  const [jobs, setJobs] = useState<HistoryItem[]>([])
  useEffect(() => {
    setJobs(getHistory())
  }, [])
  return (
    <div>
      <h1 className="text-xl mb-4">Try-On History</h1>
      <ul className="space-y-4">
        {jobs.map(job => (
          <li key={job.id} className="flex items-center gap-2">
            <StatusBadge status={job.status} />
            {job.resultImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={job.resultImageUrl} className="w-20 h-20 object-cover" />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
