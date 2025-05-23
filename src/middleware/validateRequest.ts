import { Request, Response, NextFunction } from 'express'
import { Schema } from 'zod'
import { AppError } from '@/utils/errors'

export const validateRequest = (schema: Schema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      next(new AppError(400, 'Validation failed', error))
    }
  }
} 