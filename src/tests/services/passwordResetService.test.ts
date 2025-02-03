import { PasswordResetService } from '../../services/passwordResetService'
import { UserRepository } from '../../repositories/userRepository'
import { NotFoundError, BadRequestError } from '../../errors/CustomErrors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Mock the UserRepository, jwt, and bcrypt modules.
jest.mock('../../repositories/userRepository')
jest.mock('jsonwebtoken')
jest.mock('bcrypt')

describe('PasswordResetService', () => {
  let passwordResetService: PasswordResetService
  let userRepository: jest.Mocked<UserRepository>

  beforeEach(() => {
    // Create a mocked instance of UserRepository.
    userRepository = new UserRepository() as jest.Mocked<UserRepository>
    // Pass the mocked repository to PasswordResetService.
    passwordResetService = new PasswordResetService(userRepository)
    jest.clearAllMocks()
  })

  describe('requestPasswordReset', () => {
    test('should throw NotFoundError if user not found', async () => {
      userRepository.getUserByEmail.mockResolvedValue(null)
      await expect(
        passwordResetService.requestPasswordReset('nonexistent@example.com')
      ).rejects.toThrow(NotFoundError)
    })

    test('should return a token when user is found', async () => {
      const fakeUser = { id: 1, email: 'test@example.com' }
      userRepository.getUserByEmail.mockResolvedValue(fakeUser as any)
      ;(jwt.sign as jest.Mock).mockReturnValue('resettoken123')

      const token = await passwordResetService.requestPasswordReset(
        'test@example.com'
      )
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com'
      )
      expect(jwt.sign).toHaveBeenCalled()
      expect(token).toBe('resettoken123')
    })
  })

  describe('resetPassword', () => {
    test('should throw BadRequestError if token is invalid', async () => {
      ;(jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('invalid token')
      })
      await expect(
        passwordResetService.resetPassword('badtoken', 'newpass')
      ).rejects.toThrow(BadRequestError)
    })

    test('should throw NotFoundError if user not found', async () => {
      ;(jwt.verify as jest.Mock).mockReturnValue({ id: 1 })
      userRepository.getUserById.mockResolvedValue(null)
      await expect(
        passwordResetService.resetPassword('validtoken', 'newpass')
      ).rejects.toThrow(NotFoundError)
    })

    test('should update password successfully', async () => {
      const fakeUser = { id: 1, email: 'test@example.com' }
      ;(jwt.verify as jest.Mock).mockReturnValue({ id: 1 })
      userRepository.getUserById.mockResolvedValue(fakeUser as any)
      ;(bcrypt.hash as jest.Mock).mockResolvedValue('newhashedpassword')
      userRepository.updatePassword.mockResolvedValue()

      await passwordResetService.resetPassword('validtoken', 'newpass')
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10)
      expect(userRepository.updatePassword).toHaveBeenCalledWith(
        1,
        'newhashedpassword'
      )
    })
  })
})
