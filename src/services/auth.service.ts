import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { UserRepository } from '@/repositories/user.repository'
import { sendOTPEmail } from '@/services/email.service'
import { TCreateUserData } from '@/types/user'
import { AppError, ERROR_CODES } from '@/utils/errors'
import { generateOTP, storeOTP } from '@/utils/otp'
import { LoginRequestDto } from '@/validations/auth.validation'

/**
 * Validates user credentials and returns user data without password
 * @param email - User's email address
 * @param password - User's password
 * @returns User data if valid, null if invalid
 */
export const validateUser = async ({ email, password }: LoginRequestDto) => {
  const user = await UserRepository.findByEmail(email)

  if (!user) {
    throw AppError.unauthorized('Invalid credentials')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid credentials')
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Generates a JWT token for authenticated user
 * @param userId - User's unique identifier
 * @param role - User's role
 * @param email - User's email
 * @returns JWT token
 */
export const generateToken = (userId: string, role: string, email: string): string => {
  if (!process.env.JWT_SECRET) {
    throw AppError.internal('JWT secret not configured')
  }

  return jwt.sign(
    { userId, role, email },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}

/**
 * Creates a new user account
 * @param userData - User registration data
 * @returns Created user data without password, null if email exists
 */
export const createUser = async (userData: TCreateUserData) => {
  const existingUser = await UserRepository.findByEmail(userData.email)

  if (existingUser) {
    throw AppError.badRequest('Email already exists', ERROR_CODES.USER_EXISTS)
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10)

  const user = await UserRepository.create({
    ...userData,
    password: hashedPassword,
  })

  return user
}

/**
 * Handles forgot password request by generating and sending OTP
 * @param email - User's email address
 * @returns User data without password
 */
export const forgotPassword = async (email: string) => {
  const user = await UserRepository.findByEmail(email)

  if (!user) {
    throw new AppError(404, 'User not found', ERROR_CODES.USER_NOT_FOUND)
  }

  const otp = generateOTP()
  storeOTP(email, otp)
  await sendOTPEmail(email, otp)

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}