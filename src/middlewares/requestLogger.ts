import { Request, Response, NextFunction } from 'express'
import logger from '../logger/logger'

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const startTime = Date.now()
  logger.info(`Incoming ${req.method} ${req.url}`, {
    query: req.query,
    body: req.body,
  })
  res.on('finish', () => {
    const duration = Date.now() - startTime
    logger.info(
      `Completed ${req.method} ${req.url} ${res.statusCode} in ${duration}ms`
    )
  })
  next()
}
