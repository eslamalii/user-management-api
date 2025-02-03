import poolExport from '../config/db'
import { IUserRepository } from '../interfaces/IUserRepository'
import { User } from '../models/User'

export class UserRepository implements IUserRepository {
  // Create a new user
  async createUser(user: User): Promise<number> {
    try {
      const [result]: any = await poolExport.execute(
        'INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)',
        [user.name, user.email, user.password, user.isAdmin || false]
      )
      return result.insertId
    } catch (error) {
      throw error
    }
  }

  // Reset password
  async updatePassword(
    userId: number,
    newHashedPassword: string
  ): Promise<void> {
    try {
      await poolExport.execute('UPDATE users SET password = ? WHERE id = ?', [
        newHashedPassword,
        userId,
      ])
    } catch (error) {
      throw error
    }
  }

  // Get a user by email
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const [rows]: any = await poolExport.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      )
      return rows.length ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  // Get a user by id
  async getUserById(id: number): Promise<User | null> {
    try {
      const [rows]: any = await poolExport.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
      )
      return rows.length ? rows[0] : null
    } catch (error) {
      throw error
    }
  }

  // Update login statistics (increment loginCount and update lastLogin)
  async updateLoginStats(userId: number): Promise<void> {
    try {
      await poolExport.execute(
        'UPDATE users SET loginCount = loginCount + 1, lastLogin = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      )
    } catch (error) {
      throw error
    }
  }

  // Update user details
  async updateUser(
    userId: number,
    data: { name?: string; email?: string }
  ): Promise<void> {
    try {
      let query = 'UPDATE users SET '
      const fields: string[] = []
      const values: any[] = []

      if (data.name) {
        fields.push('name = ?')
        values.push(data.name)
      }
      if (data.email) {
        fields.push('email = ?')
        values.push(data.email)
      }
      query += fields.join(', ') + ' WHERE id = ?'
      values.push(userId)
      await poolExport.execute(query, values)
    } catch (error) {
      throw error
    }
  }

  // Delete a user
  async deleteUser(userId: number): Promise<void> {
    try {
      await poolExport.execute('DELETE FROM users WHERE id = ?', [userId])
    } catch (error) {
      throw error
    }
  }

  // Verify a user
  async verifyUser(email: string): Promise<void> {
    try {
      await poolExport.execute(
        'UPDATE users SET isVerified = TRUE WHERE email = ?',
        [email]
      )
    } catch (error) {
      throw error
    }
  }
}
