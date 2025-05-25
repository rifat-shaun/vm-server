import { Request, Response, NextFunction } from 'express'
import { verify, TokenExpiredError, JwtPayload } from 'jsonwebtoken'

import { config } from '@/config'
import { AUTH_MESSAGES } from '@/constants/auth'
import { AppError, ERROR_CODES } from '@/utils/errors'

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      throw new AppError(401, AUTH_MESSAGES.INVALID_TOKEN, ERROR_CODES.INVALID_TOKEN)
    }

    const decoded = verify(token, config.auth.jwt.secret)

    req.params.userId = (decoded as JwtPayload).userId
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError(401, AUTH_MESSAGES.TOKEN_EXPIRED, ERROR_CODES.INVALID_TOKEN))
    } else {
      next(new AppError(401, AUTH_MESSAGES.INVALID_TOKEN, ERROR_CODES.INVALID_TOKEN))
    }
  }
} 