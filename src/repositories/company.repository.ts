import { ICompanyCreateData } from '@/interfaces';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

const defaultSelect = {
  id: true,
  name: true,
  address: true,
} as const;

type CompanySelect = {
  [K in keyof typeof defaultSelect]: boolean;
};

export const CompanyRepository = {
  create: async (companyData: ICompanyCreateData, select?: Partial<CompanySelect>) => {
    const company = await prisma.company.create({
      data: companyData,
      select: { ...defaultSelect, ...select },
    });
    return company;
  },
  findByName: async (name: string) => {
    return prisma.company.findUnique({
      where: { name },
    });
  },
};
