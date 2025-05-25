import { z } from 'zod'

import { baseResponseSchema } from '@/response-schema/base.schema'

const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string()
})

export const profileResponseSchema = baseResponseSchema.extend({
  data: userProfileSchema.nullable().optional()
})

export type UserProfileSchema = z.infer<typeof userProfileSchema> 