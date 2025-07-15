import { IUserSignupInfo, IUserUpdateInfo } from '@/interfaces';

import { PrismaClient, Role } from '../../generated/prisma';

const prisma = new PrismaClient();

const defaultSelect = {
  id: true,
  email: true,
  password: false, // password is not returned by default as it is sensitive data
  firstName: true,
  lastName: true,
  role: true,
  company: false,
  branch: false,
  mobileNumber: true,
} as const;

type UserSelect = {
  [K in keyof typeof defaultSelect]: boolean;
};

export const UserRepository = {
  create: async (data: IUserSignupInfo, select?: Partial<UserSelect>) => {
    const { companyId, branchId, ...userData } = data;
    return prisma.user.create({
      data: {
        ...userData,
        role: userData.role as Role,
        company: {
          connect: { id: companyId },
        },
        branch: {
          connect: { id: branchId },
        },
      },
      select: { ...defaultSelect, ...select },
    });
  },

  update: async (userId: string, userData: IUserUpdateInfo, select?: Partial<UserSelect>) => {
    return prisma.user.update({
      where: { id: userId },
      data: userData,
      select: { ...defaultSelect, ...select },
    });
  },

  delete: async (userId: string, select?: Partial<UserSelect>) => {
    return prisma.user.delete({
      where: { id: userId },
      select: { ...defaultSelect, ...select },
    });
  },

  findById: async (userId: string, select?: Partial<UserSelect>) => {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { ...defaultSelect, ...select },
    });
  },

  findByEmail: async (email: string, select?: Partial<UserSelect>) => {
    return prisma.user.findUnique({
      where: { email },
      select: { ...defaultSelect, ...select },
    });
  },

  findByEmailOrMobileNumber: async (
    email: string,
    mobileNumber: string,
    select?: Partial<UserSelect>
  ) => {
    return prisma.user.findFirst({
      where: { OR: [{ email }, { mobileNumber }] },
      select: { ...defaultSelect, ...select },
    });
  },
};
