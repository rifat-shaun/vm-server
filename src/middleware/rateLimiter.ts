import rateLimit from 'express-rate-limit'
import { config } from '@/config'
import { AppError, ERROR_CODES } from '@/utils/errors'

export const authLimiter = rateLimit({
  windowMs: config.api.rateLimiting.windowMs,
  max: config.api.rateLimiting.max,
  handler: (req, res) => {
    throw new AppError(
      429,
      'Too many requests, please try again later',
      ERROR_CODES.RATE_LIMIT_EXCEEDED
    )
  }
}) 