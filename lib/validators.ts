import { z } from 'zod'

export const uploadSchema = z.object({
  files: z.any().array().max(3)
})

export const ingestSchema = z
  .object({ url: z.string().url().optional(), csv: z.string().optional() })
  .refine(data => data.url || data.csv, { message: 'url or csv required' })
