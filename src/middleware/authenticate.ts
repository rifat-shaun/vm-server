import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '@/config'
import { AppError, ERROR_CODES } from '@/utils/errors'
import { AUTH_MESSAGES } from '@/constants/auth'

interface AuthRequest extends Request {
  user?: jwt.JwtPayload | string
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new AppError(401, AUTH_MESSAGES.INVALID_TOKEN, ERROR_CODES.INVALID_TOKEN)
    }

    const decoded = jwt.verify(token, config.auth.jwt.secret)
    req.user = decoded
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, AUTH_MESSAGES.TOKEN_EXPIRED, ERROR_CODES.INVALID_TOKEN))
    } else {
      next(new AppError(401, AUTH_MESSAGES.INVALID_TOKEN, ERROR_CODES.INVALID_TOKEN))
    }
  }
} 