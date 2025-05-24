import { Request, Response } from 'express'
import rateLimit from 'express-rate-limit'

import { config } from '@/config'

export const authLimiter = rateLimit({
  windowMs: config.api.rateLimiting.windowMs,
  max: config.api.rateLimiting.max,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      data: null
    })
  }
})

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      data: null
    })
  }
}) 