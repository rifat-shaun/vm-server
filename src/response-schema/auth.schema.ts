import { z } from 'zod'

import { baseResponseSchema } from '@/response-schema/base.schema'

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
})

const authDataSchema = z.object({
  token: z.string(),
  user: userSchema
})

export const loginResponseSchema = baseResponseSchema.extend({
  data: authDataSchema.nullable().optional()
})

export const forgotPasswordResponseSchema = baseResponseSchema.extend({
  data: z.object({
    user: userSchema
  })
})

export const registerResponseSchema = loginResponseSchema

export type LoginResponse = z.infer<typeof loginResponseSchema>
export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>