import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'
import { sendResponse } from '../utils/sendResponse'
import { loginResponseSchema, registerResponseSchema, errorResponseSchema } from '../response-schema'

const authService = new AuthService()

/**
 * Handles user login request
 * @param req - Express request
 * @param res - Express response
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await authService.validateUser(email, password)

    if (!user) {
      sendResponse({
        res,
        statusCode: 401,
        success: false,
        message: 'Invalid credentials',
        schema: errorResponseSchema
      })
      return
    }

    const token = authService.generateToken(user.id, user.role)

    sendResponse({
      res,
      success: true,
      message: 'Login successful',
      data: { token, user },
      schema: loginResponseSchema
    })
  } catch (error) {
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

/**
 * Handles user registration request
 * @param req - Express request
 * @param res - Express response
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body

    const user = await authService.createUser({
      email,
      password,
      firstName,
      lastName
    })

    if (!user) {
      sendResponse({
        res,
        statusCode: 400,
        success: false,
        message: 'Email already exists',
        schema: errorResponseSchema
      })
      return
    }

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