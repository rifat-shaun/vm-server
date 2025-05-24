import { Router } from 'express'

const router = Router()

router.get('/profile', (_req, res) => {
  res.json({ message: 'Profile route - to be implemented' })
})

export default router
