export const AUTH_CONSTANTS = {
  TOKEN_EXPIRY: '1d',
  SALT_ROUNDS: 10,
  ROLES: {
    ADMIN: 'admin',
    USER: 'user'
  }
} as const

export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_EXISTS: 'Email already exists',
  ACCOUNT_CREATED: 'Account created successfully',
  LOGIN_SUCCESS: 'Login successful',
  TOKEN_EXPIRED: 'Token has expired',
  INVALID_TOKEN: 'Invalid token'
} as const 