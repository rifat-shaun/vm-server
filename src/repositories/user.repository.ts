import { TCreateUserData, TUserSelect, TUpdateUserData } from '@/types/user'

import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

export const UserRepository = {
  findByEmail: async (email: string, select?: Partial<TUserSelect>) => {
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

  create: async (data: TCreateUserData) => {
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
  },

  findById: async (id: string, select?: Partial<TUserSelect>) => {
    return prisma.user.findUnique({
      where: { id },
      select: select || {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })
  },

  update: async (userId: string, userData: TUpdateUserData, select?: Partial<TUserSelect>) => {
    return prisma.user.update({
      where: { id: userId },
      data: userData,
      select: select || {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })
  }
} 