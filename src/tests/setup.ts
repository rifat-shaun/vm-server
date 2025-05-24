import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'

import { PrismaClient } from '../../generated/prisma'

// Mock Prisma
export const prismaMock = mockDeep<PrismaClient>()

// Mock config
jest.mock('@/config', () => ({
  config: {
    env: 'test',
    server: {
      isTest: true,
      port: 3000,
      host: 'localhost'
    },
    auth: {
      jwt: {
        secret: 'test-secret',
        expiresIn: '1d'
      }
    },
    api: {
      rateLimiting: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      }
    }
  }
}))

// Reset mocks before each test
beforeEach(() => {
  mockReset(prismaMock)
})

// Mock JWT functions
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mocked-token'),
  verify: jest.fn().mockReturnValue({ userId: 'test-user-id', role: 'user' })
}))

// Mock bcrypt functions
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true)
}))

export type Context = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockContext = (): Context => {
  return { prisma: prismaMock }
} 