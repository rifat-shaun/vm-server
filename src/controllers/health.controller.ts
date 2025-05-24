import { Request, Response } from 'express'

import { sendResponse } from '@/utils/sendResponse'

import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

/**
 * Check service health
 * @route GET /health
 * @description Check the health of the service and its dependencies
 * @returns {Object} 200 - Service is healthy
 * @returns {Object} 503 - Service is unhealthy
 */
export const healthCheck = async (_req: Request, res: Response) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    
    sendResponse({
      res,
      success: true,
      message: 'Service is healthy',
      data: {
        status: 'up',
        timestamp: new Date().toISOString(),
        services: {
          database: 'up'
        }
      }
    })
  } catch {
    sendResponse({
      res,
      statusCode: 503,
      success: false,
      message: 'Service is unhealthy',
      data: {
        status: 'down',
        timestamp: new Date().toISOString(),
        services: {
          database: 'down'
        }
      }
    })
  }
} 