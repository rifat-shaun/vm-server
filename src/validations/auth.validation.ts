import { z } from 'zod'

// Common auth validation schemas
const emailValidation = z.string().email('Invalid email format').optional()
const mobileNumberValidation = z.string()
  .min(6, 'Mobile number is too short')
  .max(15, 'Mobile number is too long')
  .regex(/^\d+$/, 'Mobile number must contain only digits')
  .optional()

const baseAuthSchema = z.object({
  email: emailValidation,
  mobileNumber: mobileNumberValidation,
})

const contactInfoSchema = baseAuthSchema.refine((data) => data.email || data.mobileNumber, {
  message: 'Either email or mobile number is required',
  path: ['email', 'mobileNumber']
})

export const checkUserValidation = z.object({
  body: contactInfoSchema,
})

export const loginValidation = z.object({
  body: baseAuthSchema.extend({
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }).refine((data) => data.email || data.mobileNumber, {
    message: 'Either email or mobile number is required',
    path: ['email', 'mobileNumber']
  }),
})

export const registerValidation = z.object({
  body: baseAuthSchema.extend({
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ).optional(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional(),
  }),
})

export const forgotPasswordValidation = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
  }),
})

export const resetPasswordValidation = z.object({
  body: z.object({
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
    token: z.string().min(1, 'Token is required'),
  }),
})

export type LoginRequestDto = z.infer<typeof loginValidation>['body']
export type RegisterRequestDto = z.infer<typeof registerValidation>['body']
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordValidation>['body']
export type ResetPasswordRequestDto = z.infer<typeof resetPasswordValidation>['body']