import { Router } from 'express'

import { getUserDetails, updateUserDetails } from '@/controllers/user.controller'
import { authenticate } from '@/middlewares/authenticate'

const router = Router()

router.get('/:userId', authenticate, getUserDetails)
router.put('/:userId', authenticate, updateUserDetails)

export default router
