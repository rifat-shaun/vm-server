import { Request, Response } from 'express'
import { PrismaClient } from '../../generated/prisma'
import { sendResponse } from '@/utils/sendResponse'

const prisma = new PrismaClient()

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Check service health
 *     description: Check the health of the service and its dependencies
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service is unhealthy
 */
export const healthCheck = async (req: Request, res: Response) => {
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
  } catch (error) {
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