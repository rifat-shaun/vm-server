import { PrismaClient } from '../../generated/prisma'
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended'
import { config } from '@/config'

// Mock Prisma
export const prismaMock = mockDeep<PrismaClient>()

// Mock config
jest.mock('@/config', () => ({
  config: {
    ...config,
    env: 'test',
    server: {
      ...config.server,
      isTest: true
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