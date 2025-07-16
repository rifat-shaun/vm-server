export const ERROR_CODES = {
  // Auth errors
  INVALID_CREDENTIALS: 'AUTH-ICD',
  INVALID_TOKEN: 'AUTH-ITK',
  USER_NOT_FOUND: 'AUTH-UNF',

  // User errors
  USER_EXISTS: 'USR-EXS',
  USER_CREATION_FAILED: 'USR-CRF',

  // Company errors
  COMPANY_ALREADY_EXISTS: 'COMP-EXS',
  COMPANY_CREATION_FAILED: 'COMP-CRF',
  COMPANY_NOT_FOUND: 'COMP-NFD',

  // Branch errors
  BRANCH_ALREADY_EXISTS: 'BRN-EXS',
  INVALID_BRANCH_DATA: 'BRN-IDD',
  BRANCH_CREATION_FAILED: 'BRN-CRF',

  // Validation errors
  VALIDATION_ERROR: 'VAL-ERR',

  // Server errors
  INTERNAL_SERVER_ERROR: 'SRV-ERR',

  // API errors
  RATE_LIMIT_EXCEEDED: 'API-RLE',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: ErrorCode,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }

  static unauthorized(message = 'Unauthorized', code: ErrorCode = ERROR_CODES.INVALID_CREDENTIALS) {
    return new AppError(401, message, code);
  }

  static badRequest(message: string, code: ErrorCode = ERROR_CODES.VALIDATION_ERROR) {
    return new AppError(400, message, code);
  }

  static internal(
    message = 'Internal server error',
    code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR
  ) {
    return new AppError(500, message, code);
  }
}
