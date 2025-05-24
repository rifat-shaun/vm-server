import { describe, it, expect, beforeEach } from '@jest/globals'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { UserRepository } from '@/repositories/user.repository'
import * as authService from '@/services/auth.service'

import { Role } from '../../../generated/prisma'

// Mock implementations
jest.mock('@/repositories/user.repository')

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('validateUser', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'Test',
      lastName: 'User',
      role: Role.USER
    }

    it('should validate user with correct credentials', async () => {
      // Arrange
      jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(mockUser)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)

      // Act
      const result = await authService.validateUser(mockCredentials)

      // Assert
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        role: mockUser.role
      })
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(mockCredentials.email)
      expect(bcrypt.compare).toHaveBeenCalledWith(mockCredentials.password, mockUser.password)
    })

    it('should throw error for non-existent user', async () => {
      // Arrange
      jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(null)

      // Act & Assert
      await expect(authService.validateUser(mockCredentials))
        .rejects
        .toThrow('Invalid credentials')
    })

    it('should throw error for invalid password', async () => {
      // Arrange
      jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(mockUser)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never)

      // Act & Assert
      await expect(authService.validateUser(mockCredentials))
        .rejects
        .toThrow('Invalid credentials')
    })
  })

  describe('generateToken', () => {
    const mockUserId = '1'
    const mockRole = Role.USER
    const mockToken = 'generated-token'

    beforeEach(() => {
      process.env.JWT_SECRET = 'test-secret'
    })

    it('should generate valid JWT token', () => {
      // Arrange
      jest.spyOn(jwt, 'sign').mockImplementation(() => mockToken)

      // Act
      const token = authService.generateToken(mockUserId, mockRole)

      // Assert
      expect(token).toBe(mockToken)
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUserId, role: mockRole },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      )
    })

    it('should throw error if JWT_SECRET is not configured', () => {
      // Arrange
      delete process.env.JWT_SECRET

      // Act & Assert
      expect(() => authService.generateToken(mockUserId, mockRole))
        .toThrow('JWT secret not configured')
    })
  })

  describe('createUser', () => {
    const mockUserData = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }

    const mockCreatedUser = {
      id: '1',
      ...mockUserData,
      role: Role.USER,
      password: 'hashedPassword'
    }

    it('should create new user successfully', async () => {
      // Arrange
      jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(null)
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never)
      jest.spyOn(UserRepository, 'create').mockResolvedValue(mockCreatedUser)

      // Act
      const result = await authService.createUser(mockUserData)

      // Assert
      expect(result).toEqual(mockCreatedUser)
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(mockUserData.email)
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10)
      expect(UserRepository.create).toHaveBeenCalledWith({
        ...mockUserData,
        password: 'hashedPassword'
      })
    })

    it('should throw error if email already exists', async () => {
      // Arrange
      jest.spyOn(UserRepository, 'findByEmail').mockResolvedValue(mockCreatedUser)

      // Act & Assert
      await expect(authService.createUser(mockUserData))
        .rejects
        .toThrow('Email already exists')
    })
  })
}) 