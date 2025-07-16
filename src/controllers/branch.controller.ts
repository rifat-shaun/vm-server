import { branchResponseSchema, errorResponseSchema } from '@/response-schema';
import { branchService } from '@/services';
import { AppError } from '@/utils/errors';
import { sendResponse } from '@/utils/sendResponse';
import { Request, Response } from 'express';

export const createBranch = async (req: Request, res: Response) => {
  try {
    const branch = await branchService.createBranch(req.body);

    sendResponse({
      res,
      success: true,
      message: 'Branch created successfully',
      data: branch,
      schema: branchResponseSchema,
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
    }
  }
};
