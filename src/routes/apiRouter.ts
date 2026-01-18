import { Router } from 'express'
import apiController from '../controllers/apiController'
import userController from '../controllers/userController'

const router = Router()

router.route('/self').get(apiController.self)
router.route('/health').get(apiController.health)
router.route('/auth/login').post(userController.login)

export default router
