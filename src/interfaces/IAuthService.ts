import { User } from '../models/User'

export interface IAuthService {
  registerUser(
    name: string,
    email: string,
    password: string,
    isAdmin: boolean
  ): Promise<User>
  loginUser(
    email: string,
    password: string
  ): Promise<{ token: string; user: Partial<User> }>
  verifyUser(email: string): Promise<{ isVerified: boolean }>
}
