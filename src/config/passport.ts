import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import pool from './db'
import { User } from '../models/User'
import { RowDataPacket } from 'mysql2'
import config from './env'

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.JWT_SECRET,
}

interface UserRow extends User, RowDataPacket {}

passport.use(
  new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
      const [users] = await pool.query<UserRow[]>(
        'SELECT id, name, email, isAdmin AS isAdmin FROM users WHERE id = ?',
        [payload.id]
      )
      if (users[0]) {
        return done(null, users[0])
      }
      return done(null, false)
    } catch (error) {
      return done(error, false)
    }
  })
)

export default passport
