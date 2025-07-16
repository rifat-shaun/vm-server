import { Router } from 'express'
import { validateRequest } from '@/middlewares/validateRequest'
import { createCompanyValidation } from '@/validations'
import { createCompany } from '@/controllers'

const router = Router()

router.post('/create',  validateRequest(createCompanyValidation), createCompany)



export default router  