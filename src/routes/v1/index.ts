import { Router } from 'express'

import { authLimiter, rateLimiter } from '@/middlewares/rateLimiter.ts'
import { authenticate } from '@/middlewares/authenticate'

import authRoutes from './auth.routes.ts'
import userRoutes from './user.routes.ts'
import companyRoutes from './company.routes.ts'
import branchRoutes from './branch.routes.ts'

const router = Router()

// Apply rate limiter to auth routes
router.use('/auth', authLimiter, authRoutes)
router.use('/users', rateLimiter, authenticate, userRoutes)
router.use('/company', rateLimiter, authenticate, companyRoutes)
router.use('/branch', rateLimiter, authenticate, branchRoutes)

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v1' })
})

export default router 