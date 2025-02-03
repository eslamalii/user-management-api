import { User } from '../models/User'

export interface IUserService {
  createUser(user: User): Promise<number>
  resetPassword(userId: number, newHashedPassword: string): Promise<void>
  getUserByEmail(email: string): Promise<User | null>
  getUserById(userId: number): Promise<User>
  updateUser(
    userId: number,
    data: { name?: string; email?: string }
  ): Promise<void>
  deleteUser(userId: number): Promise<void>
  updateLoginStats(userId: number): Promise<void>
}
