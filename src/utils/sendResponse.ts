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
      console.error('Response validation error:', error.errors)
      
      // Send a fallback error response
      const fallbackResponse: BaseResponse = {
        success: false,
        message: 'Internal server error: Invalid response format',
        errors: process.env.NODE_ENV === 'development' ? error.errors : null
      }
      
      return res.status(500).json(fallbackResponse)
    }
    throw error
  }
}
