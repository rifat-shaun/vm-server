import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

export type CreateUserData = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type UserSelect = {
  id: true
  email: true
  password: true
  firstName: true
  lastName: true
  role: true
}

export const UserRepository = {
  findByEmail: async (email: string, select?: Partial<UserSelect>) => {
    return prisma.user.findUnique({
      where: { email },
      select: select || {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })
  },

  create: async (data: CreateUserData) => {
    return prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })
  }
} 