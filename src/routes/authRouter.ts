import { Router } from 'express'
import userController from '../controllers/userController'

const router = Router()
router.route('/login').post(userController.login)

export default router
