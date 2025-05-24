import { LoginRequestDto, RegisterRequestDto } from '@/validations/auth.validation'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface IAuthService {
  validateUser(credentials: LoginRequestDto): Promise<User>
  createUser(userData: RegisterRequestDto): Promise<User>
  generateToken(userId: string, role: string): string
  verifyToken(token: string): Promise<{ userId: string; role: string }>
} 