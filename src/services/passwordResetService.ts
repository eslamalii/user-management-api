import jwt, { SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { BadRequestError, NotFoundError } from '../errors/CustomErrors'
import { IPasswordResetService } from '../interfaces/IPasswordResetService'
import { IUserRepository } from '../interfaces/IUserRepository'
import config from '../config/env'

export class PasswordResetService implements IPasswordResetService {
  constructor(private readonly userRepository: IUserRepository) {}

  // Generate a password reset token
  async requestPasswordReset(email: string): Promise<string> {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    const payload = { id: user.id }
    const signOptions: SignOptions = {
      expiresIn: Number(config.RESET_TOKEN_EXPIRY),
    }

    const token = jwt.sign(payload, config.JWT_SECRET, signOptions)

    return token
  }

  // Reset the password using the token and new password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    let decoded: any
    try {
      decoded = jwt.verify(token, config.JWT_SECRET)
    } catch (error) {
      throw new BadRequestError('Invalid or expired token')
    }
    const user = await this.userRepository.getUserById(decoded.id)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await this.userRepository.updatePassword(user.id as number, hashedPassword)
  }
}
