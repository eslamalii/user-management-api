import { UserService } from '../../services/userService'
import { IUserRepository } from '../../interfaces/IUserRepository'
import { User } from '../../models/User'
import { NotFoundError } from '../../errors/CustomErrors'

describe('UserService', () => {
  let userRepository: jest.Mocked<IUserRepository>
  let userService: UserService

  beforeEach(() => {
    userRepository = {
      createUser: jest.fn(),
      updatePassword: jest.fn(),
      getUserByEmail: jest.fn(),
      getUserById: jest.fn(),
      updateLoginStats: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      verifyUser: jest.fn(),
    }
    userService = new UserService(userRepository)
  })

  describe('createUser', () => {
    test('should create a user and return user id', async () => {
      const fakeUser: User = {
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
        isVerified: false,
        isAdmin: false,
      }
      userRepository.createUser.mockResolvedValue(42)
      const id = await userService.createUser(fakeUser)
      expect(userRepository.createUser).toHaveBeenCalledWith(fakeUser)
      expect(id).toBe(42)
    })
  })

  describe('resetPassword', () => {
    test('should call updatePassword on repository', async () => {
      userRepository.updatePassword.mockResolvedValue()
      await userService.resetPassword(1, 'newhashed')
      expect(userRepository.updatePassword).toHaveBeenCalledWith(1, 'newhashed')
    })
  })

  describe('getUserByEmail', () => {
    test('should return user when found', async () => {
      const fakeUser: User = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
        isVerified: true,
        isAdmin: false,
      }
      userRepository.getUserByEmail.mockResolvedValue(fakeUser)
      const user = await userService.getUserByEmail('test@example.com')
      expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
        'test@example.com'
      )
      expect(user).toEqual(fakeUser)
    })
  })

  describe('getUserById', () => {
    test('should return user when found', async () => {
      const fakeUser: User = {
        id: 1,
        name: 'Test',
        email: 'test@example.com',
        password: 'pass',
        isVerified: true,
        isAdmin: false,
      }
      userRepository.getUserById.mockResolvedValue(fakeUser)
      const user = await userService.getUserById(1)
      expect(userRepository.getUserById).toHaveBeenCalledWith(1)
      expect(user).toEqual(fakeUser)
    })

    test('should throw NotFoundError when user not found', async () => {
      userRepository.getUserById.mockResolvedValue(null)
      await expect(userService.getUserById(99)).rejects.toThrow(NotFoundError)
    })
  })

  describe('updateUser', () => {
    test('should call updateUser on repository', async () => {
      userRepository.updateUser.mockResolvedValue()
      await userService.updateUser(1, {
        name: 'NewName',
        email: 'new@example.com',
      })
      expect(userRepository.updateUser).toHaveBeenCalledWith(1, {
        name: 'NewName',
        email: 'new@example.com',
      })
    })
  })

  describe('deleteUser', () => {
    test('should call deleteUser on repository', async () => {
      userRepository.deleteUser.mockResolvedValue()
      await userService.deleteUser(1)
      expect(userRepository.deleteUser).toHaveBeenCalledWith(1)
    })
  })

  describe('updateLoginStats', () => {
    test('should call updateLoginStats on repository', async () => {
      userRepository.updateLoginStats.mockResolvedValue()
      await userService.updateLoginStats(1)
      expect(userRepository.updateLoginStats).toHaveBeenCalledWith(1)
    })
  })
})
