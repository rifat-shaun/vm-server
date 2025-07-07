import * as crypto from 'crypto'

/**
 * Generates a 6-digit OTP
 * @returns 6-digit OTP string
 */
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString()
}

/**
 * Stores OTP in memory with expiration (5 minutes)
 * In production, this should be stored in Redis or similar
 */
const otpStore = new Map<string, { otp: string; expiresAt: number }>()

/**
 * Stores OTP for a user
 * @param email - User's email
 * @param otp - Generated OTP
 */
export const storeOTP = (email: string, otp: string): void => {
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
  otpStore.set(email, { otp, expiresAt })
}

/**
 * Validates OTP for a user
 * @param email - User's email
 * @param otp - OTP to validate
 * @returns boolean indicating if OTP is valid
 */
export const validateOTP = (email: string, otp: string): boolean => {
  const stored = otpStore.get(email)
  if (!stored) return false
  
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(email)
    return false
  }
  
  return stored.otp === otp
}

/**
 * Removes OTP for a user
 * @param email - User's email
 */
export const removeOTP = (email: string): void => {
  otpStore.delete(email)
} 