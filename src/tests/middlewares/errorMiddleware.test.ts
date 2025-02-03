import { Request, Response, NextFunction } from 'express'
import { errorMiddleware } from '../../middlewares/errorMiddleware'
import { CustomError } from '../../errors/CustomErrors'

describe('errorMiddleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should log error stack if NODE_ENV is not "test"', () => {
    process.env.NODE_ENV = 'development'
    const error = new CustomError('Test error', 418)
    errorMiddleware(error, req as Request, res as Response, next)
    expect(consoleErrorSpy).toHaveBeenCalledWith(error.stack)
  })

  it('should use error.status and send error message with stack in development', () => {
    process.env.NODE_ENV = 'development'
    const error = new CustomError('Custom error', 400)
    errorMiddleware(error, req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Custom error',
      stack: error.stack,
    })
  })

  it('should send generic message if error is not a CustomError', () => {
    process.env.NODE_ENV = 'production'
    const error = new Error('Some error')
    ;(error as any).status = 500
    errorMiddleware(error, req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    })
  })
})
