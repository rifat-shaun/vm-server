import { Request, Response } from 'express'
import * as authService from '@/services/auth.service'
import { sendResponse } from '@/utils/sendResponse'
import { loginResponseSchema, registerResponseSchema, errorResponseSchema } from '@/response-schema'
import { LoginDto, RegisterDto } from '@/dtos/auth.dto'
import { validateRequest } from '@/middleware/validate'
import { AppError } from '@/utils/errors'

/**
 * Handles user login request
 * @param req - Express request
 * @param res - Express response
 */
export const login = [
  validateRequest(LoginDto),
  async (req: Request, res: Response) => {
    try {
      const user = await authService.validateUser(req.body)
      const token = authService.generateToken(user.id, user.role)

      sendResponse({
        res,
        success: true,
        message: 'Login successful',
        data: { token, user },
        schema: loginResponseSchema
      })
    } catch (error) {
      if (error instanceof AppError) {
        sendResponse({
          res,
          statusCode: error.statusCode,
          success: false,
          message: error.message,
          errors: { code: error.code, details: error.details },
          schema: errorResponseSchema
        })
      } else {
        sendResponse({
          res,
          statusCode: 500,
          success: false,
          message: 'Internal server error',
          errors: error,
          schema: errorResponseSchema
        })
      }
    }
  }
]

/**
 * Handles user registration request
 * @param req - Express request
 * @param res - Express response
 */
export const register = [
  validateRequest(RegisterDto),
  async (req: Request, res: Response) => {
    try {
      const user = await authService.createUser(req.body)
      const token = authService.generateToken(user.id, user.role)

      sendResponse({
        res,
        statusCode: 201,
        success: true,
        message: 'Registration successful',
        data: { token, user },
        schema: registerResponseSchema
      })
    } catch (error) {
      if (error instanceof AppError) {
        sendResponse({
          res,
          statusCode: error.statusCode,
          success: false,
          message: error.message,
          errors: { code: error.code, details: error.details },
          schema: errorResponseSchema
        })
      } else {
        sendResponse({
          res,
          statusCode: 500,
          success: false,
          message: 'Internal server error',
          errors: error,
          schema: errorResponseSchema
        })
      }
    }
  }
] 