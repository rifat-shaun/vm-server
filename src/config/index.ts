import { config as dotenvConfig } from 'dotenv';
dotenvConfig();
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  DATABASE_URL: z.string(),
  CORS_ORIGINS: z.string().optional(),
  BASE_URL: z.string().optional()
})

// Validate environment variables
const validateEnv = () => {
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
    corsOrigins: env.CORS_ORIGINS?.split(',') || ['*'],
    baseUrl: env.BASE_URL || `http://localhost:${env.PORT ? parseInt(env.PORT) : 3000}`
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