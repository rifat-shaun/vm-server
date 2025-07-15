import { IUserDetails, IUserUpdateInfo } from '@/interfaces'
import { UserRepository } from '@/repositories/user.repository'
import { AppError, ERROR_CODES } from '@/utils/errors'

//########################################################################################
// TODO: Remove all the unknown as casts
//########################################################################################

/**
 * Get user profile by ID
 * @param userId - User's unique identifier
 * @returns User profile data
 */
export const getUserDetails = async (userId: string): Promise<Omit<IUserDetails, 'password'>> => {
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new AppError(404, 'User not found', ERROR_CODES.USER_NOT_FOUND)
  }

  const { password: _, ...userWithoutPassword } = user

  return userWithoutPassword as unknown as Omit<IUserDetails, 'password'>
}

/**
 * Update user details by ID
 * @param userId - User's unique identifier
 * @param userData - User data to update
 * @returns Updated user data
 */
export const updateUserDetails = async (userId: string, userData: IUserUpdateInfo): Promise<Omit<IUserDetails, 'password'>> => {
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new AppError(404, 'User not found', ERROR_CODES.USER_NOT_FOUND)
  }

  const updatedUser = await UserRepository.update(userId, userData)

  const { password: _, ...userWithoutPassword } = updatedUser

  return userWithoutPassword as unknown as Omit<IUserDetails, 'password'>
}
