import { describe, it, beforeEach, expect } from '@jest/globals'

import { UserRepository } from '@/repositories/user.repository'
import { getUserDetails } from '@/services/user.service'

import { Role } from '../../../generated/prisma'

describe('User Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUserDetails', () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      password: 'hashedPassword123',
      role: Role.USER
    }
    
    it('should get user details without password', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(mockUser)
      
      const result = await getUserDetails('1')
      
      expect(UserRepository.findById).toHaveBeenCalledWith('1')
      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: Role.USER
      })
      expect(result).not.toHaveProperty('password')
    })

    it('should throw error when user is not found', async () => {
      jest.spyOn(UserRepository, 'findById').mockResolvedValue(null)
      
      await expect(getUserDetails('nonexistent')).rejects.toThrow('User not found')
      expect(UserRepository.findById).toHaveBeenCalledWith('nonexistent')
    })
  })
})