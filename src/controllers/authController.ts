import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../errors/CustomErrors'
import { IAuthService } from '../interfaces/IAuthService'

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, password, isAdmin } = req.body
      const user = await this.authService.registerUser(
        name,
        email,
        password,
        isAdmin
      )
      res.status(201).json({ message: 'User registered successfully', user })
    } catch (error) {
      next(error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const result = await this.authService.loginUser(email, password)
      res.status(200).json({
        message: 'Login successful',
        token: result.token,
        user: result.user,
      })
    } catch (error) {
      next(error)
    }
  }

  verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.query
      if (!email || typeof email !== 'string') {
        throw new BadRequestError('Invalid email query parameter')
      }
      const verificationStatus = await this.authService.verifyUser(email)
      res.status(200).json(verificationStatus)
    } catch (error) {
      next(error)
    }
  }
}
