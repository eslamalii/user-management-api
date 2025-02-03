import { Router } from 'express'
import { authenticateJWT } from '../middlewares/authMiddleware'
import { UserController } from '../controllers/userController'
import { validateDTO } from '../middlewares/validationMiddleware'
import { UpdateUserDTO } from '../dtos/user.dto'

export const userRouter = (userController: UserController) => {
  const router = Router()

  router.use(authenticateJWT)

  router.get('/:id', userController.getUser)

  router.put('/:id', validateDTO(UpdateUserDTO), userController.updateUser)

  router.delete('/:id', userController.deleteUser)

  return router
}
