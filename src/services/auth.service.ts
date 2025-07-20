import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { IUserCheckRequest, IUserCredentials, IUserDetails, IUserSignupInfo } from '@/interfaces';
import { UserRepository } from '@/repositories/user.repository';
import { sendOTPEmail } from '@/services/email.service';
import { AppError, ERROR_CODES } from '@/utils/errors';
import { generateOTP, storeOTP } from '@/utils/otp';

//########################################################################################
// TODO: Remove all the unknown as casts
//########################################################################################

/**
 * Checks if user exists
 * @param email - User's email address
 * @param mobileNumber - User's mobile number
 * @returns User data if user exists, null if user does not exist
 */
export const getUserByEmailOrMobileNumber = async ({
  email,
  mobileNumber,
}: IUserCheckRequest): Promise<IUserDetails | null> => {
  if (!email && !mobileNumber) {
    throw AppError.badRequest('Either email or mobile number is required');
  }

  const user = (await UserRepository.findByEmailOrMobileNumber(email || '', mobileNumber || '', {
    password: true,
  })) as unknown as IUserDetails;

  return user;
};

/**
 * Validates user credentials and returns user data without password
 * @param email - User's email address
 * @param password - User's password
 * @param mobileNumber - User's mobile number
 * @returns User data if valid, null if invalid
 */
export const validateUser = async ({
  email,
  mobileNumber,
  password,
}: IUserCredentials): Promise<Omit<IUserDetails, 'password'>> => {
  const user = await UserRepository.findByEmailOrMobileNumber(email || '', mobileNumber || '', {
    password: true,
  });

  if (!user) {
    throw AppError.unauthorized('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password || '');

  if (!isPasswordValid) {
    throw AppError.unauthorized('Invalid credentials');
  }

  return user as unknown as Omit<IUserDetails, 'password'>;
};

/**
 * Generates a JWT token for authenticated user
 * @param userId - User's unique identifier
 * @param role - User's role
 * @param email - User's email
 * @returns JWT token
 */
export const generateToken = (userId: string, role: string, email: string): string => {
  if (!process.env.JWT_SECRET) {
    throw AppError.internal('JWT secret not configured');
  }

  return jwt.sign({ userId, role, email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

/**
 * Creates a new user account
 * @param userData - User registration data
 * @returns Created user data without password, null if email exists
 */
export const createUser = async (
  userData: IUserSignupInfo
): Promise<Omit<IUserDetails, 'password'>> => {
  const existingUser = await UserRepository.findByEmailOrMobileNumber(
    userData.email || '',
    userData.mobileNumber || '',
  );

  if (existingUser) {
    throw AppError.badRequest('Email or mobile number already exists', ERROR_CODES.USER_EXISTS);
  }

  const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 10) : undefined;

  const user = (await UserRepository.create({
    ...userData,
    password: hashedPassword,
  })) as unknown as IUserDetails;

  return user;
};

/**
 * Handles forgot password request by generating and sending OTP
 * @param email - User's email address
 * @returns User data without password
 */
export const forgotPassword = async (email: string): Promise<Omit<IUserDetails, 'password'>> => {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new AppError(404, 'User not found', ERROR_CODES.USER_NOT_FOUND);
  }

  await sendOTP(email);

  return user as unknown as Omit<IUserDetails, 'password'>;
};

/**
 * Validates OTP and returns a temporary token for password reset
 * @param email - User's email address
 * @param otp - OTP to validate
 * @returns Temporary JWT token for password reset
 */
export const validateOTPAndGenerateToken = async (email: string, otp: string): Promise<string> => {
  const user = await UserRepository.findByEmail(email);

  if (!user) {
    throw new AppError(404, 'User not found', ERROR_CODES.USER_NOT_FOUND);
  }

  // Import validateOTP from utils
  const { validateOTP, removeOTP } = await import('@/utils/otp');
  
  const isValidOTP = validateOTP(email, otp);
  
  if (!isValidOTP) {
    throw AppError.badRequest('Invalid or expired OTP');
  }

  // Remove the OTP after successful validation
  removeOTP(email);

  // Generate a short-lived token specifically for password reset
  if (!process.env.JWT_SECRET) {
    throw AppError.internal('JWT secret not configured');
  }

  return jwt.sign(
    { 
      userId: user.id, 
      role: user.role, 
      email: user.email,
      purpose: 'password_reset' 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '15m' } // Short expiration for security
  );
};

/**
 * Resets user password using temporary token
 * @param password - New password
 * @param confirmPassword - Confirm password
 * @param token - Temporary JWT token from OTP validation
 * @returns User data without password
 */
export const resetPassword = async (password: string, confirmPassword: string, token: string): Promise<Omit<IUserDetails, 'password'>> => {
  try {
    if (!process.env.JWT_SECRET) {
      throw AppError.internal('JWT secret not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      role: string;
      email: string;
      purpose: string;
    };

    // Verify this token is specifically for password reset
    if (decoded.purpose !== 'password_reset') {
      throw AppError.unauthorized('Invalid token purpose');
    }

    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      throw new AppError(404, 'User not found', ERROR_CODES.USER_NOT_FOUND);
    }

    if (password !== confirmPassword) {
      throw AppError.badRequest('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await UserRepository.update(user.id, { password: hashedPassword });

    return updatedUser as unknown as Omit<IUserDetails, 'password'>;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized('Token expired');
    }
    throw error;
  }
}

/**
 * Verifies JWT token and returns user session information
 * @param token - JWT token to verify
 * @returns User session data
 */
export const verifySession = async (token: string): Promise<Omit<IUserDetails, 'password'>> => {
  if (!process.env.JWT_SECRET) {
    throw AppError.internal('JWT secret not configured');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
      role: string;
      email: string;
    };

    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      throw AppError.unauthorized('User not found');
    }

    return user as unknown as Omit<IUserDetails, 'password'>;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized('Invalid token');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized('Token expired');
    }
    throw error;
  }
};

/**
 * Sends OTP to user's email or mobile number
 * @param email - User's email address
 * @param mobileNumber - User's mobile number
 * @param otp - OTP to send
 */
export const sendOTP = async (
  email?: string | null,
  mobileNumber?: string | null,
): Promise<void> => {
  const otp = generateOTP();
  storeOTP(email || mobileNumber || '', otp);

  if (email) {
    await sendOTPEmail(email, otp);
  } else if (mobileNumber) {
    // TODO: Send OTP to mobile number
    throw AppError.badRequest('Mobile number is not supported yet');
  } else {
    throw AppError.badRequest('Either email or mobile number is required');
  }
};
