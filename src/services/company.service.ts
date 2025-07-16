import { ICompanyCreateData, ICompanyDetails } from '@/interfaces';
import { CompanyRepository } from '@/repositories';
import { AppError, ERROR_CODES } from '@/utils/errors';

/**
 * Creates a new company
 * @param name - Company name
 * @param address - Company address
 * @returns Created company
 */
export const createCompany = async ({
  name,
  address,
}: ICompanyCreateData): Promise<ICompanyDetails | null> => {
  const existingCompany = await CompanyRepository.findByName(name);
  if (existingCompany) {
    throw new AppError(400, 'Company already exists', ERROR_CODES.COMPANY_ALREADY_EXISTS);
  }

  const company = await CompanyRepository.create({ name, address });

  if (!company) {
    throw new AppError(400, 'Failed to create company', ERROR_CODES.COMPANY_CREATION_FAILED);
  }

  return company;
};
