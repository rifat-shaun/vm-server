import { PrismaClient } from '../../generated/prisma'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

/**
 * Validates user credentials and returns user data without password
 * @param email - User's email address
 * @param password - User's password
 * @returns User data if valid, null if invalid
 */
export const validateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      role: true
    }
  })

  if (!user) {
    return null
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return null
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

/**
 * Generates a JWT token for authenticated user
 * @param userId - User's unique identifier
 * @param role - User's role
 * @returns JWT token
 */
export const generateToken = (userId: string, role: string) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '1d' }
  )
}

/**
 * Creates a new user account
 * @param userData - User registration data
 * @returns Created user data without password, null if email exists
 */
export const createUser = async (userData: { 
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string 
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  })

  if (existingUser) {
    return null
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10)

  const user = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  })

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
} 