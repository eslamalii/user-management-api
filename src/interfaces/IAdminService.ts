import { AdminUserFilterDTO } from '../dtos/admin.dto'
import { User } from '../models/User'

export interface IAdminService {
  getAllUsers(filters: AdminUserFilterDTO): Promise<User[]>
  getTotalUsers(): Promise<number>
  getVerifiedUsers(): Promise<number>
  getTopUsers(): Promise<User[]>
  getInactiveUsers(): Promise<User[]>
}
