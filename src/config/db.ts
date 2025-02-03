import mysql, { Pool, PoolOptions } from 'mysql2/promise'
import dotenv from 'dotenv'
import config from './env'

dotenv.config()

function getDbConfig(): PoolOptions {
  return {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: config.DB_CONNECTION_LIMIT,
    queueLimit: 0,
    namedPlaceholders: true,
    timezone: 'Z',
    connectTimeout: config.DB_CONNECT_TIMEOUT,
    decimalNumbers: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: config.DB_KEEP_ALIVE_DELAY,
  }
}

/**
 * Create a dummy pool for test environments.
 */
function createDummyPool() {
  return {
    query: async () => [],
    execute: async () => [],
    end: async () => {},
  }
}

/**
 * Create a real connection pool and test connectivity.
 */
function createRealPool(): Pool {
  const config = getDbConfig()
  const pool = mysql.createPool(config)

  pool
    .getConnection()
    .then((connection) => {
      console.log('Successfully connected to database')
      connection.release()
    })
    .catch((error) => {
      console.error('Database connection failed:', error)
      process.exit(1)
    })

  return pool
}

const poolExport =
  config.NODE_ENV === 'test' ? createDummyPool() : createRealPool()
export default poolExport
