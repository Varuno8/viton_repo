'use server'

import { ingestCsvFromUrl } from '@/lib/admin'

export async function ingestAction(url: string) {
  return ingestCsvFromUrl(url)
}
