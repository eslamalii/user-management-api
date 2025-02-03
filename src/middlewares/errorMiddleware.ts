import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors/CustomErrors'
import config from '../config/env'

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (config.NODE_ENV !== 'test') {
    console.error(err.stack)
  }

  const statusCode = err.status || 500

  const message =
    err instanceof CustomError ? err.message : 'Internal Server Error'

  const response = {
    message,
    ...(config.NODE_ENV === 'development' && { stack: err.stack }),
  }

  res.status(statusCode).json(response)
}
