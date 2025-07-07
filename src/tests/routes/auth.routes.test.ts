import { Express } from 'express'
import request from 'supertest'

import app from '@/app'

import { PrismaClient } from '../../../generated/prisma'
import { prismaMock } from '../setup'

const prisma = new PrismaClient()
let testApp: Express

beforeAll(async () => {
  testApp = app
})

// This is for demonstration - not needed with mocks
afterEach(async () => {
  // If using real database, you would clean up here
  await prisma.user.deleteMany({
    where: {
      email: {
        contains: 'test@example.com'
      }
    }
  })
})

describe('Auth Routes', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'Test123@password',
        firstName: 'Test',
        lastName: 'User'
      }

      prismaMock.user.create.mockResolvedValue({
        id: '1',
        email: mockUser.email,
        password: 'hashed-password',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      const response = await request(testApp)
        .post('/api/v1/auth/register')
        .send(mockUser)
        .expect(201)

      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data.user.email).toBe(mockUser.email)
      expect(response.body.data.user.firstName).toBe(mockUser.firstName)
      expect(response.body.data.user).not.toHaveProperty('password')
    })

    it('should return 400 for invalid registration data', async () => {
      const invalidUser = {
        email: 'invalid-email',
        password: '123', // too short
        firstName: '',
        lastName: ''
      }

      const response = await request(testApp)
        .post('/api/v1/auth/register')
        .send(invalidUser)
        .expect(400)

      expect(response.body).toHaveProperty('errors')
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('should login user successfully', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'Test123@password',
        firstName: 'Test',
        lastName: 'User'
      }

      const mockCredentials = {
        email: mockUser.email,
        password: mockUser.password
      }

      prismaMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: mockCredentials.email,
        password: 'hashed-password',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      await request(testApp)
        .post('/api/v1/auth/register')
        .send(mockUser)

      const response = await request(testApp)
        .post('/api/v1/auth/login')
        .send(mockCredentials)
        .expect(200)

      expect(response.body.data).toHaveProperty('token')
      expect(response.body.data).toHaveProperty('user')
      expect(response.body.data.user.email).toBe(mockCredentials.email)
      expect(response.body.data.user).not.toHaveProperty('password')
    })

    it('should return 401 for invalid credentials', async () => {
      const invalidCredentials = {
        email: 'nonexistent@example.com',
        password: 'WrongPassword123!'
      }

      prismaMock.user.findUnique.mockResolvedValue(null)

      const response = await request(testApp)
        .post('/api/v1/auth/login')
        .send(invalidCredentials)
        .expect(401)

      expect(response.body).toHaveProperty('message')
    })

    it('should return 400 for invalid login data format', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: ''
      }

      const response = await request(testApp)
        .post('/api/v1/auth/login')
        .send(invalidData)
        .expect(400)

      expect(response.body).toHaveProperty('errors')
    })
  })
})
