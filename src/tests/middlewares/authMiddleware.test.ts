import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { authenticateJWT } from '../../middlewares/authMiddleware'
import { UnauthorizedError } from '../../errors/CustomErrors'

// Mock passport.authenticate to control its behavior
jest.mock('passport')

describe('authenticateJWT middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {}
    next = jest.fn()
    jest.clearAllMocks()
  })

  it('should call next with error if passport returns an error', () => {
    ;(passport.authenticate as jest.Mock).mockImplementation(
      (strategy: string, options: any, callback: Function) =>
        (req: Request, res: Response, next: NextFunction) => {
          callback(new Error('Passport error'), false)
        }
    )

    authenticateJWT(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(expect.any(Error))
  })

  it('should call next with UnauthorizedError if no user is returned', () => {
    ;(passport.authenticate as jest.Mock).mockImplementation(
      (strategy: string, options: any, callback: Function) =>
        (req: Request, res: Response, next: NextFunction) => {
          callback(null, false)
        }
    )

    authenticateJWT(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError))
  })

  it('should attach user to req and call next when authentication succeeds', () => {
    const fakeUser = { id: 1, isAdmin: false }
    ;(passport.authenticate as jest.Mock).mockImplementation(
      (strategy: string, options: any, callback: Function) =>
        (req: Request, res: Response, next: NextFunction) => {
          callback(null, fakeUser)
        }
    )

    authenticateJWT(req as Request, res as Response, next)
    expect(req.user).toEqual(fakeUser)
    expect(next).toHaveBeenCalledWith()
  })
})
