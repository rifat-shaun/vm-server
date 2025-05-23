import { Response } from 'express'
import { z } from 'zod'
import { baseResponseSchema, BaseResponse } from '../response-schema'

type SendResponseOptions<T> = {
  res: Response
  statusCode?: number
  success: boolean
  message: string
  data?: T | null
  errors?: any
  schema?: z.ZodType
}

export function sendResponse<T>({
  res,
  statusCode = 200,
  success,
  message,
  data = null,
  errors = null,
  schema = baseResponseSchema
}: SendResponseOptions<T>) {
  const response = {
    success,
    message,
    data,
    errors,
  }

  try {
    // Validate response against schema
    schema.parse(response)
    
    return res.status(statusCode).json(response)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Format validation errors into readable messages
      const validationErrors = error.errors.map(err => {
        const path = err.path.join('.')
        return `${path}: ${err.message}`
      })
      
      // Send a fallback error response with detailed validation errors
      const fallbackResponse: BaseResponse = {
        success: false,
        message: 'Invalid response format',
        errors: {
          message: 'Response validation failed',
          details: validationErrors
        }
      }
      
      return res.status(500).json(fallbackResponse)
    }
    throw error
  }
}
