import { Router } from 'express'
import authRoutes from './auth.routes.ts'
import userRoutes from './user.routes.ts'
import { authLimiter } from '@/middleware/rateLimiter'

const router = Router()

// Apply rate limiter to auth routes
router.use('/auth', authLimiter, authRoutes)
router.use('/users', userRoutes)

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v1' })
})

export default router 