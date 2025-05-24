import { Router } from 'express'

import { login, register } from '@/controllers/auth.controller'
import { validateRequest } from '@/middleware/validateRequest'
import { loginValidation, registerValidation } from '@/validations/auth.validation'

const router = Router()

router.post('/login', validateRequest(loginValidation), login)
router.post('/register', validateRequest(registerValidation), register)

export default router  