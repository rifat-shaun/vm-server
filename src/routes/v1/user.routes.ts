import { Router } from 'express';

import { getUserDetails, updateUserDetails } from '@/controllers/user.controller';

const router = Router();

router.get('/:userId', getUserDetails);
router.put('/:userId', updateUserDetails);

export default router;
