import { Request, Response, NextFunction } from 'express'
import { Schema, ZodError } from 'zod'

import { AppError, ERROR_CODES } from '@/utils/errors'

export const validateRequest = (schema: Schema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code
        }))

        res.status(400).json({
          success: false,
          message: 'Validation Error',
          code: 'VAL001',
          errors: validationErrors,
          errorCount: validationErrors.length
        })
        return
      }
      
      next(new AppError(500, 'Unexpected validation error', ERROR_CODES.INTERNAL_SERVER_ERROR))
    }
  }
} 