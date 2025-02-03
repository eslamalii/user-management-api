import { Request, Response, NextFunction } from 'express'
import { IAdminService } from '../interfaces/IAdminService'

export class AdminController {
  constructor(private readonly adminStatsRepo: IAdminService) {}

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, page, limit, start_date, end_date } = req.query
      const isVerified = req.query.isVerified === 'true'

      const users = await this.adminStatsRepo.getAllUsers({
        name: name as string,
        email: email as string,
        isVerified,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        startDate: start_date as string,
        endDate: end_date as string,
      })
      res.json(users)
    } catch (error) {
      next(error)
    }
  }

  getTotalUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const total = await this.adminStatsRepo.getTotalUsers()
      res.json({ totalUsers: total })
    } catch (error) {
      next(error)
    }
  }

  getVerifiedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const total = await this.adminStatsRepo.getVerifiedUsers()
      res.json({ verifiedUsers: total })
    } catch (error) {
      next(error)
    }
  }

  getTopUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topUsers = await this.adminStatsRepo.getTopUsers()
      res.json(topUsers)
    } catch (error) {
      next(error)
    }
  }

  getInactiveUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const inactiveUsers = await this.adminStatsRepo.getInactiveUsers()
      res.json(inactiveUsers)
    } catch (error) {
      next(error)
    }
  }
}
