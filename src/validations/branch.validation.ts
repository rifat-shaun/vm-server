import { z } from 'zod';

export const createBranchValidation = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Branch name is required' }),
    companyId: z.string().min(1, { message: 'Company ID is required' }),
    address: z.string().optional(),
  }),
});

export type CreateBranchValidation = z.infer<typeof createBranchValidation>;
