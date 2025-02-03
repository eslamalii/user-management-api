import { Router } from 'express'
import { authenticateJWT } from '../middlewares/authMiddleware'
import { adminOnly } from '../middlewares/adminMiddleware'
import { AdminController } from '../controllers/adminController'

export const adminRouter = (adminController: AdminController) => {
  const router = Router()

  // All admin routes are protected: first by JWT auth, then by admin-only check
  router.use(authenticateJWT, adminOnly)

  router.get('/users', adminController.getAllUsers)
  router.get('/stats/total-users', adminController.getTotalUsers)
  router.get('/stats/verified-users', adminController.getVerifiedUsers)
  router.get('/stats/top-users', adminController.getTopUsers)
  router.get('/stats/inactive-users', adminController.getInactiveUsers)

  return router
}
