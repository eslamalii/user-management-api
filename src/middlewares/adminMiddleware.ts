import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../errors/CustomErrors'
import { User } from '../models/User'

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User | undefined
  if (user && user.isAdmin) {
    return next()
  }
  next(new ForbiddenError('Forbidden: Admins only'))
}
