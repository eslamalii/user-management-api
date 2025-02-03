import { User } from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { BadRequestError, NotFoundError } from '../errors/CustomErrors'
import { IUserRepository } from '../interfaces/IUserRepository'
import { IAuthService } from '../interfaces/IAuthService'
import config from '../config/env'

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  // User Registration
  async registerUser(
    name: string,
    email: string,
    password: string,
    isAdmin: boolean
  ): Promise<User> {
    const existingUser = await this.userRepository.getUserByEmail(email)
    if (existingUser) {
      throw new BadRequestError('User already exists')
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user: User = {
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      isAdmin,
    }
    const insertId = await this.userRepository.createUser(user)
    user.id = insertId
    return user
  }

  // User Login
  async loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; user: Partial<User> }> {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    if (!user.password) {
      throw new BadRequestError('Invalid user configuration')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new BadRequestError('Invalid credentials')
    }
    if (!user.isVerified) {
      throw new BadRequestError('User is not verified')
    }
    await this.userRepository.updateLoginStats(user.id as number)
    const payload = { id: user.id, isAdmin: user.isAdmin }
    const token = jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: Number(config.JWT_EXPIRES_IN),
    })
    // Remove sensitive fields before returning the user object
    const { password: _password, ...safeUser } = user
    return { token, user: safeUser }
  }

  // Check user verification status
  async verifyUser(email: string): Promise<{ isVerified: boolean }> {
    const user = await this.userRepository.getUserByEmail(email)
    if (!user) {
      throw new NotFoundError('User not found')
    }
    await this.userRepository.verifyUser(email)
    return { isVerified: user.isVerified || false }
  }
}
