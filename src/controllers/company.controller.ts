import { companyResponseSchema, errorResponseSchema } from '@/response-schema';
import { companyService } from '@/services';
import { AppError } from '@/utils/errors';
import { sendResponse } from '@/utils/sendResponse';
import { Request, Response } from 'express';

/**
 * Handles company creation request
 * @param req - Express request
 * @param res - Express response
 */
export const createCompany = async (req: Request, res: Response) => {
  try {
    const company = await companyService.createCompany(req.body);

    sendResponse({
      res,
      success: true,
      message: 'Company created successfully',
      data: company,
      schema: companyResponseSchema,
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
