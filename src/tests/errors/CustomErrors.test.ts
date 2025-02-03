// src/__tests__/errors/CustomErrors.test.ts
import {
  CustomError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
} from '../../errors/CustomErrors'

describe('CustomError', () => {
  it('should set message, status, and capture a stack trace', () => {
    const message = 'Test error'
    const status = 500
    const error = new CustomError(message, status)

    expect(error.message).toBe(message)
    expect(error.status).toBe(status)
    expect(error.stack).toBeDefined()

    // Check that the error is an instance of CustomError and Error
    expect(error instanceof CustomError).toBe(true)
    expect(error instanceof Error).toBe(true)
  })
})

describe('UnauthorizedError', () => {
  it('should default to "Unauthorized" and status 401', () => {
    const error = new UnauthorizedError()
    expect(error.message).toBe('Unauthorized')
    expect(error.status).toBe(401)
  })

  it('should allow a custom message', () => {
    const customMessage = 'Custom unauthorized message'
    const error = new UnauthorizedError(customMessage)
    expect(error.message).toBe(customMessage)
    expect(error.status).toBe(401)
  })
})

describe('ForbiddenError', () => {
  it('should default to "Forbidden" and status 403', () => {
    const error = new ForbiddenError()
    expect(error.message).toBe('Forbidden')
    expect(error.status).toBe(403)
  })

  it('should allow a custom message', () => {
    const customMessage = 'Custom forbidden message'
    const error = new ForbiddenError(customMessage)
    expect(error.message).toBe(customMessage)
    expect(error.status).toBe(403)
  })
})

describe('NotFoundError', () => {
  it('should default to "Resource not found" and status 404', () => {
    const error = new NotFoundError()
    expect(error.message).toBe('Resource not found')
    expect(error.status).toBe(404)
  })

  it('should allow a custom message', () => {
    const customMessage = 'Custom not found message'
    const error = new NotFoundError(customMessage)
    expect(error.message).toBe(customMessage)
    expect(error.status).toBe(404)
  })
})

describe('BadRequestError', () => {
  it('should default to "Bad Request" and status 400', () => {
    const error = new BadRequestError()
    expect(error.message).toBe('Bad Request')
    expect(error.status).toBe(400)
  })

  it('should allow a custom message', () => {
    const customMessage = 'Custom bad request message'
    const error = new BadRequestError(customMessage)
    expect(error.message).toBe(customMessage)
    expect(error.status).toBe(400)
  })
})
