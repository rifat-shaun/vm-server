import { UserRepository } from '@/repositories/user.repository'
import { AppError, ERROR_CODES } from '@/utils/errors'

/**
 * Get user profile by ID
 * @param userId - User's unique identifier
 * @returns User profile data
 */
export const getUserDetails = async (userId: string) => {
  const user = await UserRepository.findById(userId)

  if (!user) {
    throw new AppError(404, 'User not found', ERROR_CODES.VALIDATION_ERROR)
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
