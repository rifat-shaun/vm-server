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

export const registerResponseSchema = loginResponseSchema

export type LoginResponse = z.infer<typeof loginResponseSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>
export type UserSchema = z.infer<typeof userSchema> 