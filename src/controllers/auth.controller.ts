import { Request, Response } from 'express';

import {
  loginResponseSchema,
  registerResponseSchema,
  errorResponseSchema,
  forgotPasswordResponseSchema,
  verifySessionResponseSchema,
  checkUserResponseSchema,
  resetPasswordResponseSchema,
  validateOTPResponseSchema,
} from '@/response-schema';
import { authService } from '@/services';
import { AppError } from '@/utils/errors';
import { sendResponse } from '@/utils/sendResponse';

/**
 * Handles user check request
 * @param req - Express request
 * @param res - Express response
 */
export const checkUser = async (req: Request, res: Response) => {
  try {
    const user = await authService.getUserByEmailOrMobileNumber(req.body);

    const isNewUser = user && !user?.password ? true : false;

    if (isNewUser && user) {
      await authService.sendOTP(user.email);

      sendResponse({
        res,
        success: true,
        message: 'OTP has been sent to your email',
        data: { isUserExists: !!user, isNewUser },
        schema: checkUserResponseSchema,
      });

      return;
    }

    sendResponse({
      res,
      success: true,
      message: user ? 'User exists' : 'User does not exist',
      data: { isUserExists: !!user, isNewUser },
      schema: checkUserResponseSchema,
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendResponse({
        res,
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: { code: error.code, details: error.details },
        schema: errorResponseSchema,
      });
    } else {
      sendResponse({
        res,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema,
      });
    }
  }
};

/**
 * Handles user login request
 * @param req - Express request
 * @param res - Express response
 */
export const login = async (req: Request, res: Response) => {
  try {
    const user = await authService.validateUser(req.body);
    const token = authService.generateToken(user.id, user.role, user.email);

    sendResponse({
      res,
      success: true,
      message: 'Login successful',
      data: { token, user },
      schema: loginResponseSchema,
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendResponse({
        res,
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: { code: error.code, details: error.details },
        schema: errorResponseSchema,
      });
    } else {
      sendResponse({
        res,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema,
      });
    }
  }
};

/**
 * Handles user registration request
 * @param req - Express request
 * @param res - Express response
 */
export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.createUser(req.body);
    const token = authService.generateToken(user.id, user.role, user.email);

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: 'Registration successful',
      data: { token, user },
      schema: registerResponseSchema,
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendResponse({
        res,
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: { code: error.code, details: error.details },
        schema: errorResponseSchema,
      });
    } else {
      sendResponse({
        res,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema,
      });
    }
  }
};

/**
 * Handles forgot password request
 * @param req - Express request
 * @param res - Express response
 */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const user = await authService.forgotPassword(req.body.email);

    sendResponse({
      res,
      success: true,
      message: 'OTP has been sent to your email',
      data: { user },
      schema: forgotPasswordResponseSchema,
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendResponse({
        res,
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: { code: error.code, details: error.details },
        schema: errorResponseSchema,
      });
    } else {
      sendResponse({
        res,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema,
      });
    }
  }
};

/**
 * Handles OTP validation and returns temporary token for password reset
 * @param req - Express request
 * @param res - Express response
 */
export const validateOTP = async (req: Request, res: Response) => {
  try {
    const token = await authService.validateOTPAndGenerateToken(req.body.email, req.body.otp);

    sendResponse({
      res,
      success: true,
      message: 'OTP validated successfully',
      data: { token },
      schema: validateOTPResponseSchema,
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendResponse({
        res,
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: { code: error.code, details: error.details },
        schema: errorResponseSchema,
      });
    } else {
      sendResponse({
        res,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema,
      });
    }
  }
};

/**
 * Handles reset password request
 * @param req - Express request
 * @param res - Express response
 */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = await authService.resetPassword(req.body.password, req.body.confirmPassword, token);

    sendResponse({
      res,
      success: true,
      message: 'Password reset successful',
      data: { user },
      schema: resetPasswordResponseSchema,
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendResponse({
        res,
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: { code: error.code, details: error.details },
        schema: errorResponseSchema,
      });
    } else {
      sendResponse({
        res,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema,
      });
    }
  }
};


/**
 * Verifies user session using JWT token
 * @param req - Express request
 * @param res - Express response
 */
export const verifySession = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const user = await authService.verifySession(token);

    sendResponse({
      res,
      success: true,
      message: 'Session verified successfully',
      data: { user },
      schema: verifySessionResponseSchema,
    });
  } catch (error) {
    if (error instanceof AppError) {
      sendResponse({
        res,
        statusCode: error.statusCode,
        success: false,
        message: error.message,
        errors: { code: error.code, details: error.details },
        schema: errorResponseSchema,
      });
    } else {
      sendResponse({
        res,
        statusCode: 500,
        success: false,
        message: 'Internal server error',
        errors: error,
        schema: errorResponseSchema,
      });
    }
  }
};
