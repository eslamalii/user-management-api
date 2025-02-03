import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { validateDTO } from '../middlewares/validationMiddleware'
import { LoginUserDTO, RegisterUserDTO } from '../dtos/auth.dto'

export const authRouter = (authController: AuthController) => {
  const router = Router()

  router.post(
    '/register',
    validateDTO(RegisterUserDTO),
    authController.register
  )
  router.post('/login', validateDTO(LoginUserDTO), authController.login)
  router.get('/verify', authController.verify)

  return router
}
