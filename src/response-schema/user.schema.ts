import { z } from 'zod'

import { baseResponseSchema } from '@/response-schema/base.schema'

const userDetailsSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string()
})

export const userDetailsResponseSchema = baseResponseSchema.extend({
  data: userDetailsSchema.nullable().optional()
})

export type UserDetailsResponse = z.infer<typeof userDetailsResponseSchema>