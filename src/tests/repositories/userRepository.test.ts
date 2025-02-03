import { UserRepository } from '../../repositories/userRepository'
import poolExport from '../../config/db'

// Mock the pool module (which is imported as poolExport in the repository)
jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}))

const mockedPool = poolExport as unknown as { execute: jest.Mock<any, any> }

describe('UserRepository', () => {
  let userRepo: UserRepository

  beforeEach(() => {
    userRepo = new UserRepository()
    mockedPool.execute.mockReset()
  })

  describe('createUser', () => {
    it('should execute insert query and return the insertId', async () => {
      const fakeUser = {
        name: 'Bob',
        email: 'bob@example.com',
        password: 'hashedPassword',
        isAdmin: false,
      }
      const fakeResult = { insertId: 123 }
      mockedPool.execute.mockResolvedValue([{ insertId: 123 }])

      const insertId = await userRepo.createUser(fakeUser)
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
        [fakeUser.name, fakeUser.email, fakeUser.password, fakeUser.isAdmin]
      )
      expect(insertId).toBe(123)
    })
  })

  describe('updatePassword', () => {
    it('should execute update query to change the password', async () => {
      mockedPool.execute.mockResolvedValue([])
      await userRepo.updatePassword(1, 'newHashedPassword')
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'UPDATE users SET password = ? WHERE id = ?',
        ['newHashedPassword', 1]
      )
    })
  })

  describe('getUserByEmail', () => {
    it('should return a user when found', async () => {
      const fakeRows = [{ id: 1, email: 'bob@example.com' }]
      mockedPool.execute.mockResolvedValue([fakeRows])
      const result = await userRepo.getUserByEmail('bob@example.com')
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE email = ?',
        ['bob@example.com']
      )
      expect(result).toEqual(fakeRows[0])
    })

    it('should return null when no user is found', async () => {
      mockedPool.execute.mockResolvedValue([[]])
      const result = await userRepo.getUserByEmail('nonexistent@example.com')
      expect(result).toBeNull()
    })
  })

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      const fakeRows = [{ id: 1, name: 'Bob' }]
      mockedPool.execute.mockResolvedValue([fakeRows])
      const result = await userRepo.getUserById(1)
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE id = ?',
        [1]
      )
      expect(result).toEqual(fakeRows[0])
    })

    it('should return null when no user is found', async () => {
      mockedPool.execute.mockResolvedValue([[]])
      const result = await userRepo.getUserById(999)
      expect(result).toBeNull()
    })
  })

  describe('updateLoginStats', () => {
    it('should execute update query to increment loginCount and update lastLogin', async () => {
      mockedPool.execute.mockResolvedValue([])
      await userRepo.updateLoginStats(1)
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'UPDATE users SET loginCount = loginCount + 1, lastLogin = CURRENT_TIMESTAMP WHERE id = ?',
        [1]
      )
    })
  })

  describe('updateUser', () => {
    it('should build the query dynamically and execute it', async () => {
      mockedPool.execute.mockResolvedValue([])
      await userRepo.updateUser(1, {
        name: 'NewName',
        email: 'new@example.com',
      })

      // We expect that the query string contains both "name = ?" and "email = ?"
      const calledArgs = mockedPool.execute.mock.calls[0]
      expect(calledArgs[0]).toContain('name = ?')
      expect(calledArgs[0]).toContain('email = ?')
      // The values array should have the new name, new email, and finally the userId.
      expect(calledArgs[1]).toEqual(['NewName', 'new@example.com', 1])
    })
  })

  describe('deleteUser', () => {
    it('should execute delete query', async () => {
      mockedPool.execute.mockResolvedValue([])
      await userRepo.deleteUser(1)
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'DELETE FROM users WHERE id = ?',
        [1]
      )
    })
  })

  describe('verifyUser', () => {
    it('should execute update query to set isVerified to TRUE', async () => {
      mockedPool.execute.mockResolvedValue([])
      await userRepo.verifyUser('bob@example.com')
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'UPDATE users SET isVerified = TRUE WHERE email = ?',
        ['bob@example.com']
      )
    })
  })
})
