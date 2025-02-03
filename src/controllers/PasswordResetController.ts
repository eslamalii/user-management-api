import { Request, Response, NextFunction } from 'express'
import { IPasswordResetService } from '../interfaces/IPasswordResetService'

export class PasswordResetController {
  constructor(private readonly passwordResetService: IPasswordResetService) {}

  requestPasswordReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body
      const token = await this.passwordResetService.requestPasswordReset(email)
      res.json({ message: 'Password reset token generated', token })
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, newPassword } = req.body
      await this.passwordResetService.resetPassword(token, newPassword)
      res.json({ message: 'Password has been reset successfully' })
    } catch (error) {
      next(error)
    }
  }
}
