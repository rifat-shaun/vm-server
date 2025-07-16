import { Router } from 'express'
import { validateRequest } from '@/middlewares/validateRequest'
import { createBranchValidation } from '@/validations'
import { createBranch } from '@/controllers'

const router = Router()

router.post('/create', validateRequest(createBranchValidation), createBranch)

export default router 