import { z } from 'zod'

import { baseResponseSchema } from '@/response-schema/base.schema'

export const companyResponseSchema = baseResponseSchema.extend({
  data: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string().nullable().optional(),
  }),
})

export type CompanyResponse = z.infer<typeof companyResponseSchema>