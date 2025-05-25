import { Router } from 'express'

import { getUserDetails } from '@/controllers/user.controller'
import { authenticate } from '@/middlewares/authenticate'

const router = Router()

router.get('/:userId', authenticate, getUserDetails)

export default router
