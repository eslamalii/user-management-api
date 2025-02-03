// src/__tests__/controllers/adminController.test.ts
import { Request, Response, NextFunction } from 'express'
import { AdminController } from '../../controllers/adminController'

// Create a mock implementation of the IAdminStatsRepository
const createMockAdminStatsRepo = () => ({
  getAllUsers: jest.fn(),
  getTotalUsers: jest.fn(),
  getVerifiedUsers: jest.fn(),
  getTopUsers: jest.fn(),
  getInactiveUsers: jest.fn(),
})

describe('AdminController', () => {
  let mockRepo: ReturnType<typeof createMockAdminStatsRepo>
  let controller: AdminController
  let req: Partial<Request>
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    mockRepo = createMockAdminStatsRepo()
    controller = new AdminController(mockRepo)
    req = { query: {} }
    res = {
      json: jest.fn(),
    }
    next = jest.fn()
  })

  describe('getAllUsers', () => {
    it('should call getAllUsers on the repository with parsed query params and return result', async () => {
      // Arrange: Setup req.query values and a mock repository return value
      req.query = {
        name: 'Alice',
        email: 'alice@example.com',
        page: '2',
        limit: '10',
        start_date: '2023-01-01',
        end_date: '2023-02-01',
        isVerified: 'true',
      }
      const expectedUsers = [{ id: 1, name: 'Alice' }]
      ;(mockRepo.getAllUsers as jest.Mock).mockResolvedValue(expectedUsers)

      // Act
      await controller.getAllUsers(req as Request, res as Response, next)

      // Assert: repository should be called with the parsed parameters
      expect(mockRepo.getAllUsers).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@example.com',
        isVerified: true,
        page: 2,
        limit: 10,
        startDate: '2023-01-01',
        endDate: '2023-02-01',
      })
      // And the result should be sent via res.json
      expect(res.json).toHaveBeenCalledWith(expectedUsers)
    })

    it('should call next with error when repository throws', async () => {
      const error = new Error('Something went wrong')
      ;(mockRepo.getAllUsers as jest.Mock).mockRejectedValue(error)

      await controller.getAllUsers(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getTotalUsers', () => {
    it('should return total user count', async () => {
      const totalUsers = 42
      ;(mockRepo.getTotalUsers as jest.Mock).mockResolvedValue(totalUsers)

      await controller.getTotalUsers(req as Request, res as Response, next)

      expect(mockRepo.getTotalUsers).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ totalUsers })
    })

    it('should call next with error on failure', async () => {
      const error = new Error('Database error')
      ;(mockRepo.getTotalUsers as jest.Mock).mockRejectedValue(error)

      await controller.getTotalUsers(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getVerifiedUsers', () => {
    it('should return verified user count', async () => {
      const verifiedUsers = 10
      ;(mockRepo.getVerifiedUsers as jest.Mock).mockResolvedValue(verifiedUsers)

      await controller.getVerifiedUsers(req as Request, res as Response, next)

      expect(mockRepo.getVerifiedUsers).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith({ verifiedUsers })
    })

    it('should call next with error on failure', async () => {
      const error = new Error('Database error')
      ;(mockRepo.getVerifiedUsers as jest.Mock).mockRejectedValue(error)

      await controller.getVerifiedUsers(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getTopUsers', () => {
    it('should return top users', async () => {
      const topUsers = [{ id: 1, name: 'Top User' }]
      ;(mockRepo.getTopUsers as jest.Mock).mockResolvedValue(topUsers)

      await controller.getTopUsers(req as Request, res as Response, next)

      expect(mockRepo.getTopUsers).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(topUsers)
    })

    it('should call next with error on failure', async () => {
      const error = new Error('Database error')
      ;(mockRepo.getTopUsers as jest.Mock).mockRejectedValue(error)

      await controller.getTopUsers(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('getInactiveUsers', () => {
    it('should return inactive users', async () => {
      const inactiveUsers = [{ id: 2, name: 'Inactive User' }]
      ;(mockRepo.getInactiveUsers as jest.Mock).mockResolvedValue(inactiveUsers)

      await controller.getInactiveUsers(req as Request, res as Response, next)

      expect(mockRepo.getInactiveUsers).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(inactiveUsers)
    })

    it('should call next with error on failure', async () => {
      const error = new Error('Database error')
      ;(mockRepo.getInactiveUsers as jest.Mock).mockRejectedValue(error)

      await controller.getInactiveUsers(req as Request, res as Response, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
