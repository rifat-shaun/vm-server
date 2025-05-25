import { Router } from 'express'

import { getProfile } from '@/controllers/user.controller'
import { authenticate } from '@/middlewares/authenticate'

const router = Router()

router.get('/profile', authenticate, getProfile)

export default router
