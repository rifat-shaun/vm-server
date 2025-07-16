import { z } from 'zod';

export const companyResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
});

export type CompanyResponse = z.infer<typeof companyResponseSchema>;
