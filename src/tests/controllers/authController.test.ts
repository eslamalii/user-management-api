import { AuthController } from '../../controllers/authController'
import { AuthService } from '../../services/authService'
import { Request, Response, NextFunction } from 'express'
import { BadRequestError, NotFoundError } from '../../errors/CustomErrors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../../models/User'

jest.mock('../../services/authService')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('AuthController', () => {
  let authController: AuthController
  let mockAuthService: jest.Mocked<AuthService>
  let mockReq: Partial<Request>
  let mockRes: Partial<Response>
  let nextFn: jest.MockedFunction<NextFunction>

  beforeEach(() => {
    mockAuthService = new AuthService({} as any) as jest.Mocked<AuthService>
    authController = new AuthController(mockAuthService)
    mockReq = { body: {} }
    mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis() }
    nextFn = jest.fn()
  })

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const user: User = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        password: 'dummy',
      }
      mockAuthService.registerUser.mockResolvedValue(user)

      mockReq.body = {
        name: 'Test',
        email: 'test@example.com',
        password: 'password',
      }
      await authController.register(
        mockReq as Request,
        mockRes as Response,
        nextFn
      )

      expect(mockAuthService.registerUser).toHaveBeenCalled()
      expect(mockRes.status).toHaveBeenCalledWith(201)
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'User registered successfully',
        user,
      })
    })

    it('should handle existing user registration', async () => {
      mockAuthService.registerUser.mockRejectedValue(
        new BadRequestError('User exists')
      )

      await authController.register(
        mockReq as Request,
        mockRes as Response,
        nextFn
      )

      expect(nextFn).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })

  describe('login', () => {
    it('should return token on successful login', async () => {
      const result = { token: 'jwt.token', user: { id: 1 } }
      mockAuthService.loginUser.mockResolvedValue(result)

      mockReq.body = { email: 'test@example.com', password: 'password' }
      await authController.login(
        mockReq as Request,
        mockRes as Response,
        nextFn
      )

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Login successful',
        ...result,
      })
    })

    it('should handle invalid credentials', async () => {
      mockAuthService.loginUser.mockRejectedValue(
        new BadRequestError('Invalid credentials')
      )

      await authController.login(
        mockReq as Request,
        mockRes as Response,
        nextFn
      )

      expect(nextFn).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })

  describe('verify', () => {
    it('should verify user email', async () => {
      mockReq.query = { email: 'test@example.com' }
      mockAuthService.verifyUser.mockResolvedValue({ isVerified: true })

      await authController.verify(
        mockReq as Request,
        mockRes as Response,
        nextFn
      )

      expect(mockRes.json).toHaveBeenCalledWith({ isVerified: true })
    })

    it('should handle missing email parameter', async () => {
      mockReq.query = {}

      await authController.verify(
        mockReq as Request,
        mockRes as Response,
        nextFn
      )

      expect(nextFn).toHaveBeenCalledWith(expect.any(BadRequestError))
    })
  })
})
