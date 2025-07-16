export interface IBranchCreateData {
  name: string;
  address?: string | null;
  companyId: string;
}

export interface IBranchDetails {
  id: string;
  name: string;
  address?: string | null;
  companyId: string;
}

export interface IBranchService {
  createBranch(branchData: IBranchCreateData): Promise<IBranchDetails | null>;
}
