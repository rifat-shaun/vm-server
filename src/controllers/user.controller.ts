import { Response } from 'express'

import { IAuthenticatedRequest } from '@/interfaces/user.interface'
import { errorResponseSchema , userDetailsResponseSchema } from '@/response-schema'
import * as userService from '@/services/user.service'
import { AppError, ERROR_CODES } from '@/utils/errors'
import { sendResponse } from '@/utils/sendResponse'

/**
 * Get user profile
 * @param req - Express request
 * @param res - Express response
 */
export const getUserDetails = async (req: IAuthenticatedRequest, res: Response) : Promise<void> => {
	try {
		if (!req.params.userId) {
			throw new AppError(401, 'Unauthorized', ERROR_CODES.INVALID_TOKEN)
		}

		const profile = await userService.getUserDetails(req.params.userId)

		sendResponse({
			res,
			success: true,
			message: 'Profile retrieved successfully',
			data: profile,
			schema: userDetailsResponseSchema
		})
	} catch (error) {
		if (error instanceof AppError) {
			sendResponse({
				res,
				statusCode: error.statusCode,
				success: false,
				message: error.message,
				errors: { code: error.code, details: error.details },
				schema: errorResponseSchema
			})
		} else {
			sendResponse({
				res,
				statusCode: 500,
				success: false,
				message: 'Internal server error',
				errors: error,
				schema: errorResponseSchema
			})
		}
	}
}

/**
 * Update user details
 * @param req - Express request
 * @param res - Express response
 */
export const updateUserDetails = async (req: IAuthenticatedRequest, res: Response) : Promise<void> => {
	try {
		if (!req.params.userId) {
			throw new AppError(401, 'Unauthorized', ERROR_CODES.INVALID_TOKEN)
		}

		const updatedUser = await userService.updateUserDetails(req.params.userId, req.body)

		sendResponse({
			res,
			success: true,
			message: 'User details updated successfully',
			data: updatedUser,	
			schema: userDetailsResponseSchema
		})
	} catch (error) {
		if (error instanceof AppError) {
			sendResponse({
				res,
				statusCode: error.statusCode,
				success: false,
				message: error.message,	
				errors: { code: error.code, details: error.details },
				schema: errorResponseSchema
			})
		} else {
			sendResponse({
				res,
				statusCode: 500,
				success: false,
				message: 'Internal server error',	
				errors: error,
				schema: errorResponseSchema
			})
		}
	}
}