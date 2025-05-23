import { PrismaClient } from '../../generated/prisma'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export class AuthService {
  async validateUser(email: string, password: string) {
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

  generateToken(userId: string, role: string) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )
  }

  async createUser(userData: { 
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string 
  }) {
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
} 