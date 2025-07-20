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

export const checkUserResponseSchema = baseResponseSchema.extend({
  data: z.object({
    isUserExists: z.boolean(),
    isNewUser: z.boolean()
  })
})

export const loginResponseSchema = baseResponseSchema.extend({
  data: authDataSchema.nullable().optional()
})

export const forgotPasswordResponseSchema = baseResponseSchema.extend({
  data: z.object({
    user: userSchema
  })
})

export const resetPasswordResponseSchema = baseResponseSchema.extend({
  data: z.object({
    user: userSchema
  })
})

export const verifySessionResponseSchema = baseResponseSchema.extend({
  data: z.object({
    user: userSchema
  }).nullable().optional()
})

export const registerResponseSchema = loginResponseSchema

export type LoginResponse = z.infer<typeof loginResponseSchema>
export type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>
export type VerifySessionResponse = z.infer<typeof verifySessionResponseSchema>
export type RegisterResponse = z.infer<typeof registerResponseSchema>
export type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>