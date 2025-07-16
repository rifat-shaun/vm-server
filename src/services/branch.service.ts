import { IBranchCreateData, IBranchDetails } from '@/interfaces';
import { BranchRepository, CompanyRepository } from '@/repositories';
import { AppError, ERROR_CODES } from '@/utils/errors';

export const createBranch = async (branchData: IBranchCreateData): Promise<IBranchDetails | null> => {

    const { name, address, companyId } = branchData;
  
  if (!branchData.name || !branchData.companyId) {
    throw new AppError(400, 'Invalid branch data', ERROR_CODES.INVALID_BRANCH_DATA);
  }

  const existingBranch = await BranchRepository.findByName(name);
  if (existingBranch) {
    throw new AppError(400, 'Branch already exists', ERROR_CODES.BRANCH_ALREADY_EXISTS);
  }

  const existingCompany = await CompanyRepository.findById(companyId);
  if (!existingCompany) {
    throw new AppError(400, 'Company not found', ERROR_CODES.COMPANY_NOT_FOUND);
  }

  const branch = await BranchRepository.create({ name, address, companyId });
  if (!branch) {
    throw new AppError(500, 'Failed to create branch', ERROR_CODES.BRANCH_CREATION_FAILED);
  }

  return branch;
};
