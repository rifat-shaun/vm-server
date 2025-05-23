import { z } from 'zod'

export const LoginDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const RegisterDto = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters')
})

export type LoginRequestDto = z.infer<typeof LoginDto>
export type RegisterRequestDto = z.infer<typeof RegisterDto> 