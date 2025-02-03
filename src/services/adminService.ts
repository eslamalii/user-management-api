import { AdminUserFilterDTO } from '../dtos/admin.dto'
import { IAdminRepository } from '../interfaces/IAdminRepository'
import { IAdminService } from '../interfaces/IAdminService'
import { User } from '../models/User'

export class AdminService implements IAdminService {
  constructor(private readonly adminStatsRepo: IAdminRepository) {}

  async getAllUsers(filters: AdminUserFilterDTO): Promise<User[]> {
    return await this.adminStatsRepo.getAllUsers(filters)
  }

  async getTotalUsers(): Promise<number> {
    return await this.adminStatsRepo.getTotalUsers()
  }

  async getVerifiedUsers(): Promise<number> {
    return await this.adminStatsRepo.getVerifiedUsers()
  }

  async getTopUsers(): Promise<User[]> {
    return await this.adminStatsRepo.getTopUsers()
  }

  async getInactiveUsers(): Promise<User[]> {
    return await this.adminStatsRepo.getInactiveUsers()
  }
}
