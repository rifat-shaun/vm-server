import { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'

import { AppError } from '@/utils/errors'

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Handle AppError instances
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
      errors: err.details
    })
    return
  }

  // Handle Zod validation errors directly
  if (err instanceof ZodError) {
    const validationErrors = err.errors.map((e) => ({
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
  
  // Handle other types of errors
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'SRV001'
  })
}
