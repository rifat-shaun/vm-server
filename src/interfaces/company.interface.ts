export interface ICompanyCreateData {
  name: string;
  address?: string;
}

export interface ICompanyDetails {
  id: string;
  name: string;
  address?: string | null;
}
