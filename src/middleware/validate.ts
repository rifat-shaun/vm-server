import { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

import { AppError, ERROR_CODES } from '@/utils/errors'

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        
        next(new AppError(
          400,
          'Validation failed',
          ERROR_CODES.VALIDATION_ERROR,
          details
        ))
      } else {
        next(error)
      }
    }
  }
} 