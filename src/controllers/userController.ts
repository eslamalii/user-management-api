import { Request, Response, NextFunction } from 'express'
import { NotFoundError } from '../errors/CustomErrors'
import { IUserService } from '../interfaces/IUserService'

export class UserController {
  constructor(private readonly userService: IUserService) {}

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id, 10)
      const user = await this.userService.getUserById(userId)
      if (!user) {
        throw new NotFoundError('User not found')
      }
      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id, 10)
      const { name, email } = req.body
      await this.userService.updateUser(userId, { name, email })
      res.json({ message: 'User updated successfully' })
    } catch (error) {
      next(error)
    }
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id, 10)
      await this.userService.deleteUser(userId)
      res.json({ message: 'User deleted successfully' })
    } catch (error) {
      next(error)
    }
  }
}
