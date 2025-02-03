import { User } from '../models/User'

export interface IUserRepository {
  createUser(user: User): Promise<number>
  updatePassword(userId: number, newHashedPassword: string): Promise<void>
  getUserByEmail(email: string): Promise<User | null>
  getUserById(userId: number): Promise<User | null>
  updateUser(
    userId: number,
    data: { name?: string; email?: string }
  ): Promise<void>
  deleteUser(userId: number): Promise<void>
  updateLoginStats(userId: number): Promise<void>
  verifyUser(email: string): Promise<void>
}
