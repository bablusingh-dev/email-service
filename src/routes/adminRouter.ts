import { Router } from 'express'
import projectController from '../controllers/projectController'

const router = Router()
router.post('/projects', projectController.createProject)

export default router
