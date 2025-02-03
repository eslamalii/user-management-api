import pool from '../config/db'
import { AdminUserFilterDTO } from '../dtos/admin.dto'
import { IAdminRepository } from '../interfaces/IAdminRepository'
import { User } from '../models/User'

export class AdminRepository implements IAdminRepository {
  // Get all users with optional filters: name, email, isVerified, pagination, and date range filtering
  async getAllUsers(filters: AdminUserFilterDTO): Promise<User[]> {
    try {
      let query = 'SELECT * FROM users WHERE 1=1'
      const values: any[] = []

      if (filters.name) {
        query += ' AND name LIKE ?'
        values.push(`%${filters.name}%`)
      }

      if (filters.email) {
        query += ' AND email LIKE ?'
        values.push(`%${filters.email}%`)
      }

      if (filters.isVerified !== undefined) {
        query += ' AND isVerified = ?'
        const verified =
          typeof filters.isVerified === 'string'
            ? filters.isVerified === 'true'
              ? 1
              : 0
            : filters.isVerified
            ? 1
            : 0
        values.push(Number(verified))
      }

      if (filters.startDate && filters.endDate) {
        query += ' AND createdAt BETWEEN ? AND ?'
        values.push(filters.startDate, filters.endDate)
      }

      // Pagination: ensure page and limit are positive numbers
      if (
        filters.page !== undefined &&
        filters.limit !== undefined &&
        Number(filters.page) > 0 &&
        Number(filters.limit) > 0
      ) {
        const page = parseInt(String(filters.page), 10)
        const limit = parseInt(String(filters.limit), 10)
        const offset = (page - 1) * limit
        // Directly embed the numeric values into the query string
        query += ` LIMIT ${limit} OFFSET ${offset}`
      }

      const [rows]: any = await pool.execute(query, values)
      return rows
    } catch (error) {
      throw error
    }
  }

  // Get total number of users
  async getTotalUsers(): Promise<number> {
    try {
      const [rows]: any = await pool.execute(
        'SELECT COUNT(*) as total FROM users'
      )
      return rows[0].total
    } catch (error) {
      throw error
    }
  }

  // Get number of verified users
  async getVerifiedUsers(): Promise<number> {
    try {
      const [rows]: any = await pool.execute(
        'SELECT COUNT(*) as total FROM users WHERE isVerified = true'
      )
      return rows[0].total
    } catch (error) {
      throw error
    }
  }

  // Get the top 3 users by login_count
  async getTopUsers(): Promise<User[]> {
    try {
      const [rows]: any = await pool.execute(
        'SELECT * FROM users ORDER BY loginCount DESC LIMIT 3'
      )
      return rows
    } catch (error) {
      throw error
    }
  }

  // Get users who have never logged in (inactive users)
  async getInactiveUsers(): Promise<User[]> {
    try {
      const [rows]: any = await pool.execute(
        'SELECT * FROM users WHERE loginCount = 0'
      )
      return rows
    } catch (error) {
      throw error
    }
  }
}
