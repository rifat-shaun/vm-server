import { Request, Response } from 'express'

import { errorResponseSchema } from '@/response-schema'
import { profileResponseSchema } from '@/response-schema/user.schema'
import * as userService from '@/services/user.service'
import { AppError, ERROR_CODES } from '@/utils/errors'
import { sendResponse } from '@/utils/sendResponse'

interface AuthRequest extends Request {
	user?: {
		userId?: string
		email?: string
	}
}

/**
 * Get user profile
 * @param req - Express request
 * @param res - Express response
 */
export const getProfile = async (req: AuthRequest, res: Response) : Promise<void> => {
	try {
		if (!req.user?.userId) {
			throw new AppError(401, 'Unauthorized', ERROR_CODES.INVALID_TOKEN)
		}

		const profile = await userService.getProfile(req.user.userId)

		sendResponse({
			res,
			success: true,
			message: 'Profile retrieved successfully',
			data: profile,
			schema: profileResponseSchema
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
