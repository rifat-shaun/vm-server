import { Request, Response } from 'express'
import { AuthService } from '../services/auth.service'

const authService = new AuthService()

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body

    const user = await authService.validateUser(email, password)

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      })
      return
    }

    const token = authService.generateToken(user.id, user.role)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName } = req.body

    const user = await authService.createUser({
      email,
      password,
      firstName,
      lastName
    })

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Email already exists',
      })
      return
    }

    const token = authService.generateToken(user.id, user.role)

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
} 