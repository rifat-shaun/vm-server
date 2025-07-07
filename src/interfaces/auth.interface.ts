import { LoginRequestDto, RegisterRequestDto } from '@/validations/auth.validation'

export interface IUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

export interface IAuthService {
  validateUser(credentials: LoginRequestDto): Promise<IUser>
  createUser(userData: RegisterRequestDto): Promise<IUser>
  generateToken(userId: string, role: string): string
  verifyToken(token: string): Promise<{ userId: string; role: string }>
} 