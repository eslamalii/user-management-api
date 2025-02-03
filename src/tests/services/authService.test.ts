import { AuthService } from '../../services/authService'
import { IUserRepository } from '../../interfaces/IUserRepository'
import { User } from '../../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { BadRequestError, NotFoundError } from '../../errors/CustomErrors'

// Mock external modules
jest.mock('bcrypt')
jest.mock('jsonwebtoken')

describe('AuthService', () => {
  let userRepository: jest.Mocked<IUserRepository>
  let authService: AuthService

  beforeEach(() => {
    userRepository = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updatePassword: jest.fn(),
      updateLoginStats: jest.fn(),
      verifyUser: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    }
    authService = new AuthService(userRepository)
    jest.clearAllMocks()
  })

  describe('registerUser', () => {
    test('should throw error if user exists', async () => {
      userRepository.getUserByEmail.mockResolvedValue({} as User)
      await expect(
        authService.registerUser(
          'Alice',
          'alice@example.com',
          'password123',
          false
        )
      ).rejects.toThrow(BadRequestError)
    })

    test('should register user successfully', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword')
      userRepository.createUser.mockResolvedValue(1)

      const user = await authService.registerUser(
        'Alice',
        'alice@example.com',
        'password123',
        false
      )
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'alice@example.com'
      )
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10)
      expect(userRepository.createUser).toHaveBeenCalled()
      expect(user.id).toBe(1)
    })
  })

  describe('loginUser', () => {
    test('should throw NotFoundError if user not found', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null)
      await expect(
        authService.loginUser('bob@example.com', 'password')
      ).rejects.toThrow(NotFoundError)
    })

    test('should throw BadRequestError if password does not match', async () => {
      const fakeUser: User = {
        id: 1,
        name: 'Bob',
        email: 'bob@example.com',
        password: 'hashedPassword',
        isVerified: true,
        isAdmin: false,
      }
      userRepository.getUserByEmail.mockResolvedValue(fakeUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(false)
      await expect(
        authService.loginUser('bob@example.com', 'wrongpassword')
      ).rejects.toThrow(BadRequestError)
    })

    test('should throw BadRequestError if user is not verified', async () => {
      const fakeUser: User = {
        id: 1,
        name: 'Bob',
        email: 'bob@example.com',
        password: 'hashedPassword',
        isVerified: false,
        isAdmin: false,
      }
      userRepository.getUserByEmail.mockResolvedValue(fakeUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      await expect(
        authService.loginUser('bob@example.com', 'password')
      ).rejects.toThrow(BadRequestError)
    })

    test('should login user successfully and return token and safe user', async () => {
      const fakeUser: User = {
        id: 1,
        name: 'Bob',
        email: 'bob@example.com',
        password: 'hashedPassword',
        isVerified: true,
        isAdmin: false,
      }
      userRepository.getUserByEmail.mockResolvedValue(fakeUser)
      ;(bcrypt.compare as jest.Mock).mockResolvedValue(true)
      userRepository.updateLoginStats.mockResolvedValue()
      ;(jwt.sign as jest.Mock).mockReturnValue('token123')

      const result = await authService.loginUser('bob@example.com', 'password')
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'bob@example.com'
      )
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword')
      expect(userRepository.updateLoginStats).toHaveBeenCalledWith(fakeUser.id)
      expect(jwt.sign).toHaveBeenCalled()
      expect(result).toHaveProperty('token', 'token123')
      expect(result.user).not.toHaveProperty('password')
    })
  })

  describe('verifyUser', () => {
    test('should throw NotFoundError if user not found', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null)
      await expect(
        authService.verifyUser('nonexistent@example.com')
      ).rejects.toThrow(NotFoundError)
    })

    test('should verify user and return verification status', async () => {
      const fakeUser: User = {
        id: 1,
        name: 'Charlie',
        email: 'charlie@example.com',
        password: 'hashedPassword',
        isVerified: false,
        isAdmin: false,
      }
      userRepository.getUserByEmail.mockResolvedValue(fakeUser)
      userRepository.verifyUser.mockResolvedValue()

      const result = await authService.verifyUser('charlie@example.com')
      expect(userRepository.verifyUser).toHaveBeenCalledWith(
        'charlie@example.com'
      )
      expect(result).toEqual({ isVerified: false })
    })
  })
})
