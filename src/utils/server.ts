import cors from 'cors'
import express, { Express, json, urlencoded } from 'express'

import routes from '@/routes/v1'

export const createServer = async (): Promise<Express> => {
  const app = express()

  // Middleware
  app.use(cors())
  app.use(json())
  app.use(urlencoded({ extended: true }))

  // Routes
  app.use('/api/v1', routes)

  return app
} 