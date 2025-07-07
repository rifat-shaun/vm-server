import { Response } from 'express'
import { mock } from 'jest-mock-extended'

import { getUserDetails } from '@/controllers/user.controller'
import { IAuthenticatedRequest } from '@/interfaces/user.interface'
import * as userService from '@/services/user.service'
import { AppError, ERROR_CODES } from '@/utils/errors'

import { Role } from '../../../generated/prisma'

// Mock the user service
jest.mock('@/services/user.service')

describe('UserController', () => {
	describe('getUserDetails', () => {
		let mockReq: IAuthenticatedRequest
		let mockRes: Response

		beforeEach(() => {
			mockReq = {
				params: {},
			} as IAuthenticatedRequest

			mockRes = mock<Response>()
			mockRes.json = jest.fn().mockReturnThis()
			mockRes.status = jest.fn().mockReturnThis()
		})

		afterEach(() => {
			jest.clearAllMocks()
		})

		it('should return user profile when valid userId is provided', async () => {
			// Arrange
			const userId = 'valid-user-id'
			const mockUser = {
				id: userId,
				email: 'test@example.com',
				firstName: 'Test',
				lastName: 'User',
				role: Role.USER
			}

			mockReq.params.userId = userId
			jest.spyOn(userService, 'getUserDetails').mockResolvedValue(mockUser)

			// Act
			await getUserDetails(mockReq, mockRes)

			// Assert
			expect(userService.getUserDetails).toHaveBeenCalledWith(userId)
			expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
				success: true,
				message: 'Profile retrieved successfully',
				data: mockUser
			}))
		})

		it('should return 401 when userId is not provided', async () => {
			// Act
			await getUserDetails(mockReq, mockRes)

			// Assert
			expect(mockRes.status).toHaveBeenCalledWith(401)
			expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
				success: false,
				message: 'Unauthorized',
				errors: expect.objectContaining({
					code: ERROR_CODES.INVALID_TOKEN
				})
			}))
		})

		it('should return 404 when user is not found', async () => {
			// Arrange
			const userId = 'non-existent-user'
			mockReq.params.userId = userId

			jest.spyOn(userService, 'getUserDetails').mockRejectedValue(
				new AppError(404, 'User not found', ERROR_CODES.VALIDATION_ERROR)
			)

			// Act
			await getUserDetails(mockReq, mockRes)

			// Assert
			expect(userService.getUserDetails).toHaveBeenCalledWith(userId)
			expect(mockRes.status).toHaveBeenCalledWith(404)
			expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
				success: false,
				message: 'User not found',
				errors: expect.objectContaining({
					code: ERROR_CODES.VALIDATION_ERROR
				})
			}))
		})

		it('should return 500 when an unexpected error occurs', async () => {
			// Arrange
			const userId = 'valid-user-id'
			mockReq.params.userId = userId

			jest.spyOn(userService, 'getUserDetails').mockRejectedValue(new Error('Unexpected error'))

			// Act
			await getUserDetails(mockReq, mockRes)

			// Assert
			expect(userService.getUserDetails).toHaveBeenCalledWith(userId)
			expect(mockRes.status).toHaveBeenCalledWith(500)
			expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
				success: false,
				message: 'Internal server error'
			}))
		})
	})
})
