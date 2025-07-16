import { z } from 'zod';

import { baseResponseSchema } from '@/response-schema/base.schema';

export const branchResponseSchema = baseResponseSchema.extend({
  data: z.object({
    id: z.string(),
    name: z.string(),
    address: z.string().nullable().optional(),
    companyId: z.string(),
  }),
});

export type BranchResponse = z.infer<typeof branchResponseSchema>;
