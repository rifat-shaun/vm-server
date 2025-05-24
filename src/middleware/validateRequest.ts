import { Request, Response, NextFunction } from 'express'
import { Schema, ZodError } from 'zod'

import { AppError, ERROR_CODES } from '@/utils/errors'

export const validateRequest = (schema: Schema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })
      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        return next(error)
      }
      
      return next(new AppError(500, 'Unexpected validation error', ERROR_CODES.INTERNAL_SERVER_ERROR))
    }
  }
} 