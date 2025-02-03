import { Request, Response, NextFunction } from 'express'
import { validateDTO } from '../../middlewares/validationMiddleware'
import { IsNotEmpty, IsString } from 'class-validator'

// Dummy DTO for testing purposes.
class DummyDTO {
  @IsNotEmpty({ message: 'Name must not be empty' })
  @IsString()
  name!: string
}

describe('validateDTO middleware', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should call next() if DTO is valid', async () => {
    req.body = { name: 'Alice' }
    const middleware = validateDTO(DummyDTO, 'body')
    await middleware(req as Request, res as Response, next)
    expect(next).toHaveBeenCalledWith() // Called with no error.
  })

  it('should return 400 with errors if DTO is invalid', async () => {
    req.body = { name: '' } // Violates @IsNotEmpty.
    const middleware = validateDTO(DummyDTO, 'body')
    await middleware(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      errors: expect.arrayContaining(['Name must not be empty']),
    })
  })
})
