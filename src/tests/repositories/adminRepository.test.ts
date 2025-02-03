import { AdminRepository } from '../../repositories/adminRepository'
import pool from '../../config/db'
import { AdminUserFilterDTO } from '../../dtos/admin.dto'

// Mock the pool module (which exports an object with an "execute" method)
jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}))

// Tell TypeScript that "pool" is now a mocked version.
const mockedPool = pool as unknown as { execute: jest.Mock }

describe('AdminRepository', () => {
  let adminRepo: AdminRepository

  beforeEach(() => {
    adminRepo = new AdminRepository()
    mockedPool.execute.mockReset()
  })

  describe('getAllUsers', () => {
    it('should build query with filters and return rows', async () => {
      const filters: AdminUserFilterDTO = {
        name: 'Alice',
        email: 'alice@example.com',
        isVerified: true,
        page: 2,
        limit: 10,
        startDate: '2023-01-01',
        endDate: '2023-02-01',
      }
      const fakeRows = [{ id: 1, name: 'Alice' }]
      mockedPool.execute.mockResolvedValue([fakeRows])

      const result = await adminRepo.getAllUsers(filters)

      // Expect the pool to be called and the result to be what we simulated.
      expect(mockedPool.execute).toHaveBeenCalled()
      expect(result).toEqual(fakeRows)
    })
  })

  describe('getTotalUsers', () => {
    it('should return total number of users', async () => {
      const fakeRows = [{ total: 42 }]
      mockedPool.execute.mockResolvedValue([fakeRows])

      const total = await adminRepo.getTotalUsers()
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT COUNT(*) as total FROM users'
      )
      expect(total).toBe(42)
    })
  })

  describe('getVerifiedUsers', () => {
    it('should return number of verified users', async () => {
      const fakeRows = [{ total: 15 }]
      mockedPool.execute.mockResolvedValue([fakeRows])

      const total = await adminRepo.getVerifiedUsers()
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT COUNT(*) as total FROM users WHERE isVerified = true'
      )
      expect(total).toBe(15)
    })
  })

  describe('getTopUsers', () => {
    it('should return the top 3 users by loginCount', async () => {
      const fakeRows = [{ id: 1 }, { id: 2 }, { id: 3 }]
      mockedPool.execute.mockResolvedValue([fakeRows])

      const result = await adminRepo.getTopUsers()
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT * FROM users ORDER BY loginCount DESC LIMIT 3'
      )
      expect(result).toEqual(fakeRows)
    })
  })

  describe('getInactiveUsers', () => {
    it('should return users who have never logged in', async () => {
      const fakeRows = [{ id: 4 }]
      mockedPool.execute.mockResolvedValue([fakeRows])

      const result = await adminRepo.getInactiveUsers()
      expect(mockedPool.execute).toHaveBeenCalledWith(
        'SELECT * FROM users WHERE loginCount = 0'
      )
      expect(result).toEqual(fakeRows)
    })
  })
})
