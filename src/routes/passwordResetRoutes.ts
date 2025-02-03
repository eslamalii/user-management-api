import { Router } from 'express'
import { PasswordResetController } from '../controllers/PasswordResetController'
import { validateDTO } from '../middlewares/validationMiddleware'
import {
  RequestPasswordResetDTO,
  ResetPasswordDTO,
} from '../dtos/password-reset.dto'

export const resetRouter = (
  passwordResetController: PasswordResetController
) => {
  const router = Router()

  router.post(
    '/request',
    validateDTO(RequestPasswordResetDTO),
    passwordResetController.requestPasswordReset
  )

  router.post(
    '/reset',
    validateDTO(ResetPasswordDTO),
    passwordResetController.resetPassword
  )
  return router
}
