import { IUserSignupInfo, IUserUpdateInfo , IUserDetails } from '@/interfaces'

import { PrismaClient } from '../../generated/prisma'

const prisma = new PrismaClient()

const defaultSelect: Record<keyof IUserDetails, boolean> = {
  id: true,
  email: true,
  password: false, // password is not returned by default as it is sensitive data
  firstName: true,
  lastName: true,
  role: true
}

export const UserRepository = {
  create: async (data: IUserSignupInfo, select?: Record<keyof IUserDetails, boolean>): Promise<IUserDetails> => {
    return prisma.user.create({
      data,
      select: select || defaultSelect
    })
  },

  update: async (userId: string, userData: IUserUpdateInfo, select?: Record<keyof IUserDetails, boolean>): Promise<IUserDetails | null> => {
    return prisma.user.update({
      where: { id: userId },
      data: userData,
      select: select || defaultSelect
    })
  },

  delete: async (userId: string, select?: Record<keyof IUserDetails, boolean>): Promise<IUserDetails | null> => {
    return prisma.user.delete({
      where: { id: userId },
      select: select || defaultSelect
    })
  },

  findById: async (userId: string, select?: Record<keyof IUserDetails, boolean>): Promise<IUserDetails | null> => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: select || defaultSelect
    })
  },

  findByEmail: async (email: string, select?: Record<keyof IUserDetails, boolean>): Promise<IUserDetails | null> => {
    return prisma.user.findUnique({
      where: { email },
      select: select || defaultSelect
    })
  }
} 