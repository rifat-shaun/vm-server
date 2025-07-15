import { Request } from 'express'

import { Role } from '../../generated/prisma'

export interface IAuthenticatedRequest extends Request {
  user?: { id: string, email: string, role: string }
}

export interface IUserCheckRequest {
  email?: string
  mobileNumber?: string
}

export interface IUserCredentials {
  email: string
  password: string
}

export interface IUserSignupInfo {
  email: string
  password?: string
  firstName?: string
  lastName?: string
  mobileNumber?: string
  role: string
  companyId: string
  branchId: string
}

export interface IUserUpdateInfo {
  id: string
  email?: string
  password?: string
  firstName?: string
  lastName?: string
  role?: Role
}

export interface IUserDetails extends IUserSignupInfo {
  id: string,
}