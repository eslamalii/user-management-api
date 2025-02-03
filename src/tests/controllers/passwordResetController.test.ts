// src/__tests__/controllers/passwordResetController.test.ts
import { Request, Response, NextFunction } from 'express'
import { PasswordResetController } from '../../controllers/PasswordResetController'
import { PasswordResetService } from '../../services/passwordResetService'

// Create a mock for the PasswordResetService
const createMockPasswordResetService = () => ({
  requestPasswordReset: jest.fn(),
  resetPassword: jest.fn(),
})

describe('PasswordResetController', () => {
  let mockService: PasswordResetService
  let controller: PasswordResetController
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    mockService =
      createMockPasswordResetService() as unknown as PasswordResetService
    controller = new PasswordResetController(mockService)
    req = { body: {} }
    res = {
      json: jest.fn(),
    }
    next = jest.fn()
  })

  describe('requestPasswordReset', () => {
    it('should return a JSON response with a token when successful', async () => {
      // Arrange
      const email = 'user@example.com'
      const token = 'dummy-token'
      req.body = { email }
      ;(mockService.requestPasswordReset as jest.Mock).mockResolvedValue(token)

      // Act
      await controller.requestPasswordReset(
        req as Request,
        res as Response,
        next
      )

      // Assert: Verify that the service was called correctly
      expect(mockService.requestPasswordReset).toHaveBeenCalledWith(email)
      // And that the response contains the expected message and token
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password reset token generated',
        token,
      })
    })

    it('should pass errors to next if service throws', async () => {
      // Arrange
      const error = new Error('Service error')
      req.body = { email: 'user@example.com' }
      ;(mockService.requestPasswordReset as jest.Mock).mockRejectedValue(error)

      // Act
      await controller.requestPasswordReset(
        req as Request,
        res as Response,
        next
      )

      // Assert: Verify that the error was passed to next
      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('resetPassword', () => {
    it('should return a JSON response with a success message when successful', async () => {
      // Arrange
      const token = 'dummy-token'
      const newPassword = 'new-secret'
      req.body = { token, newPassword }
      ;(mockService.resetPassword as jest.Mock).mockResolvedValue(undefined)

      // Act
      await controller.resetPassword(req as Request, res as Response, next)

      // Assert: Verify that the service was called correctly
      expect(mockService.resetPassword).toHaveBeenCalledWith(token, newPassword)
      // And that the response contains the expected success message
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password has been reset successfully',
      })
    })

    it('should pass errors to next if service throws', async () => {
      // Arrange
      const error = new Error('Reset error')
      req.body = { token: 'dummy-token', newPassword: 'new-secret' }
      ;(mockService.resetPassword as jest.Mock).mockRejectedValue(error)

      // Act
      await controller.resetPassword(req as Request, res as Response, next)

      // Assert: Verify that the error was passed to next
      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
