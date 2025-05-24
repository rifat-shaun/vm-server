import cors from 'cors'
import helmet from 'helmet'

import { config } from '@/config'

export const securityMiddleware = [
  // Helmet for security headers
  helmet({
    xssFilter: true,
    hidePoweredBy: true,
    frameguard: { action: 'deny' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    }
  }),
  
  // CORS configuration
  cors({
    origin: config.server.corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
  })
] 