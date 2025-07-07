import { z } from 'zod'

import { Role } from 'generated/prisma'

export const updateUserValidation = z.object({
    body: z.object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        role: z.nativeEnum(Role),
    }),
})