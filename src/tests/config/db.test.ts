import mysql from 'mysql2/promise'

describe('Database Configuration', () => {
  // Backup original process.env values that we intend to change.
  const originalEnv = { ...process.env }

  afterEach(() => {
    // Restore process.env to its original state.
    process.env = { ...originalEnv }
    jest.resetModules() // Reset module registry to pick up env changes.
    jest.clearAllMocks()
  })

  describe('when NODE_ENV is "test"', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test'
      // Remove required DB vars by deleting them from process.env.
      delete process.env.DB_HOST
      delete process.env.DB_USER
      delete process.env.DB_PASSWORD
      delete process.env.DB_NAME
    })

    it('should export a dummy pool with async methods', async () => {
      // Import the module fresh using require.
      const db = require('../../config/db').default

      // Verify that the dummy pool has the expected async functions.
      expect(typeof db.query).toBe('function')
      expect(typeof db.execute).toBe('function')
      expect(typeof db.end).toBe('function')

      // Verify that the dummy functions resolve as expected.
      await expect(db.query('SELECT 1')).resolves.toEqual([])
      await expect(db.execute('SELECT 1')).resolves.toEqual([])
      await expect(db.end()).resolves.toBeUndefined()
    })
  })

  describe('when NODE_ENV is not "test"', () => {
    let fakePool: any
    let createPoolSpy: jest.SpyInstance

    beforeEach(() => {
      // Set non-test environment and required DB vars in process.env.
      process.env.NODE_ENV = 'development'
      process.env.DB_HOST = 'localhost'
      process.env.DB_USER = 'myuser'
      process.env.DB_PASSWORD = 'mypassword'
      process.env.DB_NAME = 'mydb'
      process.env.DB_CONNECTION_LIMIT = '15'
      process.env.DB_CONNECT_TIMEOUT = '15000'
      process.env.DB_KEEP_ALIVE_DELAY = '35000'

      // Create a fake pool object with spy functions.
      fakePool = {
        getConnection: jest.fn().mockResolvedValue({ release: jest.fn() }),
        query: jest.fn().mockResolvedValue([]),
        execute: jest.fn().mockResolvedValue([]),
        end: jest.fn().mockResolvedValue(undefined),
      }
      // Spy on mysql.createPool and have it return the fakePool.
      createPoolSpy = jest.spyOn(mysql, 'createPool').mockReturnValue(fakePool)
    })

    it('should create a real pool using mysql.createPool and attempt a connection', async () => {
      // Use isolateModules to force a fresh import of db.ts.
      jest.isolateModules(() => {
        const db = require('../../config/db').default
        expect(createPoolSpy).toHaveBeenCalled()
        expect(db).toBe(fakePool)
      })

      // Wait briefly for asynchronous connection attempt.
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(fakePool.getConnection).toHaveBeenCalled()
    })

    it('should exit process on connection failure', async () => {
      // Make the connection attempt fail.
      fakePool.getConnection.mockRejectedValue(new Error('Connection failed'))

      // Spy on process.exit to simulate immediate exit.
      const exitSpy = jest
        .spyOn(process, 'exit')
        .mockImplementation(
          (code?: number | string | null | undefined): never => {
            throw new Error('process.exit called with code: ' + code)
          }
        )
      // Spy on console.error to suppress output during tests.
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {})

      let caughtError: Error | null = null
      try {
        // Force a fresh import to trigger connection attempt.
        jest.isolateModules(() => {
          require('../../config/db')
        })
      } catch (err) {
        caughtError = err as Error
      }

      // Verify that process.exit was "called" with code 1.
      expect(caughtError?.message).toContain('process.exit called with code: 1')

      // Wait a bit to allow asynchronous logging to complete.
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Database connection failed:',
        expect.any(Error)
      )

      exitSpy.mockRestore()
      consoleErrorSpy.mockRestore()
    })
  })
})
