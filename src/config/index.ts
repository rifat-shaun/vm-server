import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  CORS_ORIGINS: z.string().optional()
})

// Validate environment variables
const validateEnv = () => {
  const env = process.env.NODE_ENV || 'development'
  
  // Use default values for development
  if (env === 'development') {
    return envSchema.parse({
      NODE_ENV: env,
      PORT: process.env.PORT || '3000',
      JWT_SECRET: process.env.JWT_SECRET || 'dev_jwt_secret_key_123',
      DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/my_app_db'
    })
  }

  // Require all variables in production
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'))
      throw new Error(`Missing environment variables: ${missingVars.join(', ')}`)
    }
    throw error
  }
}

const env = validateEnv()

export const config = {
  env: env.NODE_ENV,
  server: {
    port: env.PORT ? parseInt(env.PORT) : 3000,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
    isTest: env.NODE_ENV === 'test',
    corsOrigins: env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173']
  },
  auth: {
    jwt: {
      secret: env.JWT_SECRET,
      expiresIn: '1d',
      refreshExpiresIn: '7d'
    },
    password: {
      saltRounds: 10,
      minLength: 6
    }
  },
  database: {
    url: env.DATABASE_URL
  },
  api: {
    rateLimiting: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    }
  }
} as const

export type Config = typeof config 