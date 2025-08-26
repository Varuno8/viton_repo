import clsx from 'clsx'

const colors: Record<string, string> = {
  PENDING: 'bg-gray-500',
  RUNNING: 'bg-blue-500',
  DONE: 'bg-green-600',
  FAILED: 'bg-red-600'
}

export function StatusBadge({ status }: { status: string }) {
  return <span className={clsx('px-2 py-1 text-white text-xs rounded', colors[status] || 'bg-gray-500')}>{status}</span>
}
