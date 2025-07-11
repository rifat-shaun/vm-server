import { Router } from 'express'

import { forgotPassword, login, register, verifySession } from '@/controllers/auth.controller'
import { validateRequest } from '@/middlewares/validateRequest'
import { forgotPasswordValidation, loginValidation, registerValidation } from '@/validations/auth.validation'

const router = Router()

router.post('/login', validateRequest(loginValidation), login)
router.post('/register', validateRequest(registerValidation), register)
router.post('/forgot-password', validateRequest(forgotPasswordValidation), forgotPassword)
router.get('/verify-session', verifySession)
// router.post('/reset-password', validateRequest(resetPasswordValidation), resetPassword)

export default router  