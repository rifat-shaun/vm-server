import { describe, it, expect, jest, beforeEach } from '@jest/globals'
import { Request, Response } from 'express'

import { login, register } from '@/controllers/auth.controller'
import { loginResponseSchema, registerResponseSchema, errorResponseSchema } from '@/response-schema'
import * as authService from '@/services/auth.service'
import { sendResponse } from '@/utils/sendResponse'

import { Role } from '../../../generated/prisma'

// Mock sendResponse utility
jest.mock('@/utils/sendResponse')

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>

  beforeEach(() => {
    mockRequest = {
      body: {}
    }
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    } as unknown as Response
    
    jest.clearAllMocks()
  })

  describe('login', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: Role.USER
    }

    const mockToken = 'mock-jwt-token'

    it('should successfully login user', async () => {
      // Arrange
      mockRequest.body = mockCredentials
      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser)
      jest.spyOn(authService, 'generateToken').mockReturnValue(mockToken)

      // Act
      await login(mockRequest as Request, mockResponse as Response)

      // Assert
      expect(authService.validateUser).toHaveBeenCalledWith(mockCredentials)
      expect(authService.generateToken).toHaveBeenCalledWith(mockUser.id, mockUser.role, mockUser.email)
      expect(sendResponse).toHaveBeenCalledWith({
        res: mockResponse,
        success: true,
        message: 'Login successful',
        data: { token: mockToken, user: mockUser },
        schema: loginResponseSchema
      })
    })

    it('should handle invalid credentials', async () => {
      // Arrange
      mockRequest.body = mockCredentials
      const error = new Error('Invalid credentials')
      jest.spyOn(authService, 'validateUser').mockRejectedValue(error)

      // Act
      await login(mockRequest as Request, mockResponse as Response)

      // Assert
      expect(sendResponse).toHaveBeenCalledWith({
        res: mockResponse,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema
      })
    })
  })

  describe('register', () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }

    const mockCreatedUser = {
      id: '1',
      ...mockUserData,
      role: Role.USER
    }

    const mockToken = 'mock-jwt-token'

    it('should successfully register user', async () => {
      // Arrange
      mockRequest.body = mockUserData
      jest.spyOn(authService, 'createUser').mockResolvedValue(mockCreatedUser)
      jest.spyOn(authService, 'generateToken').mockReturnValue(mockToken)

      // Act
      await register(mockRequest as Request, mockResponse as Response)

      // Assert
      expect(authService.createUser).toHaveBeenCalledWith(mockUserData)
      expect(authService.generateToken).toHaveBeenCalledWith(mockCreatedUser.id, mockCreatedUser.role, mockCreatedUser.email)
      expect(sendResponse).toHaveBeenCalledWith({
        res: mockResponse,
        statusCode: 201,
        success: true,
        message: 'Registration successful',
        data: { token: mockToken, user: mockCreatedUser },
        schema: registerResponseSchema
      })
    })

    it('should handle registration with existing email', async () => {
      // Arrange
      mockRequest.body = mockUserData
      const error = new Error('Email already exists')
      jest.spyOn(authService, 'createUser').mockRejectedValue(error)

      // Act
      await register(mockRequest as Request, mockResponse as Response)

      // Assert
      expect(sendResponse).toHaveBeenCalledWith({
        res: mockResponse,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema
      })
    })
  })
}) 