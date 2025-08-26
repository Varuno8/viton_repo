'use client'

export interface HistoryItem {
  id: string
  productId: string
  status: string
  resultImageUrl?: string | null
  createdAt: string
}

const KEY = 'tryOnHistory'

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]') as HistoryItem[]
  } catch {
    return []
  }
}

export function addHistory(item: HistoryItem) {
  const history = getHistory()
  history.unshift(item)
  localStorage.setItem(KEY, JSON.stringify(history.slice(0, 50)))
}
