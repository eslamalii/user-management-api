import { Request, Response, NextFunction, RequestHandler } from 'express'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { ClassConstructor } from 'class-transformer/types/interfaces'

export function validateDTO<T extends object>(
  dtoClass: ClassConstructor<T>,
  targetProperty: 'body' | 'query' | 'params' = 'body'
): RequestHandler {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const targetData = req[targetProperty]
      const dto = plainToInstance(dtoClass, targetData)

      const errors = await validate(dto as object)
      if (errors.length > 0) {
        const errorMessages = errors.flatMap((error) =>
          Object.values(error.constraints || {})
        )
        res.status(400).json({ errors: errorMessages })
        return
      }

      req[targetProperty] = dto as (typeof req)[typeof targetProperty]
      next()
    } catch (error) {
      next(error)
    }
  }
}
