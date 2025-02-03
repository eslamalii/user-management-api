import dotenv from 'dotenv'

dotenv.config()

interface EnvConfig {
  PORT: number
  DB_HOST: string
  DB_USER: string
  DB_PASSWORD: string
  DB_NAME: string
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  DB_CONNECTION_LIMIT: number
  DB_CONNECT_TIMEOUT: number
  DB_KEEP_ALIVE_DELAY: number
  RESET_TOKEN_EXPIRY: number
  EXPIRE_TIME: string
  NODE_ENV: string
  LOG_THEME: string
}

const config: EnvConfig = {
  PORT: Number(process.env.PORT) || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'user',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password',
  DB_NAME: process.env.DB_NAME || 'user_management',
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  DB_CONNECTION_LIMIT: Number(process.env.DB_CONNECTION_LIMIT) || 10,
  DB_CONNECT_TIMEOUT: Number(process.env.DB_CONNECT_TIMEOUT) || 10000,
  DB_KEEP_ALIVE_DELAY: Number(process.env.DB_KEEP_ALIVE_DELAY) || 30000,
  RESET_TOKEN_EXPIRY: Number(process.env.RESET_TOKEN_EXPIRY) || 15,
  EXPIRE_TIME: process.env.EXPIRE_TIME || '1h',
  NODE_ENV: process.env.NODE_ENV || 'test',
  LOG_THEME: process.env.LOG_THEME || 'light',
}

export default config
