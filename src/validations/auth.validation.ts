import { z } from 'zod'

export const loginValidation = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
})

export const registerValidation = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string()
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
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
      .min(6, 'Password must be at least 6 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
    token: z.string().min(1, 'Token is required'),
  }),
})

export type LoginRequestDto = z.infer<typeof loginValidation>['body']
export type RegisterRequestDto = z.infer<typeof registerValidation>['body']
export type ForgotPasswordRequestDto = z.infer<typeof forgotPasswordValidation>['body']
export type ResetPasswordRequestDto = z.infer<typeof resetPasswordValidation>['body']