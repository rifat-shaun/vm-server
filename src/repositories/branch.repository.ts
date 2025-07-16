import { IBranchCreateData } from '@/interfaces';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

const defaultSelect = {
  id: true,
  name: true,
  address: true,
  companyId: true,
} as const;

type BranchSelect = {
  [K in keyof typeof defaultSelect]: boolean;
};

export const BranchRepository = {
  create: async (branchData: IBranchCreateData, select?: Partial<BranchSelect>) => {
    const branch = await prisma.branch.create({
      data: branchData,
      select: { ...defaultSelect, ...select },
    });
    return branch;
  },

  findByName: async (name: string, select?: Partial<BranchSelect>) => {
    const branch = await prisma.branch.findUnique({
      where: { name },
      select: { ...defaultSelect, ...select },
    });
    return branch;
  },
};
