import { Router } from 'express';

import {
  checkUser,
  forgotPassword,
  login,
  register,
  verifySession,
  resetPassword,
  validateOTP,
} from '@/controllers/auth.controller';
import { validateRequest } from '@/middlewares/validateRequest';
import {
  checkUserValidation,
  forgotPasswordValidation,
  loginValidation,
  registerValidation,
  resetPasswordValidation,
  validateOTPValidation,
} from '@/validations';

const router = Router();

router.post('/check-user', validateRequest(checkUserValidation), checkUser);
router.post('/login', validateRequest(loginValidation), login);
router.post('/register', validateRequest(registerValidation), register);
router.post('/forgot-password', validateRequest(forgotPasswordValidation), forgotPassword);
router.post('/validate-otp', validateRequest(validateOTPValidation), validateOTP);
router.get('/verify-session', verifySession);
router.post('/reset-password', validateRequest(resetPasswordValidation), resetPassword);

export default router;
