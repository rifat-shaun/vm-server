import { createTransport } from 'nodemailer'

import { AppError, ERROR_CODES } from '@/utils/errors'

// Create a transporter using environment variables
const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

/**
 * Sends an email
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Email body
 */
export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
    })
  } catch (error) {
    throw new AppError(500, 'Failed to send email', ERROR_CODES.INTERNAL_SERVER_ERROR, error)
  }
}

/**
 * Sends OTP email
 * @param email - Recipient email address
 * @param otp - OTP to send
 */
export const sendOTPEmail = async (email: string, otp: string) => {
  const subject = 'Password Reset OTP'
  const text = `Your OTP for password reset is: ${otp}\nThis OTP will expire in 5 minutes.`
  
  await sendEmail(email, subject, text)
} 