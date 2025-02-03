import { AdminService } from '../../services/adminService'
import { AdminUserFilterDTO } from '../../dtos/admin.dto'
import { User } from '../../models/User'
import { IAdminService } from '../../interfaces/IAdminService'

describe('AdminService', () => {
  let adminStatsRepo: jest.Mocked<IAdminService>
  let adminService: AdminService

  beforeEach(() => {
    adminStatsRepo = {
      getAllUsers: jest.fn(),
      getTotalUsers: jest.fn(),
      getVerifiedUsers: jest.fn(),
      getTopUsers: jest.fn(),
      getInactiveUsers: jest.fn(),
    }
    adminService = new AdminService(adminStatsRepo)
  })

  test('getAllUsers returns users based on filters', async () => {
    const filters: AdminUserFilterDTO = {
      name: 'Alice',
      email: 'alice@example.com',
      page: 1,
      limit: 10,
    }
    const fakeUsers: User[] = [
      {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'xxx',
        isVerified: true,
        isAdmin: false,
      },
    ]
    adminStatsRepo.getAllUsers.mockResolvedValue(fakeUsers)

    const result = await adminService.getAllUsers(filters)
    expect(adminStatsRepo.getAllUsers).toHaveBeenCalledWith(filters)
    expect(result).toEqual(fakeUsers)
  })

  test('getTotalUsers returns total count', async () => {
    adminStatsRepo.getTotalUsers.mockResolvedValue(100)
    const total = await adminService.getTotalUsers()
    expect(adminStatsRepo.getTotalUsers).toHaveBeenCalled()
    expect(total).toBe(100)
  })

  test('getVerifiedUsers returns count', async () => {
    adminStatsRepo.getVerifiedUsers.mockResolvedValue(50)
    const count = await adminService.getVerifiedUsers()
    expect(adminStatsRepo.getVerifiedUsers).toHaveBeenCalled()
    expect(count).toBe(50)
  })

  test('getTopUsers returns top users', async () => {
    const fakeUsers: User[] = [
      {
        id: 1,
        name: 'Alice',
        email: 'alice@example.com',
        password: 'xxx',
        isVerified: true,
        isAdmin: false,
      },
    ]
    adminStatsRepo.getTopUsers.mockResolvedValue(fakeUsers)
    const result = await adminService.getTopUsers()
    expect(adminStatsRepo.getTopUsers).toHaveBeenCalled()
    expect(result).toEqual(fakeUsers)
  })

  test('getInactiveUsers returns inactive users', async () => {
    const fakeUsers: User[] = [
      {
        id: 2,
        name: 'Bob',
        email: 'bob@example.com',
        password: 'xxx',
        isVerified: false,
        isAdmin: false,
      },
    ]
    adminStatsRepo.getInactiveUsers.mockResolvedValue(fakeUsers)
    const result = await adminService.getInactiveUsers()
    expect(adminStatsRepo.getInactiveUsers).toHaveBeenCalled()
    expect(result).toEqual(fakeUsers)
  })
})
