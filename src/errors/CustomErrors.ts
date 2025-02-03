export class CustomError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }
}

/**
 * Represents a 401 Unauthorized error.
 */
export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}

/**
 * Represents a 403 Forbidden error.
 */
export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden') {
    super(message, 403)
  }
}

/**
 * Represents a 404 Not Found error.
 */
export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404)
  }
}

/**
 * Represents a 400 Bad Request error.
 */
export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad Request') {
    super(message, 400)
  }
}
