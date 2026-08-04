import { z } from 'zod'

export const healthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string().datetime(),
  environment: z.string()
})
