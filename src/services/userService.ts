import { User } from '../models/User'
import { NotFoundError } from '../errors/CustomErrors'
import { IUserRepository } from '../interfaces/IUserRepository'
import { IUserService } from '../interfaces/IUserService'

export class UserService implements IUserService {
  constructor(private readonly userRepo: IUserRepository) {}

  async createUser(user: User): Promise<number> {
    const userId = await this.userRepo.createUser(user)
    return userId
  }

  async resetPassword(
    userId: number,
    newHashedPassword: string
  ): Promise<void> {
    await this.userRepo.updatePassword(userId, newHashedPassword)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.getUserByEmail(email)
  }

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepo.getUserById(userId)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    return user
  }

  async updateUser(
    userId: number,
    data: { name?: string; email?: string }
  ): Promise<void> {
    await this.userRepo.updateUser(userId, data)
  }

  async deleteUser(userId: number): Promise<void> {
    await this.userRepo.deleteUser(userId)
  }

  async updateLoginStats(userId: number): Promise<void> {
    await this.userRepo.updateLoginStats(userId)
  }
}
