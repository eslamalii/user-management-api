import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { UnauthorizedError } from '../errors/CustomErrors'
import { User } from '../models/User'

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (err: Error, user: User | false) => {
      if (err) return next(err)
      if (!user) return next(new UnauthorizedError('Unauthorized'))
      req.user = user
      next()
    }
  )(req, res, next)
}
