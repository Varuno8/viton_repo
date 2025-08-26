'use server'

import { ingestCsvContent, ingestCsvFromUrl } from '@/lib/admin'

export async function ingestAction(prevState: any, formData: FormData) {
  const url = (formData.get('url') as string | null)?.trim()
  const file = formData.get('file') as File | null
  try {
    let count: number
    if (file && file.size > 0) {
      const text = await file.text()
      count = await ingestCsvContent(text)
    } else if (url) {
      count = await ingestCsvFromUrl(url)
    } else {
      return { error: 'Provide CSV URL or file', count: null }
    }
    return { count, error: null }
  } catch (e: any) {
    return { error: e.message, count: null }
  }
}
