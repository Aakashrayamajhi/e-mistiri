import { z } from 'zod'

const safeJsonSchema = z.record(z.string(), z.unknown())

export const proxyRequestSchema = z.object({
  body: z
    .unknown()
    .refine(
      (val) => {
        if (typeof val === 'string') return val.length <= 10_000
        if (Buffer.isBuffer(val)) return val.length <= 10_000
        if (typeof val === 'object' && val !== null) {
          return JSON.stringify(val).length <= 10_000
        }
        return true
      },
      { message: 'Request body exceeds 10kb limit' }
    )
    .optional(),
  query: safeJsonSchema.optional(),
  params: safeJsonSchema.optional()
})
