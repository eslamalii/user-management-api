import { Request, Response, NextFunction } from 'express'
import { adminOnly } from '../../middlewares/adminMiddleware'
import { ForbiddenError } from '../../errors/CustomErrors'

describe('adminOnly middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {} // Start with a blank request.
    res = {}
    next = jest.fn()
  })

  it('should call next() when req.user exists and isAdmin is true', () => {
    req.user = { id: 1, isAdmin: true }
    adminOnly(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith() // Called with no arguments.
  })

  it('should call next() with ForbiddenError when req.user is not admin', () => {
    req.user = { id: 2, isAdmin: false }
    adminOnly(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError))
  })

  it('should call next() with ForbiddenError when req.user is undefined', () => {
    req.user = undefined
    adminOnly(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError))
  })
})
