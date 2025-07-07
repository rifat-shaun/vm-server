import { z } from 'zod'

export const baseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().nullable().optional(),
  errors: z.any().nullable().optional(),
})

export const errorResponseSchema = baseResponseSchema.extend({
  success: z.literal(false),
  errors: z.any().nullable().optional()
})

export type BaseResponse = z.infer<typeof baseResponseSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>