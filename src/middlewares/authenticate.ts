import { Response, NextFunction } from 'express'
import { verify, TokenExpiredError, JwtPayload } from 'jsonwebtoken'

import { config } from '@/config'
import { AUTH_MESSAGES } from '@/constants/auth'
import { IAuthenticatedRequest } from '@/interfaces/user.interface'
import { AppError, ERROR_CODES } from '@/utils/errors'

export const authenticate = (req: IAuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, AUTH_MESSAGES.INVALID_TOKEN, ERROR_CODES.INVALID_TOKEN)
    }

    const token = authHeader.split(' ')[1]
    const decoded = verify(token, config.auth.jwt.secret) as JwtPayload

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      throw new AppError(401, AUTH_MESSAGES.INVALID_TOKEN, ERROR_CODES.INVALID_TOKEN)
    }

    req.user = { id: decoded.userId, email: decoded.email, role: decoded.role }
    next()
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new AppError(401, AUTH_MESSAGES.TOKEN_EXPIRED, ERROR_CODES.INVALID_TOKEN))
    } else {
      next(new AppError(401, AUTH_MESSAGES.INVALID_TOKEN, ERROR_CODES.INVALID_TOKEN))
    }
  }
}