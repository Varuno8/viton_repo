'use server'

import { ingestCsvContent } from '@/lib/admin'
import { detectCsvParser } from '@/lib/csv'

export async function ingestAction(prevState: any, formData: FormData) {
  const url = (formData.get('url') as string | null)?.trim()
  const file = formData.get('file') as File | null
  const replace = formData.get('replace') !== null
  try {
    let count: number
    if (file && file.size > 0) {
      const text = await file.text()
      const parser = detectCsvParser(text)
      count = await ingestCsvContent(text, replace, parser)
    } else if (url) {
      const res = await fetch(url)
      if (!res.ok) return { error: 'Failed to fetch URL', count: null }
      const text = await res.text()
      const parser = detectCsvParser(text)
      count = await ingestCsvContent(text, replace, parser)
    } else {
      return { error: 'Provide CSV URL or file', count: null }
    }
    return { count, error: null }
  } catch (e: any) {
    return { error: e.message, count: null }
  }
}
