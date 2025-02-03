import express from 'express'
import dotenv from 'dotenv'
import { authRouter } from './routes/authRoutes'
import { userRouter } from './routes/userRoutes'
import { adminRouter } from './routes/adminRoutes'
import { resetRouter } from './routes/passwordResetRoutes'
import { errorMiddleware } from './middlewares/errorMiddleware'
import passport from './config/passport'
import { setupSwagger } from './config/swagger'
import { requestLogger } from './middlewares/requestLogger'
import { UserRepository } from './repositories/userRepository'
import { UserService } from './services/userService'
import { UserController } from './controllers/userController'
import { AdminRepository } from './repositories/adminRepository'
import { AdminService } from './services/adminService'
import { AdminController } from './controllers/adminController'
import { AuthService } from './services/authService'
import { AuthController } from './controllers/authController'
import { PasswordResetController } from './controllers/PasswordResetController'
import { PasswordResetService } from './services/passwordResetService'
import config from './config/env'

dotenv.config()

const app = express()
app.use(passport.initialize())

app.use(express.json())
app.use(requestLogger)
setupSwagger(app)

// Manually instantiate dependencies.
const userRepository = new UserRepository()
const userService = new UserService(userRepository)
const userController = new UserController(userService)

const adminRepository = new AdminRepository()
const adminService = new AdminService(adminRepository)
const adminController = new AdminController(adminService)

const authService = new AuthService(userRepository)
const authController = new AuthController(authService)

const passwordResetService = new PasswordResetService(userRepository)
const passwordResetController = new PasswordResetController(
  passwordResetService
)

app.use('/api/auth', authRouter(authController))
app.use('/api/users', userRouter(userController))
app.use('/api/admin', adminRouter(adminController))
app.use('/api/password-reset', resetRouter(passwordResetController))

app.use(errorMiddleware)

const PORT = config.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
