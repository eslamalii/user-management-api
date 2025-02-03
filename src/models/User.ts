export interface User {
  id?: number
  name: string
  email: string
  password: string
  isVerified?: boolean
  isAdmin?: boolean
  loginCount?: number
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
}
