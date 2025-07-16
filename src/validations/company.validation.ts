import { z } from 'zod'

export const createCompanyValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    address: z.string().optional(),
  }),
})

export type CreateCompanyRequestDto = z.infer<typeof createCompanyValidation>['body']