export const ERROR_CODES = {
  // Auth errors
  INVALID_CREDENTIALS: 'AUTH001',
  USER_EXISTS: 'AUTH002',
  INVALID_TOKEN: 'AUTH003',
  
  // Validation errors
  VALIDATION_ERROR: 'VAL001',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'SRV001'
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: ErrorCode,
    public details?: any
  ) {
    super(message)
    this.name = 'AppError'
  }

  static unauthorized(message = 'Unauthorized', code: ErrorCode = ERROR_CODES.INVALID_CREDENTIALS) {
    return new AppError(401, message, code)
  }

  static badRequest(message: string, code: ErrorCode = ERROR_CODES.VALIDATION_ERROR) {
    return new AppError(400, message, code)
  }

  static internal(message = 'Internal server error', code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR) {
    return new AppError(500, message, code)
  }
} 